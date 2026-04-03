import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '@/app/components/LandingPage';
import PatientDashboard from '@/app/components/patient/PatientDashboard';
import PatientRegistration from '@/app/components/patient/PatientRegistration';
import PatientLogin from '@/app/components/patient/PatientLogin';
import SymptomChecker from '@/app/components/patient/SymptomChecker';
import DoctorList from '@/app/components/patient/DoctorList';
import AppointmentBooking from '@/app/components/patient/AppointmentBooking';
import MedicalHistory from '@/app/components/patient/MedicalHistory';
import Notifications from '@/app/components/patient/Notifications';
import DoctorDashboard from '@/app/components/doctor/DoctorDashboard';
import DoctorLogin from '@/app/components/doctor/DoctorLogin';
import DoctorSchedule from '@/app/components/doctor/DoctorSchedule';
import PatientAppointments from '@/app/components/doctor/PatientAppointments';
import VideoConsultation from '@/app/components/telemedicine/VideoConsultation';
import HospitalDashboard from '@/app/components/hospital/HospitalDashboard';
import HospitalLogin from '@/app/components/hospital/HospitalLogin';
import BedAvailability from '@/app/components/hospital/BedAvailability';
import PaymentScreen from '@/app/components/payment/PaymentScreen';
import AdminDashboard from '@/app/components/admin/AdminDashboard';
import AdminLogin from '@/app/components/admin/AdminLogin';
import AdminRegistration from '@/app/components/admin/AdminRegistration';
import DoctorRegistration from '@/app/components/doctor/DoctorRegistration';
import HospitalRegistration from '@/app/components/hospital/HospitalRegistration';
import Chatbot from '@/app/components/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Patient Routes */}
          <Route path="/patient/register" element={<PatientRegistration />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/symptoms" element={<SymptomChecker />} />
          <Route path="/patient/doctors" element={<DoctorList />} />
          <Route path="/patient/appointment" element={<AppointmentBooking />} />
          <Route path="/patient/history" element={<MedicalHistory />} />
          <Route path="/patient/notifications" element={<Notifications />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/register" element={<DoctorRegistration />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route path="/doctor/appointments" element={<PatientAppointments />} />
          
          {/* Hospital Routes */}
          <Route path="/hospital/register" element={<HospitalRegistration />} />
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/beds" element={<BedAvailability />} />
          
          {/* Telemedicine */}
          <Route path="/consultation/:id" element={<VideoConsultation />} />
          
          {/* Payment */}
          <Route path="/payment" element={<PaymentScreen />} />
          
          {/* Admin Routes */}
          <Route path="/admin/register" element={<AdminRegistration />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
