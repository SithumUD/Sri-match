"use client";

import React from 'react';
import Link from 'next/link';
import { Filter, RefreshCw, Crown, Shield, ChevronDown, Heart, X } from 'lucide-react';

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onRangeChange, 
  onToggleInterest, 
  onReset, 
  isPremium, 
  showAdvanced, 
  setShowAdvanced, 
  likesRemaining,
  options,
  onClose
}: any) => {
  return (
    <aside className="sticky top-6 h-fit overflow-hidden rounded-[20px] bg-white shadow-[0_12px_40px_rgba(120,60,30,0.08),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col max-h-[85vh] lg:max-h-none">
      <div className="flex items-center justify-between bg-gradient-to-br from-[#3d1f12] via-[#6b3526] to-[#8b4e2e] px-6 py-4 sm:py-5 flex-shrink-0">
        <span className="flex items-center gap-2 font-['Cormorant_Garamond'] text-[1.15rem] font-semibold text-white">
          <Filter size={15} /> Filters
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={onReset} 
            className="flex items-center gap-1 rounded-full bg-white/15 px-[0.65rem] py-[0.3rem] font-['DM_Sans'] text-[0.72rem] text-white transition-colors hover:bg-white/25"
          >
            <RefreshCw size={10} /> Reset
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
              aria-label="Close filters"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[calc(100vh-120px)] overflow-y-auto px-6 py-5">
        {!isPremium && (
          <div className="mb-5 rounded-xl border border-[#f0ddd5] bg-gradient-to-br from-[#fdf5ee] to-[#fdf0e8] p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-[0.82rem] font-semibold text-[#4a3028]">
              <Crown size={13} className="text-[#d4a017]" /> Premium Filters
            </h4>
            <p className="mb-2.5 text-[0.73rem] leading-relaxed text-[#9a7060]">
              Unlock education, income, lifestyle & horoscope filters to find your ideal match faster.
            </p>
            <Link href="/subscription" className="inline-block rounded-full bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] px-4 py-1.5 text-[0.75rem] font-medium text-white no-underline transition-opacity hover:opacity-90">
              Upgrade Now ✦
            </Link>
          </div>
        )}

        <div className="mb-[1.1rem]">
          <div className="mb-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-[#8b4e2e]">Basic</div>
          
          <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Looking for</label>
          <select 
            name="gender" 
            value={filters.gender} 
            onChange={onFilterChange} 
            className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
          >
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Marital Status</label>
          <select 
            name="maritalStatus" 
            value={filters.maritalStatus} 
            onChange={onFilterChange} 
            className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
          >
            <option value="">Any Status</option>
            {options.maritalStatus.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Has Children</label>
          <select 
            name="hasChildren" 
            value={filters.hasChildren} 
            onChange={onFilterChange} 
            className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <p className="mt-2 mb-1 text-[0.74rem] text-[#9a7060]">Age: {filters.ageFrom} – {filters.ageTo} yrs</p>
          <input 
            type="range" min="18" max="70" 
            value={filters.ageFrom} 
            onChange={e => onRangeChange("age", +e.target.value, false)} 
            className="mb-1 w-full accent-[#8b4e2e]"
          />
          <input 
            type="range" min="18" max="70" 
            value={filters.ageTo} 
            onChange={e => onRangeChange("age", +e.target.value, true)} 
            className="mb-1 w-full accent-[#8b4e2e]"
          />
        </div>

        <div className="my-4 h-px bg-[#f0ddd5]" />

        <div className="mb-[1.1rem]">
          <div className="mb-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-[#8b4e2e]">Location & Background</div>
          
          <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">City / Town</label>
          <input 
            name="city" value={filters.city} onChange={onFilterChange} 
            className="mb-4 w-full rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] px-3 py-[0.52rem] font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none focus:border-[#c9856a]" 
            placeholder="e.g. Colombo, Kandy" 
          />

          <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Religion</label>
          <select 
            name="religion" value={filters.religion} onChange={onFilterChange} 
            className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
          >
            <option value="">Any Religion</option>
            {options.religion.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Ethnicity</label>
          <select 
            name="ethnicity" value={filters.ethnicity} onChange={onFilterChange} 
            className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
          >
            <option value="">Any Ethnicity</option>
            {options.ethnicity.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div className="my-4 h-px bg-[#f0ddd5]" />
        
        <div className="my-2 flex items-center gap-2">
          <input 
            type="checkbox" id="hp-verified" name="verified" 
            checked={filters.verified} onChange={onFilterChange} 
            className="h-[15px] w-[15px] cursor-pointer accent-[#8b4e2e]"
          />
          <label htmlFor="hp-verified" className="cursor-pointer text-[0.79rem] text-[#6b4a3a]">
            Verified Profiles Only <Shield size={11} className="inline text-[#5d9e6a]" />
          </label>
        </div>

        <div className="my-4 h-px bg-[#f0ddd5]" />

        <button 
          className="flex w-full items-center justify-between border-none bg-transparent py-1.5 font-['DM_Sans'] text-[0.8rem] font-medium text-[#8b4e2e] disabled:cursor-not-allowed disabled:text-[#b09080]"
          onClick={() => isPremium && setShowAdvanced(!showAdvanced)} 
          disabled={!isPremium}
        >
          <span className="flex items-center gap-1.5">
            Advanced Filters {!isPremium && <Crown size={12} className="text-[#d4a017]" />}
          </span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`} />
        </button>

        {showAdvanced && isPremium && (
          <div className="mt-4">
            <div className="mb-[1.1rem]">
              <div className="mb-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-[#8b4e2e]">Education & Career</div>
              
              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Education Level</label>
              <select 
                name="education" value={filters.education} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any Education</option>
                {options.education.map(l => <option key={l} value={l}>{l}</option>)}
              </select>

              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Profession</label>
              <input 
                name="profession" value={filters.profession} onChange={onFilterChange} 
                className="mb-4 w-full rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] px-3 py-[0.52rem] font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none focus:border-[#c9856a]" 
                placeholder="Search profession..." 
              />

              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Industry</label>
              <select 
                name="industry" value={filters.industry} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any Industry</option>
                {options.industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>

              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Income Range</label>
              <select 
                name="income" value={filters.income} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any Income</option>
                {options.incomeRanges.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="my-4 h-px bg-[#f0ddd5]" />

            <div className="mb-[1.1rem]">
              <div className="mb-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-[#8b4e2e]">Physical & Lifestyle</div>
              
              <p className="mt-2 mb-1 text-[0.74rem] text-[#9a7060]">Height: {filters.heightFrom} – {filters.heightTo} cm</p>
              <input 
                type="range" min="120" max="250" 
                value={filters.heightFrom} 
                onChange={e => onRangeChange("height", +e.target.value, false)} 
                className="mb-1 w-full accent-[#8b4e2e]"
              />
              <input 
                type="range" min="120" max="250" 
                value={filters.heightTo} 
                onChange={e => onRangeChange("height", +e.target.value, true)} 
                className="mb-1 w-full accent-[#8b4e2e]"
              />

              <label className="mb-1 mt-4 block text-[0.77rem] font-medium text-[#4a3028]">Body Type</label>
              <select 
                name="bodyType" value={filters.bodyType} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any</option>
                {options.bodyType.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Smoking</label>
              <select 
                name="smoking" value={filters.smoking} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any</option>
                {options.smoking.map(h => <option key={h} value={h}>{h}</option>)}
              </select>

              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Drinking</label>
              <select 
                name="drinking" value={filters.drinking} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any</option>
                {options.drinking.map(h => <option key={h} value={h}>{h}</option>)}
              </select>

              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Dietary Preference</label>
              <select 
                name="dietaryPreferences" value={filters.dietaryPreferences} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any</option>
                {options.dietary.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="my-4 h-px bg-[#f0ddd5]" />

            <div className="mb-[1.1rem]">
              <div className="mb-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-[#8b4e2e]">Horoscope & Interests</div>
              
              <label className="mb-1 block text-[0.77rem] font-medium text-[#4a3028]">Horoscope Sign</label>
              <select 
                name="horoscopeSign" value={filters.horoscopeSign} onChange={onFilterChange} 
                className="mb-4 w-full appearance-none rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%2710%27_height=%277%27_viewBox=%270_0_10_7%27%3E%3Cpath_fill=%27%23c9856a%27_d=%27M0_0l5_7_5-7z%27/%3E%3C/svg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
              >
                <option value="">Any Sign</option>
                {options.horoscope.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <label className="mb-2 mt-4 block text-[0.77rem] font-medium text-[#4a3028]">Interests</label>
              <div className="max-h-[110px] overflow-y-auto rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] p-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {options.interests.map(interest => (
                    <button 
                      key={interest} 
                      type="button" 
                      className={`rounded-full border-[1.5px] border-[#e8ddd8] px-2.5 py-1 font-['DM_Sans'] text-[0.71rem] transition-all duration-150 ${filters.interests.includes(interest) ? "bg-gradient-to-br from-[#3d1f12] to-[#8b4e2e] border-transparent text-white" : "bg-white text-[#6b4a3a] hover:border-[#c9856a]"}`} 
                      onClick={() => onToggleInterest(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isPremium && (
          <div className="mt-4 rounded-xl border border-[#f0ddd5] bg-[#fdf5ee] p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.78rem] font-medium text-[#4a3028]">
                <Heart size={13} className="text-[#c9856a]" /> Daily Likes
              </span>
              <span className="text-[0.78rem] font-semibold text-[#8b4e2e]">{likesRemaining} / 5</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#ede5e0]">
              <div className="h-full bg-gradient-to-r from-[#8b4e2e] to-[#c9856a] transition-all duration-500" style={{ width: `${(likesRemaining / 5) * 100}%` }} />
            </div>
            <p className="mt-2 text-[0.69rem] text-[#9a7060]">Upgrade to Premium for unlimited likes ✦</p>
          </div>
        )}
      </div>

      {onClose && (
        <div className="p-4 border-t border-[#f0ddd5] bg-[#fdf8f4] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] text-white font-medium text-[0.88rem] shadow-[0_4px_14px_rgba(139,78,46,0.25)] transition-all active:scale-[0.98]"
          >
            Show Matching Profiles ✦
          </button>
        </div>
      )}
    </aside>
  );
};

export default React.memo(FilterSidebar);
