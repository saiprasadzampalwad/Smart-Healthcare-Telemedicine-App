import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, FileText, Download, Clock, MapPin, Video } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';

export default function MedicalHistory() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Still mocking prescriptions as backend `/api/prescriptions` is not fully wired yet
  const prescriptions = [
    { id: 1, date: '2026-01-15', doctor: 'Dr. Priya Sharma', medicines: 3 },
    { id: 2, date: '2025-12-20', doctor: 'Dr. Rajesh Kumar', medicines: 2 }
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/patient/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const apptData = await res.json();
          setAppointments(apptData);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/patient/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-900">Medical History</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="appointments">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            {isLoading ? (
               <p className="text-center text-gray-500 py-6">Loading real-time records...</p>
            ) : appointments.length === 0 ? (
               <p className="text-center text-gray-500 py-6">No appointments found.</p>
            ) : (
                appointments.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{apt.doctor_name || 'Doctor'}</h3>
                          <p className="text-blue-600 mb-2">{apt.specialization || 'Specialist'}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(apt.appointment_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{apt.time_slot}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                           <Badge variant="outline" className={apt.type === 'video_consultation' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}>
                             {apt.type === 'video_consultation' ? 'Video' : 'In-Person'}
                           </Badge>
                           <Badge className={
                             apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                             apt.status === 'completed' ? 'bg-green-100 text-green-700' : 
                             'bg-red-100 text-red-700'
                           }>
                             {apt.status === 'scheduled' ? 'Scheduled' : apt.status === 'completed' ? 'Completed' : 'Cancelled'}
                           </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            {prescriptions.map((rx) => (
              <Card key={rx.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">Prescription #{rx.id}</h3>
                      </div>
                      <p className="text-gray-600 mb-2">Dr. {rx.doctor}</p>
                      <p className="text-sm text-gray-600">{rx.medicines} medicines prescribed</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(rx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
