import { Footer } from '@/components/Footer';
import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p>At PulsePeak, our mission is to provide innovative solutions in fitness that improve the lives of our users through technology.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>If you have any questions about PulsePeak or our services, please contact us at <a href="mailto:contact@pulsepeak.fitness" className="text-blue-500">contact@pulsepeak.fitness</a>.</p>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;
