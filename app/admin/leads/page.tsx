"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";
import { Phone, Mail, RefreshCw } from "lucide-react";

type Lead = {
  id: string; name: string; phone: string; email?: string | null;
  message?: string | null; source: string; status: string; createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  CLOSED: "bg-green-100 text-green-700",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState({ source: "", status: "" });
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (filter.source) params.set("source", filter.source);
    if (filter.status) params.set("status", filter.status);
    const res = await fetch(`/api/admin/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads);
    setTotal(data.total);
    setPages(data.pages);
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">{total} total leads</p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-2">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-4">
        <select
          value={filter.source}
          onChange={(e) => { setFilter(f => ({ ...f, source: e.target.value })); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option value="">All Sources</option>
          <option value="HOME_DISCOVERY">Home Discovery</option>
          <option value="HOME_CALLBACK">Home Callback</option>
          <option value="CONTACT">Contact Form</option>
          <option value="INFLUENCER">Influencer</option>
        </select>
        <select
          value={filter.status}
          onChange={(e) => { setFilter(f => ({ ...f, status: e.target.value })); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Contact", "Message", "Source", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-5 py-4">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-brand-600 hover:underline mb-1">
                      <Phone size={12} /> {lead.phone}
                    </a>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-gray-500 hover:underline text-xs">
                        <Mail size={12} /> {lead.email}
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-500 max-w-[200px]">
                    <span className="line-clamp-2 text-xs">{lead.message || "—"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      {lead.source.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(lead.createdAt)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-200"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                Previous
              </button>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
