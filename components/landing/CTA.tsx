import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedHeading, AnimatedButton } from "@/components/animations/landing-page";

export function CTA() {
  return (
    <section className="w-full pb-16 md:pb-24" data-testid="cta-section">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 md:py-16">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4 max-w-[700px]">
                <AnimatedHeading>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-700">
                    Ready to 10X your Knowledge?
                  </h2>
                </AnimatedHeading>
                <AnimatedHeading delay={0.2}>
                  <p className="text-lg text-blue-600 md:text-xl mb-8">
                    Join thousands of knowledge enthusiasts already using TedCards to enhance their learning and
                    productivity.
                  </p>
                </AnimatedHeading>
                <AnimatedButton delay={0.4}>
                  <Link href="/signup" data-testid="try-free-button">
                    <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                      Try TedCards Free
                    </Button>
                  </Link>
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
