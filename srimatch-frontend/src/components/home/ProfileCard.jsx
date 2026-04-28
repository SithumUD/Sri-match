import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Check, MapPin, Briefcase, GraduationCap, BookOpen, Zap, ChevronRight } from 'lucide-react';

const ProfileCard = React.forwardRef(({ profile, likedProfiles, onToggleLike }, ref) => {
  const isLiked = profile.interactionType === 'NORMAL' || likedProfiles.some(p => p.profileId === profile.id && p.type === 'NORMAL');
  const isStarred = profile.interactionType === 'STAR' || likedProfiles.some(p => p.profileId === profile.id && p.type === 'STAR');
  const hasInteraction = profile.interactionType || likedProfiles.some(p => p.profileId === profile.id);

  return (
    <div 
      ref={ref} 
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_rgba(120,60,30,0.07),0_2px_6px_rgba(0,0,0,0.03)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(120,60,30,0.13),0_4px_10px_rgba(0,0,0,0.05)] ${profile.boosted ? 'ring-2 ring-[#e07a30]' : ''}`}
    >
      {/* Card Image */}
      <div className="relative h-[190px] overflow-hidden">
        <Link to={`/profile/${profile.id}`}>
          <img 
            src={profile.profileImage || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop"} 
            alt={profile.firstName} 
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105" 
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(30,10,5,0.58)] via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-[0.65rem] left-[0.65rem] flex gap-2">
          {profile.verified && (
            <div className="flex items-center gap-1 rounded-full bg-[rgba(61,31,18,0.85)] px-2.5 py-1 text-[0.67rem] font-semibold text-[#e8c97a] backdrop-blur-md">
              <Check size={9} /> Verified
            </div>
          )}
        </div>
        
        {profile.boosted && (
          <div className="absolute top-[0.65rem] right-[0.65rem] flex items-center gap-1 rounded-full bg-gradient-to-br from-[#e07a30] to-[#c93a1a] px-2.5 py-1 text-[0.67rem] font-semibold text-white">
            <Zap size={9} /> Boosted
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute right-[0.7rem] bottom-[0.7rem] flex gap-1.5">
          <button 
            type="button"
            className={`flex h-[33px] w-[33px] items-center justify-center rounded-full border-none transition-all duration-200 backdrop-blur-md ${isLiked ? 'bg-[#f4c9d0] text-[#c03060]' : 'bg-white/90 text-[#b09080] hover:bg-white hover:text-[#c9856a]'}`}
            onClick={() => !hasInteraction && onToggleLike(profile.id, 'NORMAL')}
            title="Like"
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
          </button>

          <button 
            type="button"
            className={`flex h-[33px] w-[33px] items-center justify-center rounded-full border-none transition-all duration-200 backdrop-blur-md ${isStarred ? 'bg-[#fff5d1] text-[#d4a017]' : 'bg-white/90 text-[#b09080] hover:bg-white hover:text-[#d4a017]'}`}
            onClick={() => !hasInteraction && onToggleLike(profile.id, 'STAR')}
            title="Star Like"
          >
            <Star size={14} fill={isStarred ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 sm:px-[1.2rem] sm:pt-4 sm:pb-[1.15rem]">
        <Link to={`/profile/${profile.id}`} className="mb-1 block font-['Cormorant_Garamond'] text-[1.25rem] font-semibold leading-tight text-[#2d1810] decoration-none transition-colors duration-200 hover:text-[#8b4e2e]">
          {profile.firstName}, {profile.age}
        </Link>
        
        <div className="mb-[0.6rem] flex items-center gap-1 text-[0.74rem] text-[#9a7060]">
          <MapPin size={10} /> {profile.city}, {profile.district}
        </div>

        <div className="mb-[0.65rem] flex flex-wrap gap-[0.3rem]">
          {profile.profession && (
            <span className="flex items-center gap-1 rounded-full bg-[#fdf0e8] px-2.5 py-1 text-[0.69rem] font-medium text-[#8b4e2e]">
              <Briefcase size={9} /> {profile.profession}
            </span>
          )}
          {profile.education && (
            <span className="flex items-center gap-1 rounded-full bg-[#edf5fd] px-2.5 py-1 text-[0.69rem] font-medium text-[#3a6ea8]">
              <GraduationCap size={9} /> {profile.education}
            </span>
          )}
          {profile.religion && (
            <span className="flex items-center gap-1 rounded-full bg-[#f5f0fa] px-2.5 py-1 text-[0.69rem] font-medium text-[#6a40a8]">
              <BookOpen size={9} /> {profile.religion}
            </span>
          )}
        </div>

        <p className="mb-[0.65rem] flex-1 line-clamp-2 text-[0.79rem] leading-[1.55] text-[#6b4a3a]">
          {profile.about}
        </p>

        {(profile.interests || []).length > 0 && (
          <div className="mb-[0.8rem] flex flex-wrap gap-[0.28rem]">
            {(profile.interests || []).slice(0, 3).map((it, i) => (
              <span key={i} className="rounded-full bg-[#f5ede8] px-2 py-[0.18rem] text-[0.67rem] text-[#8b5e4a]">
                {it}
              </span>
            ))}
            {(profile.interests || []).length > 3 && (
              <span className="rounded-full bg-[#f5ede8] px-2 py-[0.18rem] text-[0.67rem] text-[#8b5e4a]">
                +{(profile.interests || []).length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-[#f5ede8] pt-[0.7rem]">
          <Link to={`/profile/${profile.id}`} className="group/link flex items-center gap-[3px] text-[0.77rem] font-medium text-[#8b4e2e] decoration-none transition-all duration-200 hover:gap-[6px]">
            View Profile <ChevronRight size={12} />
          </Link>
          {profile.compatibilityScore && (
            <span className="bg-gradient-to-r from-[#8b4e2e] to-[#c9856a] bg-clip-text text-[0.71rem] font-semibold text-transparent">
              {profile.compatibilityScore}% match
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

export default React.memo(ProfileCard);
