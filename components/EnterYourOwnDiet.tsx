import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "tailwindcss/tailwind.css";

const DietForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  }: any = useForm({
    defaultValues: {
      diets: [{ diet: "", time: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "diets",
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Diet Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((item, index) => (
          <div key={item.id} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Diet
              </label>
              <input
                type="text"
                {...register(`diets.${index}.diet`, {
                  required: "Diet is required",
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.diets?.[index]?.diet ? "border-red-500" : ""
                }`}
              />
              {errors.diets?.[index]?.diet && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.diets[index].diet.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                {...register(`diets.${index}.time`, {
                  required: "Time is required",
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.diets?.[index]?.time ? "border-red-500" : ""
                }`}
              />
              {errors.diets?.[index]?.time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.diets[index].time.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => append({ diet: "", time: "" })}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Diet
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietForm;
