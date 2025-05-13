import { AnimatedHeading, AnimatedCard } from "@/components/animations/landing-page";
import { Users, BookOpen, BrainCog, Globe, Check } from "lucide-react";

export function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 relative overflow-hidden" data-testid="testimonial-section">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
        <AnimatedHeading>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Who Is TedCards For?</h2>
              <div className="h-1 w-24 bg-blue-600 mx-auto my-4"></div>
              <p className="max-w-[800px] text-gray-500 md:text-xl dark:text-gray-400">
                TedCards adapts to your unique learning style no matter who you are
              </p>
            </div>
          </div>
        </AnimatedHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedCard direction="left">
            <div className="shadow-lg rounded-xl overflow-hidden bg-white h-full">
              <div className="px-8 py-10 h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Students</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Convert lectures </span>
                      into organized, digestible flashcards in seconds
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Prepare effectively </span>
                      for exams with personalized study materials
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Master difficult concepts </span>
                      with AI-generated examples that match your learning style
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard direction="right">
            <div className="shadow-lg rounded-xl overflow-hidden bg-white h-full">
              <div className="px-8 py-10 h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Teachers</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Generate materials </span>
                      for your class in minutes instead of hours
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Share flashcard collections </span>
                      directly with students and colleagues
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Customize difficulty levels </span>
                      to match different student proficiency levels
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard direction="left">
            <div className="shadow-lg rounded-xl overflow-hidden bg-white h-full">
              <div className="px-8 py-10 h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <BrainCog className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Lifelong Learners</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Build a personal knowledge library </span>
                      that grows and evolves with your interests
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Stay current </span>
                      in rapidly changing fields with organized information
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Learn efficiently </span>
                      by capturing insights from educational content in any format
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard direction="right">
            <div className="shadow-lg rounded-xl overflow-hidden bg-white h-full">
              <div className="px-8 py-10 h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Globe className="text-amber-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Travelers</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Learn essential phrases </span>
                      tailored to your destination before you travel
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Create custom flashcards </span>
                      for cultural insights and local customs
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-500 mt-1" size={20} />
                    <p className="text-gray-700">
                      <span className="font-semibold">Study offline </span>
                      with downloaded flashcards during your journey
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
