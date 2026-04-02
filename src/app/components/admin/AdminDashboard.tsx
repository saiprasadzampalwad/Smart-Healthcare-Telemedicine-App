import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Building2, DollarSign, Activity, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const monthlyData = [
    { month: 'Jan', patients: 4000, consultations: 2400, subsidy: 2000 },
    { month: 'Feb', patients: 3000, consultations: 1398, subsidy: 2210 },
    { month: 'Mar', patients: 2000, consultations: 9800, subsidy: 2290 },
    { month: 'Apr', patients: 2780, consultations: 3908, subsidy: 2000 },
    { month: 'May', patients: 1890, consultations: 4800, subsidy: 2181 },
    { month: 'Jun', patients: 2390, consultations: 3800, subsidy: 2500 }
  ];

  const hospitalData = [
    { name: 'AIIMS', performance: 95 },
    { name: 'Safdarjung', performance: 88 },
    { name: 'RML', performance: 92 },
    { name: 'Max', performance: 85 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-orange-600" />
              <h1 className="text-xl font-bold">Government Healthcare Admin</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Total Patients</div>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold">50,234</div>
              <div className="flex items-center text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Partner Hospitals</div>
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold">523</div>
              <div className="flex items-center text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Subsidy Distributed</div>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold">₹2.5Cr</div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Activity className="w-4 h-4 mr-1" />
                <span>This month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Active Consultations</div>
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold">1,245</div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <span>Currently ongoing</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="consultations" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hospital Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hospitalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
