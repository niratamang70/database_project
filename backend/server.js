const express=require('express')
const mysql=require('mysql2')
const cors=require('cors')
const path=require('path')


const app=express()

app.use(express.static(path.join(__dirname,'public')))
app.use(cors())
app.use(express.json())

const port = 5000

const database= mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'nira0423',
  database:'recipe_book'
})


database.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.get('/recipes', (req, res) => {
  database.query('SELECT * FROM Recipes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(port, () => console.log('Server running on port 5000'));
