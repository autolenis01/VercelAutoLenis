"use client"

export default function AdminCompliancePage() {
  // Mock compliance events
  const events = [
    {
      id: "1",
      type: "SOFT_CREDIT_PULL",
      userId: "U123",
      userName: "John Smith",
      details: "Soft credit check performed",
      timestamp: "2025-01-15 14:32:10",
      severity: "INFO",
    },
    {
      id: "2",
      type: "FEE_FINANCING_DISCLOSURE",
      userId: "U124",
      userName: "Sarah Johnson",
      details: "User agreed to loan inclusion disclosure",
      timestamp: "2025-01-15 13:15:45",
      severity: "INFO",
    },
    {
      id: "3",
      type: "CONTRACT_SHIELD_FAIL",
      userId: "D45",
      userName: "ABC Motors",
      details: "APR mismatch detected: Expected 4.9%, Found 5.2%",
      timestamp: "2025-01-15 12:05:22",
      severity: "WARNING",
    },
    {
      id: "4",
      type: "SUSPICIOUS_ACTIVITY",
      userId: "U125",
      userName: "Mike Davis",
      details: "Multiple failed login attempts",
      timestamp: "2025-01-15 11:30:00",
      severity: "CRITICAL",
    },
  ]

  const severityColors: Record<string, string> = {
    INFO: "bg-blue-100 text-blue-800",
    WARNING: "bg-yellow-100 text-yellow-800",
    CRITICAL: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Compliance Logs</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Events Today</p>
          <p className="text-3xl font-bold text-gray-900">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Critical Alerts</p>
          <p className="text-3xl font-bold text-red-600">{events.filter((e) => e.severity === "CRITICAL").length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Warnings</p>
          <p className="text-3xl font-bold text-yellow-600">{events.filter((e) => e.severity === "WARNING").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.userName} ({event.userId})
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{event.details}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[event.severity]}`}>
                    {event.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
