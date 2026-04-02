import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bed, Users, Activity, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function HospitalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold">AIIMS Delhi - Dashboard</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">45</div>
              <div className="text-gray-600">Available Beds</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">120</div>
              <div className="text-gray-600">Active Patients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">15</div>
              <div className="text-gray-600">Subsidized Beds</div>
            </CardContent>
          </Card>
        </div>

        <Card className="cursor-pointer hover:shadow-lg" onClick={() => navigate('/hospital/beds')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-purple-600" />
              Bed Availability Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage bed allocation and availability status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
