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
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

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
const getProfile = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.id, d.specialization, d.experience_years, d.consultation_fee, d.bio, d.is_available,
             u.name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      // Fallback default response if not in doctors table
      return res.json({
         is_available: true,
         consultation_fee: 500,
         specialization: 'General'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { is_available, consultation_fee } = req.body;
  try {
    const doctorRes = await db.query('SELECT id FROM doctors WHERE user_id = $1', [req.user.id]);
    
    if (doctorRes.rows.length === 0) {
      // Auto-insert if missing
      const inserted = await db.query(
        "INSERT INTO doctors (user_id, specialization, consultation_fee, is_available) VALUES ($1, 'General Medicine', $2, $3) RETURNING *",
        [req.user.id, consultation_fee, is_available]
      );
      return res.json({ message: 'Profile created successfully', profile: inserted.rows[0] });
    }

    const updated = await db.query(
      'UPDATE doctors SET is_available = $1, consultation_fee = $2 WHERE user_id = $3 RETURNING *',
      [is_available, consultation_fee, req.user.id]
    );

    res.json({ message: 'Profile updated successfully', profile: updated.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error check input types' });
  }
};

module.exports = { getDoctors, getDoctorById, getProfile, updateProfile };
