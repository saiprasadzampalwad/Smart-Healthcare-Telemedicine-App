import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Save } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export default function DoctorSchedule() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [consultationFee, setConsultationFee] = useState(500);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/doctor/login');

        const res = await fetch('http://localhost:5000/api/doctors/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setIsAvailable(data.is_available);
        setConsultationFee(data.consultation_fee || 500);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/doctors/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_available: isAvailable,
          consultation_fee: consultationFee
        })
      });

      if (!res.ok) throw new Error('Failed to save profile');
      alert('Schedule updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating schedule');
    } finally {
      setIsSaving(false);
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
              <h1 className="text-xl font-bold">Manage Schedule</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Availability & Pricing</CardTitle>
            <CardDescription>Control your visibility to patients on the portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
               <p className="py-10 text-gray-500">Loading settings...</p>
            ) : (
              <>
                <div className="flex items-center justify-between border-b pb-6">
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">Patient Acceptance</h3>
                    <p className="text-sm text-gray-500">Toggle whether you are currently accepting new appointments.</p>
                  </div>
                  <button 
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${isAvailable ? 'bg-green-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-8' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <Label htmlFor="fee" className="text-base">Consultation Fee (₹)</Label>
                  <Input 
                    id="fee"
                    type="number" 
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    min="0"
                    step="50"
                    className="max-w-[200px]"
                  />
                  <p className="text-sm text-gray-500">This fee will be displayed to patients before they book.</p>
                </div>
                
                <div className="pt-6">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
