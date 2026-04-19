import React from 'react';

const AdminSupport = () => {
  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Contact & Support</h2>
      <p style={{ color: '#64748b' }}>Manage incoming customer support tickets, contact requests, and inquiries.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <p><strong>Open Support Tickets:</strong> 8</p>
        <p><strong>Avg Response Time:</strong> 2h 15m</p>
        <p><strong>Unread Messages:</strong> 14</p>
      </div>
    </div>
  );
};

export default AdminSupport;
