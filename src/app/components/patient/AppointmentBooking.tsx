import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, Clock, MapPin, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';

export default function AppointmentBooking() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [consultationType, setConsultationType] = useState('online');
  const [selectedDate, setSelectedDate] = useState('2026-01-26');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [booked, setBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [doctorInfo, setDoctorInfo] = useState<any>(null);

  const availableDates = [
    '2026-01-26',
    '2026-01-27',
    '2026-01-28',
    '2026-01-29',
    '2026-01-30'
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
  ];

  React.useEffect(() => {
    if (!doctorId) {
      navigate('/patient/doctors');
      return;
    }
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`);
        if (res.ok) {
          const data = await res.json();
          setDoctorInfo(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctor();
  }, [doctorId, navigate]);

  const handleBooking = async () => {
    setIsBooking(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/patient/login');

      // Convert "10:00 AM" to "10:00:00" for postgres TIME type compatibility
      const formatTime = (timeStr: string) => {
        const [time, modifier] = timeStr.trim().split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
          hours = '00';
        }
        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12 + '';
        }
        return `${hours.padStart(2, '0')}:${minutes}:00`;
      };

      const bodyData = {
        doctor_id: doctorId,
        appointment_date: selectedDate,
        time_slot: formatTime(selectedTime),
        type: consultationType === 'online' ? 'video_consultation' : 'in_person',
        notes: 'General Checkup'
      };

      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error booking appointment');
      
      setBooked(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/patient/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-blue-900">Appointment Confirmed</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
              <p className="text-gray-600 mb-8">Your appointment has been confirmed</p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-semibold text-gray-900">{doctorInfo ? doctorInfo.name : 'Loading...'}</p>
                    <p className="text-sm text-blue-600">{doctorInfo ? doctorInfo.specialization : 'Specialist'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>{selectedTime}</span>
                  </div>
                  <Badge className={consultationType === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                    {consultationType === 'online' ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                    {consultationType === 'online' ? 'Video Consultation' : 'In-Person Visit'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/patient/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/patient/history')}>
                  View My Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/patient/doctors')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-900">Book Appointment</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Doctor Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{doctorInfo?.name ? doctorInfo.name[0].toUpperCase() : 'D'}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{doctorInfo ? doctorInfo.name : 'Loading...'}</h3>
                <p className="text-blue-600">{doctorInfo ? doctorInfo.specialization : 'Specialist'}</p>
                <p className="text-sm text-gray-600">Smart Healthcare Network {doctorInfo?.experience_years ? `• ${doctorInfo.experience_years} years exp.` : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Type */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Consultation Type</CardTitle>
            <CardDescription>Choose how you'd like to consult</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={consultationType} onValueChange={setConsultationType}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Label
                  htmlFor="online"
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${
                    consultationType === 'online' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value="online" id="online" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Video Consultation</p>
                      <p className="text-sm text-gray-600">₹500</p>
                    </div>
                  </div>
                </Label>

                <Label
                  htmlFor="offline"
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${
                    consultationType === 'offline' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value="offline" id="offline" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">In-Person Visit</p>
                      <p className="text-sm text-gray-600">₹500</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    selectedDate === date
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs text-gray-600 mb-1">
                    {new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })}
                  </div>
                  <div className="font-semibold">
                    {new Date(date).toLocaleDateString('en-IN', { day: 'numeric' })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(date).toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Time Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    selectedTime === time
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}
        <Button
          onClick={handleBooking}
          disabled={isBooking}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        >
          {isBooking ? 'Booking...' : 'Confirm Booking - ₹500'}
        </Button>
      </div>
    </div>
  );
}
