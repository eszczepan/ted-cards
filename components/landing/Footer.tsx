import Link from "next/link";
import { AnimatedContainer } from "@/components/animations/landing-page";

export function Footer() {
  return (
    <footer className="w-full py-8 bg-gray-100" data-testid="footer">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
        <AnimatedContainer delay={0.1} once={true}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-gray-500">&copy; 2024 TedCards. All rights reserved.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                Terms & Conditions
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                Contact Us
              </Link>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  );
}
