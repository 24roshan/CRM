const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login user
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log("Login route hit");

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(400).json({ error: 'Invalid email or password' });

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: 'Invalid email or password' });

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: 'Error comparing passwords' });
    }
  });
};

// Get current user
exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};

// Get all users
exports.getUsers = (req, res) => {
  const query = 'SELECT id, name, email FROM users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Create user
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0)
      return res.status(400).json({ error: 'Email already in use' });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error hashing password' });
    }
  });
};

// Simple test route
exports.simple = async (req, res) => {
  return res.status(200).send("working");
};
