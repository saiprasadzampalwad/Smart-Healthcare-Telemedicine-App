import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, User, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export default function PatientAppointments() {
  const navigate = useNavigate();
  
  const appointments = [
    { id: 1, patient: 'Ramesh Kumar', age: 45, symptoms: 'Chest pain, breathlessness', priority: 'high', time: '10:00 AM' },
    { id: 2, patient: 'Priya Singh', age: 32, symptoms: 'Fever, cough', priority: 'medium', time: '10:30 AM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
        {appointments.map(apt => (
          <Card key={apt.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{apt.patient}</h3>
                    <p className="text-gray-600">Age: {apt.age}</p>
                    <p className="text-sm text-gray-600 mt-1">Symptoms: {apt.symptoms}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{apt.time}</span>
                    </div>
                  </div>
                </div>
                <Badge className={apt.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>
                  {apt.priority === 'high' ? 'High Priority' : 'Medium'}
                </Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => navigate('/consultation/1')} className="bg-green-600 hover:bg-green-700">
                  Start Consultation
                </Button>
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
