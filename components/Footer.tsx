import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
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
          <li>
            <Link href="/refund" className="hover:underline me-4 md:me-6">
              Refunds
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline me-4 md:me-6">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline me-4 md:me-6">
              About
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="hover:underline me-4 md:me-6">
              Pricing
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
