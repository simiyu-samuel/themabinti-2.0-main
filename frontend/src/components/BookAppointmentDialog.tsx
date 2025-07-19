import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import api from '@/config/api';

interface TimeSlot {
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
}

const timeSlots: TimeSlot[] = [
  // Morning slots
  ...[
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', 
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM'
  ].map(time => ({ time, period: 'Morning' as const })),
  
  // Afternoon slots
  ...[
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
  ].map(time => ({ time, period: 'Afternoon' as const })),
  
  // Evening slots
  ...[
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
    '10:00 PM', '10:30 PM'
  ].map(time => ({ time, period: 'Evening' as const }))
];

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId?: string; // Optional serviceId for booking from service detail page
}

const BookAppointmentDialog = ({ open, onOpenChange, serviceId }: BookAppointmentDialogProps) => {
  const { id: urlServiceId } = useParams<{ id: string }>();
  const actualServiceId = serviceId || urlServiceId;
  
  const [activeTab, setActiveTab] = useState('appointment');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Enquiry form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Auto switch to enquiry tab after time selection
    setActiveTab('enquiry');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !name || !email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/appointments', {
        serviceId: actualServiceId,
        name,
        email,
        date: selectedDate,
        time: selectedTime,
        message
      });
      
      toast.success('Appointment booked successfully!');
      
      // Reset form and close dialog
      setSelectedDate(undefined);
      setSelectedTime(null);
      setName('');
      setEmail('');
      setMessage('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDateFormatted = selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : '';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-purple-700">Book an Appointment</DialogTitle>
          <DialogDescription className="text-center">
            Schedule an appointment or make an enquiry with our service provider
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="appointment">Appointment</TabsTrigger>
            <TabsTrigger value="enquiry" disabled={!selectedDate || !selectedTime}>Enquiry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointment" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Select a date and time slot to book an Appointment</h3>
              
              <div className="my-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full p-3 pointer-events-auto"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </div>
              
              {selectedDate && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">{selectedDateFormatted}</h4>
                  
                  {['Morning', 'Afternoon', 'Evening'].map((period) => (
                    <div key={period} className="mb-4">
                      <h5 className="text-sm font-medium text-gray-600 mb-2">{period}</h5>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots
                          .filter((slot) => slot.period === period)
                          .map((slot) => (
                            <Button
                              key={slot.time}
                              type="button"
                              variant={selectedTime === slot.time ? "default" : "outline"}
                              className={`text-sm py-1 px-2 h-auto ${
                                selectedTime === slot.time ? 'bg-purple-500 text-white' : ''
                              }`}
                              onClick={() => handleTimeSelect(slot.time)}
                            >
                              {slot.time}
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="enquiry">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-purple-700 font-medium">
                  Selected Appointment: {selectedDateFormatted} at {selectedTime}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide any additional details about your appointment request..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-500 hover:bg-purple-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Book'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentDialog;
