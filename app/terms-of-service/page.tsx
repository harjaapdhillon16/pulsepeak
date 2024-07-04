import AuthButton from "@/components/AuthButton";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import React from "react";

const TermsOfService = () => {
  return (
    <div className="flex-1 w-screen flex flex-col gap-5 items-center">
      <nav className="w-full flex justify-center h-24">
        <div className="w-full max-w-[1024px] flex justify-between items-center p-3 text-sm">
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          {/* <AuthButton /> */}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
          <p>
            Welcome to PulsePeak! These Terms of Service ("Terms") govern your
            access to and use of our mobile application and website
            (collectively, the "Services"). By using our Services, you agree to
            comply with these Terms.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Use of Our Services</h2>
          <p>
            <strong>License:</strong> We grant you a limited, non-exclusive,
            non-transferable license to use our Services for your personal,
            non-commercial use.
          </p>
          <p>
            <strong>User Responsibilities:</strong> You are responsible for
            maintaining the confidentiality of your account and for all
            activities that occur under your account.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Content and User Conduct
          </h2>
          <p>
            <strong>Content Ownership:</strong> You retain ownership of any
            content you submit to our Services ("User Content").
          </p>
          <p>
            <strong>Prohibited Conduct:</strong> You agree not to engage in any
            activity that interferes with or disrupts our Services, or that
            violates any applicable laws.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Privacy</h2>
          <p>
            Our Privacy Policy explains how we collect, use, and disclose
            information about you. By using our Services, you agree to our
            collection and use of your information as described in the Privacy
            Policy.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Modifications to the Services
          </h2>
          <p>
            We may modify or discontinue our Services at any time without
            notice. We are not liable to you or any third party for any
            modification, suspension, or discontinuation of our Services.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, PulsePeak and its affiliates
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of India, without regard to its conflict of law
            principles.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions or concerns about these Terms or our
            Services, please contact us at{" "}
            <a
              href="mailto:contact@pulsepeak.fitness"
              className="text-blue-500"
            >
              contact@pulsepeak.fitness
            </a>
            .
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TermsOfService;
