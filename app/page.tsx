/**
 * Landing Page for WhatsApp Sales AI
 * Public-facing marketing page with African-inspired design
 */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  MessageCircle,
  Bot,
  BarChart3,
  Users,
  ShoppingCart,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Star,
  Check,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Smartphone,
  Clock,
  Headphones,
  Send,
  Wallet,
} from "lucide-react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      desc: "Connect your WhatsApp Business number and start selling in minutes. Full API integration for seamless messaging.",
      color: "text-whatsapp-green",
      bgColor: "bg-whatsapp-green/10",
    },
    {
      icon: Bot,
      title: "AI Sales Agent",
      desc: "24/7 AI-powered sales assistant that handles inquiries, answers FAQs, and converts leads automatically.",
      color: "text-africa-primary",
      bgColor: "bg-africa-primary/10",
    },
    {
      icon: ShoppingCart,
      title: "Smart Orders",
      desc: "Create, track, and manage orders directly from WhatsApp conversations with automated confirmations.",
      color: "text-africa-accent",
      bgColor: "bg-africa-accent/10",
    },
    {
      icon: Users,
      title: "Customer CRM",
      desc: "Build customer profiles, track interactions, and segment your audience for targeted campaigns.",
      color: "text-africa-secondary",
      bgColor: "bg-africa-secondary/10",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Real-time insights into sales performance, customer behavior, and conversion metrics.",
      color: "text-kente-red-DEFAULT",
      bgColor: "bg-kente-red/10",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      desc: "Enterprise-grade security with end-to-end encryption, GDPR compliance, and 99.9% uptime guarantee.",
      color: "text-kente-green-DEFAULT",
      bgColor: "bg-kente-green/10",
    },
  ]

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "1M+", label: "Messages Sent", icon: Send },
    { value: "98%", label: "Uptime", icon: Shield },
    { value: "15+", label: "Countries", icon: Globe },
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Connect WhatsApp",
      desc: "Link your WhatsApp Business number in minutes. Our guided setup walks you through the entire process.",
      icon: MessageCircle,
    },
    {
      step: 2,
      title: "Customize Your AI",
      desc: "Train your AI sales agent with your products, FAQs, and brand voice. It learns your business instantly.",
      icon: Bot,
    },
    {
      step: 3,
      title: "Start Selling",
      desc: "Your AI sales agent goes live 24/7, handling inquiries, processing orders, and closing deals automatically.",
      icon: TrendingUp,
    },
  ]

  const pricing = [
    {
      name: "Free",
      price: "₦0",
      period: "forever",
      desc: "Perfect for testing the waters",
      features: [
        "Up to 50 conversations/month",
        "Basic AI responses",
        "1 product catalog",
        "Email support",
        "7-day message history",
      ],
      cta: "Get Started",
      popular: false,
      color: "from-gray-500 to-gray-600",
    },
    {
      name: "Basic",
      price: "₦15,000",
      period: "/month",
      desc: "For growing businesses",
      features: [
        "Up to 500 conversations/month",
        "Advanced AI responses",
        "Unlimited products",
        "Order management",
        "30-day message history",
        "WhatsApp analytics",
        "Email & chat support",
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "from-africa-primary to-africa-secondary",
    },
    {
      name: "Pro",
      price: "₦45,000",
      period: "/month",
      desc: "For serious sellers",
      features: [
        "Unlimited conversations",
        "Premium AI with custom training",
        "CRM with customer profiles",
        "Advanced analytics & reports",
        "90-day message history",
        "Multiple agents",
        "API access",
        "Priority support",
        "Custom integrations",
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-africa-accent to-africa-primary",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated AI model",
        "Custom development",
        "SLA guarantee",
        "Unlimited history",
        "Dedicated account manager",
        "On-premise deployment",
        "White-label option",
        "24/7 phone support",
        "Team training",
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-kente-red to-kente-gold",
    },
  ]

  const testimonials = [
    {
      name: "Amara Okafor",
      role: "CEO, Trendy Lagos Boutique",
      img: "/testimonials/amara.jpg",
      content:
        "Chapia transformed how we sell. Our customers love the instant responses on WhatsApp, and we've seen a 40% increase in sales since we started.",
      rating: 5,
    },
    {
      name: "Kwame Mensah",
      role: "Owner, Accra Fresh Foods",
      img: "/testimonials/kwame.jpg",
      content:
        "The AI sales agent handles customer inquiries even while I'm sleeping. It's like having an extra employee working 24/7 without the salary.",
      rating: 5,
    },
    {
      name: "Fatima Adeleke",
      role: "Marketing Director, Naija Mart",
      img: "/testimonials/fatima.jpg",
      content:
        "The analytics alone are worth it. We now understand our customers better and can target our promotions more effectively.",
      rating: 5,
    },
  ]

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-africa-cream/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg shadow-lg shadow-africa-primary/5"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-9 h-9 lg:w-10 lg:h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-africa-primary to-africa-accent rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-africa-secondary to-africa-primary rounded-xl group-hover:-rotate-3 transition-transform duration-300 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-africa-primary via-africa-secondary to-africa-accent bg-clip-text text-transparent">
                Chapia
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-africa-primary dark:hover:text-africa-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-africa-primary to-africa-secondary hover:from-africa-secondary hover:to-africa-primary text-white shadow-lg shadow-africa-primary/25 hover:shadow-xl hover:shadow-africa-primary/30 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-africa-primary dark:hover:text-africa-accent hover:bg-africa-primary/5 dark:hover:bg-africa-accent/10 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-africa-primary to-africa-secondary text-white">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-africa-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-africa-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-africa-secondary/20 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-africa-accent/20 rounded-full" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-africa-primary/20 rounded-full" />
          <div className="absolute top-20 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-africa-primary/10 to-transparent" />
          <div className="absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-africa-secondary/10 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-africa-primary/10 dark:bg-africa-primary/20 border border-africa-primary/20 text-sm text-africa-primary dark:text-africa-accent font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered WhatsApp Sales
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">Sell More on</span>
                <br />
                <span className="bg-gradient-to-r from-africa-primary via-africa-secondary to-africa-accent bg-clip-text text-transparent">
                  WhatsApp Automatically
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Your AI sales agent works 24/7 on WhatsApp — answering questions, 
                processing orders, and closing deals. Built for African businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-africa-primary to-africa-secondary hover:from-africa-secondary hover:to-africa-primary text-white text-base px-8 py-6 shadow-xl shadow-africa-primary/25 hover:shadow-2xl hover:shadow-africa-primary/30 transition-all duration-300 group"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base px-8 py-6 border-2 border-gray-300 dark:border-gray-600 hover:border-africa-primary dark:hover:border-africa-accent transition-all duration-300"
                  >
                    See How It Works
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-africa-primary/80 to-africa-secondary/80 flex items-center justify-center text-xs text-white font-bold shadow-md"
                    >
                      {["AO", "KM", "FA", "TO"][i - 1]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">2,000+</span> businesses joined
                </div>
              </div>
            </div>

            {/* Right - WhatsApp Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-[320px] sm:w-[360px]">
                {/* Phone frame */}
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-africa-primary/10 border-4 border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Phone header */}
                  <div className="bg-gradient-to-r from-africa-primary to-africa-secondary p-4 flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 text-center">
                      <span className="text-white text-sm font-semibold">Chapia Sales AI</span>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-[400px]">
                    {/* Incoming message */}
                    <div className="flex items-start space-x-2 animate-in slide-in-from-left-3 fade-in duration-500">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-africa-primary to-africa-accent flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm max-w-[80%]">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          Hello! 👋 I'm your AI sales assistant. How can I help you today?
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">10:30 AM</span>
                      </div>
                    </div>

                    {/* Outgoing message */}
                    <div className="flex items-start justify-end space-x-2 space-x-reverse animate-in slide-in-from-right-3 fade-in duration-500 delay-300">
                      <div className="bg-africa-primary/10 dark:bg-africa-primary/20 rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm max-w-[80%]">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          Hi! I'd like to order the Ankara print dress, size M. Do you have it in stock?
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block text-right">10:31 AM</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>

                    {/* Incoming response */}
                    <div className="flex items-start space-x-2 animate-in slide-in-from-left-3 fade-in duration-500 delay-700">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-africa-primary to-africa-accent flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm max-w-[80%]">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          Yes, we have it in stock! 🎉 The Ankara print dress, size M is ₦25,000. 
                          Would you like to place the order? I can also recommend matching accessories.
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">10:31 AM</span>
                      </div>
                    </div>

                    {/* Quick reply buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 animate-in slide-in-from-bottom-3 fade-in duration-500 delay-1000">
                      <span className="px-3 py-1.5 text-xs font-medium bg-africa-primary/10 text-africa-primary dark:bg-africa-primary/20 dark:text-africa-accent rounded-full border border-africa-primary/20 cursor-pointer hover:bg-africa-primary/20 transition-colors">
                        Yes, order now 🛍️
                      </span>
                      <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Show accessories
                      </span>
                      <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Talk to human
                      </span>
                    </div>
                  </div>

                  {/* Phone input bar */}
                  <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm text-gray-400">
                      Type a message...
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-africa-primary to-africa-secondary flex items-center justify-center">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-kente-gold to-africa-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float">
                  AI Powered
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 flex items-center space-x-2 border border-gray-100 dark:border-gray-700">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 text-kente-gold fill-kente-gold" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-africa-primary/5 via-africa-secondary/5 to-africa-accent/5 dark:from-africa-primary/10 dark:via-africa-secondary/10 dark:to-africa-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-lg shadow-africa-primary/5 mb-3">
                  <stat.icon className="w-6 h-6 text-africa-primary dark:text-africa-accent" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <Badge className="mb-4 px-4 py-1.5 bg-africa-primary/10 text-africa-primary dark:bg-africa-primary/20 dark:text-africa-accent border-0 text-sm font-medium">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to sell on{" "}
              <span className="bg-gradient-to-r from-africa-primary to-africa-secondary bg-clip-text text-transparent">
                WhatsApp
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              From AI-powered conversations to analytics, we provide all the tools to grow your business.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-africa-primary/20 dark:hover:border-africa-accent/20 shadow-lg shadow-africa-primary/5 hover:shadow-xl hover:shadow-africa-primary/10 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-africa-cream/30 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <Badge className="mb-4 px-4 py-1.5 bg-africa-secondary/10 text-africa-secondary dark:bg-africa-secondary/20 border-0 text-sm font-medium">
              <Smartphone className="w-3.5 h-3.5 mr-1.5" />
              Simple Setup
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Get started in{" "}
              <span className="bg-gradient-to-r from-africa-secondary to-africa-accent bg-clip-text text-transparent">
                3 simple steps
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              You'll be up and running in minutes. No technical skills required.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative text-center group">
                {/* Step number */}
                <div className="relative inline-flex mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-africa-primary/20 to-africa-secondary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-africa-primary/10 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                    <step.icon className="w-9 h-9 text-africa-primary dark:text-africa-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-africa-primary to-africa-secondary text-white text-sm font-bold flex items-center justify-center shadow-lg">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <Badge className="mb-4 px-4 py-1.5 bg-africa-accent/10 text-africa-accent dark:bg-africa-accent/20 border-0 text-sm font-medium">
              <Wallet className="w-3.5 h-3.5 mr-1.5" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Plans that fit your{" "}
              <span className="bg-gradient-to-r from-africa-accent to-africa-primary bg-clip-text text-transparent">
                business
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {pricing.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col p-6 lg:p-8 rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-white dark:bg-gray-800 border-2 border-africa-primary/30 dark:border-africa-accent/30 shadow-2xl shadow-africa-primary/10 scale-105 lg:scale-110"
                    : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl hover:border-africa-primary/20 dark:hover:border-africa-accent/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-africa-primary to-africa-secondary text-white border-0 px-4 py-1 text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-africa-primary dark:text-africa-accent" : "text-gray-400"
                      }`} />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-africa-primary to-africa-secondary hover:from-africa-secondary hover:to-africa-primary text-white shadow-lg shadow-africa-primary/25"
                      : plan.name === "Enterprise"
                      ? "bg-gradient-to-r from-kente-red to-kente-gold text-white hover:opacity-90"
                      : plan.name === "Free"
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-b from-africa-cream/30 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <Badge className="mb-4 px-4 py-1.5 bg-kente-gold/10 text-kente-gold dark:bg-kente-gold/20 border-0 text-sm font-medium">
              <Star className="w-3.5 h-3.5 mr-1.5 fill-kente-gold" />
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by businesses across{" "}
              <span className="bg-gradient-to-r from-kente-gold to-africa-accent bg-clip-text text-transparent">
                Africa
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See what our customers have to say about Chapia.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg shadow-africa-primary/5 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-kente-gold fill-kente-gold" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-africa-primary to-africa-secondary flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-africa-primary/10 via-africa-secondary/10 to-africa-accent/10 dark:from-africa-primary/20 dark:via-africa-secondary/20 dark:to-africa-accent/20" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-africa-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-africa-accent/30 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="space-y-8">
            <Badge className="px-4 py-1.5 bg-white dark:bg-gray-800 text-africa-primary dark:text-africa-accent border border-africa-primary/20 dark:border-africa-accent/20 text-sm font-medium shadow-lg">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Start Your Journey
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Ready to transform your{" "}
              <span className="bg-gradient-to-r from-africa-primary via-africa-secondary to-africa-accent bg-clip-text text-transparent">
                WhatsApp sales
              </span>
              ?
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of African businesses already using Chapia to automate their sales.
              Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-africa-primary to-africa-secondary hover:from-africa-secondary hover:to-africa-primary text-white text-base px-10 py-6 shadow-xl shadow-africa-primary/25 hover:shadow-2xl hover:shadow-africa-primary/30 transition-all duration-300 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base px-10 py-6 border-2"
                >
                  Sign In Free
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500">
              No credit card required &bull; Free forever plan &bull; Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 bg-gradient-to-br from-africa-primary to-africa-accent rounded-xl rotate-6" />
                  <div className="absolute inset-0 bg-gradient-to-br from-africa-secondary to-africa-primary rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold text-white">Chapia</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                AI-powered WhatsApp sales automation for African businesses. 
                Sell more, work less.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "Instagram", "YouTube"].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-africa-primary/20 flex items-center justify-center text-gray-400 hover:text-africa-accent transition-all"
                  >
                    <span className="text-xs font-bold">{social[0]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                {["Features", "Pricing", "Integrations", "API", "Changelog"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                {["About", "Blog", "Careers", "Press", "Partners"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-4">
                {["Help Center", "Documentation", "Contact Sales", "Status", "Community"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Chapia. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

