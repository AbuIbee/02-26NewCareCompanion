import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AuditLog {
  id: string;
  created_at: string;
  action: string;
  details: any;
  ip_address: string;
  profiles?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles!left(
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplay = (log: AuditLog) => {
    if (!log.profiles) return 'System';
    return `${log.profiles.first_name} ${log.profiles.last_name} (${log.profiles.email})`;
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">System Audit Log</h2>
        <p className="text-medium-gray">Last 100 actions across all users</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 overflow-x-auto">
        {logs.length === 0 ? (
          <p className="text-center text-medium-gray py-8">No audit logs found</p>
        ) : (
          <table className="w-full">
            <thead className="bg-soft-taupe/20">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Details</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-taupe/30">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-soft-taupe/10">
                  <td className="px-4 py-3 text-medium-gray text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-charcoal text-sm">
                    {getUserDisplay(log)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-warm-bronze/10 text-warm-bronze rounded-full text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-medium-gray text-sm">
                    {typeof log.details === 'object' 
                      ? JSON.stringify(log.details) 
                      : log.details}
                  </td>
                  <td className="px-4 py-3 text-medium-gray text-sm font-mono">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}