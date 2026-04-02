import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, Building2, Shield, User, Calendar, Video, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointments',
      description: 'Book appointments with top doctors in seconds'
    },
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'Consult doctors online from the comfort of your home'
    },
    {
      icon: FileText,
      title: 'Digital Records',
      description: 'Access your medical history anytime, anywhere'
    },
    {
      icon: Shield,
      title: 'Government Support',
      description: 'Subsidized healthcare for eligible patients'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-900">Smart Healthcare</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Your Health, Our Priority
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with healthcare professionals instantly. Government-supported telemedicine platform.
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-400"
            onClick={() => navigate('/patient/login')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Patient</CardTitle>
              <CardDescription>Book appointments & consultations</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Login / Register
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-400"
            onClick={() => navigate('/doctor/login')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Doctor</CardTitle>
              <CardDescription>Manage appointments & patients</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Doctor Login
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-400"
            onClick={() => navigate('/hospital/login')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Hospital</CardTitle>
              <CardDescription>Manage beds & operations</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Hospital Login
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-orange-400"
            onClick={() => navigate('/admin/login')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Admin</CardTitle>
              <CardDescription>Monitor & manage platform</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Why Choose Smart Healthcare?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Registered Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Partner Hospitals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2026 Smart Healthcare Platform. A Government Initiative.
          </p>
        </div>
      </footer>
    </div>
  );
}
