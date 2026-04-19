import React, { useState } from 'react';

// Dummy data matching backend PaymentResponse schema
const initialDummyPayments = [
  { id: 101, userEmail: 'kasun@example.com', packageId: 2, amount: 2500.0, method: 'BANK_TRANSFER', status: 'PENDING', bankName: 'BOC', referenceNo: 'REF-839219', submittedAt: '2026-04-18', notes: '' },
  { id: 102, userEmail: 'amali.p@example.com', packageId: 3, amount: 5000.0, method: 'CARD', status: 'APPROVED', bankName: 'N/A', referenceNo: 'CHG-99120', submittedAt: '2026-04-17', notes: 'Auto approved by gateway' },
  { id: 103, userEmail: 'sithum@example.com', packageId: 1, amount: 1500.0, method: 'BANK_TRANSFER', status: 'PENDING', bankName: 'Sampath', referenceNo: 'REF-00124', submittedAt: '2026-04-18', notes: '' },
  { id: 104, userEmail: 'nimal@admin.com', packageId: 2, amount: 2500.0, method: 'BANK_TRANSFER', status: 'REJECTED', bankName: 'HNB', referenceNo: 'REF-11005', submittedAt: '2026-04-10', notes: 'Invalid slip uploaded' },
];

const AdminPayments = () => {
  const [payments, setPayments] = useState(initialDummyPayments);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [reviewingPayment, setReviewingPayment] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Filtering Logic
  const filteredPayments = payments.filter((payment) => {
    const matchesTab = activeTab === 'ALL' || payment.status === activeTab;
    const matchesSearch = payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          payment.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleReviewSubmit = (isApproved) => {
    if (!reviewingPayment) return;
    
    // Simulate updating state (Patch /v1/admin/payments/{id}/review)
    const newStatus = isApproved ? 'APPROVED' : 'REJECTED';
    setPayments(payments.map(p => 
      p.id === reviewingPayment.id ? { ...p, status: newStatus, notes: reviewNotes } : p
    ));
    
    setReviewingPayment(null);
    setReviewNotes('');
    alert(`Simulated: Payment successfully ${newStatus.toLowerCase()}!`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED': return { bg: '#dcfce7', text: '#166534', label: 'Approved' };
      case 'REJECTED': return { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' };
      default: return { bg: '#fef9c3', text: '#854d0e', label: 'Pending Review' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>Payment Management</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
            Verify bank transfers and review user payment history.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: '12px', textAlign: 'right' }}>
            <span style={{ color: '#64748b', fontSize: '13px', display: 'block' }}>Requires Action</span>
            <span style={{ color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>
              {payments.filter(p => p.status === 'PENDING').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
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
          placeholder="Search by email or Ref No..." 
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
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Reference</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>User / Amount</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Method</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? filteredPayments.map((payment, idx) => {
              const badge = getStatusBadge(payment.status);
              return (
                <tr key={payment.id} style={{ borderBottom: idx !== filteredPayments.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'block', color: '#0f172a', fontWeight: '600', fontSize: '14px' }}>{payment.referenceNo}</span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{payment.submittedAt}</span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'block', color: '#334155', fontSize: '14px' }}>{payment.userEmail}</span>
                    <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>Rs {payment.amount.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: '#f1f5f9', color: '#475569'
                    }}>
                      {payment.method === 'BANK_TRANSFER' ? payment.bankName : payment.method}
                    </span>
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
                    {payment.status === 'PENDING' ? (
                      <button 
                        onClick={() => { setReviewingPayment(payment); setReviewNotes(''); }}
                        style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: '600' }}>
                        Review
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setReviewingPayment(payment); setReviewNotes(payment.notes); }}
                        style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No payments found in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAYMENT REVIEW MODAL --- */}
      {reviewingPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', width: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Transaction Details</h2>
               <span style={{ ...getStatusBadge(reviewingPayment.status), padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {getStatusBadge(reviewingPayment.status).label}
               </span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Reference No</span>
                    <p style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '15px', fontWeight: '600' }}>{reviewingPayment.referenceNo}</p>
                 </div>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Amount</span>
                    <p style={{ margin: '4px 0 0 0', color: '#10b981', fontSize: '15px', fontWeight: '700' }}>Rs {reviewingPayment.amount.toLocaleString()}</p>
                 </div>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Paid By</span>
                    <p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '14px' }}>{reviewingPayment.userEmail}</p>
                 </div>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Bank / Method</span>
                    <p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '14px' }}>{reviewingPayment.bankName || reviewingPayment.method}</p>
                 </div>
               </div>

               {/* Simulated Slip Preview */}
               {reviewingPayment.method === 'BANK_TRANSFER' && (
                 <div>
                   <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>Payment Slip Picture</span>
                   <div style={{ height: '120px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontSize: '13px' }}>
                     [Image Preview Here]
                   </div>
                 </div>
               )}

               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Admin Notes (Optional/Reason for Rejection)</label>
                  <textarea 
                    rows="3" 
                    disabled={reviewingPayment.status !== 'PENDING'}
                    value={reviewNotes} 
                    onChange={(e) => setReviewNotes(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontFamily: 'inherit' }} 
                  />
               </div>
            </div>

            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
               <button onClick={() => setReviewingPayment(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '500' }}>
                 {reviewingPayment.status === 'PENDING' ? 'Cancel' : 'Close'}
               </button>
               
               {reviewingPayment.status === 'PENDING' && (
                 <>
                   <button onClick={() => handleReviewSubmit(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ef4444', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer', fontWeight: '600' }}>
                     Reject
                   </button>
                   <button onClick={() => handleReviewSubmit(true)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                     Approve Payment
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

export default AdminPayments;
