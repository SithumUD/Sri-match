import React, { useState } from 'react';

// Dummy data matching the backend UserResponse schema
const initialDummyUsers = [
  { id: 1, firstName: 'Sithum', lastName: 'Piumika', email: 'sithum@example.com', role: 'SUPER_ADMIN', locked: false, createdAt: '2026-03-10' },
  { id: 2, firstName: 'Kasun', lastName: 'Kalhara', email: 'kasun@example.com', role: 'USER', locked: false, createdAt: '2026-04-12' },
  { id: 3, firstName: 'Amali', lastName: 'Perera', email: 'amali.p@example.com', role: 'USER', locked: true, createdAt: '2026-04-15' },
  { id: 4, firstName: 'Nimal', lastName: 'Silva', email: 'nimal@admin.com', role: 'ADMIN', locked: false, createdAt: '2026-02-05' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(initialDummyUsers);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null); // null means closed

  // Add User Form State
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'USER' });

  // Simulated API Actions
  const handleLockToggle = (email, isCurrentlyLocked) => {
    if (window.confirm(`Are you sure you want to ${isCurrentlyLocked ? 'unlock' : 'lock'} this account?`)) {
      setUsers(users.map(u => u.email === email ? { ...u, locked: !isCurrentlyLocked } : u));
    }
  };

  const handleRoleChange = (email, currentRole) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    if (window.confirm(`Change role to ${newRole}?`)) {
      setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u));
    }
  };

  const handleDelete = (email, type) => {
    if (window.confirm(`Are you sure you want to ${type} delete this user? This action cannot be undone.`)) {
      setUsers(users.filter(u => u.email !== email));
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.firstName || !newUser.lastName || !newUser.email) return alert('Fill all fields');
    
    const maxId = Math.max(...users.map(u => u.id)) || 0;
    const addedUser = { 
      ...newUser, 
      id: maxId + 1, 
      locked: false, 
      createdAt: new Date().toISOString().split('T')[0] 
    };
    
    setUsers([addedUser, ...users]);
    setIsAddUserOpen(false);
    setNewUser({ firstName: '', lastName: '', email: '', role: 'USER' });
    alert('Simulated: User Created successfully!');
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>User Management</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
            View, edit, lock, or delete user accounts across the platform.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = '#dc2626'}
                  onMouseOut={(e) => e.target.style.background = '#ef4444'}
                  onClick={() => alert('Simulate: Purging all soft-deleted users (DELETE /purge)')}>
            Purge Deleted Users
          </button>
          <button style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = '#2563eb'}
                  onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                  onClick={() => setIsAddUserOpen(true)}>
            + Add User
          </button>
        </div>
      </div>

      {/* Top Stats & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: '12px' }}>
            <span style={{ color: '#64748b', fontSize: '13px', display: 'block' }}>Total Users</span>
            <span style={{ color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>{users.length}</span>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: '12px' }}>
            <span style={{ color: '#64748b', fontSize: '13px', display: 'block' }}>Locked Accounts</span>
            <span style={{ color: '#ef4444', fontSize: '20px', fontWeight: '700' }}>{users.filter(u => u.locked).length}</span>
          </div>
        </div>
        
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px', outline: 'none' }}
        />
      </div>

      {/* Data Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
              <tr key={user.id} style={{ borderBottom: idx !== filteredUsers.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }}>
                <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '500' }}>{user.firstName} {user.lastName}</td>
                <td style={{ padding: '16px 24px', color: '#64748b' }}>{user.email}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    background: user.role.includes('ADMIN') ? '#dbeafe' : '#f1f5f9',
                    color: user.role.includes('ADMIN') ? '#1e40af' : '#475569'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px',
                    background: user.locked ? '#ef4444' : '#10b981' 
                  }}></span>
                  <span style={{ color: '#475569', fontSize: '14px' }}>{user.locked ? 'Locked' : 'Active'}</span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setViewingUser(user)}
                      style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#334155', fontWeight: '500' }}>
                      View
                    </button>
                    <button 
                      onClick={() => handleRoleChange(user.email, user.role)}
                      style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#475569', fontWeight: '500' }}>
                      Role
                    </button>
                    <button 
                      onClick={() => handleLockToggle(user.email, user.locked)}
                      style={{ padding: '6px 12px', background: user.locked ? '#ecfdf5' : '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: user.locked ? '#059669' : '#dc2626', fontWeight: '500' }}>
                      {user.locked ? 'Unlock' : 'Lock'}
                    </button>
                    <button 
                      onClick={() => handleDelete(user.email, 'soft')}
                      style={{ padding: '6px 12px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#b91c1c', fontWeight: '500' }}>
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No users matched your search criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD USER MODAL --- */}
      {isAddUserOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', width: '450px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#0f172a' }}>Add New User</h2>
            
            <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>First Name</label>
                <input type="text" required value={newUser.firstName} onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Last Name</label>
                <input type="text" required value={newUser.lastName} onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Email Address</label>
                <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '500' }}>Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' , background: '#fff' }}>
                  <option value="USER">Standard User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsAddUserOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW USER MODAL --- */}
      {viewingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', width: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
            
            {/* Modal Header */}
            <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#0f172a' }}>{viewingUser.firstName} {viewingUser.lastName}</h2>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>System UID: #{viewingUser.id}</p>
               </div>
               <span style={{ 
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  background: viewingUser.role.includes('ADMIN') ? '#dbeafe' : '#f1f5f9',
                  color: viewingUser.role.includes('ADMIN') ? '#1e40af' : '#475569'
                }}>
                  {viewingUser.role} 
                </span>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Email Address</span>
                    <p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>{viewingUser.email}</p>
                 </div>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Status</span>
                    <p style={{ margin: '4px 0 0 0', color: viewingUser.locked ? '#ef4444' : '#10b981', fontSize: '15px', fontWeight: '500' }}>
                      {viewingUser.locked ? 'Currently Locked' : 'Active'}
                    </p>
                 </div>
                 <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Created At</span>
                    <p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '15px' }}>{viewingUser.createdAt}</p>
                 </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
               <button onClick={() => setViewingUser(null)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                 Close Profile
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
