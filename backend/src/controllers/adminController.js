const db = require('../config/db');

// Admin dashboard stats
const getAdminDashboard = async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE role = 'patient') as total_patients,
        COUNT(*) FILTER (WHERE role = 'doctor') as total_doctors,
        COUNT(*) FILTER (WHERE role = 'hospital') as total_hospitals
      FROM users
    `);
    
    const appointments = await db.query('SELECT COUNT(*) as total_appointments FROM appointments');
    
    res.json({
      stats: stats.rows[0],
      recent_appointments: appointments.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Manage users list
const manageUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.*, 
        CASE 
          WHEN p.id IS NOT NULL THEN 'patient'
          WHEN d.id IS NOT NULL THEN d.specialization
          WHEN h.id IS NOT NULL THEN h.location
        END as profile_info
      FROM users u
      LEFT JOIN patients p ON u.id = p.user_id
      LEFT JOIN doctors d ON u.id = d.user_id  
      LEFT JOIN hospitals h ON u.id = h.user_id
      ORDER BY u.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Manage hospitals
const manageHospitals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT h.*, u.name, u.email
      FROM hospitals h
      JOIN users u ON h.user_id = u.id
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAdminDashboard, manageUsers, manageHospitals };

