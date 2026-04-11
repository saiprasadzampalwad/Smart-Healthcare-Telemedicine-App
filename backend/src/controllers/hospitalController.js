const db = require('../config/db');

// Get real-time bed availability for a specific hospital or all hospitals
const getHospitals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT h.*, u.name as hospital_name, u.email 
      FROM hospitals h 
      JOIN users u ON h.user_id = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching hospitals' });
  }
};

const getHospitalById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT h.*, u.name as hospital_name, u.email 
      FROM hospitals h 
      JOIN users u ON h.user_id = u.id
      WHERE h.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update real-time bed availability (only accessible by the hospital user itself)
const updateBedAvailability = async (req, res) => {
  const { general_ward_total, general_ward_occupied, icu_total, icu_occupied, subsidized_beds_total, subsidized_beds_occupied } = req.body;
  
  if (req.user.role !== 'hospital') {
      return res.status(403).json({ message: 'Only hospitals can update bed availability' });
  }

  try {
    const updateQuery = `
      UPDATE hospitals
      SET 
        general_ward_total = COALESCE($1, general_ward_total),
        general_ward_occupied = COALESCE($2, general_ward_occupied),
        icu_total = COALESCE($3, icu_total),
        icu_occupied = COALESCE($4, icu_occupied),
        subsidized_beds_total = COALESCE($5, subsidized_beds_total),
        subsidized_beds_occupied = COALESCE($6, subsidized_beds_occupied)
      WHERE user_id = $7
      RETURNING *
    `;

    const result = await db.query(updateQuery, [
      general_ward_total, general_ward_occupied, icu_total, icu_occupied, subsidized_beds_total, subsidized_beds_occupied, req.user.id
    ]);

    if (result.rows.length === 0) {
       return res.status(404).json({ message: 'Hospital profile not found for this user' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating beds' });
  }
};

module.exports = { getHospitals, getHospitalById, updateBedAvailability };
