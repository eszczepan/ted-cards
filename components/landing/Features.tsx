import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedHeading, AnimatedCards, AnimatedCard } from "@/components/animations/landing-page";
import { Youtube, FileText, Award } from "lucide-react";

export function Features() {
  return (
    <section id="powerful-ai" className="w-full py-12 md:py-24 bg-white" data-testid="feature-section">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
        <AnimatedHeading>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful AI Tools</h2>
              <div className="h-1 w-24 bg-blue-600 mx-auto my-4"></div>
            </div>
          </div>
        </AnimatedHeading>

        <AnimatedCards>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <AnimatedCard>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-2">
                    <Youtube className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mt-4 text-center">YouTube to Flashcards</h3>
                  <p className="text-gray-500 flex-grow mt-2">
                    Automatically generate flashcards from YouTube videos. Our AI extracts key concepts and creates
                    high-quality learning materials with examples.
                  </p>
                  <Link href="/signup" className="mt-4">
                    <Button variant="outline" className="w-full">
                      Generate from YouTube
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
                    <FileText className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mt-4 text-center">Text to Flashcards</h3>
                  <p className="text-gray-500 flex-grow mt-2">
                    Paste any text and let our AI transform it into flashcards with examples. Ideal for articles, notes,
                    or lecture transcripts.
                  </p>
                  <Link href="/signup" className="mt-4">
                    <Button variant="outline" className="w-full">
                      Generate from Text
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <Award className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mt-4 text-center">CEFR Level Assessment</h3>
                  <p className="text-gray-500 flex-grow mt-2">
                    Each flashcard is automatically assigned a CEFR language proficiency level (A1-C2), helping you
                    focus on content that matches your learning stage.
                  </p>
                  <Link href="/signup" className="mt-4">
                    <Button variant="outline" className="w-full">
                      Start Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </AnimatedCards>
      </div>
    </section>
  );
}
