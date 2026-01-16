import Link from "next/link"
import { Shield } from "lucide-react"

export function AuthFooter() {
  return (
    <footer className="bg-[#3d2066] border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} AutoLenis. All rights reserved.</p>

          {/* Center: Quick Links */}
          <div className="flex items-center gap-6">
            <Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/legal/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-sm text-white/60 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">
              Pricing
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/admin/sign-in"
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
