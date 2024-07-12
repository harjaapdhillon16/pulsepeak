// components/DietForm.tsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import {
  Input,
  Spacer,
  RadioGroup,
  CheckboxGroup,
  Checkbox,
  Textarea,
  Button,
  Radio,
  Slider,
  Spinner,
} from "@nextui-org/react";
import htmltoPdf from "html2pdf.js";
import { useAuth } from "@/utils/hooks/useSupabase";
import DietPlanTable from "./DietComponent";

type FormData = {
  weight: number;
  height: number;
  gender: string;
  age: number;
  muscleGoal: string;
  weightGoal: string;
  bmi: number;
  activityLevel: string;
  dietaryPreference: string;
  dietType: string;
  cuisinePreference: string[];
  allergies: string;
  medicalConditions: string;
  isMultvitamins: boolean;
};

export const DietForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const { supabaseUser } = useAuth();

  console.log({ ...watch(), ...supabaseUser });

  const [cuisne, setCuisine] = React.useState([]);

  useEffect(() => {
    register("dietType", {
      required: true,
    });
    register("weightGoal", { required: true });
    register("muscleGoal", { required: true });
    register("cuisinePreference", { required: true });
  }, [register]);

  const [activityLevel, setActivityLevel] = useState(3);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/app/create_diet", {
        ...data,
        ...supabaseUser,
        activityLevel,
      });
      setResults(response.data.data);
    } catch (error) {
      console.error("Error submitting form data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-3">
        <Spinner />
      </div>
    );
  }

  if (results.length !== 0) {
    return (
      <>
        <div id="pdftodownload" className="pt-4 bg-black">
          <h4 className="text-2xl font-bold">Your Diet</h4>
          <div className="space-y-4 divide-y-1">
            {results.map((item: any) => (
              <div className="pt-2">
                <p className="text-lg font-medium">
                  {item.dietName} - {item.timeToTake}
                </p>
                <p>Meal - {item.mealDetails}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button
            onClick={() => {
              const options = {
                margin: 0,
                filename: "Deit-Plan.pdf",
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
              };
              var tempContainer = document.getElementById("pdftodownload");
              (tempContainer as any).style.padding = "30px";
              htmltoPdf().set(options).from(tempContainer).save();
            }}
            className="mt-4"
            radius="sm"
            size="lg"
            color="danger"
          >
            Download PDF
          </Button>
        </div>
        <DietPlanTable dietPlanArray={results} />
      </>
    );
  }

  return (
    <div className="pt-4 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h4 className="text-2xl font-semibold mb-2">
            Let's Plan you an amazing diet{" "}
          </h4>
          <h4 className="text-xl font-semibold mb-2">Goals</h4>
          <RadioGroup
            label="Muscle Goal"
            value={watch("muscleGoal")}
            onValueChange={(e) => {
              setValue("muscleGoal", e);
            }}
          >
            <Radio className="text-white" value="Maintain">
              Maintain
            </Radio>
            <Radio className="text-white" value="Increase">
              Increase
            </Radio>
          </RadioGroup>
          {errors.muscleGoal && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <RadioGroup
            label="Weight Goal"
            value={watch("weightGoal")}
            onValueChange={(e) => {
              setValue("weightGoal", e);
            }}
          >
            <Radio value="Maintain">Maintain</Radio>
            <Radio value="Lose">Lose</Radio>
            <Radio value="Gain">Gain</Radio>
          </RadioGroup>
          {errors.weightGoal && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Activity Level</h4>
          <label>Rate your activity level (out of 10)</label>
          <Slider
            minValue={1}
            maxValue={10}
            step={1}
            value={activityLevel}
            onChange={(value: any) => setActivityLevel(value)}
          />
          <p className="text-gray-200 text-lg">
            Activity Level - {activityLevel}
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Preferences</h4>
          <p className="pb-2">Dietary Preferences</p>
          <Textarea
            placeholder="List your dietary preferences"
            fullWidth
            {...register("dietaryPreference", { required: true })}
          />
          {errors.dietaryPreference && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <RadioGroup
            label="Diet Type"
            value={watch("dietType")}
            onValueChange={(e) => {
              setValue("dietType", e);
            }}
          >
            <Radio value="Vegan">Vegan</Radio>
            <Radio value="Vegetarian">Vegetarian</Radio>
            <Radio value="Eggetarian">Eggetarian</Radio>
            <Radio value="Non-Vegetarian">Non-Vegetarian</Radio>
          </RadioGroup>
          {errors.dietType && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Cuisine Preferences</h4>
          <CheckboxGroup
            label="Select your preferred cuisines"
            value={cuisne}
            onValueChange={(e) => {
              setCuisine(e as any);
              setValue("cuisinePreference", e);
            }}
          >
            <Checkbox value="Indian">Indian</Checkbox>
            <Checkbox value="Italian">Italian</Checkbox>
            <Checkbox value="Mexican">Mexican</Checkbox>
            <Checkbox value="Chinese">Chinese</Checkbox>
            <Checkbox value="Japanese">Japanese</Checkbox>
          </CheckboxGroup>
          {errors.cuisinePreference && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <h4 className="text-xl font-semibold">Multi-vitamines</h4>
          <Checkbox
            isSelected={watch("isMultvitamins")}
            onValueChange={(e) => {
              setValue("isMultvitamins", e);
            }}
          >
            Add Multivitamins for a better results
          </Checkbox>
          {errors.allergies && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <label>Allergies</label>
          <Textarea
            placeholder="List any allergies"
            fullWidth
            {...register("allergies")}
          />
          {errors.allergies && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Medical Conditions</h4>
          <Textarea
            placeholder="Please list any medical conditions or injuries"
            fullWidth
            {...register("medicalConditions")}
          />
          {errors.medicalConditions && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <Button color="primary" type="submit" disabled={loading}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default DietForm;
