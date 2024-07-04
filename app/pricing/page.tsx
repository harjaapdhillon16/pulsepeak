import { Footer } from "@/components/Footer";
import React from "react";

const PricingPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Subscription Plans</h2>
        <div className="flex items-center mb-2">
          <span className="font-semibold">Basic Plan:</span> INR 29/month
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          If you have any questions about our pricing plans or need a custom
          solution, please contact us at{" "}
          <a href="mailto:contact@pulsepeak.fitness" className="text-blue-500">
            contact@pulsepeak.fitness
          </a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
