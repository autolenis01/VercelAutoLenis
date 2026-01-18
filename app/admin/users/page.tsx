"use client"

import { useState } from "react"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with real API call
  const users = [
    { id: "1", name: "John Smith", email: "john@example.com", role: "BUYER", verified: true, createdAt: "2025-01-10" },
    {
      id: "2",
      name: "ABC Motors",
      email: "contact@abcmotors.com",
      role: "DEALER",
      verified: true,
      createdAt: "2025-01-08",
    },
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "BUYER",
      verified: false,
      createdAt: "2025-01-15",
    },
    { id: "4", name: "XYZ Auto", email: "info@xyzauto.com", role: "DEALER", verified: false, createdAt: "2025-01-12" },
  ]

  const roleColors: Record<string, string> = {
    BUYER: "bg-blue-100 text-blue-800",
    DEALER: "bg-purple-100 text-purple-800",
    ADMIN: "bg-red-100 text-red-800",
    AFFILIATE: "bg-green-100 text-green-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.verified ? (
                    <span className="text-green-600 text-sm">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600 text-sm">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {!user.verified && <button className="text-green-600 hover:text-green-800">Verify</button>}
                  <button className="text-brand-purple hover:text-brand-purple/80">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
