import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Building2, Mail, Lock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export default function HospitalLogin() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/hospital/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold">Hospital Login</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">Hospital Portal</CardTitle>
            <CardDescription>Login to manage hospital operations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Hospital ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="email" placeholder="hospital@example.com" className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-12">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/hospital/register')}
                  className="text-purple-600 hover:underline font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
