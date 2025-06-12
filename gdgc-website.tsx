'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from "next/image"
import { ThemeToggle } from "./components/theme-toggle"




export default function GDGCWebsite() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean | null>(null);

  const [hasHydrated, setHasHydrated] = useState<>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const homeRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const eventsRef = useRef<HTMLElement>(null)
  const teamRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Corrected: Implemented scrollToSection properly
   const scrollToSection = useCallback(
    (sectionId: string) => {
      let ref: React.RefObject<HTMLElement> | null = null;
      switch (sectionId) {
        case "home":
          ref = homeRef;
          break;
        case "about":
          ref = aboutRef;
          break;
        case "events":
          ref = eventsRef;
          break;
        case "team":
          ref = teamRef;
          break;
        case "contact":
          ref = contactRef;
          break;
        default:
          break;
      }

      if (ref && ref.current) {
        // Adjust this value (-70) to match the exact height of your fixed navigation bar.
        // If your header is 64px tall, use -64. If it's 80px tall, use -80.
        const yOffset = -65;
        const y = ref.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    // IMPORTANT: Include all your refs in the dependency array
    [homeRef, aboutRef, eventsRef, teamRef, contactRef]
  );
  // Detect mobile and reduced motion preferences
//const [hasHydrated, setHasHydrated] = useState<boolean>(false);
useEffect(() => {
  setHasHydrated(true);
}, [])

const [selectedEvent, setSelectedEvent] = useState<{
  title: string;
  image: string;
  description: string;
} | null>(null);

useEffect(() => {
  if (!hasHydrated) return;

  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}, [hasHydrated]);
 useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const checkReducedMotion = () => {
    setIsReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  checkMobile();
  checkReducedMotion();

  window.addEventListener("resize", checkMobile);
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", checkReducedMotion);

  return () => {
    window.removeEventListener("resize", checkMobile);
    mediaQuery.removeEventListener("change", checkReducedMotion);
  };
}, []);

// Optional: Handle hashchange events for in-page anchor links
useEffect(() => {
  const handleHashChange = () => {
    const sectionId = window.location.hash.replace('#', '');
    if (sectionId) scrollToSection(sectionId);
  };

  window.addEventListener('hashchange', handleHashChange);
  return () => window.removeEventListener('hashchange', handleHashChange);
}, [scrollToSection]);


  // Optimized intersection observer with reduced threshold on mobile
  useEffect(() => {
    const observeElements = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in")
            }
          })
        },
        {
          threshold: isMobile ? 0.05 : 0.1,
          rootMargin: isMobile ? "0px 0px -20px 0px" : "0px 0px -50px 0px",
        },
      )

      elements.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }

    // Ensure this runs only on client-side
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const cleanup = observeElements()
        return cleanup
    }
  }, [isMobile])

  // Section observer for navigation
  useEffect(() => {
    const sectionRefs = [
      { id: "home", ref: homeRef },
      { id: "about", ref: aboutRef },
      { id: "events", ref: eventsRef },
      { id: "team", ref: teamRef },
      { id: "contact", ref: contactRef },
    ]

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: isMobile ? 0.3 : 0.5,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    // Ensure this runs only on client-side
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(observerCallback, observerOptions)

        sectionRefs.forEach(({ ref }) => {
            if (ref.current) {
                observer.observe(ref.current)
            }
        })

        return () => {
            sectionRefs.forEach(({ ref }) => {
                if (ref.current) {
                    observer.unobserve(ref.current)
                }
            })
        }
    }
  }, [isMobile])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    // Ensure this runs only on client-side
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden"
        document.body.style.position = "fixed"
        document.body.style.width = "100%"
      } else {
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.width = ""
      }
    }

    return () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = ""
            document.body.style.position = ""
            document.body.style.width = ""
        }
    }
  }, [isMobileMenuOpen])

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    
    <div
      className={`font-inter min-h-screen transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <div className="scroll-progress-container">
        <div
          className={`scroll-progress-bar ${scrollProgress >= 100 ? "progress-milestone" : ""}`}
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        >
          {/* Progress segments for visual feedback */}
          {[0, 1, 2, 3, 4].map((segment) => (
            <div key={segment} className="progress-segment" style={{ left: `${segment * 20}%` }} />
          ))}
        </div>
      </div>

      {/* Enhanced CSS with dark mode support */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        /* Dark mode CSS variables */
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --bg-tertiary: #f1f5f9;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --border-primary: #e5e7eb;
          --border-secondary: #d1d5db;
          --accent-primary: #6366f1;
          --accent-secondary: #8b5cf6;
          --shadow-light: rgba(0, 0, 0, 0.1);
          --shadow-medium: rgba(0, 0, 0, 0.15);
          --shadow-heavy: rgba(0, 0, 0, 0.25);
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
        }

        .dark {
          --bg-primary: #111827;
          --bg-secondary: #1f2937;
          --bg-tertiary: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --border-primary: #374151;
          --border-secondary: #4b5563;
          --accent-primary: #818cf8;
          --accent-secondary: #a78bfa;
          --shadow-light: rgba(0, 0, 0, 0.3);
          --shadow-medium: rgba(0, 0, 0, 0.4);
          --shadow-heavy: rgba(0, 0, 0, 0.6);
          --glass-bg: rgba(0, 0, 0, 0.2);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        /* Smooth theme transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Performance optimizations */
        * {
          box-sizing: border-box;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        /* Dark mode aware backdrop blur */
        .backdrop-blur-md-custom {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background-color: var(--glass-bg);
          border-color: var(--glass-border);
        }

        .backdrop-blur-lg-custom {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background-color: var(--glass-bg);
          border-color: var(--glass-border);
        }

        /* Dark mode gradients */
        .hero-background-gradient {
          background: linear-gradient(to right, #D93025 0%, #1A73E8 25%, #1E8E3E 50%, #F9AB00 75%, #F9AB00 100%);
        }

        .dark .hero-background-gradient {
          background: linear-gradient(to right,
            rgba(217, 48, 37, 0.9) 0%,
            rgba(26, 115, 232, 0.9) 25%,
            rgba(30, 142, 62, 0.9) 50%,
            rgba(249, 171, 0, 0.9) 75%,
            rgba(249, 171, 0, 0.9) 100%
          ), linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        .about-background-gradient {
          background: linear-gradient(to bottom right, #f8c0d3, #e57373);
        }

        .dark .about-background-gradient {
          background: linear-gradient(to bottom right,
            rgba(248, 192, 211, 0.3),
            rgba(229, 115, 115, 0.3)
          ), linear-gradient(135deg, #374151 0%, #1f2937 100%);
        }

        .events-background-gradient {
          background: linear-gradient(to top left, #d1c4e9, #9575cd);
        }

        .dark .events-background-gradient {
          background: linear-gradient(to top left,
            rgba(209, 196, 233, 0.3),
            rgba(149, 117, 205, 0.3)
          ), linear-gradient(135deg, #4b5563 0%, #374151 100%);
        }

        .team-background-gradient {
          background: linear-gradient(to bottom, #a5d6a7, #66bb6a);
        }

        .dark .team-background-gradient {
          background: linear-gradient(to bottom,
            rgba(165, 214, 167, 0.3),
            rgba(102, 187, 106, 0.3)
          ), linear-gradient(135deg, #374151 0%, #1f2937 100%);
        }

        .contact-background-gradient {
          background: linear-gradient(to top right, #64b5f6, #2196f3);
        }

        .dark .contact-background-gradient {
          background: linear-gradient(to top right,
            rgba(100, 181, 246, 0.3),
            rgba(33, 150, 243, 0.3)
          ), linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        /* Mobile-first responsive animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* Reduced animations on mobile */
        @media (max-width: 768px) {
          .animate-on-scroll {
            transform: translateY(10px);
            transition-duration: 0.4s;
          }
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll,
          .smooth-hover,
          .ripple-effect,
          .magnetic,
          .float-animation,
          .pulse-glow,
          .gradient-text {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }

        /* Stagger animation for cards */
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        .stagger-6 { transition-delay: 0.6s; }

        /* Optimized animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        }

        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .dark .pulse-glow {
          animation: pulse-glow-dark 3s ease-in-out infinite;
        }

        @keyframes pulse-glow-dark {
          0%, 100% { box-shadow: 0 0 20px rgba(129, 140, 248, 0.4); }
          50% { box-shadow: 0 0 30px rgba(129, 140, 248, 0.7); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-text {
          background: linear-gradient(-45deg,rgb(255, 255, 255),rgb(0, 110, 255),rgb(253, 253, 253),rgb(93, 255, 93),rgb(255, 202, 89),rgb(255, 69, 69),rgb(0, 110, 255));
          background-size: 400% 400%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Optimized hover effects */
        .smooth-hover {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }

        .smooth-hover:hover {
          transform: translateY(-5px);
        }

        /* Mobile-optimized hover effects */
        @media (max-width: 768px) {
          .smooth-hover:hover {
            transform: translateY(-2px);
          }
        }

        /* Button ripple effect */
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }

        .ripple-effect::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .ripple-effect:active::before {
          width: 300px;
          height: 300px;
        }

        .magnetic {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Optimized scroll progress bar with dark mode */
        .scroll-progress-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          z-index: 60;
          overflow: hidden;
        }

        .scroll-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #D93025 0%, #1A73E8 25%, #1E8E3E 50%, #F9AB00 75%, #F9AB00 100%);
          transform-origin: left;
          transition: transform 0.1s ease-out;
          position: relative;
          will-change: transform;
        }

        .scroll-progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
          animation: progress-shine 2s ease-in-out infinite;
        }

        @keyframes progress-shine {
          0%, 100% { opacity: 0; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(-10px); }
        }

        .progress-segment {
          position: absolute;
          top: 0;
          height: 100%;
          width: 20%;
          border-right: 1px solid var(--glass-border);
          pointer-events: none;
        }

        .progress-segment:last-child {
          border-right: none;
        }

        .progress-milestone {
          animation: progress-pulse 0.6s ease-out;
        }

        @keyframes progress-pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }

        /* Mobile-optimized typography */
        @media (max-width: 768px) {
          h1 { font-size: 2.5rem !important; }
          h2 { font-size: 2rem !important; }
          h3 { font-size: 1.5rem !important; }

          .text-6xl, .text-7xl { font-size: 2.5rem !important; }
          .text-5xl { font-size: 2rem !important; }
          .text-4xl { font-size: 1.75rem !important; }
          .text-3xl { font-size: 1.5rem !important; }
          .text-2xl { font-size: 1.25rem !important; }
          .text-xl { font-size: 1.125rem !important; }
        }

        /* Mobile-optimized spacing */
        @media (max-width: 768px) {
          .py-20 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
          .py-16 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .py-12 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .py-10 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .py-8 { padding-top: 1.25rem !important; padding-bottom: 1.25rem !important; }

          .px-10 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .px-8 { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }

          .mb-16 { margin-bottom: 2.5rem !important; }
          .mb-12 { margin-bottom: 2rem !important; }
          .mb-10 { margin-bottom: 1.5rem !important; }
          .mb-8 { margin-bottom: 1.25rem !important; }
          .mb-6 { margin-bottom: 1rem !important; }
        }

        /* Touch-friendly buttons on mobile */
        @media (max-width: 768px) {
          button, .button, a[role="button"] {
            min-height: 44px;
            min-width: 44px;
            padding: 0.75rem 1rem;
          }
        }

        /* Dark mode specific styles */
        .dark .bg-white\\/50 {
          background-color: rgba(31, 41, 55, 0.5) !important;
        }

        .dark .bg-white\\/60 {
          background-color: rgba(31, 41, 55, 0.6) !important;
        }

        .dark .bg-white\\/95 {
          background-color: rgba(31, 41, 55, 0.95) !important;
        }

        .dark .text-gray-700 {
          color: rgb(209, 213, 219) !important;
        }

        .dark .text-gray-600 {
          color: rgb(156, 163, 175) !important;
        }

        .dark .text-gray-500 {
          color: rgb(107, 114, 128) !important;
        }

        .dark .text-gray-900 {
          color: rgb(249, 250, 251) !important;
        }

        .dark .border-gray-200\\/50 {
          border-color: rgba(75, 85, 99, 0.5) !important;
        }

        .dark .border-white\\/20 {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .dark .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .dark .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
        }

        .dark .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2) !important;
        }

        .dark .shadow-md {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 smooth-hover">
                <Image
                  src="\logos\logo copy.png?height=60&width=60"
                  alt="GDGc Logo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <div className="ml-3 hidden sm:block">
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100 ">GDGc PPSU</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {["home", "about", "events", "team", "contact"].map((section, index) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeSection === section
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                    style={{ transitionDelay: `${index * 0.05}s` }}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-3">
              <span className="text-sm sm:text-base font-semibold dark:text-gray-100 gradient-text md:hidden">
    Google Developer Groups PP Savani University
  </span>
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-300"
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Toggle mobile menu"
                >
                  <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <span
                      className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                        isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                        isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                      }`}
                    />
                    <span
                      className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                        isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
{["home", "about", "events", "team", "contact"].map((section, index) => (
  <a
    key={section}
    href={`#${section}`}
    onClick={() => setIsMobileMenuOpen(false)}
    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
      activeSection === section
        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-500"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
    }`}
    style={{ transitionDelay: `${index * 0.05}s` }}
  >
    {section.charAt(0).toUpperCase() + section.slice(1)}
  </a>
))}
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section
        id="home"
        ref={homeRef}
        className="hero-background-gradient min-h-screen flex items-center justify-center pt-16 relative overflow-hidden"
      >
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center p-6 md:p-10 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 bg-black/10 dark:bg-black/20 backdrop-blur-md-custom animate-on-scroll pulse-glow">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white leading-tight">
              <span className="inline-block animate-on-scroll">Innovate.</span>{" "}
              <span className="inline-block animate-on-scroll stagger-1">Develop.</span>{" "}
              <span className="inline-block animate-on-scroll stagger-2">Inspire.</span>
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 leading-relaxed text-white/90 animate-on-scroll stagger-3">
              Empowering students with cutting-edge technology and development skills.
            </h2>
            <button onClick={() => scrollToSection("events")} className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-gray-100 dark:text-blue-800 dark:hover:bg-gray-200 px-6 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-bold shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-3xl ripple-effect magnetic animate-on-scroll stagger-4 touch-manipulation" onMouseEnter={(e) => { if (!isMobile) { e.currentTarget.style.transform = "scale(1.05) translateY(-2px)" } }} onMouseLeave={(e) => { if (!isMobile) { e.currentTarget.style.transform = "scale(1) translateY(0)" } }} > Explore Our Events </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" ref={aboutRef} className="about-background-gradient py-12 md:py-20 min-h-screen relative">
        <div className="container mx-auto px-4 pt-8 md:pt-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16 animate-on-scroll">
              <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom p-4 md:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl smooth-hover">
                <h2 className="text-3xl md:text-5xl font-bold text-indigo-700 dark:text-indigo-300">About GDGc Club</h2>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
              <div className="w-full lg:w-1/2 animate-on-scroll stagger-1">
                <div className="p-6 md:p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <Image src="\team\vivek-team.jpg"alt="Team Collaboration" width={600} height={400} className="rounded-xl object-cover w-full h-auto transition-transform duration-500 hover:scale-105" loading="lazy" />
                </div>
              </div>
              <div className="w-full lg:w-1/2 animate-on-scroll stagger-2">
                <div className="p-6 md:p-8 text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <p className="mb-4 md:mb-6 transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-100"> Google Developer Groups Club (GDGc) is a community of passionate students and professionals who share a common interest in Google technologies and development practices. </p>
                  <p className="mb-4 md:mb-6 transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-100"> Our mission is to create a vibrant ecosystem where members can learn, share knowledge, and collaborate on innovative projects that solve real-world problems. </p>
                  <p className="mb-4 md:mb-6 font-semibold transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-100"> We focus on cutting-edge technologies including: </p>
                  <ul className="list-none space-y-2 md:space-y-3">
                    {[
                      "Artificial Intelligence & Machine Learning",
                      "Web Development with modern frameworks",
                      "Mobile App Development for Android and cross-platform",
                      "Cloud Computing and DevOps practices",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center transition-all duration-300 hover:translate-x-2 hover:text-indigo-700 dark:hover:text-indigo-300" >
                        <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full mr-3 md:mr-4 transition-all duration-300 hover:scale-150 flex-shrink-0"></div>
                        <span className="text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" ref={eventsRef} className="events-background-gradient py-12 md:py-20 min-h-screen relative">
        <div className="container mx-auto px-4 pt-8 md:pt-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16 animate-on-scroll">
              <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom p-4 md:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl smooth-hover">
                <h2 className="text-3xl md:text-5xl font-bold text-purple-700 dark:text-purple-300">Our Events</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <div
  onClick={() =>
    setSelectedEvent({
      title: "Tech Globe Fest – A Deep Dive into Entrepreneurship and Innovation",
      image: "/event/tgf.jpg",
      description:
        "At GDGc Club, in collaboration with EBC Club, CCLUB, and Globewarts, we proudly hosted Tech Globe Fest, an exciting celebration of entrepreneurship and innovation. The event brought together aspiring innovators, thinkers, and creators to explore startup culture, share groundbreaking ideas, and engage in hands-on activities. With expert sessions, interactive exhibits, and networking opportunities, Tech Globe Fest inspired students to take bold steps toward turning their visions into reality.",
    })
  }
  className="cursor-pointer"
>
              <div className="animate-on-scroll stagger-1">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <Image src="\event\tgf.jpg" alt="TechGlobeFest" width={600} height={350} className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Tech Globe Fest</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-base md:text-lg"> " We at GDGc Club, in collaboration with EBC Club, CCLUB, and Globewarts, proudly hosted Tech Globe Fest — a vibrant event celebrating entrepreneurship and innovation. Students engaged in expert-led sessions, idea-sharing, and hands-on activities that encouraged creative thinking and startup spirit.</p>
                    <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-sm font-medium px-3 py-1 rounded-full">4th April 2025</span>
                  </div>
                </div>
              </div>
              </div>

              <div className="animate-on-scroll stagger-2">
                <div
  onClick={() =>
    setSelectedEvent({
      title: "App Development Workshop – GDGc PPSU",
      image: "/event/app.jpg",
      description:"The GDGc Club at PPSU successfully organized an interactive App Development Workshop, providing students with hands-on experience in building mobile applications. Using Android Studio as the primary development tool, participants explored the core concepts of Android app development, UI/UX design, and real-world implementation techniques. The session empowered attendees to create functional apps from scratch, enhancing their technical skills and sparking innovative thinking.",
    })
  }
  className="cursor-pointer"
>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <Image src="\event\app.jpg" alt="Hackathon Event" width={600} height={350} className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">App Development Workshop</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-base md:text-lg">  We at GDGc Club successfully hosted a hands-on App Development Workshop where students explored Android app creation using Android Studio. From understanding UI/UX to building functional apps, the session gave participants a strong start in mobile development.</p>
                    <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-sm font-medium px-3 py-1 rounded-full">25th December 2024</span>
                  </div>
                </div>
              </div>
              </div>

              <div className="animate-on-scroll stagger-3">
                <div
  onClick={() =>
    setSelectedEvent({
      title: "Web Development Workshop – GDGc PPSU",
      image: "/event/web.jpg",
      description:"At GDGc Club, we successfully hosted an in-depth Web Development Workshop designed to introduce students to the exciting world of web technologies. This hands-on session provided participants with a strong foundation in HTML, CSS, and JavaScript, the core languages of front-end development.Throughout the workshop, students learned how to structure web pages using HTML, style them creatively with CSS, and bring them to life through dynamic JavaScript functionality. Using tools like Visual Studio Code and real-time browser debugging, they explored modern development practices and industry-relevant techniques.The workshop also included guided mini-projects, live demonstrations, and one-on-one mentorship, allowing attendees to apply their learning immediately in a collaborative environment. By the end of the session, participants had built their own responsive web pages and gained the confidence to continue their journey in web development.This initiative was a step toward equipping future developers with practical skills, creativity, and the confidence to build their digital ideas from the ground up.",
    })
  }
  className="cursor-pointer"
></div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <Image src="\event\web.jpg" alt="Speaker Session" width={600} height={350} className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Web Development Workshop</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-base md:text-lg">Building the Web from Scratch
We at GDGc Club successfully organized a hands-on Web Development Workshop where students learned to design and develop websites using HTML, CSS, and JavaScript. The session focused on front-end fundamentals, practical coding, and real-time project building, empowering participants to bring their web ideas to life. </p>
                    <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-sm font-medium px-3 py-1 rounded-full">20th December 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" ref={teamRef} className="team-background-gradient py-12 md:py-20 min-h-screen relative">
        <div className="container mx-auto px-4 pt-8 md:pt-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16 animate-on-scroll">
              <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom p-4 md:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl smooth-hover">
                <h2 className="text-3xl md:text-5xl font-bold text-green-700 dark:text-green-300">Meet Our Team</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
              <div className="animate-on-scroll stagger-1">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl p-6 md:p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <Image src="\leaders\vivek.jpg" alt="Team Member 1" width={150} height={150} className="rounded-full mx-auto mb-4 object-cover border-4 border-green-300 dark:border-green-600 shadow-lg" loading="lazy" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Vivek Jetani </h3>
                  <p className="text-green-700 dark:text-green-300 font-medium mb-3">GDGc Organizer 2024-2025</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">“Without a team, we are nothing — and with the right team, there is nothing we can’t do.”</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <a href="https://www.linkedin.com/in/jet-vivek-jetani/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    
                  </div>
                </div>
              </div>

              <div className="animate-on-scroll stagger-2">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl p-6 md:p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <Image src="\leaders\shubh.jpg" alt="Team Member 2" width={150} height={150} className="rounded-full mx-auto mb-4 object-cover border-4 border-green-300 dark:border-green-600 shadow-lg" loading="lazy" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Shubh Patel</h3>
                  <p className="text-green-700 dark:text-green-300 font-medium mb-3">GDSC Organizer 2023-2024</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">“Growth happens when you move out of your comfort zone."”</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  
                  </div>
                </div>
              </div>

              <div className="animate-on-scroll stagger-3">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl p-6 md:p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-gray-200/50 dark:border-gray-700/50 smooth-hover">
                  <Image src="\leaders\shubham.png" alt="Team Member 3" width={150} height={150} className="rounded-full mx-auto mb-4 object-cover border-4 border-green-300 dark:border-green-600 shadow-lg" loading="lazy" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Shubham Kothiya</h3>
                  <p className="text-green-700 dark:text-green-300 font-medium mb-3">GDSC Organizer 2022-2023</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Introducer OF GDSC in P.P Savani University</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <a href="https://www.linkedin.com/in/shubham-kothiya/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                   
                  </div>
                </div>
              </div>
              {/*MAN OF THE YEAR Section*/}
              <div className="animate-on-scroll stagger-10">
  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl p-6 md:p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-yellow-400 dark:border-yellow-500 smooth-hover">
    <Image
      src="manofyear\param2.jpg"
      alt="Param Kalathiya"
      width={150}
      height={150}
      className="rounded-full mx-auto mb-4 object-cover border-4 border-yellow-400 dark:border-yellow-500 shadow-lg"
      loading="lazy"
    />
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Param Kalathiya</h3>
    <p className="text-yellow-500 font-medium mb-1">🏆 Man of the Year 2024-25</p>
    <p className="text-green-700 dark:text-green-300 font-medium mb-3">App Developer</p>
    <p className="text-gray-700 dark:text-gray-300 text-sm italic">
      "A Innovator who brought GDGc to new heights with his hardwork and innovation into PPSU"
    </p>
    <div className="flex justify-center space-x-4 mt-4">
      <a
        href="https://www.linkedin.com/in/paramkalathiya/"
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            
      </a>
    </div>
  </div>
</div>
{/*MOF2*/}
<div className="animate-on-scroll stagger-11">
  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl p-6 md:p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-yellow-400 dark:border-yellow-500 smooth-hover">
    <Image
      src="/manofyear/prince.jpg"
      alt="Prince Khunt"
      width={150}
      height={150}
      className="rounded-full mx-auto mb-4 object-cover border-4 border-yellow-400 dark:border-yellow-500 shadow-lg"
      loading="lazy"
    />
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Prince Khunt</h3>
    <p className="text-yellow-500 font-medium mb-1">🏆 Man of the Year 2023-24</p>
    <p className="text-green-700 dark:text-green-300 font-medium mb-3">Tech Lead</p>
    <p className="text-gray-700 dark:text-gray-300 text-sm italic">
      "A visionary who brought Tech to life on campus through GDSC."
    </p>
    <div className="flex justify-center space-x-4 mt-4">
      <a
        href="https://www.linkedin.com/in/princekhunt/"
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
    </div>
  </div>
</div>
<div className="animate-on-scroll stagger-12">
  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom rounded-2xl shadow-2xl p-6 md:p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-yellow-400 dark:border-yellow-500 smooth-hover">
    <Image
      src="/manofyear/man.jpg"
      alt="Man Savani"
      width={150}
      height={150}
      className="rounded-full mx-auto mb-4 object-cover border-4 border-yellow-400 dark:border-yellow-500 shadow-lg"
      loading="lazy"
    />
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Rohan Mehta</h3>
    <p className="text-yellow-500 font-medium mb-1">🏆 Man of the Year 2022-23</p>
    <p className="text-green-700 dark:text-green-300 font-medium mb-3">Event Lead</p>
    <p className="text-gray-700 dark:text-gray-300 text-sm italic">
      "A leader who transformed events into unforgettable experiences, inspiring the entire community."
    </p>
    <div className="flex justify-center space-x-4 mt-4">
      <a
        href="https://www.linkedin.com/in/mann-savani/"
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
    </div>
  </div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div className="text-center py-6">
      <span className="text-3xl  font-extrabold dark:text-gray-100 gradient-text text-center ">
    JOIN US ON SOCIALS
  </span>
  <div className="flex justify-center gap-6 mt-4">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/gdgcppsu/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-pink-500 hover:scale-110 transition-transform duration-200"
    aria-label="Instagram"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .3 2.5.5.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.5.4 1.3.5 2.5.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 2-.5 2.5-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.5.2-1.3.4-2.5.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.3-2.5-.5-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.5-.4-1.3-.5-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-2 .5-2.5.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.5-.2 1.3-.4 2.5-.5C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .1 5.7.2 4.6.5 3.8.9c-.9.4-1.6 1-2.3 1.7-.7.7-1.3 1.4-1.7 2.3-.4.8-.7 1.9-.8 3.2C-.1 8.3 0 8.7 0 12c0 3.3 0 3.7.1 5 .1 1.3.4 2.4.8 3.2.4.9 1 1.6 1.7 2.3.7.7 1.4 1.3 2.3 1.7.8.4 1.9.7 3.2.8 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.4-.4 3.2-.8.9-.4 1.6-1 2.3-1.7.7-.7 1.3-1.4 1.7-2.3.4-.8.7-1.9.8-3.2.1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.4-2.4-.8-3.2-.4-.9-1-1.6-1.7-2.3-.7-.7-1.4-1.3-2.3-1.7-.8-.4-1.9-.7-3.2-.8C15.7-.1 15.3 0 12 0z" />
      <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/company/gdscppsu/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:scale-110 transition-transform duration-200"
    aria-label="LinkedIn"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM7 19H4v-9h3v9zm-1.5-10.3c-1 0-1.7-.8-1.7-1.7 0-.9.7-1.6 1.7-1.6s1.7.7 1.7 1.6c0 .9-.8 1.7-1.7 1.7zm14.5 10.3h-3v-4.8c0-1.1-.4-1.9-1.5-1.9-1 0-1.5.7-1.7 1.4-.1.3-.1.7-.1 1v4.3h-3v-9h3v1.2c.4-.6 1.1-1.5 2.8-1.5 2.1 0 3.5 1.4 3.5 4.4v4.9z" />
    </svg>
  </a>
</div>

    </div>
      <section id="contact" ref={contactRef} className="contact-background-gradient py-12 md:py-20 min-h-screen relative">
        
        <div className="mt-6 flex justify-center space-x-6">
           
  
</div>
        <div className="container mx-auto px-4 pt-8 md:pt-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16 animate-on-scroll">
              <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-md-custom p-4 md:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl smooth-hover">
                <h2 className="text-3xl md:text-5xl font-bold text-blue-700 dark:text-blue-300">Get in Touch</h2>
              </div>
            </div>
             <div className="w-full overflow-hidden rounded-xl shadow-lg">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeVbJk_Z48GU2FV5hyBm8xa1U4WycXt1RO5UKLpNCTPtjItaA/viewform?embedded=true"
        width="100%"
        height="924"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        className="w-full h-[924px] border-none"
      >
        Loading…
      </iframe>
    </div>
          </div>
        </div>
      </section>
      {selectedEvent && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="relative bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl w-[90%] max-w-2xl p-6 md:p-8">
      <button
        onClick={() => setSelectedEvent(null)}
        className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 text-lg font-bold"
      >
        ✖
      </button>
      <Image
        src={selectedEvent.image}
        alt={selectedEvent.title}
        width={800}
        height={400}
        className="rounded-xl mb-4 w-full h-auto object-cover"
      />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {selectedEvent.title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        {selectedEvent.description}
      </p>
    </div>
  </div>
)}
      

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 md:py-12 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 text-center text-gray-700 dark:text-gray-300 text-sm md:text-base">
          <p className="mb-4">
            Made with ❤️ by the GDGc Team & PRK.
          </p>
          <p>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  )
}