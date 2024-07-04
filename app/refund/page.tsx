import { Footer } from "@/components/Footer";
import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Refund Policy</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Refund Eligibility</h2>
        <p>
          We offer refunds within 30 days of purchase for services that were not
          rendered or for products that were not delivered as described.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Refund Process</h2>
        <p>
          To request a refund, please contact our support team with your order
          details and reason for the refund request.
        </p>
        <p>
          Refunds will be processed within 5-7 business days to the original
          payment method used during the purchase.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          If you have any questions about our Refund Policy, please contact us
          at{" "}
          <a href="mailto:contact@email.com" className="text-blue-500">
            contact@email.com
          </a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
