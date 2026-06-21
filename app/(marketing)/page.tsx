// app/(marketing)/page.tsx
import Link from 'next/link'

const features = [
  {
    icon: '👥',
    title: 'Client Management',
    desc: 'Keep all your client info, contacts, and notes in one organized place. Never lose a detail again.',
  },
  {
    icon: '📁',
    title: 'Project Tracking',
    desc: 'Manage projects from planning to completion. Track deadlines, status, and link projects to clients.',
  },
  {
    icon: '✅',
    title: 'Kanban Tasks',
    desc: 'A clean Kanban board to move tasks through Todo, In Progress, and Done. Stay on top of your work.',
  },
  {
    icon: '📎',
    title: 'File Storage',
    desc: 'Upload and organise project files. Share assets and documents, all in one secure place.',
  },
  {
    icon: '📊',
    title: 'Dashboard Overview',
    desc: 'Get a bird\'s-eye view of your business — active projects, upcoming deadlines, and recent activity.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Your data is yours. Row-level security ensures each user only ever sees their own data.',
  },
]

const pricing = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for freelancers just getting started.',
    features: ['Up to 5 clients', '3 active projects', 'Kanban task board', '1 GB file storage'],
    cta: 'Get started free',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For growing freelancers and small agencies.',
    features: ['Unlimited clients', 'Unlimited projects', 'Kanban task board', '50 GB file storage', 'Priority support'],
    cta: 'Start free trial',
    href: '/auth/signup',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$49',
    period: 'per month',
    description: 'For teams managing multiple clients at scale.',
    features: ['Everything in Pro', 'Team members', 'Client portal', '500 GB storage', 'Custom branding'],
    cta: 'Contact sales',
    href: '/auth/signup',
    highlight: false,
  },
]

const testimonials = [
  {
    quote: "ClientFlow replaced 4 different tools I was using. Everything I need to run my freelance business is now in one place.",
    name: 'Sarah Chen',
    role: 'UX Designer',
    avatar: 'SC',
  },
  {
    quote: "The Kanban board alone saved me hours every week. I can finally see exactly where every task stands across all my projects.",
    name: 'Marcus Rivera',
    role: 'Web Developer',
    avatar: 'MR',
  },
  {
    quote: "My clients are impressed when I send them project updates pulled straight from ClientFlow. It makes me look so much more professional.",
    name: 'Priya Patel',
    role: 'Brand Consultant',
    avatar: 'PP',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ClientFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Built for freelancers & agencies
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Manage your clients<br />
            <span className="text-indigo-600">without the chaos</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            ClientFlow gives you everything you need to manage clients, projects, and tasks — in one clean dashboard. Stop juggling spreadsheets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200">
              Start for free →
            </Link>
            <Link href="/login" className="w-full sm:w-auto border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-base hover:bg-gray-50 transition-colors">
              Sign in to your account
            </Link>
          </div>
          <p className="text-sm text-gray-400">No credit card required · Free plan available · Setup in 2 minutes</p>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200 overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
              <div className="flex-1 bg-white rounded border border-gray-200 px-3 py-1 text-xs text-gray-400 text-center">clientflow.app/dashboard</div>
            </div>
            {/* Mock dashboard */}
            <div className="flex h-64">
              <div className="w-48 bg-gray-900 p-4 flex flex-col gap-2">
                <div className="text-white font-semibold text-sm mb-2">ClientFlow</div>
                {['Dashboard','Clients','Projects','Tasks','Settings'].map((item, i) => (
                  <div key={item} className={`text-xs px-3 py-2 rounded-lg ${i === 0 ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>{item}</div>
                ))}
              </div>
              <div className="flex-1 p-6 bg-gray-50 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[['12', 'Active Clients'],['5', 'Projects'],['24', 'Open Tasks']].map(([n, l]) => (
                    <div key={l} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="text-xl font-bold text-gray-900">{n}</div>
                      <div className="text-xs text-gray-500">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Recent Projects</div>
                  {[['Website Redesign','In Progress'],['Brand Identity','Planning'],['SEO Audit','Completed']].map(([n, s]) => (
                    <div key={n} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-600">{n}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s === 'Completed' ? 'bg-green-100 text-green-700' : s === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need to run your business</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">One tool to replace your scattered spreadsheets, sticky notes, and email chains.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-500">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {pricing.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.highlight ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-200 scale-105' : 'bg-white border-gray-200'}`}>
                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.name}</div>
                <div className={`text-4xl font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</div>
                <div className={`text-sm mb-4 ${plan.highlight ? 'text-indigo-200' : 'text-gray-400'}`}>{plan.period}</div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-indigo-100' : 'text-gray-600'}`}>
                      <span className={`text-lg ${plan.highlight ? 'text-indigo-300' : 'text-indigo-600'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Loved by freelancers</h2>
            <p className="text-lg text-gray-500">Join hundreds of freelancers who&apos;ve simplified their business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex text-yellow-400 mb-4">{'★★★★★'}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-extrabold text-white">Ready to get organised?</h2>
          <p className="text-indigo-200 text-lg">Join ClientFlow today. It&apos;s free to start.</p>
          <Link href="/auth/signup" className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-base hover:bg-indigo-50 transition-colors">
            Create your free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center"><span className="text-white font-bold text-xs">CF</span></div>
            <span className="text-white font-semibold">ClientFlow</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} ClientFlow. Built for freelancers.</p>
        </div>
      </footer>
    </div>
  )
}
