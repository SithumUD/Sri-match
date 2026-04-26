import React, { useState, useEffect } from "react";
import {
  CrownIcon, BanknoteIcon, PlusIcon, Trash2Icon,
  CheckIcon, XIcon, Loader2Icon, RefreshCwIcon,
  AlertCircleIcon, ShieldCheckIcon, Edit3Icon,
  ChevronRightIcon, BuildingIcon, CreditCardIcon,
  SparklesIcon, TrashIcon,
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .ap2-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ap2-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .ap2-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .ap2-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .ap2-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .ap2-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .ap2-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── TABS ── */
  .ap2-tabs { display: flex; gap: 1rem; margin-bottom: 1.75rem; border-bottom: 1px solid #f0ddd5; padding-bottom: 0.5rem; }
  .ap2-tab {
    padding: 0.6rem 1.25rem; border-radius: 99px; font-size: 0.85rem; font-weight: 500;
    cursor: pointer; color: #9a7060; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;
  }
  .ap2-tab:hover { color: #8b4e2e; background: #fdf5ee; }
  .ap2-tab.active { background: #2d1810; color: #fff; box-shadow: 0 4px 12px rgba(45,24,16,0.15); }

  /* ── GRID ── */
  .ap2-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

  /* ── PACKAGE CARD ── */
  .ap2-card {
    background: #fff; border: 1px solid #f0ddd5; border-radius: 20px;
    padding: 1.5rem; transition: all 0.25s; position: relative;
    display: flex; flex-direction: column;
  }
  .ap2-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(139,78,46,0.12); border-color: #e8c9b8; }
  .ap2-card.inactive { opacity: 0.6; grayscale: 1; }

  .ap2-card-badge {
    position: absolute; top: 1.25rem; right: 1.25rem;
    padding: 0.25rem 0.6rem; border-radius: 99px; font-size: 0.65rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .ap2-card-badge.active { background: #f0fdf4; color: #16a34a; }
  .ap2-card-badge.inactive { background: #fef2f2; color: #dc2626; }

  .ap2-card-hdr { margin-bottom: 1.25rem; }
  .ap2-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: #2d1810; margin-bottom: 0.25rem; }
  .ap2-card-duration { font-size: 0.75rem; color: #9a7060; display: flex; align-items: center; gap: 0.35rem; }

  .ap2-card-price-row { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 1rem; }
  .ap2-card-price { font-size: 1.6rem; font-weight: 700; color: #8b4e2e; }
  .ap2-card-original { font-size: 0.9rem; text-decoration: line-through; color: #c4a898; }
  .ap2-card-off { color: #dc2626; font-size: 0.75rem; font-weight: 600; }

  .ap2-card-desc { font-size: 0.8rem; color: #6b4a3a; line-height: 1.5; margin-bottom: 1.5rem; flex: 1; }

  .ap2-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; border-top: 1px solid #fdf5ee; }
  
  /* ── BANK CARD ── */
  .ap2-bank-card {
    background: #fff; border: 1px solid #f0ddd5; border-radius: 16px;
    padding: 1.25rem; transition: all 0.2s; display: flex; align-items: flex-start; gap: 1rem;
  }
  .ap2-bank-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px; background: #fdf5ee;
    display: flex; align-items: center; justify-content: center; color: #8b4e2e; flex-shrink: 0;
  }
  .ap2-bank-info { flex: 1; }
  .ap2-bank-name { font-weight: 600; font-size: 0.95rem; color: #2d1810; margin-bottom: 2px; }
  .ap2-bank-acc { font-family: monospace; font-size: 0.85rem; color: #8b4e2e; margin-bottom: 4px; display: block; }
  .ap2-bank-holder { font-size: 0.75rem; color: #9a7060; }
  .ap2-bank-branch { font-size: 0.75rem; color: #c4a898; margin-top: 2px; }

  /* ── TOGGLE ── */
  .ap2-toggle { position: relative; display: inline-block; width: 36px; height: 20px; cursor: pointer; }
  .ap2-toggle input { opacity: 0; width: 0; height: 0; }
  .ap2-slider { position: absolute; inset: 0; background: #e8cec0; border-radius: 99px; transition: 0.3s; }
  .ap2-toggle input:checked + .ap2-slider { background: #8b4e2e; }
  .ap2-knob { position: absolute; left: 3px; top: 3px; width: 14px; height: 14px; background: #fff; border-radius: 50%; transition: 0.3s; }
  .ap2-toggle input:checked + .ap2-slider .ap2-knob { left: 19px; }

  /* ── BUTTONS ── */
  .ap2-btn-icon {
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    border: 1px solid #f0ddd5; background: #fff; color: #9a7060; cursor: pointer; transition: all 0.2s;
  }
  .ap2-btn-icon:hover { background: #fdf5ee; color: #8b4e2e; border-color: #e8c9b8; }
  .ap2-btn-icon.del:hover { background: #fef2f2; color: #dc2626; border-color: #fca5a5; }

  .ap2-btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 1.4rem; border-radius: 99px; font-size: 0.85rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050); color: #3d1f12; border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(200,160,80,0.3); transition: all 0.2s;
  }
  .ap2-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,160,80,0.42); }

  /* ── MODAL ── */
  .ap2-overlay { position: fixed; inset: 0; background: rgba(30,8,2,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1.5rem; }
  .ap2-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 500px; overflow: hidden; border: 1px solid #f0ddd5; }
  .ap2-modal-hdr { padding: 1.25rem 1.5rem; background: #fdf8f4; border-bottom: 1px solid #f5ede5; display: flex; justify-content: space-between; align-items: center; }
  .ap2-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 700; color: #2d1810; }
  .ap2-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .ap2-modal-footer { padding: 1.25rem 1.5rem; background: #fdf8f4; border-top: 1px solid #f5ede5; display: flex; justify-content: flex-end; gap: 0.75rem; }

  .ap2-form-group { display: flex; flex-direction: column; gap: 0.35rem; }
  .ap2-label { font-size: 0.75rem; font-weight: 600; color: #6b4a3a; }
  .ap2-input {
    width: 100%; padding: 0.65rem 0.9rem; border: 1.5px solid #f0ddd5; border-radius: 12px;
    font-size: 0.85rem; font-family: 'DM Sans', sans-serif; background: #fdfaf8; transition: all 0.2s;
  }
  .ap2-input:focus { border-color: #c9856a; background: #fff; outline: none; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .ap2-textarea { resize: vertical; min-height: 80px; }

  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const AdminPackages = () => {
  const [activeTab, setActiveTab] = useState("packages");
  const [packages, setPackages] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pkgRes, bankRes] = await Promise.all([
        AdminService.getAdminPackages(),
        AdminService.getBankDetails()
      ]);
      setPackages(pkgRes.data || []);
      setBankDetails(bankRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePkg = async (id) => {
    try {
      await AdminService.togglePackageStatus(id);
      setPackages(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    } catch (err) { alert("Failed to toggle status"); }
  };

  const handleToggleBank = async (id) => {
    try {
      await AdminService.toggleBankDetailStatus(id);
      setBankDetails(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    } catch (err) { alert("Failed to toggle status"); }
  };

  const openModal = (type, item = null) => {
    setEditingItem(item);
    if (type === "package") {
      setFormData(item ? { ...item } : { title: "", description: "", price: "", timelineMonths: 1, offerPercentage: 0, active: true });
    } else {
      setFormData(item ? { ...item } : { bankName: "", branchName: "", accountNumber: "", accountHolderName: "", active: true });
    }
    setShowModal(type);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (showModal === "package") {
        if (editingItem) await AdminService.updatePackage(editingItem.id, formData);
        else await AdminService.createPackage(formData);
      } else {
        if (editingItem) await AdminService.updateBankDetail(editingItem.id, formData);
        else await AdminService.addBankDetail(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) { alert("Failed to save"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ap2-root">
        
        {/* ── HEADER ── */}
        <div className="ap2-header">
          <div>
            <div className="ap2-eyebrow"><span className="ap2-ornament">✦</span> Admin Panel</div>
            <h1 className="ap2-page-title">Revenue <span>Management</span></h1>
            <p className="ap2-page-sub">Configure subscription packages and manage bank details for manual payments.</p>
          </div>
          <button className="ap2-btn-primary" onClick={() => openModal(activeTab === "packages" ? "package" : "bank")}>
            <PlusIcon size={16} /> Add {activeTab === "packages" ? "Package" : "Bank Detail"}
          </button>
        </div>

        {/* ── TABS ── */}
        <div className="ap2-tabs">
          <div className={`ap2-tab ${activeTab === "packages" ? "active" : ""}`} onClick={() => setActiveTab("packages")}>
            <CrownIcon size={15} /> Subscription Packages
          </div>
          <div className={`ap2-tab ${activeTab === "bank" ? "active" : ""}`} onClick={() => setActiveTab("bank")}>
            <BuildingIcon size={15} /> Bank Details
          </div>
        </div>

        {loading && packages.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader2Icon size={32} className="animate-spin" color="#8b4e2e" />
          </div>
        ) : (
          <div className="ap2-grid">
            {activeTab === "packages" ? (
              packages.map(pkg => (
                <div key={pkg.id} className={`ap2-card ${!pkg.active ? 'inactive' : ''}`}>
                  <span className={`ap2-card-badge ${pkg.active ? 'active' : 'inactive'}`}>
                    {pkg.active ? "Active" : "Disabled"}
                  </span>
                  <div className="ap2-card-hdr">
                    <h3 className="ap2-card-title">{pkg.title}</h3>
                    <div className="ap2-card-duration">
                      <SparklesIcon size={12} /> {pkg.timelineMonths} {pkg.timelineMonths === 1 ? 'Month' : 'Months'} Access
                    </div>
                  </div>
                  <div className="ap2-card-price-row">
                    <span className="ap2-card-price">Rs {pkg.price.toLocaleString()}</span>
                    {pkg.offerPercentage > 0 && (
                      <>
                        <span className="ap2-card-original">Rs {pkg.originalPrice.toLocaleString()}</span>
                        <span className="ap2-card-off">-{pkg.offerPercentage}%</span>
                      </>
                    )}
                  </div>
                  <p className="ap2-card-desc">{pkg.description}</p>
                  <div className="ap2-card-footer">
                    <label className="ap2-toggle">
                      <input type="checkbox" checked={pkg.active} onChange={() => handleTogglePkg(pkg.id)} />
                      <span className="ap2-slider"><span className="ap2-knob" /></span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="ap2-btn-icon" onClick={() => openModal("package", pkg)}><Edit3Icon size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              bankDetails.map(bank => (
                <div key={bank.id} className="ap2-bank-card">
                  <div className="ap2-bank-icon-wrap">
                    <BuildingIcon size={20} />
                  </div>
                  <div className="ap2-bank-info">
                    <div className="ap2-bank-name">{bank.bankName}</div>
                    <code className="ap2-bank-acc">{bank.accountNumber}</code>
                    <div className="ap2-bank-holder">{bank.accountHolderName}</div>
                    <div className="ap2-bank-branch">{bank.branchName}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <label className="ap2-toggle">
                      <input type="checkbox" checked={bank.active} onChange={() => handleToggleBank(bank.id)} />
                      <span className="ap2-slider"><span className="ap2-knob" /></span>
                    </label>
                    <button className="ap2-btn-icon" onClick={() => openModal("bank", bank)}><Edit3Icon size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── MODALS ── */}
        {showModal && (
          <div className="ap2-overlay">
            <div className="ap2-modal">
              <div className="ap2-modal-hdr">
                <h3 className="ap2-modal-title">
                  {editingItem ? "Edit" : "Add"} {showModal === "package" ? "Package" : "Bank Detail"}
                </h3>
                <button className="ap2-btn-icon" onClick={() => setShowModal(false)}><XIcon size={16} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="ap2-modal-body">
                  {showModal === "package" ? (
                    <>
                      <div className="ap2-form-group">
                        <label className="ap2-label">Package Title</label>
                        <input className="ap2-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Premium Plus" required />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="ap2-form-group">
                          <label className="ap2-label">Price (LKR)</label>
                          <input type="number" className="ap2-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                        </div>
                        <div className="ap2-form-group">
                          <label className="ap2-label">Timeline (Months)</label>
                          <input type="number" className="ap2-input" value={formData.timelineMonths} onChange={e => setFormData({...formData, timelineMonths: e.target.value})} required />
                        </div>
                      </div>
                      <div className="ap2-form-group">
                        <label className="ap2-label">Offer Percentage (%)</label>
                        <input type="number" className="ap2-input" value={formData.offerPercentage} onChange={e => setFormData({...formData, offerPercentage: e.target.value})} />
                      </div>
                      <div className="ap2-form-group">
                        <label className="ap2-label">Description / Features</label>
                        <textarea className="ap2-input ap2-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="List features here..." />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ap2-form-group">
                        <label className="ap2-label">Bank Name</label>
                        <input className="ap2-input" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} placeholder="e.g. Bank of Ceylon" required />
                      </div>
                      <div className="ap2-form-group">
                        <label className="ap2-label">Account Number</label>
                        <input className="ap2-input" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} required />
                      </div>
                      <div className="ap2-form-group">
                        <label className="ap2-label">Account Holder Name</label>
                        <input className="ap2-input" value={formData.accountHolderName} onChange={e => setFormData({...formData, accountHolderName: e.target.value})} required />
                      </div>
                      <div className="ap2-form-group">
                        <label className="ap2-label">Branch Name</label>
                        <input className="ap2-input" value={formData.branchName} onChange={e => setFormData({...formData, branchName: e.target.value})} required />
                      </div>
                    </>
                  )}
                </div>
                <div className="ap2-modal-footer">
                  <button type="button" className="ap2-btn-icon" style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '99px' }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="ap2-btn-primary" disabled={loading}>
                    {loading ? <Loader2Icon size={14} className="animate-spin" /> : <CheckIcon size={14} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminPackages;