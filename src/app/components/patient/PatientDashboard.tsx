import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Activity, Calendar, FileText, Bell, MapPin, User, LogOut, Stethoscope, Clock, Video } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/patient/login');
          return;
        }

        // Fetch User Profile
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUserName(userData.user?.name || 'Patient');

        // Fetch Appointments
        const apptRes = await fetch('http://localhost:5000/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (apptRes.ok) {
          const apptData = await apptRes.json();
          // Assuming backend returns array of active appointments
          setUpcomingAppointments(apptData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const quickActions = [
    {
      icon: Activity,
      title: 'Check Symptoms',
      description: 'AI-powered diagnosis',
      color: 'bg-red-100 text-red-600',
      path: '/patient/symptoms'
    },
    {
      icon: Stethoscope,
      title: 'Find Doctors',
      description: 'Browse specialists',
      color: 'bg-blue-100 text-blue-600',
      path: '/patient/doctors'
    },
    {
      icon: Calendar,
      title: 'My Appointments',
      description: 'View & manage',
      color: 'bg-green-100 text-green-600',
      path: '/patient/history'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Health history',
      color: 'bg-purple-100 text-purple-600',
      path: '/patient/history'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-900">Smart Healthcare</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/patient/notifications')}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  0
                </span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {isLoading ? '...' : userName}!
          </h2>
          <p className="text-gray-600">How can we help you today?</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search hospitals, doctors, or specializations..."
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-6 text-center">
                <div className={`mx-auto mb-3 w-14 h-14 rounded-full flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button
                variant="ghost"
                className="text-blue-600"
                onClick={() => navigate('/patient/history')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
               <p className="text-gray-500 text-center py-4">Loading appointments...</p>
            ) : upcomingAppointments.length === 0 ? (
               <p className="text-gray-500 text-center py-4">No upcoming appointments found. Time to check up with a doctor?</p>
            ) : (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {/* Display Doctor Name retrieved via Join query in backend */}
                        <h4 className="font-semibold text-gray-900">{appointment.doctor_name || 'Doctor'}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialization || 'Specialist'}</p>
                      </div>
                      <Badge className={appointment.type === 'video_consultation' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                        {appointment.type === 'video_consultation' ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                        {appointment.type === 'video_consultation' ? 'Video' : 'In-Person'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time_slot}</span>
                      </div>
                    </div>
                    {appointment.type === 'video_consultation' && (
                      <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                        Join Consultation
                      </Button>
                    )}
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  💧
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Stay Hydrated</h4>
                  <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  🏃
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Regular Exercise</h4>
                  <p className="text-sm text-gray-600">30 minutes of physical activity daily</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-10">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => navigate('/patient/dashboard')}>
            <Heart className="w-5 h-5 mb-1 text-blue-600" />
            <span className="text-xs text-blue-600">Home</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => navigate('/patient/doctors')}>
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Find</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => navigate('/patient/history')}>
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Appointments</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
