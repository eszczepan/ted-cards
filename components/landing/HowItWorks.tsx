import { AnimatedHeading, AnimatedCards, AnimatedCard } from "@/components/animations/landing-page";
import { HelpCircle, ClipboardList, LayoutDashboard, MessageCircle, Cog, Share2 } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 bg-gray-50" data-testid="how-it-works-section">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
        <AnimatedHeading>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How TedCards Works</h2>
              <div className="h-1 w-24 bg-blue-600 mx-auto my-4"></div>
              <p className="max-w-[800px] text-gray-500 md:text-xl dark:text-gray-400">
                From discovering content to effective learning, TedCards makes building your knowledge effortless
              </p>
            </div>
          </div>
        </AnimatedHeading>

        <AnimatedCards>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            <AnimatedCard>
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center z-[1]">
                  <HelpCircle className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold z-[1]">Discover</h3>
                <p className="text-gray-500 z-[1]">Find valuable content across YouTube</p>
                <div className="absolute w-full h-48 mt-4 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute w-[95%] h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg transform -rotate-6"></div>
                    <div className="absolute w-1/3 h-1/3 top-0 right-0 bg-blue-300 opacity-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center z-[1]">
                  <ClipboardList className="text-purple-600" size={28} />
                </div>
                <h3 className="text-xl font-bold z-[1]">Capture</h3>
                <p className="text-gray-500 z-[1]">Save insights to your AI flashcards with a click</p>
                <div className="absolute w-full h-48 mt-4 bg-purple-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute w-[95%] h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg transform rotate-3"></div>
                    <div className="absolute w-1/3 h-1/3 bottom-0 left-0 bg-purple-300 opacity-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center z-[1]">
                  <LayoutDashboard className="text-green-600" size={28} />
                </div>
                <h3 className="text-xl font-bold z-[1]">Organize</h3>
                <p className="text-gray-500 z-[1]">Sort knowledge into custom libraries</p>
                <div className="absolute w-full h-48 mt-4 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute w-[95%] h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg transform -rotate-3"></div>
                    <div className="absolute w-1/3 h-1/3 top-0 left-0 bg-green-300 opacity-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </AnimatedCards>

        <AnimatedCards>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <AnimatedCard>
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center z-[1]">
                  <MessageCircle className="text-pink-600" size={28} />
                </div>
                <h3 className="text-xl font-bold z-[1]">Access</h3>
                <p className="text-gray-500 z-[1]">Chat with your knowledge base anytime</p>
                <div className="absolute w-full h-48 mt-4 bg-pink-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute w-[95%] h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg transform rotate-6"></div>
                    <div className="absolute w-1/3 h-1/3 bottom-0 right-0 bg-pink-300 opacity-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center z-[1]">
                  <Cog className="text-amber-600" size={28} />
                </div>
                <h3 className="text-xl font-bold z-[1]">Create</h3>
                <p className="text-gray-500 z-[1]">Transform your knowledge into flashcards for effective learning</p>
                <div className="absolute w-full h-48 mt-4 bg-amber-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute w-[95%] h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg transform -rotate-6"></div>
                    <div className="absolute w-1/3 h-1/3 top-0 right-0 bg-amber-300 opacity-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center z-[1]">
                  <Share2 className="text-cyan-600" size={28} />
                </div>
                <h3 className="text-xl font-bold z-[1]">Share</h3>
                <p className="text-gray-500 z-[1]">Exchange knowledge libraries with others who share your interests</p>
                <div className="absolute w-full h-48 mt-4 bg-cyan-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute w-[95%] h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg transform rotate-3"></div>
                    <div className="absolute w-1/3 h-1/3 bottom-0 left-0 bg-cyan-300 opacity-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </AnimatedCards>
      </div>
    </section>
  );
}
