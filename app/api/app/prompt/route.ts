// pages/api/prompt.js
import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: "sk-proj-vSErwoAEqgiQXGsANeJST3BlbkFJHJ7H1E2Aubce0HVuX7cn",
});

const openai = new OpenAIApi(configuration);

export const POST = async (req: any) => {
  if (req.method === "POST") {
    const { prompt, history = [] } = await req.json()

    try {
      // Construct the conversation history including the new prompt
      const messages = [...history, { role: "user", content: prompt }];

      const response: any = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Act as a fitness expert" },
          ...messages,
        ],
      });

      const aiResponse = response.data.choices[0].message.content;

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
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      {
        status: 500,
      }
    );
  }
};
