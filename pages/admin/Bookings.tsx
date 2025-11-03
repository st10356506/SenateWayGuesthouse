import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { database } from '../../firebaseConfig';
import { ref, onValue, off, update, remove } from 'firebase/database';
import { Calendar, User, Mail, Phone, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import emailjs from 'emailjs-com';

// EmailJS Configuration - Load from environment variables
const getEmailJSConfig = () => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const templateConfirmed = import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRMED;

  if (!serviceId || !publicKey || !templateConfirmed) {
    throw new Error('EmailJS configuration is missing. Please check your environment variables.');
  }

  return { serviceId, publicKey, templateConfirmed };
};

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  timestamp: string;
}

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const bookingsRef = ref(database, 'bookings');
    
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.entries(data).map(([id, booking]: [string, any]) => ({
          id,
          ...booking,
        }));
        setBookings(bookingsArray.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      } else {
        setBookings([]);
      }
      setLoading(false);
    });

    return () => {
      off(bookingsRef);
      unsubscribe();
    };
  }, []);

  const sendBookingNotification = async (booking: Booking) => {
    if (!booking.email) {
      console.warn('No email address for booking:', booking.id);
      return;
    }

    try {
      const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Get EmailJS configuration from environment variables
      const { serviceId, publicKey, templateConfirmed } = getEmailJSConfig();

      // Send confirmation email using the template - all formatting is handled by the EmailJS template
      await emailjs.send(
        serviceId,
        templateConfirmed,
        {
          from_name: 'SenateWay Guesthouse',
          from_email: 'vanessa141169@yahoo.com',
          to_email: booking.email,
          to_name: booking.name,
          guest_name: booking.name,
          phone: booking.phone,
          check_in: checkInDate,
          check_out: checkOutDate,
          guests: booking.guests,
          message: booking.message || '', // Special requests/message
        },
        publicKey
      );

      console.log(`Confirmation email sent to ${booking.email}`);
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw error; // Re-throw so we can show error message
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      alert('Booking not found');
      return;
    }

    try {
      // Update status in Firebase first
      const bookingRef = ref(database, `bookings/${bookingId}`);
      await update(bookingRef, { status });

      // Send email notification only for confirmations
      if (status === 'confirmed') {
        setSendingEmail(bookingId);
        try {
          await sendBookingNotification(booking);
          alert(`Booking confirmed! Confirmation email sent to ${booking.email}`);
        } catch (emailError) {
          // Status was updated but email failed
          alert(
            `Booking status updated to confirmed, but failed to send email notification. ` +
            `Please manually contact ${booking.email}`
          );
        } finally {
          setSendingEmail(null);
        }
      } else {
        // Just update status for cancellations, no email sent
        alert(`Booking status updated to cancelled.`);
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status. Please try again.');
      setSendingEmail(null);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      const bookingRef = ref(database, `bookings/${bookingId}`);
      await remove(bookingRef);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500"><CheckCircle className="w-3 h-3" />Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500"><XCircle className="w-3 h-3" />Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500"><Clock className="w-3 h-3" />Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
        <p className="text-muted-foreground">Manage guest bookings and reservations</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({bookings.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending ({bookings.filter(b => b.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'confirmed' ? 'default' : 'outline'}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
        </Button>
        <Button
          variant={filter === 'cancelled' ? 'default' : 'outline'}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
        </Button>
      </div>

      {filteredBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-semibold mb-2">No bookings found</p>
          <p className="text-muted-foreground">Bookings will appear here when guests submit reservation requests.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {booking.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {booking.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {booking.phone}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">Check-in</p>
                        <p className="text-muted-foreground">{new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">Check-out</p>
                        <p className="text-muted-foreground">{new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">Guests</p>
                        <p className="text-muted-foreground">{booking.guests}</p>
                      </div>
                    </div>
                  </div>

                  {booking.message && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Message:</strong> {booking.message}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Submitted: {new Date(booking.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="w-full md:w-auto"
                        disabled={sendingEmail === booking.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {sendingEmail === booking.id ? 'Sending Email...' : 'Confirm'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="w-full md:w-auto"
                        disabled={sendingEmail === booking.id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {sendingEmail === booking.id ? 'Sending Email...' : 'Cancel'}
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="w-full md:w-auto"
                      disabled={sendingEmail === booking.id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {sendingEmail === booking.id ? 'Sending Email...' : 'Cancel'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteBooking(booking.id)}
                    className="w-full md:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

