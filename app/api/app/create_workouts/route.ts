// @ts-nocheck
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const POST = async (req) => {
  const {
    fitnessGoals,
    workoutPreferences,
    medicalConditions,
    exerciseFrequency,
    fitnessLevel,
  } = await req.json();

  function parseWorkoutString(inputString) {
    const workoutsArray = JSON.parse(inputString);
    return workoutsArray;
  }

  const generateWorkoutPlan = async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fitness expert creating a workout plan.",
        },
        {
          role: "user",
          content: `Create a ${exerciseFrequency}-day workout plan to help someone with ${medicalConditions} ${fitnessGoals}.Each day should have 5 workouts atleast, each day should focus on a max of 2 muscles, we don't need full body workouts , They prefer ${workoutPreferences.join(
            ", "
          )}. Their fitness level is ${fitnessLevel} out of 10. Provide exercises, reps, sets, notes, and a YouTube link for each exercise in the following format:
{
  name: "Monday",
  workouts: [
    {
      exercise: "Push-ups",
      reps: "15",
      sets: "3",
      notes: "Keep your back straight",
      link: "https://www.youtube.com/results?search_query=push-ups",
    },
  ],
} - don't give me any other information in string because that will mess up the parsing just return the JSON like I have provided and I don't want an output starting with "json" or anything, I just want a stringified array as the output.`,
        },
      ],
    });

    const workoutPlan = response.choices[0].message.content.trim();
    console.log(workoutPlan);
    return parseWorkoutString(workoutPlan);
  };

  const data = await generateWorkoutPlan();
  return NextResponse.json({ data });
};
