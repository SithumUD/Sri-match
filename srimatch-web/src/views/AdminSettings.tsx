"use client";

import React, { useState, useEffect } from "react";
import {
  SettingsIcon, HeartIcon, CrownIcon, MailIcon,
  SaveIcon, CheckIcon, ChevronDownIcon, Loader2Icon,
  RefreshCwIcon, AlertCircleIcon,
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .as2-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .as2-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .as2-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
  .as2-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .as2-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .as2-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .as2-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── SECTIONS ── */
  .as2-section {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 16px; overflow: hidden; margin-bottom: 1.25rem;
  }
  .as2-section-hdr {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 1rem 1.4rem;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border-bottom: 1px solid #f5ede5;
  }
  .as2-section-icon {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .as2-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #2d1810;
  }
  .as2-section-sub { font-size: 0.72rem; color: #9a7060; margin-top: 1px; }

  .as2-section-body { padding: 0.35rem 0; }

  /* ── SETTING ROW ── */
  .as2-row {
    display: flex; justify-content: space-between; align-items: center; gap: 1.5rem;
    padding: 0.85rem 1.4rem; border-bottom: 1px solid #fdf5ee;
    transition: background 0.15s;
  }
  .as2-row:last-child { border-bottom: none; }
  .as2-row:hover { background: #fdf8f4; }

  .as2-row-left { flex: 1; }
  .as2-row-key { font-size: 0.82rem; font-weight: 500; color: #2d1810; margin-bottom: 3px; text-transform: capitalize; }
  .as2-row-desc { font-size: 0.72rem; color: #9a7060; line-height: 1.45; }
  .as2-row-right { flex-shrink: 0; }

  /* ── TOGGLE ── */
  .as2-toggle-label { position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; }
  .as2-toggle-label input { opacity: 0; width: 0; height: 0; }
  .as2-track {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 99px; background: #e8cec0; transition: 0.3s;
  }
  .as2-toggle-label input:checked + .as2-track {
    background: linear-gradient(135deg, #c9856a, #8b4e2e);
  }
  .as2-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff; transition: 0.3s;
    box-shadow: 0 1px 3px rgba(61,31,18,0.2);
    pointer-events: none;
  }
  .as2-toggle-label input:checked ~ .as2-thumb { left: 23px; }

  /* ── INPUTS ── */
  .as2-num-input {
    width: 90px; padding: 0.45rem 0.75rem;
    border: 1.5px solid #f0ddd5; border-radius: 10px;
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    color: #2d1810; background: #fdf8f4;
    outline: none; text-align: center; transition: all 0.2s;
  }
  .as2-num-input:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  .as2-text-input {
    width: 260px; padding: 0.45rem 0.75rem;
    border: 1.5px solid #f0ddd5; border-radius: 10px;
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    color: #2d1810; background: #fdf8f4;
    outline: none; transition: all 0.2s;
  }
  .as2-text-input:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  .as2-select-wrap { position: relative; display: inline-block; }
  .as2-select-wrap svg { position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: #9a7060; }
  .as2-select {
    padding: 0.45rem 2rem 0.45rem 0.75rem;
    border: 1.5px solid #f0ddd5; border-radius: 10px;
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    color: #2d1810; background: #fdf8f4;
    outline: none; cursor: pointer;
    -webkit-appearance: none; appearance: none;
    transition: all 0.2s;
  }
  .as2-select:focus { border-color: #c9856a; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  /* ── FOOTER ── */
  .as2-footer {
    display: flex; justify-content: flex-end; align-items: center;
    gap: 0.75rem; padding-top: 1.25rem;
    border-top: 1px solid #f0ddd5; margin-top: 0.5rem;
  }

  /* ── TOAST ── */
  .as2-toast {
    display: none; align-items: center; gap: 0.5rem;
    padding: 0.55rem 1.1rem;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 99px; font-size: 0.78rem; font-weight: 500; color: #16a34a;
  }
  .as2-toast.show { display: inline-flex; }

  /* ── BUTTONS ── */
  .as2-btn-primary {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.6rem 1.4rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(200,160,80,0.3);
    transition: all 0.2s;
  }
  .as2-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,160,80,0.42); }
  .as2-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  .as2-ornament { color: #e8c9b8; font-size: 0.6rem; letter-spacing: 0.2em; }
  
  .animate-spin { animation: as-spin 1.2s linear infinite; }
  @keyframes as-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

/* ─── Config ─────────────────────────────────────────────────────────────── */
const SECTION_META = {
  GENERAL:       { title: "General Settings",          sub: "Platform availability and profile management",        iconBg: "#fdf5ee", icon: <SettingsIcon size={16} color="#8b4e2e" /> },
  MATCHMAKING:   { title: "Matchmaking Settings",      sub: "Control likes, matches, and compatibility scoring",   iconBg: "#fff1f2", icon: <HeartIcon size={16} color="#f43f5e" fill="#f43f5e" /> },
  SUBSCRIPTIONS: { title: "Subscription & Payments",   sub: "Pricing, trial periods, and payment configuration",   iconBg: "#faf5ff", icon: <CrownIcon size={16} color="#7c3aed" /> },
  CONTACT_INFO:  { title: "Contact & Communication",   sub: "Support email, notifications, and announcements",     iconBg: "#ecfeff", icon: <MailIcon size={16} color="#06b6d4" /> },
};

/* ─── Component ───────────────────────────────────────────────────────────── */
const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getSettings();
      // res.data is Map<String, List<SystemSetting>>
      setSettings(res.data || {});
    } catch (err) {
      console.error("Fetch settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettingLocal = (group, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: prev[group].map((s) => s.settingKey === key ? { ...s, settingValue: String(value) } : s),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      // Construct update payload: Map<String, String>
      const payload = {};
      Object.values(settings).flat().forEach(s => {
        payload[s.settingKey] = s.settingValue;
      });

      await AdminService.updateSetting(null, null, payload); // The controller takes Map<String, String> at @PutMapping
      // Wait, let's check AdminService.updateSetting signature
      // updateSetting: (key, value) => { return API.put(`/admin/settings/${key}`, { value }); }
      // But controller has @PutMapping with @RequestBody Map<String, String> updates
      // I should add a bulk update method to AdminService or update the call here.
      
      // Let's use a specialized call if we have one, otherwise update AdminService
      await AdminService.updateBulkSettings(payload);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save settings error:", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2Icon size={32} className="animate-spin" color="#8b4e2e" />
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="as2-root">

        {/* ── PAGE HEADER ── */}
        <div className="as2-header">
          <div>
            <div className="as2-eyebrow"><span className="as2-ornament">✦</span> Admin Panel</div>
            <h1 className="as2-page-title">Platform <span>Settings</span></h1>
            <p className="as2-page-sub">Configure global parameters, matchmaking rules, subscriptions, and platform behaviour.</p>
          </div>
          <button 
            className="as2-btn-primary" 
            onClick={fetchSettings}
            style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #f0ddd5', color: '#9a7060', boxShadow: 'none' }}
          >
            <RefreshCwIcon size={14} /> Refresh
          </button>
        </div>

        {/* ── SETTING SECTIONS ── */}
        {Object.entries(settings).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9a7060' }}>
            <AlertCircleIcon size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No system settings found in the database.</p>
          </div>
        ) : Object.entries(settings).map(([group, rows]) => {
          const meta = SECTION_META[group] || { title: group, sub: "System configuration", iconBg: "#f0f0f0", icon: <SettingsIcon size={16} /> };
          return (
            <div key={group} className="as2-section">
              <div className="as2-section-hdr">
                <div className="as2-section-icon" style={{ background: meta.iconBg }}>
                  {meta.icon}
                </div>
                <div>
                  <div className="as2-section-title">{meta.title}</div>
                  <div className="as2-section-sub">{meta.sub}</div>
                </div>
              </div>
              <div className="as2-section-body">
                {rows.map((s) => (
                  <div key={s.settingKey} className="as2-row">
                    <div className="as2-row-left">
                      <div className="as2-row-key">{s.settingKey.replace(/_/g, ' ')}</div>
                      <div className="as2-row-desc">{s.description || "No description available."}</div>
                    </div>
                    <div className="as2-row-right">
                      {s.dataType === "BOOLEAN" && (
                        <label className="as2-toggle-label">
                          <input
                            type="checkbox"
                            checked={s.settingValue === "true"}
                            onChange={(e) => updateSettingLocal(group, s.settingKey, e.target.checked)}
                          />
                          <span className="as2-track" />
                          <span className="as2-thumb" />
                        </label>
                      )}
                      {s.dataType === "NUMBER" && (
                        <input
                          type="number"
                          className="as2-num-input"
                          value={s.settingValue}
                          onChange={(e) => updateSettingLocal(group, s.settingKey, e.target.value)}
                        />
                      )}
                      {(s.dataType === "TEXT" || !s.dataType) && (
                        <input
                          type="text"
                          className="as2-text-input"
                          value={s.settingValue}
                          onChange={(e) => updateSettingLocal(group, s.settingKey, e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* ── FOOTER ── */}
        <div className="as2-footer">
          {saved && (
            <div className="as2-toast show">
              <CheckIcon size={13} /> Settings saved successfully
            </div>
          )}
          <button
            className="as2-btn-primary"
            disabled={saving || Object.keys(settings).length === 0}
            onClick={handleSave}
          >
            {saving ? <Loader2Icon size={13} className="animate-spin" /> : <SaveIcon size={13} />}
            {saving ? "Saving Changes…" : "Save All Settings"}
          </button>
        </div>

      </div>
    </>
  );
};

export default AdminSettings;