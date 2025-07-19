
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookAppointmentButtonProps {
  className?: string;
}

const BookAppointmentButton = ({ className = '' }: BookAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Button 
      onClick={() => setIsOpen(true)}
      className={`bg-purple-600 hover:bg-purple-700 text-white ${className}`}
    >
      {isMobile ? 'Book' : 'Book Appointment'}
    </Button>
  );
};

export default BookAppointmentButton;
