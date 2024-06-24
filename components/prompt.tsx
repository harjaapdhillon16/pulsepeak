import React, { useState } from "react";
import axios from "axios";

const ChatBubble = ({ children, isUser, avatar, color }: any) => (
  <li className={`flex ${isUser ? "justify-end" : ""} gap-x-2 sm:gap-x-4`}>
    {!isUser && (
      <div
        className="flex-shrink-0 w-[2.375rem] h-[2.375rem] rounded-full"
        style={{ backgroundColor: color }}
      >
        {avatar ? (
          <img src={avatar} alt="Avatar" className="rounded-full" />
        ) : (
          <span className="text-sm font-medium text-white leading-none">
            AI
          </span>
        )}
      </div>
    )}
    <div
      className={`grow ${
        isUser ? "text-end" : ""
      } space-y-3 max-w-[90%] md:max-w-2xl w-full`}
    >
      <div
        className={`inline-block ${
          isUser
            ? "bg-blue-600"
            : "bg-white border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
        } rounded-lg p-4 shadow-sm`}
      >
        <p
          className={`text-sm ${
            isUser ? "text-white whitespace-pre-wrap" : "text-gray-800 dark:text-white whitespace-pre-wrap"
          }`}
        >
          {children}
        </p>
      </div>
    </div>
    {isUser && (
      <div className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
        <span className="text-sm font-medium text-white leading-none">AZ</span>
      </div>
    )}
  </li>
);

export const AIPrompt = () => {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);

    try {
      const response = await axios.post("/api/app/prompt", {
        prompt: input,
        history: messages.map((msg: any) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text,
        })),
      });

      // Add AI response to chat
      setMessages((prevMessages: any) => [
        ...prevMessages,
        { text: response.data.response, isUser: false },
      ]);

      // Optionally, handle Chain of Thought (COT)
      console.log("Chain of Thought:", response.data.COT);
    } catch (error) {
      console.error("Error sending prompt:", error);
    }

    setInput("");
  };

  return (
    <div className="relative min-h-screen pb-80">
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Title */}
        <div className="text-center">
          <svg
            className="w-28 h-auto mx-auto mb-4"
            width="116"
            height="32"
            viewBox="0 0 116 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ></svg>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            Welcome to PulsePeak AI
          </h1>
          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            Your fitness helpline
          </p>
        </div>

        <div className="space-y-3 mt-3">
          {messages.map((msg: any, index: number) => (
            <ChatBubble key={index} isUser={msg.isUser}>
              {msg.text}
            </ChatBubble>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <footer className="w-[80vw] left-[8vw] fixed bottom-12 rounded-2xl z-10 sm:px-6 dark:bg-black">
        <div className="py-3 sm:py-6">
          <div className="sm:flex sm:items-end sm:space-x-3">
            <div className="grow">
              <label htmlFor="comment" className="sr-only">
                Add your comment
              </label>
              <div className="min-h-[2.75rem] p-2 rounded-xl border border-transparent bg-gray-100 text-gray-800 shadow-sm focus-within:border-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-600 dark:bg-neutral-800 dark:text-gray-400 dark:focus-within:bg-neutral-900 dark:focus-within:border-neutral-700">
                <textarea
                  rows={3}
                  className="block w-full resize-none border-0 bg-transparent focus:ring-0 focus:outline-0 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400"
                  id="comment"
                  placeholder="Write a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                ></textarea>
              </div>
            </div>
            <div className="mt-3 flex items-center sm:mt-0 sm:flex-shrink-0">
              <button
                type="button"
                className="inline-flex translate-y-[-5px] justify-center items-center gap-x-2 py-2 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
