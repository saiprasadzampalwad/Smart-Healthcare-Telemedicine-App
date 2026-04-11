import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bed, Users, Activity, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const [hospitalData, setHospitalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/hospital/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch hospital data');
        const data = await res.json();
        
        if (data.user.role !== 'hospital') {
            navigate('/');
            return;
        }
        
        setHospitalData(data);
      } catch (err) {
        console.error('Error fetching hospital dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalData();
  }, [navigate]);

  if (isLoading) return <div className="text-center py-10">Loading Dashboard...</div>;

  const profile = hospitalData?.profile || {};
  const totalAvailableBeds = 
      (profile.general_ward_total || 0) - (profile.general_ward_occupied || 0) +
      (profile.icu_total || 0) - (profile.icu_occupied || 0) +
      (profile.subsidized_beds_total || 0) - (profile.subsidized_beds_occupied || 0);

  const totalPatients = 
      (profile.general_ward_occupied || 0) + 
      (profile.icu_occupied || 0) + 
      (profile.subsidized_beds_occupied || 0);

  const subsidizedBedsAvailable = (profile.subsidized_beds_total || 0) - (profile.subsidized_beds_occupied || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold">{hospitalData?.user?.name || 'Hospital Dashboard'}</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
            }}>
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
              <div className="text-3xl font-bold">{totalAvailableBeds}</div>
              <div className="text-gray-600">Available Beds</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">{totalPatients}</div>
              <div className="text-gray-600">Active Patients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">{subsidizedBedsAvailable}</div>
              <div className="text-gray-600">Subsidized Beds Available</div>
            </CardContent>
          </Card>
        </div>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/hospital/beds')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-purple-600" />
              Bed Availability Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Update bed allocation, admissions, and discharges</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
