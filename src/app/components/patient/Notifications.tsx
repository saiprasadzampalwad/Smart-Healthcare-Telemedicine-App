import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bell, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export default function Notifications() {
  const navigate = useNavigate();

  const notifications = [
    { id: 1, type: 'appointment', title: 'Upcoming Appointment', message: 'Appointment with Dr. Priya Sharma tomorrow at 10:00 AM', time: '2 hours ago', read: false },
    { id: 2, type: 'prescription', title: 'Prescription Ready', message: 'Your prescription from Dr. Rajesh Kumar is ready for download', time: '1 day ago', read: false },
    { id: 3, type: 'reminder', title: 'Medicine Reminder', message: 'Time to take your morning medication', time: '2 days ago', read: true }
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
              <h1 className="text-xl font-bold text-blue-900">Notifications</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card key={notif.id} className={notif.read ? 'bg-white' : 'bg-blue-50'}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.type === 'appointment' ? 'bg-blue-100' :
                    notif.type === 'prescription' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {notif.type === 'appointment' && <Calendar className="w-5 h-5 text-blue-600" />}
                    {notif.type === 'prescription' && <FileText className="w-5 h-5 text-green-600" />}
                    {notif.type === 'reminder' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{notif.title}</h3>
                      {!notif.read && <Badge className="bg-blue-600">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
