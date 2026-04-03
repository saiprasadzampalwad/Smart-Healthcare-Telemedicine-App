const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  const queryText = `
    -- Create ENUMs
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE appointment_type AS ENUM ('video_consultation', 'in_person');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE notification_type AS ENUM ('appointment', 'prescription', 'reminder', 'system');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- 1. USERS Table
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role user_role NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. PATIENTS Profile
    CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        date_of_birth DATE,
        gender VARCHAR(50),
        blood_group VARCHAR(10),
        emergency_contact VARCHAR(50),
        medical_history TEXT,
        UNIQUE(user_id)
    );

    -- 3. DOCTORS Profile
    CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        specialization VARCHAR(255) NOT NULL,
        experience_years INT,
        consultation_fee DECIMAL(10, 2),
        bio TEXT,
        is_available BOOLEAN DEFAULT true,
        UNIQUE(user_id)
    );

    -- 4. APPOINTMENTS
    CREATE TABLE IF NOT EXISTS appointments (
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

    -- 5. PRESCRIPTIONS
    CREATE TABLE IF NOT EXISTS prescriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
        doctor_id UUID REFERENCES doctors(id),
        patient_id UUID REFERENCES patients(id),
        medication_details TEXT NOT NULL,
        instructions TEXT NOT NULL,
        issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. NOTIFICATIONS
    CREATE TABLE IF NOT EXISTS notifications (
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
