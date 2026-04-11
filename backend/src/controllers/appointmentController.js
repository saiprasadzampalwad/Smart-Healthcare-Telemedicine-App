const db = require('../config/db');

// Create appointment
const createAppointment = async (req, res) => {
  const { doctor_id, appointment_date, time_slot, type, notes } = req.body;

  if (!doctor_id || !appointment_date || !time_slot || !type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Just-In-Time Patient Auto-Creation
    let patientRes = await db.query('SELECT id FROM patients WHERE user_id = $1', [req.user.id]);
    if (patientRes.rows.length === 0) {
      patientRes = await db.query(
        'INSERT INTO patients (user_id) VALUES ($1) RETURNING id',
        [req.user.id]
      );
    }
    const patient_id = patientRes.rows[0].id;

    // Check for overlapping appointments
    const overlapCheck = await db.query(
      "SELECT id FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND time_slot = $3 AND status != 'cancelled'::appointment_status",
      [doctor_id, appointment_date, time_slot]
    );

    if (overlapCheck.rows.length > 0) {
      return res.status(409).json({ message: 'This time slot is already booked for this doctor.' });
    }

    // Insert
    const newAppt = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, time_slot, type, notes) VALUES ($1, $2, $3, $4, $5::appointment_type, $6) RETURNING *',
      [patient_id, doctor_id, appointment_date, time_slot, type, notes]
    );

    // Create Notification for Doctor
    const docUserRes = await db.query('SELECT user_id FROM doctors WHERE id = $1', [doctor_id]);
    if (docUserRes.rows.length > 0) {
       await db.query(
         "INSERT INTO notifications (user_id, type, message) VALUES ($1, 'appointment'::notification_type, $2)",
         [docUserRes.rows[0].user_id, `You have a new appointment on ${appointment_date} at ${time_slot}.`]
       );
    }

    res.status(201).json(newAppt.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error check input types' });
  }
};

const getAppointments = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'patient') {
      let patientRes = await db.query('SELECT id FROM patients WHERE user_id = $1', [req.user.id]);
      if (patientRes.rows.length === 0) {
        patientRes = await db.query('INSERT INTO patients (user_id) VALUES ($1) RETURNING id', [req.user.id]);
      }
      const patient_id = patientRes.rows[0].id;
      
      result = await db.query(`
        SELECT a.*, d.specialization, u.name as doctor_name 
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE a.patient_id = $1
        ORDER BY a.appointment_date DESC, a.time_slot DESC
      `, [patient_id]);

    } else if (req.user.role === 'doctor') {
      let docRes = await db.query('SELECT id FROM doctors WHERE user_id = $1', [req.user.id]);
      if (docRes.rows.length === 0) {
        docRes = await db.query("INSERT INTO doctors (user_id, specialization) VALUES ($1, 'General') RETURNING id", [req.user.id]);
      }
      const doctor_id = docRes.rows[0].id;

      result = await db.query(`
        SELECT a.*, u.name as patient_name 
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.doctor_id = $1
        ORDER BY a.appointment_date DESC, a.time_slot DESC
      `, [doctor_id]);

    } else {
      // admin - get all
      result = await db.query('SELECT * FROM appointments ORDER BY appointment_date DESC');
    }

    res.json(result.rows || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const apptCheck = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);
    if (apptCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const updated = await db.query(
      'UPDATE appointments SET status = $1::appointment_status WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };
