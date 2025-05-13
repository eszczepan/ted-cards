import { Header, Hero, Features, HowItWorks, Testimonials, CTA, Footer } from "@/components/landing";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </>
  );
}
