// @ts-nocheck
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});



export const POST = async (req) => {
  const userdata = await req.json()

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
          content:  `Based on the following user data: ${JSON.stringify(userdata)} include protien shakes inside the diet and creatine , also mention the quantity of each thing to be taken like grams and quantity of each thing like the amount of eggs to be taken etc, ${userdata?.isMultvitamins?"also add essential mutlivitamins to the diet (specify each of the vitamin)":""}, create a diet plan with the schema {dietName:string, mealDetails:string, timeToTake:string, videoLinkForDietPrep:string} in JSON format- - don't give me any other information in string because that will mess up the parsing just return the JSON like I have provided and I don't want an output starting with "json" or anything, I just want a stringified array as the output.`,
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
