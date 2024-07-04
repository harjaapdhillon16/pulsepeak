import React from "react";
import { Footer } from "@/components/Footer";

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shipping Policy</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p>
          Thank you for choosing PulsePeak, your go-to digital solution. This
          Shipping Policy outlines the terms and conditions regarding the
          delivery of our digital products. By purchasing PulsePeak, you agree
          to this policy.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Delivery Method</h2>
        <p>
          PulsePeak is a digital product. Upon successful payment, you will
          receive an email with instructions on how to access and download the
          product. There are no physical items to be shipped.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Delivery Time</h2>
        <p>
          <strong>Instant Access</strong>: Once your payment is confirmed, you
          will receive an email with a download link and access instructions
          within minutes.
        </p>
        <p>
          <strong>Email Confirmation</strong>: Please check your spam or junk
          folder if you do not see the email in your inbox. If you still have
          not received the email after 30 minutes, please contact our support
          team.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Download Access</h2>
        <p>
          <strong>Download Link</strong>: The email will contain a unique
          download link. This link is valid for 30 days from the date of
          purchase. Ensure you download the product within this period.
        </p>
        <p>
          <strong>Account Access</strong>: If you create an account with us, you
          can also access your purchased product through the "My Account"
          section on our website.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Issues with Access</h2>
        <p>
          <strong>Incorrect Email</strong>: Ensure you provide the correct email
          address during checkout. We are not responsible for delivery issues
          arising from incorrect email addresses.
        </p>
        <p>
          <strong>Technical Difficulties</strong>: If you experience any
          technical issues accessing or downloading PulsePeak, please contact
          our support team for assistance.
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p>
          If you have any questions or concerns regarding your purchase or our
          Shipping Policy, please contact our support team at{" "}
          <a href="mailto:contac@pulsepeak.fitness" className="text-blue-500">
            contac@pulsepeak.fitness
          </a>
          . We are here to assist you and ensure you have a seamless experience
          with PulsePeak.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
