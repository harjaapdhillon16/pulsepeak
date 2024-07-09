//@ts-nocheck
"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/utils/hooks/useSupabase";
import axios from "axios";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";

const stepVariants = {
  initial: { x: 300, opacity: 0 },
  in: { x: 0, opacity: 1 },
  out: { x: -300, opacity: 0 },
};

export const MultiStepForm = ({ fetchUserData }: any) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { email, supabaseUser } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [formLoading, setFormLoading] = useState(false);
  const currentFormData = watch(); // Watch all form fields
  console.log({ formLoading });
  const onSubmit = async (data) => {
    setFormLoading(true);
    await axios.post("/api/supabase/insert", {
      table: "users",
      body: {
        height: `${data.height_ft}ft ${data?.height_in ?? 0}inches`,
        "lifting-experience": data.experience,
        gender: data.gender,
        email,
        weight: data.weight,
        age: data.age,
        full_name: data.name,
        whatsapp_number: data?.phone,
      },
    });
    fetchUserData?.();
    setFormLoading(false);
  };

  const nextStep = () => {
    if (step < totalSteps && isCurrentStepValid()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const phoneUtil = PhoneNumberUtil.getInstance();

  const parseNumber = () => {
    try {
      return phoneUtil.isValidNumber(
        phoneUtil.parseAndKeepRawInput(currentFormData?.phone ?? "")
      );
    } catch {
      return false;
    }
  };

  const isCurrentStepValid = () => {
    switch (step) {
      case 1:
        return currentFormData.gender;
      case 2:
        return currentFormData.weight;
      case 3:
        return currentFormData.height_ft && currentFormData.height_in;
      case 4:
        return currentFormData.name;
      case 5:
        return currentFormData.experience;
      case 6:
        return currentFormData.age;
      case 7:
        return parseNumber();
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="text-center mb-10">
        <h1 className="font-bold text-3xl mb-2">
          Welcome to Your Fitness Journey!
        </h1>
        <p className="text-gray-400">
          Let's get some quick details to personalize your experience.
        </p>
      </div>
      <div className="mx-auto px-2">
        <div className="flex justify-center w-full mb-4 space-x-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-[16%] ${
                step === i + 1 ? "bg-blue-500" : "bg-gray-200"
              } rounded-sm`}
            ></div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ type: "tween", duration: 0.15 }}
                className="space-y-4 w-[250px]"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Gender
                  </label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-xs italic">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ type: "tween", duration: 0.15 }}
                className="space-y-4 w-[250px]"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Weight (kg)
                  </label>
                  <Controller
                    name="weight"
                    control={control}
                    rules={{ required: "Weight is required" }}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    )}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-xs italic">
                      {errors.weight.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ type: "tween", duration: 0.15 }}
                className="space-y-4 w-[250px]"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Height
                  </label>
                  <div className="flex space-x-2">
                    <Controller
                      name="height_ft"
                      control={control}
                      rules={{ required: "Height in feet is required" }}
                      render={({ field }) => (
                        <input
                          type="number"
                          placeholder="Feet"
                          {...field}
                          className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}
                    />
                    <Controller
                      name="height_in"
                      control={control}
                      rules={{ required: "Height in inches is required" }}
                      render={({ field }) => (
                        <input
                          type="number"
                          placeholder="Inches"
                          {...field}
                          className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}
                    />
                  </div>
                  {errors.height_ft && (
                    <p className="text-red-500 text-xs italic">
                      {errors.height_ft.message}
                    </p>
                  )}
                  {errors.height_in && (
                    <p className="text-red-500 text-xs italic">
                      {errors.height_in.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ type: "tween", duration: 0.15 }}
                className="space-y-4 w-[250px]"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs italic">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ type: "tween", duration: 0.15 }}
                className="space-y-4 w-[250px]"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Workout Experience (years)
                  </label>
                  <Controller
                    name="experience"
                    control={control}
                    rules={{ required: "Experience is required" }}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="mt-1 text-white block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    )}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-xs italic">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
            {step === 6 && (
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ type: "tween", duration: 0.15 }}
                className="space-y-4 w-[250px]"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Age
                  </label>
                  <Controller
                    name="age"
                    control={control}
                    rules={{ required: "Age is required" }}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="mt-1 text-white block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    )}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs italic">
                      {errors.age.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
            {step === 7 && (
              <motion.div
                key={step}
                initial="initial"
                animate="in"
                exit="out"
                variants={stepVariants}
                transition={{ type: "tween", duration: 0.15 }}
                className="space-y-4 w-[250px]"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Your Whatsapp Phone Number
                  </label>
                  <PhoneInput
                    defaultCountry="in"
                    value={watch("phone")}
                    onChange={(phone) => setValue("phone", phone)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-700 hover:bg-gray-600 text-white font-light text-sm py-2 px-10 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isCurrentStepValid()}
                className={`bg-blue-500 flex items-center space-x-2 hover:bg-blue-400 text-white font-light text-sm py-2 px-10 rounded-lg ${
                  !isCurrentStepValid() && "opacity-50 cursor-not-allowed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isCurrentStepValid()}
                className={`bg-green-500 hover:bg-green-400 text-white font-light text-sm py-1 px-5 rounded-lg  ${
                  !isCurrentStepValid() && "opacity-50 cursor-not-allowed"
                }`}
              >
                {formLoading ? (
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 text-gray-200 animate-spin fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
