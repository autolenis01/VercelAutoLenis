"use client"

export default function AdminAffiliatesPage() {
  // Mock data - replace with real API call
  const affiliates = [
    {
      id: "1",
      name: "Mike Wilson",
      email: "mike@example.com",
      level1: 12,
      level2: 8,
      level3: 5,
      level4: 2,
      level5: 1,
      totalEarnings: 4250,
      pendingPayout: 850,
    },
    {
      id: "2",
      name: "Lisa Brown",
      email: "lisa@example.com",
      level1: 25,
      level2: 15,
      level3: 10,
      level4: 5,
      level5: 3,
      totalEarnings: 8900,
      pendingPayout: 1200,
    },
    {
      id: "3",
      name: "Tom Davis",
      email: "tom@example.com",
      level1: 8,
      level2: 4,
      level3: 2,
      level4: 1,
      level5: 0,
      totalEarnings: 2100,
      pendingPayout: 450,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Affiliate Management</h1>
        <button className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/90">
          Process All Payouts
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Affiliates</p>
          <p className="text-3xl font-bold text-gray-900">{affiliates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Earnings Paid</p>
          <p className="text-3xl font-bold text-gray-900">
            ${affiliates.reduce((sum, a) => sum + a.totalEarnings, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Pending Payouts</p>
          <p className="text-3xl font-bold text-gray-900">
            ${affiliates.reduce((sum, a) => sum + a.pendingPayout, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affiliate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L2</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L4</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L5</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Earned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                    <div className="text-sm text-gray-500">{affiliate.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.level1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.level2}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.level3}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.level4}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affiliate.level5}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${affiliate.totalEarnings.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  ${affiliate.pendingPayout.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-green-600 hover:text-green-800">Pay Out</button>
                  <button className="text-brand-purple hover:text-brand-purple/80">View Tree</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
