// components/DietForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Input,
  Spacer,
  Button,
  Radio,
  Select,
} from "@nextui-org/react";

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
  allergies: string;
  medicalConditions: string;
};

const DietForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text h2>Diet Planner Form</Text>
        <Input
          label="Weight (kg)"
          type="number"
          {...register("weight", { required: true })}
          fullWidth
        />
        {errors.weight && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="Height (cm)"
          type="number"
          {...register("height", { required: true })}
          fullWidth
        />
        {errors.height && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="Age"
          type="number"
          {...register("age", { required: true })}
          fullWidth
        />
        {errors.age && <span>This field is required</span>}
        <Spacer y={1} />
        <Text>Gender</Text>
        <Radio.Group
          orientation="horizontal"
          {...register("gender", { required: true })}
        >
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
          <Radio value="other">Other</Radio>
        </Radio.Group>
        {errors.gender && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="Muscle Goal"
          type="text"
          {...register("muscleGoal", { required: true })}
          fullWidth
        />
        {errors.muscleGoal && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="Weight Goal"
          type="text"
          {...register("weightGoal", { required: true })}
          fullWidth
        />
        {errors.weightGoal && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="BMI"
          type="number"
          {...register("bmi", { required: true })}
          fullWidth
        />
        {errors.bmi && <span>This field is required</span>}
        <Spacer y={1} />
        <Select
          label="Activity Level"
          {...register("activityLevel", { required: true })}
          fullWidth
        >
          <Select.Option value="sedentary">Sedentary</Select.Option>
          <Select.Option value="lightly_active">Lightly active</Select.Option>
          <Select.Option value="moderately_active">
            Moderately active
          </Select.Option>
          <Select.Option value="very_active">Very active</Select.Option>
          <Select.Option value="super_active">Super active</Select.Option>
        </Select>
        {errors.activityLevel && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="Dietary Preference"
          type="text"
          {...register("dietaryPreference", { required: true })}
          fullWidth
        />
        {errors.dietaryPreference && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="Allergies"
          type="text"
          {...register("allergies", { required: true })}
          fullWidth
        />
        {errors.allergies && <span>This field is required</span>}
        <Spacer y={1} />
        <Input
          label="Medical Conditions"
          type="text"
          {...register("medicalConditions", { required: true })}
          fullWidth
        />
        {errors.medicalConditions && <span>This field is required</span>}
        <Spacer y={2} />
        <Button type="submit" auto>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default DietForm;
