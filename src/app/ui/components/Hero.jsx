'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="hero" className="bg-blue-100 min-h-screen flex items-center pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              AI-Powered Workout Feedback in Real-Time
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Get instant form correction and personalized guidance for better results and injury prevention, without the cost of a personal trainer.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                href="#"
                className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-center"
              >
                Start Free Trial
              </Link>
              <Link
                href="#"
                className="bg-white text-blue-600 border border-blue-600 font-medium px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-300 text-center"
              >
                How It Works
              </Link>
            </div>
            <div className="pt-4 space-y-2">
              {[
                'No equipment required, just your device camera',
                'Analyze 30+ body points for accurate feedback',
                'Access 150+ guided workouts and exercises',
              ].map((text, index) => (
                <p key={index} className="text-gray-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="bg-blue-600 rounded-xl shadow-xl overflow-hidden transform rotate-1 relative">
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                LIVE AI
              </div>
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&q=80&fit=crop&w=1080"
                alt="Person being monitored by fitness AI"
                className="w-full rounded-xl"
                onError={(e) => ((e.currentTarget.src = 'https://placehold.co/600x400'))}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/60 to-purple-600/60 rounded-xl"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Form Analysis: Your squat depth is perfect!
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Keep your back straight and maintain this position
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Testimonial Bubble */}
            <div className="hidden md:block absolute -bottom-6 -left-6 bg-yellow-400 rounded-lg p-4 shadow-lg transform -rotate-2">
              <p className="text-sm font-bold text-gray-900">
                "My form improved 80% in just 2 weeks!"
              </p>
              <p className="text-xs text-gray-700 mt-1">— Sarah K., FitAI user</p>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">TRUSTED BY FITNESS ENTHUSIASTS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-gray-400 font-semibold">
            <div>RUNNER'S WORLD</div>
            <div>FITNESS MAGAZINE</div>
            <div>MEN'S HEALTH</div>
            <div>WOMEN'S FITNESS</div>
            <div>TECH INSIDER</div>
          </div>
        </div>
      </div>
    </section>
  );
}
