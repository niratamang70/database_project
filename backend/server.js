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

// get all recipes
app.get('/recipes/all', (req, res) => {
  database.query('SELECT recipe_id, recipe_name, image_url FROM recipes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//get all the recipes
app.get('/recipes/all', (req, res) => {
  database.query('SELECT * FROM recipes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//get a single recipe by ID
app.get('/recipes/:id', (req, res) => {
  const recipeId = req.params.id;

  // SQL query to retrieve recipe details, ingredients, and category information
  const query = `
    SELECT 
      r.recipe_id,
      r.recipe_name,
      r.image_url,
      r.instructions,
      c.category_name,
      i.ingredient_id,
      i.ingredient_name,
      i.unit_of_measurement,
      ri.quantity,
      ri.is_optional
    FROM 
      recipes r
    JOIN 
      recipe_ingredients ri ON r.recipe_id = ri.recipe_id
    JOIN 
      ingredients i ON i.ingredient_id = ri.ingredient_id
    LEFT JOIN 
      categories c ON r.category_id = c.category_id
    WHERE 
      r.recipe_id = ?;
  `;

  // execute the query
  database.query(query, [recipeId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // format the response to include ingredients, instructions, and category
    const recipe = {
      recipe_id: results[0].recipe_id,
      recipe_name: results[0].recipe_name,
      recipe_image: results[0].image_url,
      instructions: results[0].instructions,
      category: results[0].category_name,
      ingredients: results.map(result => ({
        ingredient_id: result.ingredient_id,
        ingredient_name: result.ingredient_name,
        unit: result.unit_of_measurement,
        quantity: result.quantity,
        is_optional: result.is_optional
      }))
    };

    //the response
    res.json(recipe);
  });
});

//create a new recipe
app.post('/recipes', (req, res) => {
  const { recipe_name, image_url, category_id, instructions, ingredients } = req.body;

  database.beginTransaction(err => {
    if (err) {
      return res.status(500).send('Error starting sql transaction');
    }

    const insertRecipeQuery =
      'INSERT INTO recipes (recipe_name,image_url, category_id, instructions) VALUES (?, ?, ?, ?)';
    database.query(insertRecipeQuery, [recipe_name, image_url, category_id, instructions], (err, result) => {
      if (err) {
        return database.rollback(() => {
          return res.status(500).send('Error adding recipe');
        });
      }

      const recipeId = result.insertId;

      const ingredientPromises = ingredients.map(ingredient => {
        return new Promise((resolve, reject) => {
          const checkIngredientQuery = 'SELECT * FROM ingredients WHERE ingredient_name = ?';
          database.query(checkIngredientQuery, [ingredient.name], (err, existingIngredients) => {
            if (err) return reject(err);

            let ingredientId;

            if (existingIngredients.length > 0) {
              ingredientId = existingIngredients[0].ingredient_id;
              resolve(ingredientId);
            } else {
              const insertIngredientQuery =
                'INSERT INTO ingredients (ingredient_name, unit_of_measurement) VALUES (?, ?)';
              database.query(insertIngredientQuery, [ingredient.name, ingredient.unit], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
              });
            }
          });
        });
      });

      Promise.all(ingredientPromises)
        .then(ingredientIds => {
          const insertRecipeIngredientsPromises = ingredientIds.map((ingredientId, index) => {
            const insertRecipeIngredientQuery =
              'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, is_optional) VALUES (?, ?, ?, ?)';
            return new Promise((resolve, reject) => {
              database.query(
                insertRecipeIngredientQuery,
                [recipeId, ingredientId, ingredients[index].quantity, ingredients[index].is_optional],
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
                  return database.rollback(() => {
                    return res.status(500).send('Error committing transaction');
                  });
                }
                res.status(201).send({ message: 'Recipe added successfully' });
              });
            })
            .catch(err => {
              database.rollback(() => {
                return res.status(500).send('Error linking ingredients to recipe');
              });
            });
        })
        .catch(err => {
          database.rollback(() => {
            return res.status(500).send('Error processing ingredients');
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
app.listen(port, () => console.log(`Server running on port ${port}`));
