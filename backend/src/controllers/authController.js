const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, specialization } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields (name, email, password, role)' });
  }

  // Doctor check
  if (role === 'doctor' && !specialization) {
    return res.status(400).json({ message: 'Doctors must provide specialization' });
  }

  try {
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    await db.query('BEGIN');
    
    const newUserResult = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    const newUser = newUserResult.rows[0];

    if (role === 'patient') {
      await db.query('INSERT INTO patients (user_id) VALUES ($1)', [newUser.id]);
    } else if (role === 'doctor') {
      await db.query('INSERT INTO doctors (user_id, specialization) VALUES ($1, $2)', [newUser.id, specialization]);
    }

    await db.query('COMMIT');

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser.id, newUser.role, newUser.email),
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role, user.email),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getMe = async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userResult.rows[0];

    // If we want more info, we can join patients or doctors table
    let profile = {};
    if (user.role === 'patient') {
       const patientRes = await db.query('SELECT * FROM patients WHERE user_id = $1', [user.id]);
       profile = patientRes.rows[0] || {};
    } else if (user.role === 'doctor') {
       const docRes = await db.query('SELECT * FROM doctors WHERE user_id = $1', [user.id]);
       profile = docRes.rows[0] || {};
    }

    res.json({ user, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { registerUser, loginUser, getMe };
