const db = require('../config/db');

// Get Unified Patient Record
const getUnifiedRecord = async (req, res) => {
  const { patient_id } = req.params;

  try {
    // 1. Get basic patient info + eligibility
    const patientRes = await db.query(`
      SELECT p.*, u.name, u.email 
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [patient_id]);

    if (patientRes.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const patientData = patientRes.rows[0];

    // 2. Get past and upcoming appointments
    const apptRes = await db.query(`
      SELECT a.*, d.specialization, u.name as doctor_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = $1
      ORDER BY a.appointment_date DESC
    `, [patient_id]);
    const appointments = apptRes.rows;

    // 3. Get prescriptions
    const presRes = await db.query(`
      SELECT p.*, u.name as doctor_name
      FROM prescriptions p
      JOIN doctors d ON p.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE p.patient_id = $1
      ORDER BY p.issued_at DESC
    `, [patient_id]);
    const prescriptions = presRes.rows;

    res.json({
      patient: patientData,
      history: {
        appointments,
        prescriptions
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching unifying records' });
  }
};

module.exports = { getUnifiedRecord };
