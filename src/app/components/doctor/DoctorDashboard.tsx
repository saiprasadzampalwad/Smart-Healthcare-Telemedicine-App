import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Users, Clock, Video, FileText, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/doctor/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user?.name || '');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-green-600 to-emerald-400 p-2 rounded-xl shadow-lg shadow-green-200">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-emerald-600">
                Doctor Dashboard
              </h1>
            </div>
            <Button 
              variant="default" 
              className="bg-red-50 hover:bg-red-100 text-red-600 border-none shadow-sm transition-all hover:shadow-md"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-green-600">Dr. {isLoading ? '...' : userName}!</span>
          </h2>
          <p className="mt-2 text-gray-600 font-medium">Here's what's happening with your practice today.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl border-t-4 border-t-blue-500 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform hover:scale-110">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-4xl font-black text-gray-800 mb-1">24</div>
              <div className="text-sm uppercase tracking-wider font-semibold text-gray-500">Today's Patients</div>
            </CardContent>
          </Card>
          
          <Card className="hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl border-t-4 border-t-green-500 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform hover:scale-110">
                <Video className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-4xl font-black text-gray-800 mb-1">8</div>
              <div className="text-sm uppercase tracking-wider font-semibold text-gray-500">Online Consults</div>
            </CardContent>
          </Card>
          
          <Card className="hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl border-t-4 border-t-orange-500 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform hover:scale-110">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <div className="text-4xl font-black text-gray-800 mb-1">16</div>
              <div className="text-sm uppercase tracking-wider font-semibold text-gray-500">In-Person Visits</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          <Card 
            className="relative cursor-pointer hover:shadow-2xl transition-all duration-300 group rounded-2xl border-none ring-1 ring-black/5 bg-white overflow-hidden" 
            onClick={() => navigate('/doctor/appointments')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  Patient Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View and manage all your scheduled appointments for today.</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-green-600 group-hover:text-green-700">
                  Manage now <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </CardContent>
            </div>
          </Card>
          
          <Card 
            className="relative cursor-pointer hover:shadow-2xl transition-all duration-300 group rounded-2xl border-none ring-1 ring-black/5 bg-white overflow-hidden" 
            onClick={() => navigate('/doctor/schedule')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  Manage Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Set your availability, configure time slots, and block dates.</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Update schedule <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
