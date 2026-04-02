import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bed } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';

export default function BedAvailability() {
  const navigate = useNavigate();

  const bedTypes = [
    { type: 'General Ward', total: 100, occupied: 55, available: 45, subsidized: 0 },
    { type: 'ICU', total: 30, occupied: 25, available: 5, subsidized: 0 },
    { type: 'Subsidized Beds', total: 20, occupied: 5, available: 15, subsidized: 15 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/hospital/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold">Bed Availability</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {bedTypes.map((bed, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  {bed.type}
                </span>
                {bed.subsidized > 0 && (
                  <Badge className="bg-purple-100 text-purple-700">Govt. Subsidized</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{bed.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{bed.occupied}</div>
                  <div className="text-sm text-gray-600">Occupied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{bed.available}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
              </div>
              <Progress value={(bed.occupied / bed.total) * 100} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                {Math.round((bed.occupied / bed.total) * 100)}% Occupancy
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
