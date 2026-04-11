import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bed, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

export default function BedAvailability() {
  const navigate = useNavigate();
  const [bedsData, setBedsData] = useState({
    general_ward_total: 0,
    general_ward_occupied: 0,
    icu_total: 0,
    icu_occupied: 0,
    subsidized_beds_total: 0,
    subsidized_beds_occupied: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/hospital/login');

        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await res.json();
        if (data.user?.role !== 'hospital') return navigate('/');
        
        if (data.profile) {
            setBedsData({
                general_ward_total: data.profile.general_ward_total || 0,
                general_ward_occupied: data.profile.general_ward_occupied || 0,
                icu_total: data.profile.icu_total || 0,
                icu_occupied: data.profile.icu_occupied || 0,
                subsidized_beds_total: data.profile.subsidized_beds_total || 0,
                subsidized_beds_occupied: data.profile.subsidized_beds_occupied || 0,
            });
        }
      } catch (err) {
        console.error('Error fetching beds data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalData();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setError('');
      setSuccess('');
      try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:5000/api/hospitals/beds', {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify(bedsData)
          });
          
          if (!res.ok) throw new Error('Failed to update bed availability');
          setSuccess('Bed availability updated successfully in real-time!');
      } catch (err: any) {
          setError(err.message);
      } finally {
          setIsSaving(false);
      }
  };

  const handleChange = (field: string, value: string) => {
      setBedsData(prev => ({
          ...prev,
          [field]: parseInt(value) || 0
      }));
  };

  if (isLoading) return <div className="text-center py-10">Loading Bed Data...</div>;

  const bedTypes = [
    { 
        type: 'General Ward', 
        total: bedsData.general_ward_total, 
        occupied: bedsData.general_ward_occupied, 
        available: bedsData.general_ward_total - bedsData.general_ward_occupied,
        fieldTotal: 'general_ward_total',
        fieldOccupied: 'general_ward_occupied',
        subsidized: false 
    },
    { 
        type: 'ICU', 
        total: bedsData.icu_total, 
        occupied: bedsData.icu_occupied, 
        available: bedsData.icu_total - bedsData.icu_occupied,
        fieldTotal: 'icu_total',
        fieldOccupied: 'icu_occupied',
        subsidized: false 
    },
    { 
        type: 'Subsidized Beds', 
        total: bedsData.subsidized_beds_total, 
        occupied: bedsData.subsidized_beds_occupied, 
        available: bedsData.subsidized_beds_total - bedsData.subsidized_beds_occupied,
        fieldTotal: 'subsidized_beds_total',
        fieldOccupied: 'subsidized_beds_occupied',
        subsidized: true 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/hospital/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold">Manage Bed Availability</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {error && (
            <Alert className="bg-red-50 text-red-700 border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
                <Heart className="w-4 h-4 text-green-600" />
                <AlertDescription>{success}</AlertDescription>
            </Alert>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
            {bedTypes.map((bed, index) => {
              const occupancyRate = bed.total > 0 ? (bed.occupied / bed.total) * 100 : 0;
              
              return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-white border-b">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xl">
                      <Bed className="w-5 h-5 text-gray-400" />
                      {bed.type}
                    </span>
                    {bed.subsidized && (
                      <Badge className="bg-purple-100 text-purple-700">Govt. Subsidized</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      
                      <div className="space-y-4">
                          <div>
                              <Label className="text-gray-500">Total Capacity</Label>
                              <Input 
                                  type="number" 
                                  value={bed.total} 
                                  onChange={(e) => handleChange(bed.fieldTotal, e.target.value)}
                                  className="mt-1 text-lg"
                                  min="0"
                              />
                          </div>
                          <div>
                              <Label className="text-gray-500">Currently Occupied</Label>
                              <Input 
                                  type="number" 
                                  value={bed.occupied} 
                                  onChange={(e) => handleChange(bed.fieldOccupied, e.target.value)}
                                  className="mt-1 text-lg font-semibold text-red-600"
                                  min="0"
                                  max={bed.total}
                              />
                          </div>
                      </div>

                      <div className="flex flex-col justify-center items-center bg-gray-50 rounded-xl p-6">
                          <div className="text-center">
                            <div className="text-4xl font-extrabold text-green-600">{bed.available}</div>
                            <div className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Available Beds</div>
                          </div>
                          <div className="w-full mt-6">
                              <Progress value={occupancyRate} className="h-2" />
                              <p className="text-sm text-center text-gray-600 mt-2 font-medium">
                                {Math.round(occupancyRate)}% Occupancy
                              </p>
                          </div>
                      </div>
                  </div>
                </CardContent>
              </Card>
            )})}

            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" size="lg" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Updating Network...' : 'Save & Publish Real-time'}
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}
