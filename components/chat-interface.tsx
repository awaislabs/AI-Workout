"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal} from "lucide-react";

interface ChatInterfaceProps {
  onGenerate: (prompt: string) => void;
}

export function ChatInterface({ onGenerate }: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState("");
  const maxChars = 1000;

  console.log(
    "Prompt:",
    prompt,
    "Trimmed:",
    prompt.trim(),
    "Is disabled:",
    !prompt.trim()
  );

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-[32px] font-bold text-black leading-[1.5] tracking-[0px] mb-4">
          Smarter training starts here
        </h2>
        <p className="font-poppins font-normal text-[18px] leading-[1.5] tracking-[0px] text-center align-middle text-black">
          Chat with AI to build custom fitness plans
        </p>
      </div>

      <div className="w-full max-w-2xl relative">
        <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-[0_0_5px_rgba(0,0,0,0.1)]">
          <Textarea
            placeholder={`Describe what are we building today...`}
            className="min-h-[120px] border border-[#ebebeb] resize-none  focus-visible:ring-0 focus-visible:ring-offset-0 text-base  text-black p-4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, maxChars))}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-end items-center mt-4 gap-2">
            <span className="font-[400] text-[12px] leading-[1] tracking-[-0.008em] text-right text-gray-400 font-[Bricolage Grotesque">
              {prompt.length}/{maxChars}
            </span>
            <Button
              className="w-[44px] h-[44px] p-[11px] rounded-full border border-transparent bg-[#6367EF] shadow-[0_1px_2px_rgba(10,13,18,0.05)] opacity-100 transition-colors hover:bg-[#4F52C8] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!prompt.trim()}
            >
              <SendHorizontal className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
