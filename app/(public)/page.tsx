"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedContainer, AnimatedCards, AnimatedCard } from "@/components/animations/landing-page";

export default function Home() {
  return (
    <>
      <header className="w-full fixed top-0 z-50 border-b bg-background/95 backdrop-blur" data-testid="main-header">
        <div className="container max-w-screen-xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" data-testid="logo">
            <span className="sr-only">TedCards</span>
            TedCards
          </Link>
          <div className="flex items-center gap-x-2">
            <Link href="/login" data-testid="login-button">
              <Button>Login</Button>
            </Link>
            <Link href="/signup" data-testid="signup-button">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-col min-h-screen">
        <section className="w-full mt-[64px] py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-50" data-testid="hero-section">
          <div className="container max-w-screen-xl mx-auto px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
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
                      Capture, store, and leverage knowledge that grows with you. Transform YouTube videos into
                      high-quality flashcards for effective learning in seconds.
                    </p>
                  </div>
                  <motion.div
                    className="flex flex-col gap-2 min-[400px]:flex-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <Link href="/dashboard" data-testid="get-started-button">
                      <Button size="lg" className="w-full">
                        Try TedCards Free
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </AnimatedContainer>
              <AnimatedContainer delay={0.2}>
                <div className="flex justify-center">
                  <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
                    <motion.div
                      className="absolute w-[250px] h-[180px] md:w-[320px] md:h-[220px] bg-white rounded-xl shadow-lg transform rotate-6 z-10 border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, rotate: 12, y: 20 }}
                      animate={{ opacity: 1, rotate: 6, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.4 }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-12 bg-red-600 flex items-center px-4">
                        <div className="w-6 h-6 rounded-full bg-white/20 mr-2"></div>
                        <div className="h-3 w-24 bg-white/30 rounded-full"></div>
                      </div>
                      <div className="absolute top-14 left-0 right-0 px-4 flex flex-col space-y-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-full bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <div className="h-3 w-28 bg-white/50 rounded-full"></div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute w-[250px] h-[180px] md:w-[320px] md:h-[220px] bg-white rounded-xl shadow-lg transform -rotate-3 z-0 border border-gray-200 top-14 md:top-20 overflow-hidden"
                      initial={{ opacity: 0, rotate: -8, y: 40 }}
                      animate={{ opacity: 1, rotate: -3, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-12 bg-green-600 flex items-center px-4">
                        <div className="w-6 h-6 rounded-full bg-white/20 mr-2"></div>
                        <div className="h-3 w-24 bg-white/30 rounded-full"></div>
                      </div>
                      <div className="absolute top-14 left-0 right-0 px-4 flex flex-col space-y-3">
                        <div className="h-4 w-1/2 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-full bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <div className="h-3 w-28 bg-white/50 rounded-full"></div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-500 p-4 rounded-lg transform rotate-6 z-20"
                      initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
                      animate={{ opacity: 1, scale: 1, rotate: 6 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0"></path>
                        <path d="M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0"></path>
                        <path d="M3 6v13"></path>
                        <path d="M12 6v13"></path>
                        <path d="M21 6v13"></path>
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </AnimatedContainer>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white" data-testid="feature-section">
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-600"
                        >
                          <path d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"></path>
                          <path d="M10 9l5 3l-5 3z"></path>
                        </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-purple-600"
                        >
                          <path d="M8 21h12a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2z"></path>
                          <path d="M6 9h16"></path>
                          <path d="M6 14h16"></path>
                          <path d="M8 4v16"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mt-4 text-center">Text to Flashcards</h3>
                      <p className="text-gray-500 flex-grow mt-2">
                        Paste any text and let our AI transform it into flashcards with examples. Ideal for articles,
                        notes, or lecture transcripts.
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600"
                        >
                          <path d="M9 12l2 2l4 -4"></path>
                          <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                          <path d="M15 16h6"></path>
                          <path d="M15 12h6"></path>
                          <path d="M15 8h6"></path>
                        </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-600"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="M10 4v4"></path>
                        <path d="M2 8h20"></path>
                        <path d="M6 4v4"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <path d="M14 4h6v6h-6z"></path>
                        <path d="M4 14h6v6H4z"></path>
                        <circle cx="17" cy="17" r="3"></circle>
                        <circle cx="7" cy="7" r="3"></circle>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-pink-600"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-amber-600"
                      >
                        <path d="M14 4h6v6h-6z"></path>
                        <path d="M4 14h6v6H4z"></path>
                        <path d="M17 10 7 20"></path>
                        <path d="m7 4 10 10"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold z-[1]">Create</h3>
                    <p className="text-gray-500 z-[1]">
                      Transform your knowledge into flashcards for effective learning
                    </p>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-cyan-600"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold z-[1]">Share</h3>
                    <p className="text-gray-500 z-[1]">
                      Exchange knowledge libraries with others who share your interests
                    </p>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Students</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Convert lectures </span>
                          into organized, digestible flashcards in seconds
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Prepare effectively </span>
                          for exams with personalized study materials
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-purple-600"
                        >
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Teachers</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Generate materials </span>
                          for your class in minutes instead of hours
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Share flashcard collections </span>
                          directly with students and colleagues
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600"
                        >
                          <path d="M18 16.98h-2.99"></path>
                          <path d="M18 20.01h-2.99"></path>
                          <path d="M18 8h-2.99"></path>
                          <path d="M18 4h-2.99"></path>
                          <path d="M2.5 6h16.99"></path>
                          <path d="M2.5 12h16.99"></path>
                          <path d="M2.5 18h16.99"></path>
                          <ellipse cx="9" cy="6" rx="2" ry="2"></ellipse>
                          <ellipse cx="9" cy="12" rx="2" ry="2"></ellipse>
                          <ellipse cx="9" cy="18" rx="2" ry="2"></ellipse>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Lifelong Learners</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Build a personal knowledge library </span>
                          that grows and evolves with your interests
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Stay current </span>
                          in rapidly changing fields with organized information
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-600"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                          <path d="M2 12h20"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Travelers</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Learn essential phrases </span>
                          tailored to your destination before you travel
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p className="text-gray-700">
                          <span className="font-semibold">Create custom flashcards </span>
                          for cultural insights and local customs
                        </p>
                      </li>
                      <li className="flex items-start space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500 mt-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
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

        <section className="w-full pb-16 md:pb-24" data-testid="cta-section">
          <div className="container max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-24">
            <div className="mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl shadow-lg overflow-hidden">
              <div className="px-8 py-12 md:py-16">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="space-y-4 max-w-[700px]">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-700">
                      Ready to 10X your Knowledge?
                    </h2>
                    <p className="text-lg text-blue-600 md:text-xl mb-8">
                      Join thousands of knowledge enthusiasts already using TedCards to enhance their learning and
                      productivity.
                    </p>
                    <Link href="/signup" data-testid="try-free-button">
                      <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                        Try TedCards Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full py-8 bg-gray-100" data-testid="footer">
          <div className="container max-w-screen-xl mx-auto px-4 md:px-6">
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
          </div>
        </footer>
      </div>
    </>
  );
}
