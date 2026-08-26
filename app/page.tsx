import CheckoutButton from './components/CheckoutButton'
import BackgroundGlow from './components/BackgroundGlow'
import LiveBadge from './components/LiveBadge'

const WHATSAPP_LINK = 'https://wa.me/923177336159' // replace with your real number
const CALENDLY_LINK = 'https://calendly.com/thealibhatti-dev/30min' // replace with your real link

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100">
      <BackgroundGlow />

      {/* Nav */}
      <header className="border-b border-slate-800/60 bg-slate-950/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">
              AI
            </div>
            <span className="font-semibold">FrontDesk</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:block">
              <LiveBadge label="System online" />
            </div>
            <a href="/login" className="text-sm text-slate-400 hover:text-white transition">
              Log in
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-indigo-500 hover:bg-indigo-400 transition text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Talk to Me
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-20 text-center">
        <div className="fade-in-up inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI-powered phone receptionist
        </div>

        <h1 className="fade-in-up-delay-1 text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
          Never miss a call.<br />Never miss a booking.
        </h1>

        <p className="fade-in-up-delay-2 text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          An AI receptionist that answers your business phone, understands what callers need,
          and books real appointments directly on your calendar — 24/7, no hold music, no missed leads.
        </p>

        <div className="fade-in-up-delay-2 flex justify-center gap-4 flex-wrap">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-500 hover:bg-indigo-400 hover:-translate-y-0.5 transition-all text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25"
          >
            💬 Message on WhatsApp
          </a>
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-700 hover:border-slate-500 hover:-translate-y-0.5 transition-all text-slate-300 font-medium px-6 py-3 rounded-lg"
          >
            📅 Book a Call
          </a>
        </div>

        <p className="fade-in-up-delay-2 text-sm text-slate-500 mt-6">
          Or <a href="/signup" className="text-indigo-400 hover:text-indigo-300">explore the live demo</a> yourself first
        </p>
      </section>

      {/* Stats strip */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl py-5 text-center">
            <p className="text-2xl font-bold text-indigo-400">24/7</p>
            <p className="text-xs text-slate-500 mt-1">Always answering</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl py-5 text-center">
            <p className="text-2xl font-bold text-indigo-400">&lt;2s</p>
            <p className="text-xs text-slate-500 mt-1">Response time</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl py-5 text-center">
            <p className="text-2xl font-bold text-indigo-400">0</p>
            <p className="text-xs text-slate-500 mt-1">Missed calls</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-6 hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 text-lg">
              📞
            </div>
            <h3 className="font-semibold mb-2">Answers every call</h3>
            <p className="text-sm text-slate-400">
              Your AI receptionist picks up instantly, day or night, and handles the conversation naturally.
            </p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-6 hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 text-lg">
              📅
            </div>
            <h3 className="font-semibold mb-2">Books real appointments</h3>
            <p className="text-sm text-slate-400">
              Checks real-time availability and books directly, so nothing is ever double-booked.
            </p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-6 hover:border-indigo-500/40 hover:-translate-y-1 transition-all">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 text-lg">
              ⚡
            </div>
            <h3 className="font-semibold mb-2">Set up in minutes</h3>
            <p className="text-sm text-slate-400">
              Sign up, tell us about your business, and your AI receptionist is live the same day.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold mb-3">Simple, transparent pricing</h2>
          <p className="text-slate-400">Pay only for what you use. No long-term contracts.</p>
        </div>
        <div className="max-w-xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-12 text-center">
          <p className="text-sm text-amber-300 font-medium mb-1">
            🧪 This checkout is in test mode — no real charge
          </p>
          <p className="text-xs text-slate-400">
            Use test card <span className="font-mono text-slate-300">4242 4242 4242 4242</span>, any future expiry, any CVC, any ZIP. This demonstrates a full Stripe subscription flow.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Want this actually running for your business, or something similar built for you?{' '}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Let's talk →
            </a>
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-6 hover:border-slate-700 transition-all">
            <h3 className="font-semibold mb-1">Starter</h3>
            <p className="text-3xl font-bold mb-4">
              $29<span className="text-base font-normal text-slate-400">/mo</span>
            </p>
            <ul className="text-sm text-slate-400 space-y-2 mb-6">
              <li>Up to 100 minutes/month</li>
              <li>1 AI receptionist</li>
              <li>Real-time availability</li>
              <li>Email support</li>
            </ul>
            <CheckoutButton plan="starter" label="Try the Demo" />
          </div>

          <div className="bg-slate-900/60 backdrop-blur border-2 border-indigo-500 rounded-xl p-6 relative hover:-translate-y-1 transition-all shadow-lg shadow-indigo-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              Most Popular
            </div>
            <h3 className="font-semibold mb-1">Growth</h3>
            <p className="text-3xl font-bold mb-4">
              $99<span className="text-base font-normal text-slate-400">/mo</span>
            </p>
            <ul className="text-sm text-slate-400 space-y-2 mb-6">
              <li>Up to 500 minutes/month</li>
              <li>1 AI receptionist</li>
              <li>Real-time availability</li>
              <li>Priority support</li>
              <li>Call transcripts</li>
            </ul>
            <CheckoutButton plan="growth" label="Try the Demo" variant="primary" />
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-6 hover:border-slate-700 transition-all">
            <h3 className="font-semibold mb-1">Enterprise</h3>
            <p className="text-3xl font-bold mb-4">Custom</p>
            <ul className="text-sm text-slate-400 space-y-2 mb-6">
              <li>Unlimited minutes</li>
              <li>Multiple locations</li>
              <li>Custom integrations</li>
              <li>Dedicated support</li>
            </ul>
            <a
              href="mailto:thealibhatti.dev@gmail.com?subject=Enterprise Plan Inquiry"
              className="block text-center border border-slate-700 hover:border-indigo-500 transition text-slate-200 font-medium py-2 rounded-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-slate-800/60 text-center">
        <h2 className="text-2xl font-bold mb-3">Want something like this for your business?</h2>
        <p className="text-slate-400 mb-8">
          I build AI voice agents, automation systems, and full-stack products like this one. Let's talk about your project.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-500 hover:bg-indigo-400 hover:-translate-y-0.5 transition-all text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25"
          >
            💬 WhatsApp Me
          </a>
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-700 hover:border-slate-500 hover:-translate-y-0.5 transition-all text-slate-300 font-medium px-6 py-3 rounded-lg"
          >
            📅 Book a Call
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-8">
        <p className="text-center text-sm text-slate-500">
          Built by Ali Hassnain Bhatti ·{' '}
          <a href="https://www.linkedin.com/in/ali-hassnain-bhatti-1a0506312/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">
            LinkedIn
          </a>
          {' '}·{' '}
          <a href="https://github.com/alibhatti59" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}