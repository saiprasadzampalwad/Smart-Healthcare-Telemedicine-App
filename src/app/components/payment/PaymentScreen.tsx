import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, CreditCard, Smartphone, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Separator } from '@/app/components/ui/separator';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paid, setPaid] = useState(false);

  const consultationFee = 500;
  const governmentSubsidy = 200;
  const finalAmount = consultationFee - governmentSubsidy;

  const handlePayment = () => {
    setPaid(true);
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold">Payment Successful</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-8">Your payment has been processed</p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-semibold">₹{finalAmount}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Government Subsidy</span>
                    <span className="font-semibold">-₹{governmentSubsidy}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm">TXN{Date.now()}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => navigate('/patient/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">Payment</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Subsidy Alert */}
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Info className="w-4 h-4 text-green-600" />
          <AlertTitle className="text-green-900">Government Subsidy Applied</AlertTitle>
          <AlertDescription className="text-green-700">
            You are eligible for ₹{governmentSubsidy} subsidy based on your income certificate
          </AlertDescription>
        </Alert>

        {/* Payment Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Consultation with Dr. Priya Sharma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-semibold">₹{consultationFee}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Government Subsidy</span>
                <span className="font-semibold">-₹{governmentSubsidy}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Payable</span>
                <span className="font-bold text-blue-600">₹{finalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-4">
                <Label
                  htmlFor="upi"
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value="upi" id="upi" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">UPI Payment</p>
                      <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                </Label>

                <Label
                  htmlFor="card"
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, Rupay</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'upi' && (
              <div className="mt-4">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@upi"
                  className="mt-2"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      maxLength={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        >
          Pay ₹{finalAmount}
        </Button>
      </div>
    </div>
  );
}
