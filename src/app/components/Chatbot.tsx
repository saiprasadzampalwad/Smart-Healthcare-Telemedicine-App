import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AI healthcare assistant powered by Gemini. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg } as Message];
    setMessages(newMessages);
    setIsTyping(true);

    try {
const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMsg,
          expectedHistory: messages.filter(m => m.text !== 'Hello! I am your AI healthcare assistant powered by Gemini. How can I help you today?')
        }),
      });

      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      setMessages([...newMessages, { role: 'model', text: data.reply || 'Sorry, I couldn\'t understand that.' }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', text: 'Sorry, I am facing connectivity issues right now or the API key is not configured properly.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 z-[100]"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[350px] shadow-2xl flex flex-col h-[500px] z-[100]">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`text-sm p-3 rounded-lg max-w-[75%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                 <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                    <Loader2 className="animate-spin h-4 w-4" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-3 bg-gray-50 border-t">
            <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                autoFocus
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isTyping || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
