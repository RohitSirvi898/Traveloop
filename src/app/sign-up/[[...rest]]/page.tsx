'use client';

import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Plane, Compass, Zap, Shield, Users } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5"></div>

        {/* Animated blobs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, 30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, -30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-60 h-60 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Branding & Benefits */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo/Brand */}
            <motion.div
              className="mb-8 flex items-center justify-center lg:justify-start gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur-lg opacity-75"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-xl">
                  <Plane className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                Traveloop
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start Your Journey
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl text-slate-300 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join thousands of travelers planning amazing trips and discovering the world together.
            </motion.p>

            {/* Benefits cards */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Compass,
                  title: 'Smart Itineraries',
                  desc: 'AI-powered trip planning at your fingertips',
                },
                {
                  icon: Zap,
                  title: 'Quick Planning',
                  desc: 'Build beautiful trips in minutes, not hours',
                },
                {
                  icon: Shield,
                  title: 'Secure & Private',
                  desc: 'Your travel data is encrypted and protected',
                },
                {
                  icon: Plane,
                  title: 'Group Trips',
                  desc: 'Plan and collaborate with friends easily',
                },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-green-500/20 flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">{benefit.title}</h3>
                      <p className="text-sm text-slate-400">{benefit.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-slate-300 italic mb-3">
                "Traveloop transformed how I plan trips. It's intuitive, beautiful, and actually saves me time."
              </p>
              <p className="text-sm font-semibold text-white">Sarah M. • Travel Enthusiast</p>
            </motion.div>
          </motion.div>

          {/* Right side - Sign up form */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Custom wrapper for Clerk */}
            <div className="w-full max-w-md">
              <motion.div
                className="relative"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Premium glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card with enhanced styling */}
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                  {/* Inner gradient overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/8 to-transparent pointer-events-none" />
                  
                  {/* Top shine effect */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                  <div className="relative z-10">
                    <SignUp
                      appearance={{
                        elements: {
                          rootBox: 'w-full',
                          card: 'bg-transparent border-0 shadow-none',
                          cardBox: 'bg-transparent',
                          headerTitle: 'text-white text-2xl font-bold tracking-tight',
                          headerSubtitle: 'text-slate-300 text-sm',
                          socialButtonsBlockButton: 'border border-white/20 text-slate-100 hover:bg-white/20 hover:border-white/40 transition-all duration-300 rounded-xl font-medium',
                          dividerLine: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
                          dividerText: 'text-slate-400 text-sm font-medium',
                          formFieldLabel: 'text-white font-semibold text-sm tracking-wide',
                          formFieldInput:
                            'bg-white/8 border border-white/20 text-white placeholder-slate-400/60 focus:bg-white/15 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300 px-4 py-3',
                          formButtonPrimary:
                            'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 active:from-blue-700 active:to-green-700 text-white font-bold rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-200 w-full',
                          footerActionLink: 'text-blue-300 hover:text-blue-200 font-medium transition-colors',
                          identifierMobileLink: 'text-blue-300 hover:text-blue-200 font-medium transition-colors',
                          otpCodeFieldInput:
                            'bg-white/8 border border-white/20 text-white focus:bg-white/15 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300',
                          formResendCodeLink: 'text-blue-300 hover:text-blue-200 font-medium transition-colors',
                          form: 'space-y-5',
                          formFieldRoot: 'space-y-2.5',
                          footerActionText: 'text-slate-300 text-sm',
                          footer: 'mt-7 pt-7 text-center border-t border-white/10',
                          alternativeMethods: 'pt-7 border-t border-white/10 mt-7',
                          button: 'text-blue-300 hover:text-blue-200 transition-colors font-medium',
                          backButton: 'text-slate-300 hover:text-white transition-colors font-medium',
                          toggleButton: 'text-blue-300 hover:text-blue-200 transition-colors font-medium',
                          socialButtons: 'gap-3 flex flex-col',
                          providerButton:
                            'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 text-white rounded-xl transition-all duration-300 font-medium py-3',
                          accordion: 'border-b border-white/10',
                          accordionTrigger: 'text-white hover:text-blue-300 transition-colors font-medium',
                          accordionContent: 'text-slate-300 text-sm',
                          badge: 'bg-blue-500/30 text-blue-200 border border-blue-500/50 px-3 py-1 rounded-full text-xs font-semibold',
                          internalProcessSpinner: '[&>svg]:text-blue-400',
                          activeDevice: 'border-blue-400/60 bg-blue-500/15',
                          activeDeviceIcon: 'text-blue-300',
                        },
                        variables: {
                          colorPrimary: '#3b82f6',
                          colorText: '#ffffff',
                          colorTextSecondary: '#cbd5e1',
                          colorBackground: 'rgba(255, 255, 255, 0.08)',
                          colorInputBackground: 'rgba(255, 255, 255, 0.08)',
                          colorInputText: '#ffffff',
                          colorShellBackground: 'transparent',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          radiusBorderControl: '0.75rem',
                          spacingUnit: '0.5rem',
                        },
                      }}
                      redirectUrl="/dashboard"
                      signInUrl="/sign-in"
                      forceRedirectUrl="/dashboard"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Decorative animated elements */}
              <motion.div
                className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-30"
                animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute -top-20 -right-20 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 group-hover:opacity-25"
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
