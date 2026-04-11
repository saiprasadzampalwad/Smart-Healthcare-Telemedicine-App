import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, FileText, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

export default function PatientRecordView() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/doctor/login');

        const res = await fetch(`http://localhost:5000/api/records/patient/${patientId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to fetch patient unified records');
        
        const data = await res.json();
        setRecord(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [patientId, navigate]);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading Unified Records...</div>;
  
  if (error || !record) return (
      <div className="max-w-3xl mx-auto mt-20 p-4">
          <Alert className="bg-red-50 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error || 'Patient not found'}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate('/doctor/dashboard')}>Go Back</Button>
      </div>
  );

  const { patient, history } = record;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/doctor/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
              <h1 className="text-xl font-bold text-gray-900">Unified Digital Record</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Patient Profile */}
              <div className="space-y-6">
                  <Card className="border-t-4 border-t-blue-500 shadow-md">
                      <CardHeader className="text-center pb-2">
                          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                              <User className="w-10 h-10 text-blue-600" />
                          </div>
                          <CardTitle className="text-2xl">{patient.name}</CardTitle>
                          <CardDescription>{patient.email}</CardDescription>
                          
                          <div className="mt-2 flex justify-center gap-2">
                              {patient.is_eligible_for_subsidy && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified Govt Subsidy
                                  </Badge>
                              )}
                          </div>
                      </CardHeader>
                      <CardContent>
                          <div className="border-t pt-4 space-y-3 text-sm">
                              <div className="flex justify-between">
                                  <span className="text-gray-500">Aadhaar (Last 4)</span>
                                  <span className="font-medium text-gray-900">
                                      {patient.aadhaar_number ? `...${patient.aadhaar_number.slice(-4)}` : 'N/A'}
                                  </span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-gray-500">Gender</span>
                                  <span className="font-medium text-gray-900 capitalize">{patient.gender || 'Not specified'}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-gray-500">Blood Group</span>
                                  <span className="font-medium text-red-600">{patient.blood_group || 'Unknown'}</span>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              </div>

              {/* Right Column: History */}
              <div className="lg:col-span-2 space-y-6">
                  
                  {/* Prescriptions */}
                  <Card className="shadow-sm">
                      <CardHeader className="bg-gray-50/50 border-b pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                              <Activity className="w-5 h-5 text-purple-600" />
                              Latest Prescriptions
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                          {history.prescriptions.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">No past prescriptions found.</p>
                          ) : (
                              <div className="space-y-4">
                                  {history.prescriptions.map((pres: any) => (
                                      <div key={pres.id} className="border border-gray-100 rounded-lg p-4 bg-white hover:bg-gray-50 transition border-l-4 border-l-purple-400">
                                          <div className="flex justify-between items-start mb-2">
                                              <div>
                                                  <h4 className="font-semibold text-gray-900">{pres.medication_details}</h4>
                                                  <p className="text-sm text-gray-600 mt-1">{pres.instructions}</p>
                                              </div>
                                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                                  {new Date(pres.issued_at).toLocaleDateString()}
                                              </span>
                                          </div>
                                          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" />
                                            Prescribed by Dr. {pres.doctor_name}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </CardContent>
                  </Card>

                  {/* Appointments */}
                  <Card className="shadow-sm">
                      <CardHeader className="bg-gray-50/50 border-b pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              Appointment History
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                          {history.appointments.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">No prior appointments.</p>
                          ) : (
                              <div className="space-y-4">
                                  {history.appointments.map((appt: any) => (
                                      <div key={appt.id} className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg hover:shadow-sm transition">
                                          <div>
                                              <h4 className="font-semibold text-gray-900">Dr. {appt.doctor_name}</h4>
                                              <p className="text-sm text-gray-500">{appt.specialization}</p>
                                          </div>
                                          <div className="mt-3 sm:mt-0 sm:text-right flex flex-col gap-1">
                                              <Badge variant="outline" className={`w-fit self-start sm:self-end ${appt.status === 'completed' ? 'text-green-600 border-green-200 bg-green-50' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                                                  {appt.status.toUpperCase()}
                                              </Badge>
                                              <p className="text-xs font-medium text-gray-500">
                                                  {new Date(appt.appointment_date).toLocaleDateString()} at {appt.time_slot}
                                              </p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </CardContent>
                  </Card>
              </div>

          </div>
      </div>
    </div>
  );
}
