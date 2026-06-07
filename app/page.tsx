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

      {/* CTA Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of vendors already growing their business with
            Vendorly
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            Create Free Store
          </Link>
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
