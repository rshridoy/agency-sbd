import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Users, FileText, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [newLeads, totalPosts, totalCommunity, recentLeads] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.post.count(),
    prisma.communityApplication.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const stats = [
    { label: "New Leads", value: newLeads, icon: AlertCircle, href: "/admin/leads", color: "text-amber-600 bg-amber-50" },
    { label: "Blog Posts", value: totalPosts, icon: FileText, href: "/admin/posts", color: "text-blue-600 bg-blue-50" },
    { label: "Community Apps", value: totalCommunity, icon: MessageSquare, href: "/admin/community", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-brand-600 text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <a href={`tel:${lead.phone}`} className="hover:text-brand-600">{lead.phone}</a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      {lead.source.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      lead.status === "NEW" ? "bg-amber-100 text-amber-700" :
                      lead.status === "CONTACTED" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No leads yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
