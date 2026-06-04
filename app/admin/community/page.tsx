import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Phone, Mail } from "lucide-react";

export const metadata: Metadata = { title: "Community Applications" };

export default async function CommunityPage() {
  const applications = await prisma.communityApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">Community Applications</h1>
        <p className="text-gray-500 mt-1">{applications.length} total applications</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Email", "Phone", "Message", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{app.name}</td>
                  <td className="px-5 py-4">
                    <a href={`mailto:${app.email}`} className="flex items-center gap-1 text-brand-600 hover:underline">
                      <Mail size={12} /> {app.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {app.phone ? (
                      <a href={`tel:${app.phone}`} className="flex items-center gap-1 hover:text-brand-600">
                        <Phone size={12} /> {app.phone}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 max-w-[250px]">
                    <span className="line-clamp-2 text-xs">{app.message || "—"}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(app.createdAt)}</td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No applications yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
