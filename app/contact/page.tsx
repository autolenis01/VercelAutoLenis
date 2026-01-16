"use client"

import type React from "react"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2, Loader2, Building2 } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    marketingConsent: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!formData.subject) {
      setError("Please select a subject")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get("content-type")
      let data
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(text || "Server error")
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message")
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ backgroundColor: "#2D1B69" }}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
              <Building2 className="w-4 h-4 text-[#7ED321]" />
              <span className="text-sm text-white/90">Contact AutoLenis</span>
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                Get in{" "}
                <span
                  style={{
                    background: "linear-gradient(to right, #7ED321, #00D9FF, #0066FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Touch
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-white/80 text-balance max-w-xl mx-auto">
              Questions about our process, privacy, or partnerships? Our team is here to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{
                  background: "linear-gradient(to right, #7ED321, #00D9FF)",
                  color: "#2D1B69",
                }}
              >
                How It Works
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll respond within one business day.
                  </p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We'll respond within one business day.
                      </p>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false)
                          setFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            subject: "",
                            message: "",
                            marketingConsent: false,
                          })
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                            <SelectItem value="Application Process">Application Process</SelectItem>
                            <SelectItem value="Privacy & Data">Privacy & Data Questions</SelectItem>
                            <SelectItem value="Partner Program">Partner Program</SelectItem>
                            <SelectItem value="Dealer Partnership">Dealer Partnership</SelectItem>
                            <SelectItem value="Technical Support">Technical Support</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          rows={6}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="marketingConsent"
                          checked={formData.marketingConsent}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, marketingConsent: checked as boolean })
                          }
                          className="mt-1"
                        />
                        <Label
                          htmlFor="marketingConsent"
                          className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                        >
                          I agree to receive marketing communications from AutoLenis. I can unsubscribe at any time.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full font-semibold text-black"
                        style={{ background: "linear-gradient(to right, #7ED321, #00D9FF)" }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card
                className="border-2 text-white"
                style={{ background: "linear-gradient(to bottom right, #2D1B69, #1E0F42)" }}
              >
                <CardContent className="pt-8">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5" style={{ color: "#00D9FF" }} />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Email</div>
                        <a
                          href="mailto:info@autolenis.com"
                          className="text-gray-300 hover:text-white transition-colors"
                        >
                          info@autolenis.com
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5" style={{ color: "#7ED321" }} />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Phone</div>
                        <a href="tel:+19726001236" className="text-gray-300 hover:text-white transition-colors">
                          (972) 600-1236
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5" style={{ color: "#0066FF" }} />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Address</div>
                        <p className="text-gray-300">
                          5830 Granite Parkway, Ste 100
                          <br />
                          Plano, TX 75024
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5" style={{ color: "#7ED321" }} />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Hours</div>
                        <p className="text-gray-300">
                          Monday - Friday: 9am - 6pm CST
                          <br />
                          Saturday: 10am - 4pm CST
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-2"
                style={{
                  background: "linear-gradient(to bottom right, rgba(126, 211, 33, 0.1), rgba(126, 211, 33, 0.05))",
                }}
              >
                <CardContent className="pt-8">
                  <h3 className="text-lg font-bold mb-3">Quick Links</h3>
                  <div className="space-y-3">
                    <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                      About AutoLenis →
                    </Link>
                    <Link
                      href="/how-it-works"
                      className="block text-muted-foreground hover:text-primary transition-colors"
                    >
                      How It Works →
                    </Link>
                    <Link
                      href="/affiliate"
                      className="block text-muted-foreground hover:text-primary transition-colors"
                    >
                      Partner Program →
                    </Link>
                    <Link
                      href="/dealer-application"
                      className="block text-muted-foreground hover:text-primary transition-colors"
                    >
                      Become a Dealer →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: "#2D1B69" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-white/80">
              Learn more about how AutoLenis can help you navigate your next vehicle purchase.
            </p>
            <Link
              href="/buyer/onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(to right, #7ED321, #00D9FF)",
                color: "#2D1B69",
              }}
            >
              Start Your Application
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
