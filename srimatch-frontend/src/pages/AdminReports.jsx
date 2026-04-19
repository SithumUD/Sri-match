import React, { useState } from 'react';

// Dummy data representing reported user profiles
const initialDummyReports = [
  { id: 401, reportedEmail: 'fake.user@example.com', reporterEmail: 'sithum@example.com', reason: 'Fake Profile / Scammer', description: 'They asked me for money immediately after matching.', status: 'PENDING', createdAt: '2026-04-19' },
  { id: 402, reportedEmail: 'kasun@example.com', reporterEmail: 'amali.p@example.com', reason: 'Inappropriate Behavior', description: 'Sent offensive messages in chat.', status: 'PENDING', createdAt: '2026-04-18' },
  { id: 403, reportedEmail: 'nimal@admin.com', reporterEmail: 'kasun@example.com', reason: 'Underage / Invalid Info', description: 'Their bio says they are 16.', status: 'DISMISSED', createdAt: '2026-04-10' },
  { id: 404, reportedEmail: 'spammer123@example.com', reporterEmail: 'sithum@example.com', reason: 'Spam or Advertising', description: 'Trying to sell crypto', status: 'RESOLVED', createdAt: '2026-04-12' },
];

const AdminReports = () => {
  const [reports, setReports] = useState(initialDummyReports);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'ALL', 'PENDING', 'RESOLVED', 'DISMISSED'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [reviewingReport, setReviewingReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Filtering Logic
  const filteredReports = reports.filter((report) => {
    const matchesTab = activeTab === 'ALL' || report.status === activeTab;
    const matchesSearch = report.reportedEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.reporterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleActionSubmit = (actionType) => {
    if (!reviewingReport) return;
    
    // Simulate updating state depending on action
    let newStatus = 'PENDING';
    if (actionType === 'DISMISS') newStatus = 'DISMISSED';
    if (actionType === 'RESOLVE' || actionType === 'LOCK_USER') newStatus = 'RESOLVED';

    setReports(reports.map(r => 
      r.id === reviewingReport.id ? { ...r, status: newStatus } : r
    ));
    
    const message = actionType === 'LOCK_USER' 
      ? 'Simulated: Offending user account has been LOCKED and report marked as resolved.'
      : `Simulated: Report successfully mapped to ${newStatus}.`;

    setReviewingReport(null);
    setAdminNotes('');
    alert(message);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'RESOLVED': return { bg: '#dcfce7', text: '#166534', label: 'Resolved' };
      case 'DISMISSED': return { bg: '#f3f4f6', text: '#4b5563', label: 'Dismissed' };
      default: return { bg: '#fee2e2', text: '#991b1b', label: 'Needs Review' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>Moderation Queue</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
            Review user reports, enforce community guidelines, and moderate flagged profiles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 24px', borderRadius: '12px', textAlign: 'right' }}>
            <span style={{ color: '#991b1b', fontSize: '13px', display: 'block', fontWeight: '500' }}>Unresolved Reports</span>
            <span style={{ color: '#7f1d1d', fontSize: '20px', fontWeight: '700' }}>
              {reports.filter(r => r.status === 'PENDING').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          {['ALL', 'PENDING', 'RESOLVED', 'DISMISSED'].map(tab => (
            <button key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#0f172a' : '#64748b',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}>
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        
        <input 
          type="text" 
          placeholder="Search by email or reason..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '280px', outline: 'none' }}
        />
      </div>

      {/* Data Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Reported User</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Reason</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Reported By</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? filteredReports.map((report, idx) => {
              const badge = getStatusBadge(report.status);
              return (
                <tr key={report.id} style={{ borderBottom: idx !== filteredReports.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'block', color: '#1e293b', fontWeight: '600', fontSize: '14px' }}>{report.reportedEmail}</span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{report.createdAt}</span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#334155', fontSize: '14px', fontWeight: '500' }}>
                    {report.reason}
                  </td>
                  <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px' }}>
                    {report.reporterEmail}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: badge.bg, color: badge.text
                    }}>
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {report.status === 'PENDING' ? (
                      <button 
                        onClick={() => { setReviewingReport(report); setAdminNotes(''); }}
                        style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: '600' }}>
                        Review Case
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setReviewingReport(report); }}
                        style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No reports found in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- REPORT REVIEW MODAL --- */}
      {reviewingReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', width: '550px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Review Report #{reviewingReport.id}</h2>
                 <p style={{ margin: 0, color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Submitted on {reviewingReport.createdAt}</p>
               </div>
               <span style={{ ...getStatusBadge(reviewingReport.status), padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {getStatusBadge(reviewingReport.status).label}
               </span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px' }}>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#991b1b', textTransform: 'uppercase' }}>Reported Account</span>
                    <p style={{ margin: '4px 0 0 0', color: '#7f1d1d', fontSize: '15px', fontWeight: '600' }}>{reviewingReport.reportedEmail}</p>
                 </div>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Categorized As</span>
                    <p style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '14px', fontWeight: '500' }}>{reviewingReport.reason}</p>
                 </div>
               </div>

               <div>
                 <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Reporter's Description:</span>
                 <p style={{ margin: '6px 0 0 0', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>
                   "{reviewingReport.description}"
                 </p>
                 <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginTop: '6px' }}>— Reported by {reviewingReport.reporterEmail}</span>
               </div>

               {reviewingReport.status === 'PENDING' && (
                 <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Internal Moderator Notes</label>
                    <textarea 
                      rows="3" 
                      value={adminNotes} 
                      onChange={(e) => setAdminNotes(e.target.value)} 
                      placeholder="e.g. Reviewed user messages, confirmed policy violation..."
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontFamily: 'inherit' }} 
                    />
                 </div>
               )}
            </div>

            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
               <button onClick={() => setReviewingReport(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '500' }}>
                 {reviewingReport.status === 'PENDING' ? 'Cancel' : 'Close'}
               </button>
               
               {reviewingReport.status === 'PENDING' && (
                 <>
                   <button onClick={() => handleActionSubmit('DISMISS')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#475569', cursor: 'pointer', fontWeight: '600' }}>
                     Dismiss Report
                   </button>
                   <button onClick={() => handleActionSubmit('RESOLVE')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                     Warn & Resolve
                   </button>
                   <button onClick={() => handleActionSubmit('LOCK_USER')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                     Lock Offending User
                   </button>
                 </>
               )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReports;
