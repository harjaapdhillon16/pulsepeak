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

    const jsonResponse = NextResponse.json({ response: aiResponse, COT });

    // Add CORS headers to the response
    jsonResponse.headers.set("Access-Control-Allow-Origin", "*");
    jsonResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    jsonResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return jsonResponse;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    const errorResponse = NextResponse.json(
      { error: "Error processing the prompt" },
      {
        status: 500,
      }
    );

    // Add CORS headers to the error response
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    errorResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return errorResponse;
  }
};

// Handle the OPTIONS method to respond to CORS preflight requests
export const OPTIONS = async () => {
  const response = NextResponse.json({ message: "CORS preflight response" });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};
