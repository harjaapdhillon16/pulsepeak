import React from "react";
import { useForm, Controller } from "react-hook-form";

export const WorkoutPlanForm = ({ onSubmit }: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md text-white shadow-md rounded mt-4"
    >
      <div>
        <label htmlFor="goal" className="block text-md font-medium mb-2">
          Fitness Goal
        </label>
        <Controller
          name="goal"
          control={control}
          rules={{ required: "Fitness goal is required" }}
          render={({ field }) => (
            <select
              {...field}
              id="goal"
              className="shadow border rounded w-full py-2 px-3 text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select your goal</option>
              <option value="weight_loss">Weight Loss 🎯</option>
              <option value="muscle_gain">Muscle Gain 💪🏼</option>
              <option value="endurance">Improve Endurance 🗡</option>
              <option value="flexibility">Flexibility & Mobility 🏃🏻‍♂️</option>
            </select>
          )}
        />
        <div className="h-2 mt-1">
          {errors.goal && (
            <p className="text-red-500 text-xs ">
              {(errors as any).goal.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="frequency" className="block text-md font-medium mb-2">
          Workout Frequency
        </label>
        <Controller
          name="frequency"
          control={control}
          rules={{ required: "Workout frequency is required" }}
          render={({ field }) => (
            <select
              {...field}
              id="frequency"
              className="shadow border rounded w-full py-2 px-3 text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select frequency</option>
              <option value="1-2">1-2 times a week</option>
              <option value="3-4">3-4 times a week</option>
              <option value="5+">5+ times a week</option>
            </select>
          )}
        />
        <div className="h-2 mt-1">
          {errors.frequency && (
            <p className="text-red-500 text-xs">
              {(errors as any).frequency.message}
            </p>
          )}
        </div>
      </div>

      <div className="pb-5">
        <label htmlFor="level" className="block text-md font-medium mb-2">
          Fitness Level
        </label>
        <Controller
          name="level"
          control={control}
          rules={{ required: "Fitness level is required" }}
          render={({ field }) => (
            <select
              {...field}
              id="level"
              className="shadow border bg-black text-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select your level</option>
              <option value="beginner">Beginner (New to workouts)</option>
              <option value="intermediate">
                Intermediate (+1 year experience)
              </option>
              <option value="advanced">Advanced (+2.5 year experience)</option>
            </select>
          )}
        />
        <div className="h-2 mt-1">
          {errors.level && (
            <p className="text-red-500 text-xs">
              {(errors as any).level.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-medium w-[200px] py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default WorkoutPlanForm;
