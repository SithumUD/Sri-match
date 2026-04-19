import React from "react";
import { Users, CreditCard, Activity, UserCheck } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-icon.blue { background: #eff6ff; color: #3b82f6; }
  .stat-icon.green { background: #f0fdf4; color: #22c55e; }
  .stat-icon.orange { background: #fff7ed; color: #f97316; }
  .stat-icon.purple { background: #faf5ff; color: #a855f7; }

  .stat-info h3 {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0 0 0.25rem 0;
    font-weight: 500;
  }

  .stat-info p {
    font-size: 1.5rem;
    color: #1e293b;
    margin: 0;
    font-weight: 600;
  }

  .recent-users-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .card-header h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #1e293b;
  }

  .table-responsive {
    width: 100%;
    overflow-x: auto;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .admin-table th {
    padding: 1rem 1.5rem;
    font-size: 0.85rem;
    color: #64748b;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
  }

  .admin-table td {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
    color: #334155;
    border-bottom: 1px solid #e2e8f0;
  }

  .admin-table tr:last-child td {
    border-bottom: none;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .status-badge.active { background: #dcfce7; color: #166534; }
  .status-badge.pending { background: #fef9c3; color: #854d0e; }

  @media (max-width: 640px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const AdminPanel = () => {
  const stats = [
    { label: "Total Users", value: "8,432", icon: <Users size={24} />, color: "blue" },
    { label: "Active Subscriptions", value: "1,204", icon: <CreditCard size={24} />, color: "green" },
    { label: "Daily Active", value: "3,110", icon: <Activity size={24} />, color: "orange" },
    { label: "New Matches", value: "452", icon: <UserCheck size={24} />, color: "purple" }
  ];

  const recentUsers = [
    { id: "101", name: "Saman Perera", email: "saman.p@example.com", joined: "Oct 12, 2023", status: "Active" },
    { id: "102", name: "Nimali Fernando", email: "nimali.f@example.com", joined: "Oct 11, 2023", status: "Active" },
    { id: "103", name: "Kasun Silva", email: "kasun.s@example.com", joined: "Oct 11, 2023", status: "Pending" },
    { id: "104", name: "Devindi Jayasinghe", email: "devindi.j@example.com", joined: "Oct 10, 2023", status: "Active" },
    { id: "105", name: "Ruwan Gunaratne", email: "ruwan.g@example.com", joined: "Oct 09, 2023", status: "Pending" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div>
        <div className="dashboard-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3>{stat.label}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-users-card">
          <div className="card-header">
            <h2>Recent User Registrations</h2>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th>Join Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.joined}</td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
