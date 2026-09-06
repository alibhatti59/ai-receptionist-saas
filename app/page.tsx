import CheckoutButton from './components/CheckoutButton'
import BackgroundGlow from './components/BackgroundGlow'
import LiveBadge from './components/LiveBadge'

const WHATSAPP_LINK = 'https://wa.me/923177336159' // replace with your real number
const CALENDLY_LINK = 'https://calendly.com/ali-hassnain-bhatti/30min' // replace with your real link

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
          and books real appointments directly on your calendar - 24/7, no hold music, no missed leads.
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

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 font-semibold">
              1
            </div>
            <h3 className="font-semibold mb-2">Sign up</h3>
            <p className="text-sm text-slate-400">Create your account and tell us a bit about your business.</p>
          </div>
          <div className="text-center">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 font-semibold">
              2
            </div>
            <h3 className="font-semibold mb-2">Set your availability</h3>
            <p className="text-sm text-slate-400">Pick your working days and hours - your AI receptionist only books within them.</p>
          </div>
          <div className="text-center">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 font-semibold">
              3
            </div>
            <h3 className="font-semibold mb-2">Go live</h3>
            <p className="text-sm text-slate-400">Your AI receptionist starts answering calls and booking appointments the same day.</p>
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
            🧪 This checkout is in test mode - no real charge
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

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-5">
            <h3 className="font-medium mb-1.5">How long does setup take?</h3>
            <p className="text-sm text-slate-400">Just a few minutes. Sign up, set your availability, and your AI receptionist is ready to take calls the same day.</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-5">
            <h3 className="font-medium mb-1.5">Is my data secure?</h3>
            <p className="text-sm text-slate-400">Your account and appointment data are stored securely with row-level access controls, so only you can see your business's data.</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-5">
            <h3 className="font-medium mb-1.5">Can I cancel anytime?</h3>
            <p className="text-sm text-slate-400">Yes. No long-term contracts — the pricing shown is exactly what a real subscription would look like, cancel whenever.</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-xl p-5">
            <h3 className="font-medium mb-1.5">Can this be customized for my specific business?</h3>
            <p className="text-sm text-slate-400">Yes — this demo shows the core system, but every deployment is customized to how your business actually operates. Reach out and let's talk about your needs.</p>
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
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-2 flex-wrap justify-center px-6">
            {['Next.js', 'Retell AI', 'Supabase', 'Stripe'].map((tech) => (
              <span
                key={tech}
                className="text-xs text-slate-500 border border-slate-800 rounded-full px-3 py-1 bg-slate-900/40"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/ali-hassnain-bhatti-1a0506312/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://github.com/alibhatti59"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.42-1.305.763-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.622-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.696.825.577C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-slate-500">
            Built by Ali Hassnain Bhatti
          </p>
        </div>
      </footer>
    </div>
  )
}