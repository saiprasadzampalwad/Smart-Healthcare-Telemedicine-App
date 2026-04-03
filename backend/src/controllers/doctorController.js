const db = require('../config/db');

const getDoctors = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.id, d.specialization, d.experience_years, d.consultation_fee, d.bio, d.is_available,
             u.name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.is_available = true
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.id, d.specialization, d.experience_years, d.consultation_fee, d.bio, d.is_available,
             u.name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDoctors, getDoctorById };
