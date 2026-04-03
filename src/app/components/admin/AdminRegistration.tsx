import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

export default function AdminRegistration() {
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
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/login')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900">Admin Sign Up</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-gray-900" />
            </div>
            <CardTitle className="text-2xl">Create Admin Account</CardTitle>
            <CardDescription>Setup a new system administrator</CardDescription>
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
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="name" placeholder="John Admin" className="pl-10" required 
                    value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="email" type="email" placeholder="admin@domain.com" className="pl-10" required 
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
              <Button type="submit" disabled={isLoading} className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12">
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account? <span onClick={() => navigate('/admin/login')} className="text-gray-900 font-medium cursor-pointer hover:underline">Log in</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
