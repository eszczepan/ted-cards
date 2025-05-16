import { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import BackButton from "@/components/shared/BackButton";

export const metadata: Metadata = {
  title: "Privacy Policy | TedCards",
  description: "Privacy Policy for TedCards application",
};

export default function PrivacyPage() {
  return (
    <>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <BackButton />
          <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            At TedCards, we are committed to protecting your privacy and personal data. This Privacy Policy explains how
            we collect, use, and protect your information when you use our service.
          </p>
          <p className="mb-4">
            TedCards operates in compliance with the General Data Protection Regulation (GDPR) and other applicable data
            protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">We collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Account Information:</strong> Email address and password (encrypted) for authentication purposes.
            </li>
            <li>
              <strong>Flashcard Data:</strong> The content of flashcards you create or generate, including front and
              back text, CEFR levels, and creation timestamps.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about accepted and rejected AI-generated flashcards to improve
              our service.
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, and device information for security and service
              improvement.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide and maintain our service, including storing your flashcards and managing your account.</li>
            <li>To personalize your experience and improve our AI-based flashcard generation.</li>
            <li>To communicate with you about your account or service changes.</li>
            <li>To ensure the security of our service and prevent unauthorized access.</li>
            <li>To analyze usage patterns and improve our service.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p className="mb-4">
            Your personal data and flashcards are stored securely in our database. We implement appropriate technical
            and organizational measures to protect your data against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
          <p className="mb-4">
            We retain your data for as long as your account is active. When you delete your account, all associated
            data, including your flashcards, will be permanently removed from our systems.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Data Protection Rights</h2>
          <p className="mb-4">Under the GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Right to Access:</strong> You can request a copy of your personal data.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can update or correct your personal data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You can request the deletion of your account and all associated data.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> You can request that we limit the processing of your data.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You can request a copy of your data in a structured, commonly
              used format.
            </li>
            <li>
              <strong>Right to Object:</strong> You can object to our processing of your personal data.
            </li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us. We will respond to your request within 30 days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
          <p className="mb-4">TedCards uses the following third-party services:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>AI services for generating flashcards from YouTube subtitles and text input.</li>
            <li>
              YouTube API services for extracting subtitles (subject to YouTube&apos;s terms of service and privacy
              policy).
            </li>
          </ul>
          <p className="mb-4">
            We do not share your personal information with these services beyond what is necessary to provide our
            service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies and Similar Technologies</h2>
          <p className="mb-4">
            TedCards uses cookies and similar technologies to maintain your session and preferences. These are essential
            for the functioning of our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
          <p className="mb-4">
            TedCards is not intended for children under 16 years of age. We do not knowingly collect personal
            information from children under 16. If you believe we have collected information from a child under 16,
            please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the effective date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
