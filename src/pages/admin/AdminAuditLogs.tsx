import React, { useState } from 'react';
import { History, Shield, Search } from 'lucide-react';
import { getAuditLogs } from '../../services/db';
import { AuditLog } from '../../types';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(getAuditLogs());
  const [search, setSearch] = useState('');

  const filtered = logs.filter((log) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        log.adminName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Administrative Audit Trail</h2>
        <p className="text-xs text-slate-400">Tamper-evident system logs tracking all product, price, inventory, and status mutations</p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0c0f17] border border-white/[0.08]">
        <input
          type="text"
          placeholder="Filter audit logs by admin, action, entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
        />
      </div>

      <div className="rounded-2xl bg-[#0c0f17] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#090b12] text-slate-400 text-[11px]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin / Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity Target</th>
                <th className="p-4">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="p-4">
                    <p className="text-slate-200 font-bold">{log.adminName}</p>
                    <p className="text-[10px] text-amber-400 uppercase">{log.adminRole}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-900 border border-cyan-800 text-cyan-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    {log.entity} <span className="text-slate-500">({log.entityId})</span>
                  </td>
                  <td className="p-4 text-slate-300 text-xs font-sans max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
