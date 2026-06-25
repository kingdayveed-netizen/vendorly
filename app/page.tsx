import Link from "next/link";
import {
  ShoppingBag,
  Users,
  Rocket,
  Home as HomeIcon,
  MessageCircle,
  User,
  Zap,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-green-100 py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Panel - Text Content */}
            <div className="lg:col-span-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
                <Rocket className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">
                  For WhatsApp Vendors
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Turn Your WhatsApp{" "}
                <span className="text-green-500">Into a Storefront</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Create a beautiful online store for your products and let
                customers order directly through WhatsApp. No technical skills
                required.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                  Create My Store
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-green-500 font-medium rounded-md transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  See Demo
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">1000+ Vendors</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Setup in 5 min</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Image */}
            <div className="lg:col-span-1">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-green-200 to-green-300">
                {/* Placeholder for image - you can replace this with an actual image */}
                <Image
                  src="/images/hero-illustration.png"
                  alt="Vendorly Storefront Example"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Hero Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Everything You Need to Sell Online
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, powerful tools designed specifically for WhatsApp vendors.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Row 1, Column 1: Mobile-First Design */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <Smartphone className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Mobile-First Design
              </h3>
              <p className="text-gray-600">
                Beautiful storefronts that work perfectly on all devices,
                especially mobile where your customers shop.
              </p>
            </div>

            {/* Row 1, Column 2: WhatsApp Integration */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                WhatsApp Integration
              </h3>
              <p className="text-gray-600">
                Direct WhatsApp ordering with pre-filled messages. Customers can
                order with one tap.
              </p>
            </div>

            {/* Row 1, Column 3: Easy Product Management */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Easy Product Management
              </h3>
              <p className="text-gray-600">
                Add, edit, and manage your products with an intuitive dashboard.
                No technical skills needed.
              </p>
            </div>

            {/* Row 2, Column 1: Grow Your Business */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Grow Your Business
              </h3>
              <p className="text-gray-600">
                Professional storefronts help build trust and increase sales.
                Track your progress with analytics.
              </p>
            </div>

            {/* Row 2, Column 2: Quick Setup */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <Zap className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quick Setup
              </h3>
              <p className="text-gray-600">
                Get your store online in minutes, not days. Start selling
                immediately with our simple tools.
              </p>
            </div>

            {/* Row 2, Column 3: Customer Management */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Customer Management
              </h3>
              <p className="text-gray-600">
                Keep track of your customers and their orders. Build lasting
                relationships that drive repeat sales.
              </p>
            </div>
          </div>
        </div>
      </section>
{/* CTA + Community Section */}
<section className="bg-gray-100 py-20">
  <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">

    {/* Community Card */}
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-green-400 px-8 py-16 sm:px-16 text-center mb-6">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-72 w-72 rounded-full bg-green-200 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-6 h-52 w-52 rounded-full bg-green-300 opacity-20 blur-3xl" />

      {/* Floating WhatsApp icons */}
      <svg className="pointer-events-none absolute right-12 top-6 h-20 w-20 animate-bounce opacity-10" style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.41 1.26 4.84L2 22l5.3-1.24A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
      <svg className="pointer-events-none absolute bottom-10 left-14 h-14 w-14 animate-bounce opacity-10" style={{ animationDuration: '8s', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.41 1.26 4.84L2 22l5.3-1.24A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>

      <div className="relative z-10">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Vendor Community</span>
        </div>

        <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Don't Build Your Business Alone
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          Join Nigeria's growing community of WhatsApp vendors. Learn proven sales strategies, get marketing tips, share experiences, and connect with entrepreneurs building successful online businesses.
        </p>

        {/* Benefits Grid */}
        <div className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { icon: <Zap className="h-4 w-4" />, text: 'Weekly business growth tips' },
            { icon: <Users className="h-4 w-4" />, text: 'Vendor networking opportunities' },
            { icon: <Rocket className="h-4 w-4" />, text: 'Early access to Vendorly updates' },
            { icon: <TrendingUp className="h-4 w-4" />, text: 'Marketing and sales resources' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur-sm transition hover:bg-white/20">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
                {icon}
              </div>
              <span className="text-sm font-medium text-white">{text}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex">
            {[
              { initials: 'AO', bg: '#0f5132' },
              { initials: 'TK', bg: '#1e3a5f' },
              { initials: 'BN', bg: '#7c2d12' },
              { initials: 'CF', bg: '#4c1d95' },
              { initials: 'MA', bg: '#1f2937' },
            ].map(({ initials, bg }, i) => (
              <div
                key={initials}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/50 text-xs font-bold text-white"
                style={{ marginLeft: i === 0 ? 0 : '-10px', background: bg, zIndex: i }}
              >
                {initials}
              </div>
            ))}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/50 bg-white/25 text-xs font-bold text-white" style={{ marginLeft: '-10px' }}>
              +495
            </div>
          </div>
          <p className="text-sm font-medium text-white/90">
            <span className="font-bold text-white">500+ vendors</span> already inside
          </p>
        </div>

        {/* Community CTA */}
        
        <a href="https://chat.whatsapp.com/D26RTk1dlm6EZO2gDxQdGP"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-green-700 shadow-xl transition hover:scale-105 hover:bg-green-50 hover:text-green-800 active:scale-95"
        >
          <MessageCircle className="h-5 w-5 text-green-500" />
          Join WhatsApp Community
          <span className="text-lg">→</span>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
          <span>✓ Free to join</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>✓ No spam</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>✓ Leave anytime</span>
        </div>
      </div>
    </div>

    {/* Store CTA — sits below as a quieter secondary action */}
    <div className="rounded-2xl bg-white border border-gray-200 px-8 py-10 text-center shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Ready to Start Selling?
      </h2>
      <p className="text-gray-500 mb-6">
        Join thousands of vendors already growing their business with Vendorly.
      </p>
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
      >
        <HomeIcon className="h-5 w-5" />
        Create Free Store
      </Link>
    </div>

  </div>
</section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#22c55e"
                />
              </svg>
              <span className="text-lg font-bold text-gray-800">Vendorly</span>
            </Link>
            <p className="text-sm text-gray-600">
              Empowering WhatsApp vendors to grow their business online
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
