const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seed = async () => {
  try {
    console.log('Seeding database with default users...');
    const salt = await bcrypt.genSalt(10);
    
    // We'll use the same convenient password for all test users
    const commonPassword = 'password123';
    const passwordHash = await bcrypt.hash(commonPassword, salt);

    const usersToInsert = [
      { name: 'System Admin', email: 'admin@test.com', role: 'admin' },
      { name: 'City Hospital', email: 'hospital@test.com', role: 'admin' },
      { name: 'Dr. Smith', email: 'doctor@test.com', role: 'doctor', specialization: 'General Practice' },
      { name: 'John Doe', email: 'patient@test.com', role: 'patient' }
    ];

    await pool.query('BEGIN');

    for (const u of usersToInsert) {
      // check if exists
      const exists = await pool.query('SELECT * FROM users WHERE email = $1', [u.email]);
      if (exists.rows.length === 0) {
        const insertRes = await pool.query(
          'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
          [u.name, u.email, passwordHash, u.role]
        );
        const userId = insertRes.rows[0].id;

        if (u.role === 'doctor') {
          await pool.query('INSERT INTO doctors (user_id, specialization) VALUES ($1, $2)', [userId, u.specialization]);
        } else if (u.role === 'patient') {
          await pool.query('INSERT INTO patients (user_id) VALUES ($1)', [userId]);
        }
        console.log(`Created user: ${u.email} (Role: ${u.role})`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    await pool.query('COMMIT');
    console.log('\n--- SEEDING COMPLETE ---');
    console.log('You can now log in using any of the following credentials:');
    usersToInsert.forEach(u => {
      console.log(`- Role: ${u.role} | Email: ${u.email} | Password: ${commonPassword}`);
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error seeding:', err);
  } finally {
    pool.end();
  }
};

seed();
