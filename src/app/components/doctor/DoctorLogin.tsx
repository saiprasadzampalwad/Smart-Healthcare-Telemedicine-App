import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Mail, Lock, Stethoscope, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
      localStorage.setItem('token', data.token);
      navigate('/doctor/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 flex flex-col font-sans">
      <header className="bg-transparent absolute top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button 
            variant="ghost" 
            className="group flex items-center gap-2 text-green-900 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 transition-all font-medium" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 lg:p-12 border border-white/60">
          
          {/* Left Side - Visual */}
          <div className="hidden lg:flex flex-col justify-center gap-8 pl-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-green-600 to-emerald-400 p-3 rounded-2xl shadow-lg shadow-green-200">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-900 to-emerald-700">
                Smart Healthcare
              </h1>
            </div>
            <div>
              <h2 className="text-4xl xl:text-5xl font-extrabold text-green-950 leading-tight mb-4 tracking-tight">
                Welcome back, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">Doctor.</span>
              </h2>
              <p className="text-lg text-green-800/80 font-medium leading-relaxed max-w-sm">
                Login to your practitioner dashboard to review patient appointments, conduct tele-consults, and manage your schedule.
              </p>
            </div>
            <div className="flex gap-4 opacity-70">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-300"></div>
              <div className="w-3 h-3 rounded-full bg-green-200"></div>
            </div>
          </div>

          {/* Right Side - Form */}
          <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden max-w-md w-full mx-auto relative z-20">
            {/* Top accent line */}
            <div className="h-2 w-full bg-gradient-to-r from-green-400 to-emerald-600"></div>
            
            <CardHeader className="text-center pt-10 pb-2">
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-[1.5rem] flex items-center justify-center rotate-3 shadow-inner border border-white">
                <Stethoscope className="w-10 h-10 text-green-600 -rotate-3" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">Portal Login</CardTitle>
              <CardDescription className="text-base text-gray-500 font-medium mt-2">Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-6">
              {error && (
                 <Alert className="mb-6 bg-red-50 text-red-700 border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                 </Alert>
              )}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="doctor@example.com" 
                      className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-200 h-14 rounded-xl text-base font-bold transition-all hover:shadow-xl mt-4"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In Securely'}
                </Button>
              </form>
              <div className="mt-8 text-center pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 font-medium">
                  New to the platform?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/doctor/register')}
                    className="text-green-600 hover:text-green-700 hover:underline font-bold transition-colors"
                  >
                    Apply for an account
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
