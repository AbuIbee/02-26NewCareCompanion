import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AuditLog {
  id: string;
  created_at: string;
  action: string;
  details: string;
  ip_address: string;
  user?: { email: string };
}

export function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // ... rest of your component

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    // You'll need an audit_logs table for this
    const { data } = await supabase
      .from('audit_logs')
      .select('*, user:user_id(email)')
      .order('created_at', { ascending: false })
      .limit(100);

    setLogs(data || []);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>System Audit Log</h2>
      <p>Last 100 actions across all users</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.user?.email}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{log.ip_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}