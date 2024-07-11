// @ts-nocheck
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Spacer,
  RadioGroup,
  Checkbox,
  Textarea,
  Button,
  Radio,
  Slider,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export function WorkoutPlanForm({onSubmit}) {
  const { push } = useRouter();
  const [exerciseFrequency, setExerciseFrequency] = useState(3);
  const [fitnessLevel, setFitnessLevel] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitFunc = (data) => {
    onSubmit({ ...data, exerciseFrequency, fitnessLevel });
    // Generate PDF logic here
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(submitFunc)} className="space-y-6">
        <div>
        <h4 className="text-2xl font-semibold mb-2">
            Let's Plan you an amazing workout{" "}
          </h4>
          <h4 className="text-xl font-semibold mb-2">Fitness Goals</h4>
          <RadioGroup
            label="What are your primary fitness goals?"
            defaultValue="Lose Weight"
          >
            <Radio
              value="Lose Weight"
              {...register("fitnessGoals", { required: true })}
            >
              Lose Weight
            </Radio>
            <Radio
              value="Build Muscle"
              {...register("fitnessGoals", { required: true })}
            >
              Build Muscle
            </Radio>
            <Radio
              value="Increase Endurance"
              {...register("fitnessGoals", { required: true })}
            >
              Increase Endurance
            </Radio>
            <Radio
              value="Improve Flexibility"
              {...register("fitnessGoals", { required: true })}
            >
              Improve Flexibility
            </Radio>
            <Radio
              value="Overall Health"
              {...register("fitnessGoals", { required: true })}
            >
              Overall Health
            </Radio>
          </RadioGroup>
          {errors.fitnessGoals && (
            <p className="text-red-500">This field is required</p>
          )}
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Current Fitness Level</h4>
          <label>How often can you exercise (in a week)?</label>
          <Slider
            minValue={1}
            maxValue={7}
            step={1}
            value={exerciseFrequency}
            onChange={(value) => setExerciseFrequency(value)}
          />
          <p className="text-gray-200 text-lg">
            Exercise Frequency - {exerciseFrequency}
          </p>
          <Spacer y={1} />
          <label>Rate your fitness level</label>
          <Slider
            minValue={0}
            maxValue={10}
            step={1}
            value={fitnessLevel}
            onChange={(value) => setFitnessLevel(value)}
          />
          <p className="text-gray-200 text-lg">
            Fitness Level - {fitnessLevel}
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Workout Preferences</h4>
          <label>Preferred types of workouts</label>
          <Checkbox
            value="Cardio"
            className="block mt-2"
            {...register("workoutPreferences")}
          >
            Cardio
          </Checkbox>
          <Checkbox
            value="Strength Training"
            className="block mt-2"
            {...register("workoutPreferences")}
          >
            Strength Training
          </Checkbox>
          <Checkbox
            value="Body Building"
            className="block mt-2"
            {...register("workoutPreferences")}
          >
            Body Building
          </Checkbox>
          <Checkbox
            value="HIIT"
            className="block mt-2"
            {...register("workoutPreferences")}
          >
            HIIT (High Intensity Interval Training)
          </Checkbox>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">Medical Conditions</h4>
          <Textarea
            placeholder="Please list any medical conditions or injuries"
            fullWidth
            {...register("medicalConditions")}
          />
        </div>

        <Button color="primary" type="submit">
          Generate Workout Plan
        </Button>
      </form>
    </div>
  );
}

export default WorkoutPlanForm;
