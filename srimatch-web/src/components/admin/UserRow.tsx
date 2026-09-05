import React from 'react';
import { 
  ShieldIcon, LockIcon, UnlockIcon, EyeIcon, 
  Trash2Icon, SparklesIcon, UsersIcon, CheckIcon 
} from "lucide-react";

const UserRow = React.memo(({ 
  user, 
  isLocked, 
  formatDate, 
  roleBadgeClass, 
  onView, 
  onRoleChange, 
  onLockToggle, 
  onDelete 
}) => {
  const locked = isLocked(user);

  return (
    <tr>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div className="au2-avatar">{user.firstName[0]}{user.lastName[0]}</div>
          <div>
            <div className="au2-user-name">{user.firstName} {user.lastName}</div>
            <div className="au2-user-date">Joined {formatDate(user.createdAt)}</div>
          </div>
        </div>
      </td>
      <td style={{ color: "#9a7060", fontSize: "0.79rem" }}>{user.email}</td>
      <td>
        <span className={`au2-badge ${roleBadgeClass(user.role)}`}>
          {user.role === "SUPER_ADMIN" ? <><SparklesIcon size={9} /> Super Admin</> :
           user.role === "ADMIN" ? <><ShieldIcon size={9} /> Admin</> :
           <><UsersIcon size={9} /> Member</>}
        </span>
      </td>
      <td>
        <span className={`au2-badge ${locked ? "red" : "green"}`}>
          {locked
            ? <><LockIcon size={9} /> Locked</>
            : <><CheckIcon size={9} /> Active</>
          }
        </span>
      </td>
      <td>
        <div className="au2-actions">
          <button className="au2-action-btn" onClick={() => onView(user)}>
            <EyeIcon size={11} /> View
          </button>
          {user.role !== "SUPER_ADMIN" && (
            <button className="au2-action-btn" onClick={() => onRoleChange(user)}>
              <ShieldIcon size={11} /> Role
            </button>
          )}
          <button
            className={`au2-action-btn ${locked ? "unlock" : "lock"}`}
            onClick={() => onLockToggle(user)}
          >
            {locked ? <><UnlockIcon size={11} /> Unlock</> : <><LockIcon size={11} /> Lock</>}
          </button>
          {user.role !== "SUPER_ADMIN" && (
            <button className="au2-action-btn del" onClick={() => onDelete(user)}>
              <Trash2Icon size={11} /> Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

UserRow.displayName = 'UserRow';

export default UserRow;
