const db = require('../config/db');

const createPrescription = async (req, res) => {
  const { appointment_id, patient_id, medication_details, instructions } = req.body;

  if (!appointment_id || !patient_id || !medication_details || !instructions) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const docRes = await db.query('SELECT id FROM doctors WHERE user_id = $1', [req.user.id]);
    if (docRes.rows.length === 0) {
      return res.status(403).json({ message: 'Only doctors can issue prescriptions' });
    }
    const doctor_id = docRes.rows[0].id;

    // Insert prescription
    const newPresc = await db.query(
      'INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medication_details, instructions) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [appointment_id, doctor_id, patient_id, medication_details, instructions]
    );

    // Notify patient
    const patientUserRes = await db.query('SELECT user_id FROM patients WHERE id = $1', [patient_id]);
    if (patientUserRes.rows.length > 0) {
       await db.query(
         "INSERT INTO notifications (user_id, type, message) VALUES ($1, 'prescription', $2)",
         [patientUserRes.rows[0].user_id, 'You have received a new prescription.']
       );
    }

    res.status(201).json(newPresc.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'patient') {
      const patientRes = await db.query('SELECT id FROM patients WHERE user_id = $1', [req.user.id]);
      if (patientRes.rows.length === 0) return res.json([]);
      const patient_id = patientRes.rows[0].id;

      result = await db.query(`
        SELECT p.*, d.specialization, u.name as doctor_name
        FROM prescriptions p
        JOIN doctors d ON p.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE p.patient_id = $1
        ORDER BY p.issued_at DESC
      `, [patient_id]);

    } else if (req.user.role === 'doctor') {
      const docRes = await db.query('SELECT id FROM doctors WHERE user_id = $1', [req.user.id]);
      if (docRes.rows.length === 0) return res.json([]);
      const doctor_id = docRes.rows[0].id;

      result = await db.query(`
        SELECT p.*, u.name as patient_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.id
        JOIN users u ON pt.user_id = u.id
        WHERE p.doctor_id = $1
        ORDER BY p.issued_at DESC
      `, [doctor_id]);
    } else {
       result = await db.query('SELECT * FROM prescriptions ORDER BY issued_at DESC');
    }

    res.json(result.rows || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPrescription, getPrescriptions };
