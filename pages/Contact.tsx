import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { database } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
import emailjs from 'emailjs-com';
import { trackUserInteraction } from '../lib/analytics';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Starting form submission...');
      console.log('Form data:', formData);

      // Prepare data for Firebase
      const bookingData = {
        ...formData,
        status: 'pending',
        timestamp: new Date().toISOString(),
        created: Date.now(),
      };

      // Save to Firebase
      console.log('Saving to Firebase...');
      await push(ref(database, 'bookings'), bookingData);
      console.log('Saved to Firebase successfully!');

      // Send email via EmailJS
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_RECEIVED;
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
        throw new Error('EmailJS configuration is missing. Please check your environment variables.');
      }

      console.log('Sending email via EmailJS...');
      await emailjs.send(
        emailjsServiceId, 
        emailjsTemplateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          to_email: formData.email, 
          phone: formData.phone,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests: formData.guests,
          message: formData.message,
        },
        emailjsPublicKey
      );

      console.log('Email sent successfully via EmailJS');
      trackUserInteraction('booking');
      alert('Thank you for your booking request! We will contact you shortly.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '',
        message: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-4">Contact Us</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Have questions or ready to book? Get in touch with us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h4 className="mb-2">Phone</h4>
              <p className="text-muted-foreground">+27 82 927 8907</p>
              <p className="text-sm text-muted-foreground mt-1">Mon-Sun: 8:00 AM - 8:00 PM</p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h4 className="mb-2">Email</h4>
              <p className="text-muted-foreground">vanessa141169@yahoo.com</p>
              <p className="text-sm text-muted-foreground mt-1">We'll reply within 24 hours</p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h4 className="mb-2">Address</h4>
              <p className="text-muted-foreground">
                Senate Way<br />
                Kimberley, Northern Cape<br />
                South Africa
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="mb-2">Check-in / Check-out</h4>
              <p className="text-muted-foreground">Check-in: 2:00 PM</p>
              <p className="text-muted-foreground">Check-out: 10:00 AM</p>
            </Card>
          </div>

          {/* Booking Form */}
          <Card className="lg:col-span-2 p-8">
            <h3 className="mb-6">Send us a Booking Request</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email address" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="Enter your phone number" />
                </div>
                <div>
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <Input id="guests" name="guests" type="number" min="1" value={formData.guests} onChange={handleChange} required placeholder="Select number of guests" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="checkIn">Check-in Date *</Label>
                  <Input id="checkIn" name="checkIn" type="date" value={formData.checkIn} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date *</Label>
                  <Input id="checkOut" name="checkOut" type="date" value={formData.checkOut} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Special Requests or Questions</Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Any special requirements or questions you may have..." rows={5} />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Booking Request
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to our terms and conditions. We'll contact you within 24 hours to confirm your booking.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
