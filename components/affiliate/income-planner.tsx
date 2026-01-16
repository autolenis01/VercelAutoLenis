"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Calculator, DollarSign, Users } from "lucide-react"

const COMMISSION_RATES = [0.15, 0.03, 0.02]
const LEVEL_NAMES = ["Direct Referral", "2nd Origin", "3rd Origin"]
const LEVEL_COLORS = ["#7ED321", "#00D9FF", "#0066FF"]

// Income distribution for realistic defaults
const INCOME_DISTRIBUTION = [0.75, 0.15, 0.1]

export default function AffiliateIncomePlanner() {
  const [selectedPackage, setSelectedPackage] = useState(750)
  const [calculatorTab, setCalculatorTab] = useState("estimate")

  // Calculate default sales to achieve ~$2,500 with proper distribution
  const getDefaultSales = (pkg: number) => {
    const targetIncome = 2500
    const sales: number[] = []
    for (let i = 0; i < 3; i++) {
      const levelIncome = targetIncome * INCOME_DISTRIBUTION[i]
      const commissionPerSale = pkg * COMMISSION_RATES[i]
      sales.push(Math.round(levelIncome / commissionPerSale))
    }
    return sales
  }

  const [salesByLevel, setSalesByLevel] = useState(getDefaultSales(750))
  const [goalIncome, setGoalIncome] = useState(5000)

  // Calculate total income
  const calculateIncome = () => {
    return salesByLevel.reduce((total, sales, index) => {
      return total + sales * selectedPackage * COMMISSION_RATES[index]
    }, 0)
  }

  // Calculate sales needed for goal using the distribution formula
  const calculateSalesForGoal = () => {
    const sales: number[] = []
    for (let i = 0; i < 3; i++) {
      const levelIncome = goalIncome * INCOME_DISTRIBUTION[i]
      const commissionPerSale = selectedPackage * COMMISSION_RATES[i]
      sales.push(Math.ceil(levelIncome / commissionPerSale))
    }
    return sales
  }

  const totalIncome = calculateIncome()
  const salesForGoal = calculateSalesForGoal()

  return (
    <Card className="border-2 border-[#3d2066]/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#7ED321]/20 to-[#00D9FF]/20">
            <Calculator className="h-6 w-6 text-[#3d2066]" />
          </div>
          <div>
            <CardTitle className="text-2xl">Income Calculator</CardTitle>
            <CardDescription>
              Estimate your potential earnings or calculate what it takes to hit your income goal
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Package Selector */}
        <div className="flex items-center justify-between pb-4 border-b">
          <span className="font-semibold text-[#3d2066]">Package Price:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedPackage(499)
                setSalesByLevel(getDefaultSales(499))
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPackage === 499 ? "bg-[#3d2066] text-white" : "bg-[#f5f5f5] text-[#3d2066] hover:bg-[#e5e5e5]"
              }`}
            >
              $499
            </button>
            <button
              onClick={() => {
                setSelectedPackage(750)
                setSalesByLevel(getDefaultSales(750))
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPackage === 750 ? "bg-[#3d2066] text-white" : "bg-[#f5f5f5] text-[#3d2066] hover:bg-[#e5e5e5]"
              }`}
            >
              $750
            </button>
          </div>
        </div>

        <Tabs value={calculatorTab} onValueChange={setCalculatorTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="estimate" className="text-base">
              Estimate My Income
            </TabsTrigger>
            <TabsTrigger value="goal" className="text-base">
              Hit My Income Goal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estimate">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-semibold text-[#3d2066] text-lg">Adjust Car Sales by Origin</h3>
                {salesByLevel.map((sales, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: LEVEL_COLORS[index] }}>
                        {LEVEL_NAMES[index]} ({(COMMISSION_RATES[index] * 100).toFixed(0)}%)
                      </span>
                      <span className="text-sm text-[#666]">
                        {sales} sales = ${(sales * selectedPackage * COMMISSION_RATES[index]).toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[sales]}
                      onValueChange={(value) => {
                        const newSales = [...salesByLevel]
                        newSales[index] = value[0]
                        setSalesByLevel(newSales)
                      }}
                      max={index === 0 ? 50 : 100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#3d2066] text-lg">Your Income Breakdown</h3>
                <div className="space-y-3">
                  {salesByLevel.map((sales, index) => {
                    const earnings = sales * selectedPackage * COMMISSION_RATES[index]
                    const percentage = totalIncome > 0 ? (earnings / totalIncome) * 100 : 0
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: LEVEL_COLORS[index] + "10" }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium" style={{ color: LEVEL_COLORS[index] }}>
                            {LEVEL_NAMES[index]}
                          </span>
                          <span className="font-bold" style={{ color: LEVEL_COLORS[index] }}>
                            ${earnings.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${percentage}%`, backgroundColor: LEVEL_COLORS[index] }}
                          />
                        </div>
                        <div className="text-xs text-[#666] mt-1">{percentage.toFixed(1)}% of total</div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#666]">Estimated Monthly Income</span>
                    <span className="text-3xl font-bold text-[#3d2066]">${totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-[#999] text-right">${(totalIncome * 12).toLocaleString()} per year</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goal">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Target Monthly Income</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666]" />
                  <Input
                    type="number"
                    value={goalIncome}
                    onChange={(e) => setGoalIncome(Math.max(0, Number.parseInt(e.target.value) || 0))}
                    className="pl-10 text-lg font-semibold"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-[#3d2066]/5 to-[#7ED321]/5 border-2 border-[#3d2066]/20">
                <h3 className="text-lg font-semibold mb-4">
                  To earn <span className="text-[#7ED321]">${goalIncome.toLocaleString()}/month</span>, you need:
                </h3>

                <div className="space-y-4">
                  {salesForGoal.map((sales, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border-2"
                      style={{ borderColor: LEVEL_COLORS[index] + "40" }}
                    >
                      <div>
                        <div className="font-semibold" style={{ color: LEVEL_COLORS[index] }}>
                          {LEVEL_NAMES[index]}
                        </div>
                        <div className="text-xs text-[#666]">
                          ${(selectedPackage * COMMISSION_RATES[index]).toFixed(2)} per sale
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: LEVEL_COLORS[index] }}>
                          {sales}
                        </div>
                        <div className="text-xs text-[#666]">sales/month</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-[#7ED321]/10 rounded-lg border border-[#7ED321]/20">
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-[#7ED321] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[#666]">
                      <span className="font-medium text-[#3d2066]">Note:</span> This calculation uses a realistic
                      distribution where 75% of income comes from direct referrals, 15% from 2nd origin, and 10% from
                      3rd origin. Your actual results will vary based on your network growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
