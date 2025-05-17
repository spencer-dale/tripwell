'use client';
import { SignedIn, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from "next/link"
import { MapPin, Users, Calendar, Compass } from "lucide-react"

export default function Page() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const redirectUrl = '/trips';

  useEffect(() => {
    if (isSignedIn) {
      setIsRedirecting(true);
      router.replace(redirectUrl);
    }
  }, [isSignedIn, router, redirectUrl]);

  if (isRedirecting) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-600">Loading your trips...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 border-b">
        <div className="font-bold text-2xl text-slate-800">Tripwell</div>
        <div className="flex gap-4">
          <SignInButton mode="modal" signUpForceRedirectUrl={redirectUrl}>
            <button className="rounded-lg bg-blue-100 text-blue-700 px-5 py-2 font-medium questrial hover:bg-blue-200 transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal" signInForceRedirectUrl={redirectUrl}>
            <button className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 font-bold commissioner transition">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex relative">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 mt-6">Plan Your Perfect Journey</h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-8">
            Organize trips, track expenses, and create memories with friends and family. All in one place.
          </p>
          <button className="rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xl py-4 px-10 font-bold commissioner transition">
            Start Planning
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-16">Everything You Need For Your Trip</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<MapPin className="h-10 w-10 text-blue-500" />}
            title="Plan Routes"
            description="Map out your journey with detailed routes and stops along the way."
          />

          <FeatureCard
            icon={<Users className="h-10 w-10 text-blue-500" />}
            title="Travel Together"
            description="Invite friends and family to join your trip and collaborate on plans."
          />

          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-blue-500" />}
            title="Timeline View"
            description="Organize your trip day by day with an interactive timeline."
          />

          <FeatureCard
            icon={<Compass className="h-10 w-10 text-blue-500" />}
            title="Track Expenses"
            description="Keep track of all expenses and split costs among travelers."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of travelers who plan and organize their trips with Tripwell.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal" signInFallbackRedirectUrl="/trips">
              <button className="bg-blue-500 hover:bg-blue-600 text-lg text-white py-6 px-8 rounded-lg font-bold commissioner transition">
                Create Account
              </button>
            </SignUpButton>
            {/* <Link href="/trip-details">
              <button className="text-lg py-6 px-8">
                View Demo Trip
              </button>
            </Link> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-bold text-xl text-slate-800 mb-4 md:mb-0">Tripwell</div>
            {/* <div className="flex gap-6 text-slate-600">
              <Link href="#" className="hover:text-blue-500">
                About
              </Link>
              <Link href="#" className="hover:text-blue-500">
                Features
              </Link>
              <Link href="#" className="hover:text-blue-500">
                Pricing
              </Link>
              <Link href="#" className="hover:text-blue-500">
                Contact
              </Link>
            </div> */}
          </div>
          <div className="mt-8 text-center text-slate-500">© 2025 Tripwell. All rights reserved.</div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 bg-blue-100 p-5 rounded-full">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}
