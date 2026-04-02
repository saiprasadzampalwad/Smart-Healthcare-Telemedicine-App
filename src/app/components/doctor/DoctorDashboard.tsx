import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Users, Clock, Video, FileText, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-green-900">Doctor Dashboard</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Welcome, Dr. Priya Sharma!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">24</div>
              <div className="text-gray-600">Today's Patients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">8</div>
              <div className="text-gray-600">Online Consultations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">16</div>
              <div className="text-gray-600">In-Person Visits</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg" onClick={() => navigate('/doctor/appointments')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Patient Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage today's appointments</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg" onClick={() => navigate('/doctor/schedule')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Manage Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Set your availability and time slots</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
