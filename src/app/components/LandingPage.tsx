import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, Building2, Shield, User, Calendar, Video, FileText, ArrowRight, Languages } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useLanguage } from '@/app/i18n/LanguageContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-indigo-200">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-cyan-700 tracking-tight">
                Smart Healthcare
              </h1>
            </div>
            <div className="hidden md:flex gap-4 items-center">
              <Button variant="ghost" className="text-indigo-900 hover:text-indigo-600 hover:bg-indigo-50 font-semibold transition-all">
                {t('nav.about')}
              </Button>
              <Button onClick={toggleLanguage} variant="outline" className="gap-2 text-indigo-900 rounded-full border-indigo-200">
                <Languages className="w-4 h-4 text-indigo-600" />
                {language === 'en' ? 'हिन्दी' : 'English'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-extrabold text-indigo-950 mb-6 tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">{t('hero.title.highlight')}</span> <br className="hidden sm:block" /> {t('hero.title.rest')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto relative z-10">
            <Card 
              className="cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-none shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
              onClick={() => navigate('/patient/login')}
            >
              <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <CardHeader className="text-center pb-4 pt-6">
                <div className="mx-auto mb-5 w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{t('card.patient.title')}</CardTitle>
                <CardDescription className="font-medium text-gray-500 mt-2">{t('card.patient.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-semibold text-base transition-colors group-hover:shadow-md">
                  {t('card.patient.btn')} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-none shadow-lg hover:shadow-2xl hover:shadow-green-200/50 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
              onClick={() => navigate('/doctor/login')}
            >
              <div className="h-2 w-full bg-gradient-to-r from-green-400 to-emerald-600"></div>
              <CardHeader className="text-center pb-4 pt-6">
                <div className="mx-auto mb-5 w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Stethoscope className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{t('card.doctor.title')}</CardTitle>
                <CardDescription className="font-medium text-gray-500 mt-2">{t('card.doctor.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-6 font-semibold text-base transition-colors group-hover:shadow-md">
                  {t('card.doctor.btn')} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-none shadow-lg hover:shadow-2xl hover:shadow-purple-200/50 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
              onClick={() => navigate('/hospital/login')}
            >
              <div className="h-2 w-full bg-gradient-to-r from-purple-400 to-indigo-600"></div>
              <CardHeader className="text-center pb-4 pt-6">
                <div className="mx-auto mb-5 w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Building2 className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{t('card.hospital.title')}</CardTitle>
                <CardDescription className="font-medium text-gray-500 mt-2">{t('card.hospital.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 font-semibold text-base transition-colors group-hover:shadow-md">
                  {t('card.hospital.btn')} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-none shadow-lg hover:shadow-2xl hover:shadow-orange-200/50 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
              onClick={() => navigate('/admin/login')}
            >
              <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-red-600"></div>
              <CardHeader className="text-center pb-4 pt-6">
                <div className="mx-auto mb-5 w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Shield className="w-10 h-10 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Admin</CardTitle>
                <CardDescription className="font-medium text-gray-500 mt-2">Monitor platform & resolve issues</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-6 font-semibold text-base transition-colors group-hover:shadow-md">
                  Admin Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50 backdrop-blur-md rounded-3xl my-10 border border-white">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold text-indigo-950 mb-4 tracking-tight">
            Why Choose Smart Healthcare?
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">Innovation driving better, faster, and more accessible healthcare for everyone.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="text-center group p-6 rounded-2xl hover:bg-white transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <feature.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">{feature.title}</h4>
              <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-3xl p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="pt-6 md:pt-0">
              <div className="text-5xl lg:text-6xl font-black mb-3">10k+</div>
              <div className="text-indigo-100 font-semibold text-lg uppercase tracking-wider">Registered Doctors</div>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-5xl lg:text-6xl font-black mb-3">50k+</div>
              <div className="text-indigo-100 font-semibold text-lg uppercase tracking-wider">Happy Patients</div>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-5xl lg:text-6xl font-black mb-3">500+</div>
              <div className="text-indigo-100 font-semibold text-lg uppercase tracking-wider">Partner Hospitals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <Heart className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold tracking-tight text-white">Smart Healthcare</span>
            </div>
            <p className="text-gray-400 font-medium text-center md:text-right">
              © 2026 Smart Healthcare Platform.<br className="md:hidden" /> A Government Initiative.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
