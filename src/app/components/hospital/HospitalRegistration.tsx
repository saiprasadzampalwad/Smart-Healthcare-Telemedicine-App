import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

export default function HospitalRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'admin' }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      
      localStorage.setItem('token', data.token);
      navigate('/hospital/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/hospital/login')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-indigo-900">Hospital Sign Up</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl">Create Hospital Account</CardTitle>
            <CardDescription>Register your institution in our network</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
               <Alert className="mb-4 bg-red-50 text-red-700 border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}
            <form onSubmit={handleRegister} className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="name">Hospital Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="name" placeholder="City General Hospital" className="pl-10" required 
                    value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="email" type="email" placeholder="admin@hospital.com" className="pl-10" required 
                    value={formData.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10" required 
                    value={formData.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}/>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12">
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account? <span onClick={() => navigate('/hospital/login')} className="text-indigo-600 font-medium cursor-pointer hover:underline">Log in</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
