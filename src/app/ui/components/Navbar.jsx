"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#', label: 'Home' },
    { href: '#', label: 'How It Works' },
    { href: '#', label: 'Features' },
    { href: '#', label: 'Testimonials' },
    { href: '#', label: 'Pricing' },
    { href: '#', label: 'FAQ' },
  ];

  return (
    <header id="header" className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <Link href="#" className="flex items-center">
              <span className="font-bold">FitAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-gray-800 hover:text-blue-600 transition duration-300">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-800 hover:text-blue-600 transition duration-300"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
