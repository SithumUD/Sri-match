"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPinIcon, SearchIcon, PlusIcon, Edit3Icon,
  Trash2Icon, Loader2Icon, RefreshCwIcon,
  XIcon, CheckIcon, GlobeIcon, NavigationIcon,
  HashIcon, LanguagesIcon, AlertCircleIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .al2-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .al2-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .al2-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
  .al2-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .al2-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .al2-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .al2-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── TOOLBAR ── */
  .al2-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap;
  }
  .al2-search-wrap { position: relative; flex: 1; max-width: 400px; }
  .al2-search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #c9856a; }
  .al2-search-input {
    width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem; border-radius: 99px;
    border: 1.5px solid #f0ddd5; background: #fff; font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .al2-search-input:focus { border-color: #c9856a; outline: none; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  .al2-toolbar-right {
    display: flex; align-items: center; gap: 0.75rem;
  }

  /* ── TABLE ── */
  .al2-card {
    background: #fff; border: 1px solid #f0ddd5; border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(139,78,46,0.05);
  }
  .al2-table-wrap { overflow-x: auto; }
  .al2-table { width: 100%; border-collapse: collapse; min-width: 900px; }
  .al2-table th {
    text-align: left; padding: 1rem 1.25rem; background: #fdf8f4;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    color: #8b4e2e; border-bottom: 1px solid #f5ede5;
  }
  .al2-table td { padding: 0.95rem 1.25rem; font-size: 0.82rem; color: #2d1810; border-bottom: 1px solid #fdf5ee; }
  .al2-table tr:last-child td { border-bottom: none; }
  .al2-table tr:hover td { background: #fdfaf8; }

  .al2-city-main { font-weight: 600; color: #2d1810; display: block; }
  .al2-city-sub { font-size: 0.75rem; color: #9a7060; }
  
  .al2-coords { font-family: monospace; font-size: 0.75rem; color: #8b4e2e; background: #fdf5ee; padding: 0.2rem 0.5rem; border-radius: 6px; }

  /* ── ACTIONS ── */
  .al2-actions { display: flex; gap: 0.5rem; }
  .al2-btn-icon {
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    border: 1px solid #f0ddd5; background: #fff; color: #9a7060; cursor: pointer; transition: all 0.2s;
  }
  .al2-btn-icon:hover { background: #fdf5ee; color: #8b4e2e; border-color: #e8c9b8; }
  .al2-btn-icon.del:hover { background: #fef2f2; color: #dc2626; border-color: #fca5a5; }

  .al2-btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 1.4rem; border-radius: 99px; font-size: 0.85rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050); color: #3d1f12; border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(200,160,80,0.3); transition: all 0.2s;
  }
  .al2-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,160,80,0.42); }

  /* ── PAGINATION BAR ── */
  .al2-pagination-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 1.5rem; background: #fffaf7; border-top: 1px solid #f0ddd5;
    flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; color: #8b4e2e;
  }
  .al2-page-info { display: flex; align-items: center; gap: 0.5rem; }
  .al2-page-size-select {
    padding: 0.3rem 0.6rem; border-radius: 8px; border: 1px solid #f0ddd5;
    background: #fff; font-size: 0.8rem; color: #2d1810; outline: none;
    font-family: inherit; cursor: pointer;
  }
  .al2-page-nav { display: flex; align-items: center; gap: 0.35rem; }
  .al2-page-btn {
    min-width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid #f0ddd5; background: #fff; color: #8b4e2e;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.15s;
    padding: 0 0.4rem;
  }
  .al2-page-btn:hover:not(:disabled) { background: #fdf5ee; border-color: #e8c9b8; }
  .al2-page-btn.active {
    background: #8b4e2e; color: #fff; border-color: #8b4e2e; font-weight: 600;
  }
  .al2-page-btn:disabled {
    opacity: 0.4; cursor: not-allowed;
  }

  /* ── MODAL ── */
  .al2-overlay { position: fixed; inset: 0; background: rgba(30,8,2,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1.5rem; }
  .al2-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 600px; overflow: hidden; border: 1px solid #f0ddd5; }
  .al2-modal-hdr { padding: 1.25rem 1.5rem; background: #fdf8f4; border-bottom: 1px solid #f5ede5; display: flex; justify-content: space-between; align-items: center; }
  .al2-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 700; color: #2d1810; }
  .al2-modal-body { padding: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-height: 70vh; overflow-y: auto; }
  .al2-modal-footer { padding: 1.25rem 1.5rem; background: #fdf8f4; border-top: 1px solid #f5ede5; display: flex; justify-content: flex-end; gap: 0.75rem; }

  .al2-form-group { display: flex; flex-direction: column; gap: 0.35rem; }
  .al2-form-group.full { grid-column: span 2; }
  .al2-label { font-size: 0.75rem; font-weight: 600; color: #6b4a3a; display: flex; align-items: center; gap: 0.35rem; }
  .al2-input { padding: 0.6rem 0.85rem; border-radius: 10px; border: 1px solid #f0ddd5; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; }
  .al2-input:focus { border-color: #c9856a; outline: none; }

  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .al2-ornament { color: #e8c9b8; font-size: 0.6rem; letter-spacing: 0.2em; }
`;

const AdminLocations = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: "", nameSi: "", nameTa: "",
    subNameEn: "", subNameSi: "", subNameTa: "",
    postcode: "", latitude: "", longitude: ""
  });

  const fetchCities = useCallback(async (targetPage = page, targetPageSize = pageSize, searchTerm = search) => {
    try {
      setLoading(true);
      const res = await AdminService.getAdminCities({
        page: targetPage,
        size: targetPageSize,
        search: searchTerm.trim() || undefined
      });

      if (res && res.data) {
        if (res.data.content) {
          setCities(res.data.content);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        } else if (Array.isArray(res.data)) {
          setCities(res.data);
          setTotalPages(1);
          setTotalElements(res.data.length);
        }
      } else if (Array.isArray(res)) {
        setCities(res);
        setTotalPages(1);
        setTotalElements(res.length);
      }
    } catch (err) {
      console.error("Fetch cities error:", err);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      fetchCities(0, pageSize, search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchCities(page, pageSize, search);
  }, [page, pageSize]);

  const openModal = (city = null) => {
    setEditingCity(city);
    if (city) {
      setFormData({ ...city });
    } else {
      setFormData({
        nameEn: "", nameSi: "", nameTa: "",
        subNameEn: "", subNameSi: "", subNameTa: "",
        postcode: "", latitude: "", longitude: ""
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCity) {
        await AdminService.updateCity(editingCity.id, formData);
      } else {
        await AdminService.addCity(formData);
      }
      setShowModal(false);
      fetchCities(page, pageSize, search);
    } catch (err) {
      alert("Failed to save city. Make sure all required fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await AdminService.deleteCity(id);
      fetchCities(page, pageSize, search);
    } catch (err) {
      alert("Failed to delete city.");
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(0, page - 2);
      let end = Math.min(totalPages - 1, page + 2);
      if (start === 0) end = maxVisible - 1;
      if (end === totalPages - 1) start = totalPages - maxVisible;
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const startRecord = totalElements === 0 ? 0 : page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

  return (
    <>
      <style>{styles}</style>
      <div className="al2-root">
        <div className="al2-header">
          <div>
            <div className="al2-eyebrow"><span className="al2-ornament">✦</span> Admin Panel</div>
            <h1 className="al2-page-title">Location <span>Management</span></h1>
            <p className="al2-page-sub">Configure the list of supported cities, postcodes, and geographical coordinates for the platform.</p>
          </div>
          <button className="al2-btn-primary" onClick={() => openModal()}>
            <PlusIcon size={16} /> Add New City
          </button>
        </div>

        <div className="al2-toolbar">
          <div className="al2-search-wrap">
            <SearchIcon size={16} className="al2-search-icon" />
            <input 
              className="al2-search-input" 
              placeholder="Search cities by name, postcode, or area..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="al2-toolbar-right">
            <button className="al2-btn-icon" onClick={() => fetchCities(page, pageSize, search)} title="Refresh data">
              <RefreshCwIcon size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="al2-card">
          <div className="al2-table-wrap">
            <table className="al2-table">
              <thead>
                <tr>
                  <th>City Name (EN/SI/TA)</th>
                  <th>Sub-Area / Province</th>
                  <th>Postcode</th>
                  <th>Coordinates (Lat/Long)</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && cities.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3.5rem' }}>
                      <Loader2Icon size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem', display: 'block', color: '#8b4e2e' }} />
                      <span style={{ color: '#9a7060', fontSize: '0.85rem' }}>Loading cities...</span>
                    </td>
                  </tr>
                ) : cities.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3.5rem' }}>
                      <AlertCircleIcon size={32} style={{ margin: '0 auto 0.75rem', display: 'block', color: '#c4a898' }} />
                      <span style={{ color: '#9a7060' }}>No cities found matching your search.</span>
                    </td>
                  </tr>
                ) : cities.map(city => (
                  <tr key={city.id}>
                    <td>
                      <span className="al2-city-main">{city.nameEn}</span>
                      <span className="al2-city-sub">{city.nameSi} {city.nameTa ? `• ${city.nameTa}` : ''}</span>
                    </td>
                    <td>
                      <span className="al2-city-main" style={{ fontSize: '0.78rem' }}>{city.subNameEn || "—"}</span>
                      <span className="al2-city-sub">{city.subNameSi || "—"}</span>
                    </td>
                    <td><span style={{ fontWeight: 500 }}>{city.postcode}</span></td>
                    <td>
                      <span className="al2-coords">
                        {typeof city.latitude === 'number' ? city.latitude.toFixed(4) : (city.latitude || "N/A")},{" "}
                        {typeof city.longitude === 'number' ? city.longitude.toFixed(4) : (city.longitude || "N/A")}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="al2-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="al2-btn-icon" onClick={() => openModal(city)} title="Edit City"><Edit3Icon size={14} /></button>
                        <button className="al2-btn-icon del" onClick={() => handleDelete(city.id)} title="Delete City"><Trash2Icon size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION BAR ── */}
          {totalElements > 0 && (
            <div className="al2-pagination-bar">
              <div className="al2-page-info">
                <span>Showing <strong>{startRecord}</strong> - <strong>{endRecord}</strong> of <strong>{totalElements}</strong> cities</span>
                <span style={{ margin: "0 0.5rem", color: "#e8c9b8" }}>|</span>
                <span>Per page:</span>
                <select
                  className="al2-page-size-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="al2-page-nav">
                <button
                  className="al2-page-btn"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  title="Previous Page"
                >
                  <ChevronLeftIcon size={14} />
                </button>

                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`al2-page-btn ${pageNum === page ? "active" : ""}`}
                    onClick={() => setPage(pageNum)}
                    disabled={loading}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                <button
                  className="al2-page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1 || loading}
                  title="Next Page"
                >
                  <ChevronRightIcon size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── MODAL ── */}
        {showModal && (
          <div className="al2-overlay">
            <div className="al2-modal">
              <div className="al2-modal-hdr">
                <h3 className="al2-modal-title">{editingCity ? "Edit City Details" : "Add New City"}</h3>
                <button className="al2-btn-icon" onClick={() => setShowModal(false)}><XIcon size={16} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="al2-modal-body">
                  <div className="al2-form-group">
                    <label className="al2-label"><LanguagesIcon size={12} /> Name (English)</label>
                    <input className="al2-input" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} required />
                  </div>
                  <div className="al2-form-group">
                    <label className="al2-label"><LanguagesIcon size={12} /> Name (Sinhala)</label>
                    <input className="al2-input" value={formData.nameSi} onChange={e => setFormData({...formData, nameSi: e.target.value})} required />
                  </div>
                  <div className="al2-form-group">
                    <label className="al2-label"><LanguagesIcon size={12} /> Name (Tamil)</label>
                    <input className="al2-input" value={formData.nameTa} onChange={e => setFormData({...formData, nameTa: e.target.value})} required />
                  </div>
                  <div className="al2-form-group">
                    <label className="al2-label"><HashIcon size={12} /> Postcode</label>
                    <input className="al2-input" value={formData.postcode} onChange={e => setFormData({...formData, postcode: e.target.value})} required />
                  </div>
                  <div className="al2-form-group">
                    <label className="al2-label"><GlobeIcon size={12} /> Sub-Area (English)</label>
                    <input className="al2-input" value={formData.subNameEn} onChange={e => setFormData({...formData, subNameEn: e.target.value})} />
                  </div>
                  <div className="al2-form-group">
                    <label className="al2-label"><GlobeIcon size={12} /> Sub-Area (Sinhala)</label>
                    <input className="al2-input" value={formData.subNameSi} onChange={e => setFormData({...formData, subNameSi: e.target.value})} />
                  </div>
                  <div className="al2-form-group">
                    <label className="al2-label"><NavigationIcon size={12} /> Latitude</label>
                    <input type="number" step="0.000001" className="al2-input" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} required />
                  </div>
                  <div className="al2-form-group">
                    <label className="al2-label"><NavigationIcon size={12} /> Longitude</label>
                    <input type="number" step="0.000001" className="al2-input" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} required />
                  </div>
                </div>
                <div className="al2-modal-footer">
                  <button type="button" className="al2-btn-icon" style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '99px' }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="al2-btn-primary" disabled={loading}>
                    {loading ? <Loader2Icon size={14} className="animate-spin" /> : <CheckIcon size={14} />}
                    {editingCity ? "Update City" : "Save City"}
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

export default AdminLocations;