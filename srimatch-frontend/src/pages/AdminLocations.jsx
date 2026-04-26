import React, { useState, useEffect } from "react";
import {
  MapPinIcon, SearchIcon, PlusIcon, Edit3Icon,
  Trash2Icon, Loader2Icon, RefreshCwIcon,
  XIcon, CheckIcon, GlobeIcon, NavigationIcon,
  HashIcon, LanguagesIcon, AlertCircleIcon,
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
  .al2-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
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
    margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
  }
  .al2-search-wrap { position: relative; flex: 1; max-width: 400px; }
  .al2-search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #c9856a; }
  .al2-search-input {
    width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem; border-radius: 99px;
    border: 1.5px solid #f0ddd5; background: #fff; font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .al2-search-input:focus { border-color: #c9856a; outline: none; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

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
  .al2-table td { padding: 1rem 1.25rem; font-size: 0.82rem; color: #2d1810; border-bottom: 1px solid #fdf5ee; }
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
  .al2-input {
    width: 100%; padding: 0.6rem 0.9rem; border: 1.5px solid #f0ddd5; border-radius: 10px;
    font-size: 0.85rem; font-family: 'DM Sans', sans-serif; background: #fdfaf8; transition: all 0.2s;
  }
  .al2-input:focus { border-color: #c9856a; background: #fff; outline: none; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .al2-ornament { color: #e8c9b8; font-size: 0.6rem; letter-spacing: 0.2em; }
`;

const AdminLocations = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: "", nameSi: "", nameTa: "",
    subNameEn: "", subNameSi: "", subNameTa: "",
    postcode: "", latitude: "", longitude: ""
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAdminCities();
      // If backend returns ApiResponse<List<City>>, use res.data
      // If backend returns List<CityResponse>, adjust accordingly.
      // Assuming Admin-side GET returns full City objects.
      setCities(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error("Fetch cities error:", err);
      // Fallback for demo if endpoint missing
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

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
      fetchCities();
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
      fetchCities();
    } catch (err) {
      alert("Failed to delete city.");
    }
  };

  const filteredCities = cities.filter(city => 
    city.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
    city.nameSi?.includes(search) ||
    city.postcode?.includes(search)
  );

  return (
    <>
      <style>{styles}</style>
      <div className="al2-root">

        {/* ── HEADER ── */}
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

        {/* ── TOOLBAR ── */}
        <div className="al2-toolbar">
          <div className="al2-search-wrap">
            <SearchIcon size={16} className="al2-search-icon" />
            <input 
              className="al2-search-input" 
              placeholder="Search cities by name or postcode..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="al2-btn-icon" onClick={fetchCities} title="Refresh data">
            <RefreshCwIcon size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* ── DATA TABLE ── */}
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
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>
                      <Loader2Icon size={32} className="animate-spin" style={{ margin: '0 auto 1rem', display: 'block', color: '#8b4e2e' }} />
                      <span style={{ color: '#9a7060' }}>Fetching location data...</span>
                    </td>
                  </tr>
                ) : filteredCities.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>
                      <AlertCircleIcon size={32} style={{ margin: '0 auto 1rem', display: 'block', color: '#c4a898' }} />
                      <span style={{ color: '#9a7060' }}>No cities found matching your search.</span>
                    </td>
                  </tr>
                ) : filteredCities.map(city => (
                  <tr key={city.id}>
                    <td>
                      <span className="al2-city-main">{city.nameEn}</span>
                      <span className="al2-city-sub">{city.nameSi} • {city.nameTa}</span>
                    </td>
                    <td>
                      <span className="al2-city-main" style={{ fontSize: '0.78rem' }}>{city.subNameEn || "—"}</span>
                      <span className="al2-city-sub">{city.subNameSi || "—"}</span>
                    </td>
                    <td><span style={{ fontWeight: 500 }}>{city.postcode}</span></td>
                    <td>
                      <span className="al2-coords">{city.latitude?.toFixed(4)}, {city.longitude?.toFixed(4)}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="al2-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="al2-btn-icon" onClick={() => openModal(city)}><Edit3Icon size={14} /></button>
                        <button className="al2-btn-icon del" onClick={() => handleDelete(city.id)}><Trash2Icon size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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