import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Search, AlertCircle, CheckCircle2, Info, TrendingUp, Video, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const commonSymptoms = [
    { id: 'fever', name: 'Fever', severity: 'medium' },
    { id: 'cough', name: 'Cough', severity: 'low' },
    { id: 'headache', name: 'Headache', severity: 'low' },
    { id: 'chest-pain', name: 'Chest Pain', severity: 'high' },
    { id: 'breathlessness', name: 'Breathing Difficulty', severity: 'high' },
    { id: 'fatigue', name: 'Fatigue', severity: 'low' },
    { id: 'sore-throat', name: 'Sore Throat', severity: 'low' },
    { id: 'body-pain', name: 'Body Pain', severity: 'medium' },
    { id: 'nausea', name: 'Nausea', severity: 'medium' },
    { id: 'dizziness', name: 'Dizziness', severity: 'medium' },
  ];

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = () => {
    setShowResults(true);
  };

  const getSeverityLevel = () => {
    const hasHighSeverity = selectedSymptoms.some(id => {
      const symptom = commonSymptoms.find(s => s.id === id);
      return symptom?.severity === 'high';
    });
    return hasHighSeverity ? 'high' : selectedSymptoms.length > 3 ? 'medium' : 'low';
  };

  const getRecommendation = () => {
    const severity = getSeverityLevel();
    
    if (severity === 'high') {
      return {
        title: 'Immediate Medical Attention Recommended',
        description: 'Based on your symptoms, we recommend visiting a hospital immediately or calling emergency services.',
        action: 'Find Nearby Hospital',
        actionPath: '/patient/doctors',
        icon: AlertCircle,
        color: 'red',
        specialists: ['Emergency Medicine', 'Cardiologist']
      };
    } else if (severity === 'medium') {
      return {
        title: 'Consult a Doctor Soon',
        description: 'Your symptoms suggest you should see a doctor within 24-48 hours.',
        action: 'Book Appointment',
        actionPath: '/patient/doctors',
        icon: Info,
        color: 'orange',
        specialists: ['General Physician', 'Internal Medicine']
      };
    } else {
      return {
        title: 'Online Consultation Recommended',
        description: 'Your symptoms are mild. An online consultation would be sufficient.',
        action: 'Start Video Consultation',
        actionPath: '/patient/doctors',
        icon: CheckCircle2,
        color: 'green',
        specialists: ['General Physician', 'Family Medicine']
      };
    }
  };

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-xl font-bold text-blue-900">Symptom Checker</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertTitle className="text-blue-900">AI-Powered Analysis</AlertTitle>
          <AlertDescription className="text-blue-700">
            This is a preliminary assessment tool. It does not replace professional medical diagnosis.
          </AlertDescription>
        </Alert>

        {!showResults ? (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <Label htmlFor="search" className="text-base mb-2 block">
                Search Symptoms
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Type to search symptoms..."
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Symptoms Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Your Symptoms</CardTitle>
                <CardDescription>
                  Choose all symptoms you are currently experiencing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSymptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSymptomToggle(symptom.id)}
                    >
                      <Checkbox
                        id={symptom.id}
                        checked={selectedSymptoms.includes(symptom.id)}
                        onCheckedChange={() => handleSymptomToggle(symptom.id)}
                      />
                      <Label htmlFor={symptom.id} className="flex-1 cursor-pointer">
                        {symptom.name}
                      </Label>
                      {symptom.severity === 'high' && (
                        <Badge className="bg-red-100 text-red-700">High</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Count */}
            {selectedSymptoms.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedSymptoms([])}
                  variant="ghost"
                  className="text-blue-600"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
            >
              Analyze Symptoms
            </Button>
          </>
        ) : (
          <>
            {/* Results */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Based on {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(() => {
                    const recommendation = getRecommendation();
                    const Icon = recommendation.icon;
                    const severity = getSeverityLevel();
                    
                    return (
                      <>
                        <Alert className={`${
                          severity === 'high' ? 'bg-red-50 border-red-200' :
                          severity === 'medium' ? 'bg-orange-50 border-orange-200' :
                          'bg-green-50 border-green-200'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            severity === 'high' ? 'text-red-600' :
                            severity === 'medium' ? 'text-orange-600' :
                            'text-green-600'
                          }`} />
                          <AlertTitle className={`${
                            severity === 'high' ? 'text-red-900' :
                            severity === 'medium' ? 'text-orange-900' :
                            'text-green-900'
                          }`}>
                            {recommendation.title}
                          </AlertTitle>
                          <AlertDescription className={`${
                            severity === 'high' ? 'text-red-700' :
                            severity === 'medium' ? 'text-orange-700' :
                            'text-green-700'
                          }`}>
                            {recommendation.description}
                          </AlertDescription>
                        </Alert>

                        <div>
                          <h4 className="font-semibold mb-3">Recommended Specialists:</h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendation.specialists.map((specialist) => (
                              <Badge key={specialist} className="bg-blue-100 text-blue-700">
                                {specialist}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            onClick={() => navigate(recommendation.actionPath)}
                            className={`h-12 ${
                              severity === 'high' ? 'bg-red-600 hover:bg-red-700' :
                              severity === 'medium' ? 'bg-orange-600 hover:bg-orange-700' :
                              'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {severity === 'high' ? <Building2 className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                            {recommendation.action}
                          </Button>
                          <Button
                            onClick={() => setShowResults(false)}
                            variant="outline"
                            className="h-12"
                          >
                            Check Again
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Selected Symptoms Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Selected Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptomId) => {
                    const symptom = commonSymptoms.find(s => s.id === symptomId);
                    return symptom ? (
                      <Badge key={symptomId} variant="outline">
                        {symptom.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
