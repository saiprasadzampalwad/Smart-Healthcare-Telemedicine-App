const db = require('../config/db');

// @desc Get current patient profile
const getPatientProfile = async (req, res) => {
  try {
    const user_id = req.user.userId;
    
    const result = await db.query(`
      SELECT p.*, u.email, u.name 
      FROM patients p
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = $1
    `, [user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update patient profile
const updatePatientProfile = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { date_of_birth, gender, blood_group, emergency_contact, medical_history } = req.body;
    
    const result = await db.query(`
      INSERT INTO patients (user_id, date_of_birth, gender, blood_group, emergency_contact, medical_history)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        date_of_birth = EXCLUDED.date_of_birth,
        gender = EXCLUDED.gender,
        blood_group = EXCLUDED.blood_group,
        emergency_contact = EXCLUDED.emergency_contact,
        medical_history = EXCLUDED.medical_history
      RETURNING *
    `, [user_id, date_of_birth, gender, blood_group, emergency_contact, medical_history]);
    
    res.json({ message: 'Profile updated', profile: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get medical history (appointments + prescriptions)
const getMedicalHistory = async (req, res) => {
  try {
    const user_id = req.user.userId;
    
    const appointments = await db.query(`
      SELECT a.*, d.name as doctor_name 
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN patients p ON a.patient_id = p.id  
      JOIN users u ON p.user_id = u.id
      WHERE u.id = $1
      ORDER BY a.appointment_date DESC
    `, [user_id]);
    
    res.json({ appointments: appointments.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPatientProfile, updatePatientProfile, getMedicalHistory };

