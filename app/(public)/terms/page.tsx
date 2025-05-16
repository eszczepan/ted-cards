import { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import BackButton from "@/components/shared/BackButton";

export const metadata: Metadata = {
  title: "Terms of Service | TedCards",
  description: "Terms of Service for TedCards application",
};

export default function TermsPage() {
  return (
    <>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <BackButton />
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to TedCards. These Terms of Service govern your use of our web application and services. By
            accessing or using TedCards, you agree to be bound by these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            TedCards is a web application that enables the automatic generation of educational flashcards from YouTube
            videos and text input using artificial intelligence. The application allows users to create, edit, and
            manage their flashcards.
          </p>
          <p className="mb-4">Key features include:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Automatic flashcard generation from YouTube subtitles</li>
            <li>Automatic flashcard generation from user-provided text</li>
            <li>Manual flashcard creation</li>
            <li>Spaced repetition learning system</li>
            <li>CEFR level assignment for language learning flashcards</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To use TedCards, you must register for an account. You are responsible for maintaining the confidentiality
            of your account information and for all activities that occur under your account.
          </p>
          <p className="mb-4">
            You may delete your account at any time. Upon account deletion, all your flashcards and associated data will
            be permanently removed from our system.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
          <p className="mb-4">
            TedCards allows you to create and manage flashcards. You retain ownership of all content you create on our
            platform. You are solely responsible for the content you generate or submit.
          </p>
          <p className="mb-4">
            TedCards does not currently support sharing flashcards between users. All content you create is private to
            your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Service Limitations</h2>
          <p className="mb-4">The service has the following limitations:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>No advanced spaced repetition algorithms beyond the basic implementation</li>
            <li>No learning progress tracking or detailed statistics</li>
            <li>No import of various file formats (PDF, DOCX, etc.)</li>
            <li>No flashcard sharing between users</li>
            <li>No thematic personalization of learning (e.g., exam-specific, specialized terminology)</li>
            <li>Web application only, no native mobile applications</li>
            <li>No data synchronization between devices</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            TedCards and its original content, features, and functionality are owned by TedCards and are protected by
            international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will provide notice of any significant changes.
            Your continued use of TedCards after such modifications constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
          <p className="mb-4">If you have any questions about these Terms, please contact us.</p>
        </section>
      </div>
      <Footer />
    </>
  );
}
