import React, { useState } from 'react';

// Dummy data matching our backend response shape Map<String, List<SystemSetting>>
const initialDummyData = {
  GENERAL: [
    { settingKey: 'MAINTENANCE_MODE', settingValue: 'false', description: 'Enable maintenance mode to restrict user access', dataType: 'BOOLEAN' },
    { settingKey: 'AUTO_APPROVE_PROFILES', settingValue: 'true', description: 'Automatically approve newly registered user profiles', dataType: 'BOOLEAN' }
  ],
  MATCHMAKING: [
    { settingKey: 'FREE_LIKES_LIMIT', settingValue: '15', description: 'Maximum number of likes a free user can send per cycle', dataType: 'NUMBER' },
    { settingKey: 'FREE_LIKES_CYCLE_DAYS', settingValue: '5', description: 'Number of days in a like limit cycle for free users', dataType: 'NUMBER' }
  ],
  CONTACT_INFO: [
    { settingKey: 'CONTACT_EMAIL', settingValue: 'support@srimatch.com', description: 'Application support contact email', dataType: 'TEXT' }
  ]
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(initialDummyData);
  const [isSaving, setIsSaving] = useState(false);

  // Handle local state updates when user changes an input
  const handleInputChange = (group, index, newValue) => {
    const updatedSettings = { ...settings };
    updatedSettings[group][index].settingValue = newValue;
    setSettings(updatedSettings);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate an API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings simulated saved successfully! (Backend linking pending)');
    }, 800);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ padding: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>Platform Settings</h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>
          Configure global application parameters, matchmaking algorithms, and contact details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {Object.entries(settings).map(([group, sectionSettings]) => (
          <div key={group} style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden'
          }}>
            {/* Group Header */}
            <div style={{ backgroundColor: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ margin: 0, color: '#334155', fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>
                {group.replace('_', ' ').toLowerCase()} Settings
              </h3>
            </div>

            {/* Group Settings */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {sectionSettings.map((setting, idx) => (
                <div key={setting.settingKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                  
                  {/* Setting Label & Description */}
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: '#1e293b', fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>
                      {setting.settingKey.replace(/_/g, ' ')}
                    </label>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>{setting.description}</span>
                  </div>

                  {/* Input Rendering based on DataType */}
                  <div style={{ flexShrink: 0, width: '240px', display: 'flex', justifyContent: 'flex-end' }}>
                    {setting.dataType === 'BOOLEAN' ? (
                      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input 
                          type="checkbox" 
                          style={{ opacity: 0, width: 0, height: 0 }} 
                          checked={setting.settingValue === 'true'}
                          onChange={(e) => handleInputChange(group, idx, e.target.checked ? 'true' : 'false')}
                        />
                        <span style={{
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: setting.settingValue === 'true' ? '#3b82f6' : '#cbd5e1',
                          transition: '.4s', borderRadius: '34px',
                          display: 'flex', alignItems: 'center', padding: '0 4px'
                        }}>
                          <span style={{
                            height: '16px', width: '16px', backgroundColor: 'white', borderRadius: '50%',
                            transform: setting.settingValue === 'true' ? 'translateX(20px)' : 'translateX(0)',
                            transition: '.4s'
                          }} />
                        </span>
                      </label>
                    ) : setting.dataType === 'NUMBER' ? (
                      <input 
                        type="number"
                        value={setting.settingValue}
                        onChange={(e) => handleInputChange(group, idx, e.target.value)}
                        style={{
                          width: '100px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
                          outline: 'none', fontSize: '14px', color: '#334155', transition: 'border 0.2s',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      />
                    ) : (
                      <input 
                        type="text"
                        value={setting.settingValue}
                        onChange={(e) => handleInputChange(group, idx, e.target.value)}
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
                          outline: 'none', fontSize: '14px', color: '#334155', transition: 'border 0.2s',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      />
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Action */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ 
            background: isSaving ? '#93c5fd' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '12px 28px', 
            fontSize: '15px', 
            fontWeight: '600',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, transform 0.1s',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)'
          }}
          onMouseOver={(e) => !isSaving && (e.currentTarget.style.background = '#1d4ed8')}
          onMouseOut={(e) => !isSaving && (e.currentTarget.style.background = '#2563eb')}
          onMouseDown={(e) => !isSaving && (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => !isSaving && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isSaving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </div>

    </div>
  );
};

export default AdminSettings;
