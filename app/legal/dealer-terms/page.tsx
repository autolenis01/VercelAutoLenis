import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"

export default function DealerTermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-purple via-[#1a0f4d] to-black text-white py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-cyan/10 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dealer Terms & Conditions</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Partnership requirements and guidelines for AutoLenis dealers
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48h1440V0s-720 48-1440 0v48z" fill="oklch(var(--background))" fillOpacity="1" />
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl flex-grow">
        <Link href="/dealer-application" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dealer Application
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1>Dealer Terms & Conditions</h1>
          <p className="lead">Last updated: November 24, 2025</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By joining the AutoLenis dealer network, you agree to be bound by these Dealer Terms and Conditions. These
            terms govern your participation in the AutoLenis platform and your relationship with AutoLenis, Inc.
          </p>

          <h2>2. Dealer Qualifications</h2>
          <p>To participate as a dealer on the AutoLenis platform, you must:</p>
          <ul>
            <li>Hold a valid dealer license in your operating jurisdiction</li>
            <li>Maintain all required business insurance</li>
            <li>Comply with all applicable federal, state, and local laws</li>
            <li>Maintain a physical dealership location</li>
            <li>Provide accurate and up-to-date business information</li>
          </ul>

          <h2>3. Auction Participation</h2>
          <p>
            As a dealer on the AutoLenis platform, you agree to participate in auctions in good faith. When you submit
            an offer on a vehicle, you are committing to honor that offer if selected by the buyer.
          </p>

          <h3>3.1 Offer Requirements</h3>
          <ul>
            <li>All offers must be complete, accurate, and honor all disclosed terms</li>
            <li>Pricing must include all fees, taxes, and applicable charges</li>
            <li>Financing terms, if offered, must be available as presented</li>
            <li>Vehicles must be available for delivery as promised</li>
          </ul>

          <h2>4. Contract Shield Review</h2>
          <p>
            Contract Shield is a review assistant that compares uploaded documents to the buyer's accepted offer and
            reference data. It is designed to support your existing processes, not replace your own review or
            legal/compliance counsel.
          </p>
          <p>When using the platform, you agree to:</p>
          <ul>
            <li>Submit accurate and complete contract documentation</li>
            <li>Review and address any items flagged by Contract Shield</li>
            <li>Provide clarification or explanation for flagged items when appropriate</li>
            <li>Honor the pricing and terms presented in your winning offer</li>
          </ul>
          <p>
            <strong>Important:</strong> Contract Shield does not determine legal compliance. Final responsibility for
            the accuracy and legality of all documents remains with you and the buyer.
          </p>

          <h2>5. Fees and Payments</h2>
          <h3>5.1 Platform Fees</h3>
          <p>AutoLenis charges dealers the following fees:</p>
          <ul>
            <li>Auction participation: Free</li>
            <li>Transaction fee: 2.5% of vehicle sale price (minimum $299, maximum $799)</li>
            <li>Payment processing fees may apply</li>
          </ul>

          <h3>5.2 Payment Terms</h3>
          <p>
            Transaction fees are automatically deducted from the buyer's payment and remitted to AutoLenis. You will
            receive your net proceeds within 2-3 business days of completed delivery.
          </p>

          <h2>6. Dealer Integrity Score</h2>
          <p>
            AutoLenis maintains an integrity score for each dealer based on performance metrics including contract
            accuracy, delivery timeliness, customer satisfaction, and compliance with platform policies.
          </p>

          <p>Dealers with consistently low integrity scores may have their platform access restricted or terminated.</p>

          <h2>7. Prohibited Conduct</h2>
          <p>Dealers are prohibited from:</p>
          <ul>
            <li>Submitting false or misleading information</li>
            <li>Attempting to contact buyers outside the platform during the auction process</li>
            <li>Adding unauthorized fees to contracts</li>
            <li>Discriminating against buyers based on protected characteristics</li>
            <li>Engaging in any fraudulent or deceptive practices</li>
          </ul>

          <h2>8. Termination</h2>
          <p>
            AutoLenis reserves the right to suspend or terminate dealer access to the platform for violation of these
            terms, fraudulent activity, or conduct detrimental to the platform or its users.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            AutoLenis provides the platform "as is" and makes no warranties regarding uninterrupted access or guaranteed
            transaction volume. Our liability is limited to the fees paid by you in the 12 months preceding any claim.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            For questions about these terms, please contact us at:
            <br />
            <strong>Email:</strong> info@autolenis.com
            <br />
            <strong>Phone:</strong> (888) 555-1234
          </p>
        </article>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}
