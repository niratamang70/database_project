const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const port = 3001;

const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nira0423',
  database: 'recipe_book_app_database'
});

database.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// GET: Fetch all recipes
app.get('/', (req, res) => {
  database.query('SELECT recipe_id, recipe_name, image_url FROM recipes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/recipes/all', (req, res) => {
  const { name, category } = req.query;

  let query = `
    SELECT r.recipe_id, r.recipe_name, r.image_url, r.duration
    FROM recipes r
    LEFT JOIN categories c ON r.category_id = c.category_id
    WHERE 1 = 1`;

  const params = [];

  if (name) {
    query += ` AND r.recipe_name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (category) {
    query += ` AND c.category_name LIKE ?`;
    params.push(`%${category}%`);
  }

  database.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//get a single recipe by ID
app.get('/recipes/:id', (req, res) => {
  const recipeId = req.params.id;

  const query = `
    SELECT 
      r.recipe_id,
      r.recipe_name,
      r.image_url,
      r.instructions,
      r.category_id,
      r.duration,
      c.category_name,
      i.ingredient_id,
      i.ingredient_name,
      iu.name AS unit_name,
      iu.unit_id,
      ri.quantity,
      ri.is_optional
    FROM 
      recipes r
    JOIN 
      recipe_ingredients ri ON r.recipe_id = ri.recipe_id
    JOIN 
      ingredients i ON i.ingredient_id = ri.ingredient_id
    JOIN 
      ingredient_unit iu ON iu.unit_id = i.unit_id
    LEFT JOIN 
      categories c ON r.category_id = c.category_id
    WHERE 
      r.recipe_id = ?;
  `;

  database.query(query, [recipeId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = {
      recipe_id: results[0].recipe_id,
      recipe_name: results[0].recipe_name,
      recipe_image: results[0].image_url,
      category_id: results[0].category_id,
      duration: results[0].duration,
      instructions: results[0].instructions,
      category: results[0].category_name,
      ingredients: results.map(result => ({
        ingredient_id: result.ingredient_id,
        ingredient_name: result.ingredient_name,
        unit_name: result.unit_name,
        unit_id: result.unit_id,
        quantity: result.quantity,
        is_optional: result.is_optional
      }))
    };

    res.json(recipe);
  });
});

//create a new recipe
app.post('/recipes', (req, res) => {
  const { recipe_name, image_url, category_id, duration, instructions, ingredients, user_id } = req.body;

  database.beginTransaction(err => {
    if (err) {
      return res.status(500).send('Error starting SQL transaction');
    }

    const insertRecipeQuery = `
      INSERT INTO recipes (recipe_name, image_url, category_id, duration, instructions, user_id )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    database.query(
      insertRecipeQuery,
      [recipe_name, image_url, category_id, duration, instructions, user_id],
      (err, result) => {
        if (err) {
          return database.rollback(() => res.status(500).send('Error adding recipe'));
        }

        const recipeId = result.insertId;

        const insertRecipeIngredientsPromises = ingredients.map(ingredient => {
          const insertRecipeIngredientQuery = `
          INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, is_optional)
          VALUES (?, ?, ?, ?)
        `;
          return new Promise((resolve, reject) => {
            database.query(
              insertRecipeIngredientQuery,
              [recipeId, ingredient.ingredient_id, ingredient.quantity, ingredient.is_optional],
              err => {
                if (err) return reject(err);
                resolve();
              }
            );
          });
        });

        Promise.all(insertRecipeIngredientsPromises)
          .then(() => {
            database.commit(err => {
              if (err) {
                return database.rollback(() => res.status(500).send('Error committing transaction'));
              }
              res.status(201).send({ message: 'Recipe added successfully', recipe_id: recipeId });
            });
          })
          .catch(err => {
            database.rollback(() => res.status(500).send('Error linking ingredients to recipe'));
          });
      }
    );
  });
});

//update a recipe
app.put('/recipes/:id', (req, res) => {
  const recipeId = req.params.id;
  const { recipe_name, image_url, category_id, duration, instructions, ingredients } = req.body;

  database.beginTransaction(err => {
    if (err) return res.status(500).send('Error starting SQL transaction');

    // Step 1: Update the main recipe details
    const updateRecipeQuery = `
      UPDATE recipes 
      SET recipe_name = ?, image_url = ?, category_id = ?, duration=?, instructions = ?
      WHERE recipe_id = ?
    `;
    database.query(updateRecipeQuery, [recipe_name, image_url, category_id, duration, instructions, recipeId], err => {
      if (err) {
        return database.rollback(() => res.status(500).send('Error updating recipe'));
      }

      // Step 2: Remove old ingredients for this recipe
      const deleteIngredientsQuery = 'DELETE FROM recipe_ingredients WHERE recipe_id = ?';
      database.query(deleteIngredientsQuery, [recipeId], err => {
        if (err) {
          return database.rollback(() => res.status(500).send('Error removing old ingredients'));
        }

        // Step 3: Process each ingredient (reuse if ID exists, insert if new)
        const ingredientPromises = ingredients.map(ingredient => {
          return new Promise((resolve, reject) => {
            if (ingredient.ingredient_id) {
              // If ID is sent, reuse
              resolve(ingredient.ingredient_id);
            } else {
              // Insert new ingredient
              const insertIngredientQuery = `
                INSERT INTO ingredients (ingredient_name, unit_id) VALUES (?, ?)
              `;
              database.query(
                insertIngredientQuery,
                [ingredient.ingredient_name, ingredient.ingredient_unit],
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result.insertId);
                }
              );
            }
          });
        });

        // Step 4: Insert into recipe_ingredients
        Promise.all(ingredientPromises)
          .then(ingredientIds => {
            const insertIngredientLinks = ingredientIds.map((ingredientId, index) => {
              const ing = ingredients[index];
              const insertRecipeIngredientQuery = `
                INSERT INTO recipe_ingredients 
                (recipe_id, ingredient_id, quantity, is_optional) 
                VALUES (?, ?, ?, ?)
              `;
              return new Promise((resolve, reject) => {
                database.query(
                  insertRecipeIngredientQuery,
                  [recipeId, ingredientId, ing.quantity, ing.is_optional],
                  err => {
                    if (err) return reject(err);
                    resolve();
                  }
                );
              });
            });

            Promise.all(insertIngredientLinks)
              .then(() => {
                database.commit(err => {
                  if (err) {
                    return database.rollback(() => res.status(500).send('Error committing changes'));
                  }
                  res.status(200).send({ message: 'Recipe updated successfully' });
                });
              })
              .catch(err => {
                database.rollback(() => res.status(500).send('Error linking ingredients to recipe'));
              });
          })
          .catch(err => {
            database.rollback(() => res.status(500).send('Error processing ingredients'));
          });
      });
    });
  });
});

//delete a recipe
app.delete('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    const sql = 'DELETE FROM recipes WHERE recipe_id = ?';
    database.query(sql, [recipeId], (err, result) => {
      if (err) {
        console.error('Error deleting recipe:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.json({ message: 'Recipe deleted successfully' });
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

//get all categories
app.get('/categories/all', (req, res) => {
  database.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//get all ingredients
app.get('/ingredients/all', (req, res) => {
  database.query('SELECT * FROM ingredients', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//get all ingredients
app.get('/ingredients-unit/all', (req, res) => {
  database.query('SELECT * FROM ingredient_unit', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//get all the recipes created by the specific user
app.get('/recipes/user/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { name, category } = req.query;
  let query = `
    SELECT r.recipe_id, r.recipe_name, r.image_url, r.duration
    FROM recipes r
    LEFT JOIN categories c ON r.category_id = c.category_id
    WHERE r.user_id = ?`;

  const params = [user_id];

  if (name) {
    query += ` AND r.recipe_name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (category) {
    query += ` AND c.category_name LIKE ?`;
    params.push(`%${category}%`);
  }

  database.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//user login
app.post('/user/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const query = `
    SELECT user_id, username,first_name,last_name, role, password 
    FROM users 
    WHERE username = ?
  `;

  database.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', err });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({
      user_id: user.user_id,
      username: user.username,
      fullname: `${user.first_name} ${user.last_name}`,
      role: user.role
    });
  });
});

// add category
app.post('/categories/create', (req, res) => {
  const { category_name, image_url, description } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const query = 'INSERT INTO categories (category_name, image_url, description) VALUES (?, ?, ?)';
  database.query(query, [category_name, image_url, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add category' });
    }

    const categoryId = result.insertId;

    database.query('SELECT * FROM categories', (err2, categories) => {
      if (err2) {
        console.error('Error fetching categories:', err2);
        return res.status(500).json({ error: 'Category added but failed to fetch categories' });
      }

      res.status(201).json({
        message: 'Category added successfully',
        data: categories,
        category_id: categoryId
      });
    });
  });
});

//register user
app.post('/user/register', async (req, res) => {
  const { username, first_name, last_name, password, role = 'user' } = req.body;

  if (!username || !first_name || !last_name || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    database.query(checkQuery, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const insertQuery = 'INSERT INTO users (username, first_name,last_name, password, role) VALUES (?, ?, ?, ?, ?)';
      database.query(insertQuery, [username, first_name, last_name, password, role], (insertErr, result) => {
        if (insertErr) {
          return res.status(500).json({ error: 'Failed to register user' });
        }
        res.status(201).json({ message: 'User registered successfully', user_id: result.insertId });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// fetch user details ny user id
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT user_id, username, fist_name,last_name, role FROM users WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
