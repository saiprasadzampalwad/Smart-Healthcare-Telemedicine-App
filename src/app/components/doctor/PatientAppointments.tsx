import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, User, Calendar, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export default function PatientAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/doctor/login');

        const res = await fetch('http://localhost:5000/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
      } else {
        console.error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/doctor/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold">Patient Appointments</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {isLoading ? (
            <p className="text-center py-10 text-gray-500">Loading Appointments...</p>
        ) : appointments.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No appointments scheduled for today.</p>
        ) : appointments.map(apt => (
          <Card key={apt.id} className="hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex shrink-0 items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{apt.patient_name || 'Unknown Patient'}</h3>
                    <p className="text-gray-600 text-sm">Reason: {apt.notes || 'Routine checkup'}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{new Date(apt.appointment_date).toLocaleDateString()} at {apt.time_slot}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right flex flex-col md:items-end gap-2">
                    <Badge variant="outline" className={apt.type === 'video_consultation' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                      {apt.type === 'video_consultation' ? 'Video Consult' : 'In-Person'}
                    </Badge>
                    <Badge className={
                      apt.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                      apt.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      'bg-red-100 text-red-700'
                    }>
                      {apt.status.toUpperCase()}
                    </Badge>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {apt.type === 'video_consultation' && (
                    <Button onClick={() => navigate(`/consultation/${apt.id}`)} className="bg-green-600 hover:bg-green-700">
                      Start Consultation
                    </Button>
                )}
                {apt.status === 'scheduled' && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => updateStatus(apt.id, 'completed')}
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Mark Completed
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateStatus(apt.id, 'cancelled')}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                <Button 
                    variant="outline" 
                    onClick={() => navigate(`/doctor/patient/${apt.patient_id}`)}
                    className="gap-2 ml-auto"
                >
                    <FileText className="w-4 h-4" />
                    Unified Digital Record
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
