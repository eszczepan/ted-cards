import React from "react";
import { Video, FileText, GraduationCap, ClipboardList } from "lucide-react";

const benefits = [
  {
    icon: <Video size={28} className="text-sky-400 flex-shrink-0 mt-1" aria-hidden="true" />,
    title: "Automatic Flashcards from YouTube",
    description:
      "Transform YouTube videos into interactive flashcards in seconds. Our AI extracts key information to make your learning easier.",
  },
  {
    icon: <FileText size={28} className="text-sky-400 flex-shrink-0 mt-1" aria-hidden="true" />,
    title: "Flashcards from Any Text",
    description:
      "Have your own notes or articles? Paste the text and let AI create engaging flashcards from it, perfect for review.",
  },
  {
    icon: <GraduationCap size={28} className="text-sky-400 flex-shrink-0 mt-1" aria-hidden="true" />,
    title: "CEFR Difficulty Levels",
    description:
      "Each flashcard is automatically tagged with a CEFR level (A1-C2), allowing you to learn at the proficiency level that's right for you.",
  },
  {
    icon: <ClipboardList size={28} className="text-sky-400 flex-shrink-0 mt-1" aria-hidden="true" />,
    title: "Smart Knowledge Organization",
    description: "Collect your acquired knowledge in personalized libraries and access it easily whenever you need it.",
  },
];

export function AuthBenefits() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 lg:p-12 flex-col justify-center">
      <div className="max-w-md lg:max-w-lg mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold mb-8 lg:mb-10 text-center">
          TedCards: Learn smarter, not harder.
        </h2>
        <ul className="space-y-6 lg:space-y-8">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">{benefit.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-slate-100">{benefit.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
