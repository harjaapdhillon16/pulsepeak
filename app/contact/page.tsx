import { Footer } from '@/components/Footer';
import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <div className="mb-6">
        <p>If you have any questions or feedback, please don't hesitate to contact us directly via email or just give us a call :)</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p><strong>Email:</strong> <a href="mailto:contact@pulsepeak.fitness" className="text-blue-500">contact@pulsepeak.fitness</a></p>
        <p><strong>Business Name:</strong> Pulsepeak</p>
        <p><strong>Phone:</strong> [+918288807134]</p>
        <p><strong>Address:</strong>SCF 48, Shiwalik Avenue, Sector 125, Kharar Punjab,India</p>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUsPage;
