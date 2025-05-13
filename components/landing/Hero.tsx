import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import {
  AnimatedContainer,
  AnimatedButton,
  AnimatedFlashcard,
  AnimatedIcon,
} from "@/components/animations/landing-page";

export function Hero() {
  return (
    <section
      className="w-full mt-[64px] pt-12 md:py-24 lg:py-32 xl:py-48 bg-blue-50 overflow-hidden"
      data-testid="hero-section"
    >
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6 space-y-10 xl:space-y-16">
        <div className="grid gap-24 md:grid-cols-1 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <AnimatedContainer>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none"
                  data-testid="hero-heading"
                >
                  Your AI-Powered Flashcard Generator
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Capture, store, and leverage knowledge that grows with you. Transform YouTube videos into high-quality
                  flashcards for effective learning in seconds.
                </p>
              </div>
              <AnimatedButton>
                <Link href="/dashboard" data-testid="get-started-button">
                  <Button size="lg" className="w-full md:w-auto">
                    Try TedCards Free
                  </Button>
                </Link>
              </AnimatedButton>
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2}>
            <div className="flex justify-center items-center w-full h-full">
              <div className="relative w-full max-w-[280px] h-[280px] sm:max-w-[300px] sm:h-[300px] md:max-w-[340px] md:h-[340px] lg:max-w-[400px] lg:h-[400px] mx-auto pl-4">
                <AnimatedFlashcard delay={0.4} rotate={12}>
                  <div className="absolute w-[220px] h-[160px] sm:w-[250px] sm:h-[180px] md:w-[280px] md:h-[200px] lg:w-[320px] lg:h-[220px] bg-white rounded-xl shadow-lg transform rotate-6 z-10 border border-gray-200 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-10 md:h-12 bg-red-600 flex items-center px-4">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 mr-2"></div>
                      <div className="h-2 md:h-3 w-16 md:w-24 bg-white/30 rounded-full"></div>
                    </div>
                    <div className="absolute top-12 md:top-14 left-0 right-0 px-4 flex flex-col space-y-2 md:space-y-3">
                      <div className="h-3 md:h-4 w-3/4 bg-gray-200 rounded-full"></div>
                      <div className="h-3 md:h-4 w-full bg-gray-200 rounded-full"></div>
                      <div className="h-3 md:h-4 w-2/3 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-3 md:bottom-4 left-4 right-4 h-8 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <div className="h-2 md:h-3 w-20 md:w-28 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                </AnimatedFlashcard>

                <AnimatedFlashcard delay={0.3} rotate={-8}>
                  <div className="absolute w-[220px] h-[160px] sm:w-[250px] sm:h-[180px] md:w-[280px] md:h-[200px] lg:w-[320px] lg:h-[220px] bg-white rounded-xl shadow-lg transform -rotate-3 z-0 border border-gray-200 top-12 sm:top-14 md:top-16 lg:top-20 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-10 md:h-12 bg-green-600 flex items-center px-4">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 mr-2"></div>
                      <div className="h-2 md:h-3 w-16 md:w-24 bg-white/30 rounded-full"></div>
                    </div>
                    <div className="absolute top-12 md:top-14 left-0 right-0 px-4 flex flex-col space-y-2 md:space-y-3">
                      <div className="h-3 md:h-4 w-1/2 bg-gray-200 rounded-full"></div>
                      <div className="h-3 md:h-4 w-full bg-gray-200 rounded-full"></div>
                      <div className="h-3 md:h-4 w-3/4 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-3 md:bottom-4 left-4 right-4 h-8 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <div className="h-2 md:h-3 w-20 md:w-28 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                </AnimatedFlashcard>

                <AnimatedIcon delay={0.6} rotate={12}>
                  <div className="absolute top-0 right-0 -mr-2 -mt-2 sm:-mr-3 sm:-mt-3 md:-mr-4 md:-mt-4 bg-blue-500 p-3 md:p-4 rounded-lg transform rotate-6 z-20">
                    <Brain className="text-white" size={20} />
                  </div>
                </AnimatedIcon>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}
