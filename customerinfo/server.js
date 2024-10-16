const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3003;

app.use(express.json());

const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'pass@word1',
  database: 'customerdb'
});

app.get('/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching customers data' });
    } else {
      res.json(results);
    }
  });
});

app.get('/customers/:id', (req, res) => {
  db.query('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching customer data' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      res.json(results[0]);
    }
  });
});

app.post('/customers', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO customers (name, email) VALUES (?, ?)', 
    [name, email], 
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error creating customer' });
      } else {
        res.status(201).json({ message: 'Customer created successfully', id: result.insertId });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
});