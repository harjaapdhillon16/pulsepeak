// pages/api/prompt.js
// @ts-nocheck
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-proj-vSErwoAEqgiQXGsANeJST3BlbkFJHJ7H1E2Aubce0HVuX7cn",
});

export const POST = async (req: any) => {
  const { prompt, history = [] } = await req.json();

  try {
    // Construct the conversation history including the new prompt
    const messages = [...history, { role: "user", content: prompt }];

    const response: any = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Act as a fitness expert" },
        ...messages,
      ],
    });

    const aiResponse = response.choices[0].message.content;

    // Store Chain of Thought (COT)
    const COT = [...messages, { role: "assistant", content: aiResponse }];

    return NextResponse.json({ response: aiResponse, COT });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json(
      { error: "Error processing the prompt" },
      {
        status: 500,
      }
    );
  }
};
