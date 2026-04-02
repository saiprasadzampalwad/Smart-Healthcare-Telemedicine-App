import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, FileText, Download, Clock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';

export default function MedicalHistory() {
  const navigate = useNavigate();

  const appointments = [
    { id: 1, date: '2026-01-15', doctor: 'Dr. Priya Sharma', type: 'Cardiologist', status: 'completed' },
    { id: 2, date: '2025-12-20', doctor: 'Dr. Rajesh Kumar', type: 'General Physician', status: 'completed' }
  ];

  const prescriptions = [
    { id: 1, date: '2026-01-15', doctor: 'Dr. Priya Sharma', medicines: 3 },
    { id: 2, date: '2025-12-20', doctor: 'Dr. Rajesh Kumar', medicines: 2 }
  ];

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
            {appointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{apt.doctor}</h3>
                      <p className="text-blue-600 mb-2">{apt.type}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
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
