'use client';

import { motion } from 'framer-motion';
import { Plane, MapPin, Users, DollarSign, Calendar, Target, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push('/dashboard');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Plane className="w-8 h-8 text-teal-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-amber-500/5"></div>

        {/* Animated blobs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, -30, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 flex items-center justify-between p-6 max-w-7xl mx-auto"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
            Traveloop
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="px-6 py-2 text-white hover:text-teal-400 transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all font-medium"
          >
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Hero section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Plan Smarter, Travel Better</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Your Journey,</span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
                Perfectly Planned
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl"
            >
              Plan incredible trips, manage budgets, build itineraries, and travel with confidence. All in one beautiful platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-teal-500/50 transition-all group"
              >
                Start Planning
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/10 hover:border-teal-400/50 transition-all"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 mt-12"
            >
              {[
                { number: '10K+', label: 'Travelers' },
                { number: '500+', label: 'Destinations' },
                { number: '50K+', label: 'Trips Planned' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold text-white">{stat.number}</p>
                  <p className="text-slate-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Hero image mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 opacity-20 blur-3xl" />

              <motion.div
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 p-8 backdrop-blur-xl"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="space-y-4">
                  {/* Mock cards */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                          {i === 1 && <MapPin className="w-6 h-6 text-teal-400" />}
                          {i === 2 && <Calendar className="w-6 h-6 text-cyan-400" />}
                          {i === 3 && <DollarSign className="w-6 h-6 text-amber-400" />}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {i === 1 && 'Destinations'}
                            {i === 2 && 'Schedule'}
                            {i === 3 && 'Budget'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {i === 1 && 'Explore 500+ places'}
                            {i === 2 && 'Plan every detail'}
                            {i === 3 && 'Track expenses'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/20 rounded-full blur-3xl"
              animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-500/20 rounded-full blur-3xl"
              animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Features section */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Everything You Need to Travel Better
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            From planning to budgeting, we've got all the tools to make your trips unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: 'Smart Destinations',
              desc: 'Discover and save your perfect destinations with curated recommendations',
            },
            {
              icon: Calendar,
              title: 'Easy Itineraries',
              desc: 'Build detailed day-by-day plans with drag-and-drop simplicity',
            },
            {
              icon: DollarSign,
              title: 'Budget Tracking',
              desc: 'Monitor expenses and stay within your travel budget',
            },
            {
              icon: Users,
              title: 'Group Trips',
              desc: 'Collaborate with friends on shared trips and plans',
            },
            {
              icon: Target,
              title: 'Checklist Manager',
              desc: 'Never forget anything with organized packing and prep lists',
            },
            {
              icon: Plane,
              title: 'All-in-One Hub',
              desc: 'Manage bookings, notes, and everything from one place',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-teal-500/50 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="p-3 w-fit rounded-lg bg-gradient-to-r from-teal-500/20 to-cyan-500/20 mb-4 group-hover:from-teal-500/40 group-hover:to-cyan-500/40 transition-all">
                <feature.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA section */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="rounded-2xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 backdrop-blur-sm p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Plan Your Perfect Trip?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of travelers already using Traveloop to plan amazing adventures.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-teal-500/50 transition-all"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>
            &copy; 2024 Traveloop. Made with{' '}
            <span className="text-red-400">♥</span> for travelers everywhere.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
