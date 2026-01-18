import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refinance Your Auto Loan | AutoLenis",
  description:
    "Lower your monthly car payment and save money with auto refinancing. Get matched with trusted lending partners in minutes—no credit score impact.",
}

export default function RefinanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
