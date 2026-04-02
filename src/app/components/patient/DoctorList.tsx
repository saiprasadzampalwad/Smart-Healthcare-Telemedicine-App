import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Search, MapPin, Star, Calendar, Video, Filter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

export default function DoctorList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      experience: 15,
      rating: 4.8,
      reviews: 234,
      hospital: 'AIIMS Delhi',
      distance: '2.5 km',
      available: true,
      onlineAvailable: true,
      consultationFee: 500,
      subsidyEligible: true
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      experience: 12,
      rating: 4.6,
      reviews: 189,
      hospital: 'Safdarjung Hospital',
      distance: '3.2 km',
      available: true,
      onlineAvailable: true,
      consultationFee: 300,
      subsidyEligible: true
    },
    {
      id: 3,
      name: 'Dr. Anita Desai',
      specialty: 'Pediatrician',
      experience: 10,
      rating: 4.9,
      reviews: 312,
      hospital: 'Ram Manohar Lohia',
      distance: '1.8 km',
      available: false,
      onlineAvailable: true,
      consultationFee: 400,
      subsidyEligible: true
    },
    {
      id: 4,
      name: 'Dr. Vikram Singh',
      specialty: 'Orthopedic',
      experience: 18,
      rating: 4.7,
      reviews: 276,
      hospital: 'Max Hospital',
      distance: '4.1 km',
      available: true,
      onlineAvailable: false,
      consultationFee: 800,
      subsidyEligible: false
    }
  ];

  const specialties = ['All', 'General Physician', 'Cardiologist', 'Pediatrician', 'Orthopedic', 'Dermatologist'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty === 'all' || doctor.specialty.toLowerCase() === specialty.toLowerCase();
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/patient/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-900">Find Doctors</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search doctors or specializations..."
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {specialties.map((spec) => (
              <Button
                key={spec}
                variant={specialty === spec.toLowerCase() ? 'default' : 'outline'}
                onClick={() => setSpecialty(spec.toLowerCase())}
                className={specialty === spec.toLowerCase() ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                {spec}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-blue-600">
                        {doctor.name.split(' ')[1][0]}
                      </span>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
                          <p className="text-blue-600">{doctor.specialty}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-gray-600 text-sm">({doctor.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{doctor.hospital}</span>
                        </div>
                        <div>• {doctor.experience} years exp.</div>
                        <div>• {doctor.distance} away</div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {doctor.available && (
                          <Badge className="bg-green-100 text-green-700">Available Today</Badge>
                        )}
                        {doctor.onlineAvailable && (
                          <Badge className="bg-blue-100 text-blue-700">
                            <Video className="w-3 h-3 mr-1" />
                            Online
                          </Badge>
                        )}
                        {doctor.subsidyEligible && (
                          <Badge className="bg-purple-100 text-purple-700">Govt. Subsidy</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:w-48">
                    <div className="text-right mb-2">
                      <p className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</p>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                    </div>
                    <Button
                      onClick={() => navigate('/patient/appointment')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                    {doctor.onlineAvailable && (
                      <Button variant="outline">
                        <Video className="w-4 h-4 mr-2" />
                        Video Consult
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No doctors found matching your criteria</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSpecialty('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
