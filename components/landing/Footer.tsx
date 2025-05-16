import Link from "next/link";
import { AnimatedContainer } from "@/components/animations/landing-page";
import { HelpCircle, Linkedin, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-10 bg-gray-100" data-testid="footer">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
        <AnimatedContainer delay={0.1} once={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">TedCards</h3>
              <p className="text-gray-600 text-sm">
                Automatic flashcard generation from YouTube videos using artificial intelligence.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Useful Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#powerful-ai" className="text-gray-600 hover:text-gray-900 text-sm">
                    Powerful AI
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#who-is-it-for" className="text-gray-600 hover:text-gray-900 text-sm">
                    Who is it for?
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://www.linkedin.com/in/szczepan-szablej/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    <span>Szczepan Szablej</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Support</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedback"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    <span>Send Feedback</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">&copy; 2025 TedCards. All rights reserved.</p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
                  Privacy Policy
                </Link>
                <Link href="/feedback" className="text-gray-500 hover:text-gray-700 text-sm">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  );
}
