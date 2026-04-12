import React, { useEffect, useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, UserIcon, MessageSquareIcon, SettingsIcon, LogOutIcon, ShieldCheckIcon, MenuIcon, XIcon, BellIcon, UsersIcon } from 'lucide-react';
import ConnectionRequests from './ConnectionRequests';
import NotificationsDropdown from './NotificationsDropdown';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const {
    user,
    logout,
    subscription
  } = useAuth();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownRef, notificationsRef]);
  
  const navItems = [{
    to: '/home',
    icon: <HomeIcon className="h-6 w-6" />,
    label: 'Browse'
  }, {
    to: '/messages',
    icon: <MessageSquareIcon className="h-6 w-6" />,
    label: 'Messages'
  }, {
    to: '/connections',
    icon: <UsersIcon className="h-6 w-6" />,
    label: 'Connections'
  }];
  
  return <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <NavLink to="/home" className="text-2xl font-bold text-purple-600">
                  SriMatch
                </NavLink>
              </div>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4 items-center">
              {navItems.map(item => <NavLink key={item.to} to={item.to} className={({
              isActive
            }) => `px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive ? 'text-purple-700 bg-purple-50' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}>
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </NavLink>)}
            </nav>
            {/* User Menu */}
            <div className="flex items-center">
              {/* Subscription Status */}
              <NavLink to="/subscription" className="mr-2 flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <span className="text-sm font-medium">
                  {subscription.plan === 'premium' ? 'Premium' : 'Upgrade'}
                </span>
              </NavLink>
              {/* Connection Requests */}
              <ConnectionRequests />
              {/* Notification */}
              <div className="relative" ref={notificationsRef}>
                <button className="relative p-2 rounded-full hover:bg-gray-100 mr-2" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                  <BellIcon className="h-6 w-6 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    3
                  </span>
                </button>
                {isNotificationsOpen && <NotificationsDropdown />}
              </div>
              {/* User Avatar */}
              <div className="relative inline-block" ref={profileDropdownRef}>
                <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center focus:outline-none p-1 rounded-full hover:bg-gray-100" aria-expanded={isProfileDropdownOpen} aria-haspopup="true">
                  <img src={user?.profileImage || 'https://via.placeholder.com/40'} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.firstName || 'User'}
                  </span>
                </button>
                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <NavLink to="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center" onClick={() => setIsProfileDropdownOpen(false)}>
                      <UserIcon className="h-4 w-4 mr-2" />
                      My Profile
                    </NavLink>
                    <NavLink to="/verification" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center" onClick={() => setIsProfileDropdownOpen(false)}>
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Verification
                    </NavLink>
                    <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center" onClick={() => setIsProfileDropdownOpen(false)}>
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </NavLink>
                    <button onClick={() => {
                  setIsProfileDropdownOpen(false);
                  handleLogout();
                }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center">
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>}
                {/* Mobile logout button */}
                <button onClick={handleLogout} className="ml-4 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden" title="Logout">
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center ml-4">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none">
                  {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(item => <NavLink key={item.to} to={item.to} className={({
            isActive
          }) => `block px-3 py-2 rounded-md text-base font-medium flex items-center ${isActive ? 'text-purple-700 bg-purple-50' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>)}
              <NavLink to="/my-profile" className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 hover:text-purple-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                <span className="mr-3">
                  <UserIcon className="h-6 w-6" />
                </span>
                My Profile
              </NavLink>
              <NavLink to="/verification" className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 hover:text-purple-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                <span className="mr-3">
                  <ShieldCheckIcon className="h-6 w-6" />
                </span>
                Verification
              </NavLink>
              <NavLink to="/settings" className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-700 hover:text-purple-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                <span className="mr-3">
                  <SettingsIcon className="h-6 w-6" />
                </span>
                Settings
              </NavLink>
            </div>
          </div>}
      </header>
      {/* Main Content */}
      <main className="py-6 px-4 sm:p-6 md:py-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>;
};

export default Layout;