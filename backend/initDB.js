const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  const queryText = `
    -- Drop tables first to allow clean schema rebuild
    DROP TABLE IF EXISTS notifications CASCADE;
    DROP TABLE IF EXISTS prescriptions CASCADE;
    DROP TABLE IF EXISTS appointments CASCADE;
    DROP TABLE IF EXISTS doctors CASCADE;
    DROP TABLE IF EXISTS patients CASCADE;
    DROP TABLE IF EXISTS hospitals CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TYPE IF EXISTS user_role CASCADE;
    DROP TYPE IF EXISTS appointment_status CASCADE;
    DROP TYPE IF EXISTS appointment_type CASCADE;
    DROP TYPE IF EXISTS notification_type CASCADE;

    -- Create ENUMs
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin', 'hospital');
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
    CREATE TYPE appointment_type AS ENUM ('video_consultation', 'in_person');
    CREATE TYPE notification_type AS ENUM ('appointment', 'prescription', 'reminder', 'system');

    -- 1. USERS Table
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role user_role NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. PATIENTS Profile
    CREATE TABLE patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        date_of_birth DATE,
        gender VARCHAR(50),
        blood_group VARCHAR(10),
        emergency_contact VARCHAR(50),
        medical_history TEXT,
        -- New fields for tracking Eligibility
        aadhaar_number VARCHAR(12),
        income_level DECIMAL(10, 2),
        is_eligible_for_subsidy BOOLEAN DEFAULT false,
        UNIQUE(user_id)
    );

    -- 3. DOCTORS Profile
    CREATE TABLE doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        specialization VARCHAR(255) NOT NULL,
        experience_years INT,
        consultation_fee DECIMAL(10, 2),
        bio TEXT,
        is_available BOOLEAN DEFAULT true,
        UNIQUE(user_id)
    );

    -- 4. HOSPITALS Profile
    CREATE TABLE hospitals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        location VARCHAR(255),
        general_ward_total INT DEFAULT 0,
        general_ward_occupied INT DEFAULT 0,
        icu_total INT DEFAULT 0,
        icu_occupied INT DEFAULT 0,
        subsidized_beds_total INT DEFAULT 0,
        subsidized_beds_occupied INT DEFAULT 0,
        UNIQUE(user_id)
    );

    -- 5. APPOINTMENTS
    CREATE TABLE appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
        appointment_date DATE NOT NULL,
        time_slot TIME NOT NULL,
        status appointment_status DEFAULT 'scheduled',
        type appointment_type NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. PRESCRIPTIONS
    CREATE TABLE prescriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
        doctor_id UUID REFERENCES doctors(id),
        patient_id UUID REFERENCES patients(id),
        medication_details TEXT NOT NULL,
        instructions TEXT NOT NULL,
        issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. NOTIFICATIONS
    CREATE TABLE notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type notification_type NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('Creating database tables...');
    await pool.query(queryText);
    console.log('Database tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    pool.end();
  }
};

createTables();
