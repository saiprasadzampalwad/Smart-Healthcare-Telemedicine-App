import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Video, Mic, MicOff, VideoOff, Phone, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';

export default function VideoConsultation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState('video');

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-400" />
              <h1 className="text-lg font-bold">Video Consultation</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Dr. Priya Sharma</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-700"
                onClick={() => navigate('/patient/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Video Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                {/* Doctor Video */}
                <div className="relative bg-gray-900 aspect-video rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl font-bold">P</span>
                      </div>
                      <p className="text-lg">Dr. Priya Sharma</p>
                      <p className="text-sm text-gray-400">Cardiologist</p>
                    </div>
                  </div>
                </div>
                
                {/* Self Video (Picture-in-Picture) */}
                <div className="absolute bottom-20 right-6 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
                  <div className="h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold">R</span>
                      </div>
                      <p className="text-sm">You</p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-gray-800 p-4 flex items-center justify-center gap-4 rounded-b-lg">
                  <Button
                    size="lg"
                    variant={isMuted ? 'destructive' : 'secondary'}
                    className="rounded-full w-14 h-14"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                  <Button
                    size="lg"
                    variant={isVideoOff ? 'destructive' : 'secondary'}
                    className="rounded-full w-14 h-14"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="rounded-full w-14 h-14"
                    onClick={() => navigate('/patient/dashboard')}
                  >
                    <Phone className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={activeTab === 'video' ? 'default' : 'ghost'}
                    className="flex-1"
                    onClick={() => setActiveTab('video')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    variant={activeTab === 'notes' ? 'default' : 'ghost'}
                    className="flex-1"
                    onClick={() => setActiveTab('notes')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </Button>
                </div>

                {activeTab === 'video' && (
                  <div className="space-y-4">
                    <div className="h-96 bg-gray-900 rounded-lg p-4 overflow-y-auto">
                      <div className="space-y-3 text-white">
                        <div className="bg-blue-600 rounded-lg p-3 max-w-xs">
                          <p className="text-sm">Hello, how can I help you today?</p>
                          <p className="text-xs text-blue-200 mt-1">10:05 AM</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3 max-w-xs ml-auto">
                          <p className="text-sm">I'm experiencing chest pain</p>
                          <p className="text-xs text-gray-400 mt-1">10:06 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      <Button>Send</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <Textarea
                      placeholder="Doctor's notes..."
                      className="h-96 bg-gray-900 border-gray-700 text-white"
                      readOnly
                      value="Patient symptoms: Chest pain, breathlessness\n\nInitial assessment: Possible cardiac issue\n\nRecommendation: ECG test required"
                    />
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
