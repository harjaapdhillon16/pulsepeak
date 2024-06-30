import AuthButton from "@/components/AuthButton";
import { AuthUserUI } from "@/components/AuthUserUI";
import Hero from "@/components/Hero";
import { useAuth } from "@/utils/hooks/useSupabase";
import Link from "next/link";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex-1 w-screen flex flex-col gap-5 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-24">
        <div className="w-full max-w-[1024px] flex justify-between items-center p-3 text-sm">
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          {/* <AuthButton /> */}
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
          <p>
            Welcome to PulsePeak! Your privacy is important to us. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our mobile application and website,
            including any features, services, or applications we offer
            (collectively, the "Services").
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Information We Collect
          </h2>
          <p>
            <strong>Personal Information:</strong> We may collect personal
            information such as your name, email address, age, gender, and
            fitness goals when you register with us or use our Services.
          </p>
          <p>
            <strong>Usage Data:</strong> We collect information about your
            interactions with our Services, including log files, usage data, and
            diagnostic information.
          </p>
          <p>
            <strong>Device Information:</strong> We may collect information
            about the device you use to access our Services, including device
            type, operating system, and unique device identifiers.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            How We Use Your Information
          </h2>
          <p>
            <strong>To Provide and Improve Services:</strong> We use your
            information to provide and personalize our Services, improve user
            experience, and develop new features.
          </p>
          <p>
            <strong>Communication:</strong> We may use your contact information
            to send you updates, newsletters, and promotional materials that may
            be of interest to you.
          </p>
          <p>
            <strong>Analytics:</strong> We use analytics services to understand
            how users interact with our Services and to improve our offerings.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            information from unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Your Choices</h2>
          <p>
            You can control the information we collect and how we communicate
            with you. You may update your preferences or unsubscribe from
            communications at any time.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on our website.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at{" "}
            <a
              href="mailto:contact@pulsepeak.fitness"
              className="text-blue-500"
            >
              contact@pulsepeak.fitness
            </a>
            .
          </p>
        </div>
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center mr-4 dark:text-gray-400">
              © 2024{" "}
              <a href="https://flowbite.com/" className="hover:underline">
                Pulsepeak
              </a>
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:underline me-4 md:me-6"
                >
                  Terms Of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:underline me-4 md:me-6"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
