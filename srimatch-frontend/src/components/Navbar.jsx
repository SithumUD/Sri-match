import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BellIcon,
  MessageCircleIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  HeartIcon,
  SearchIcon,
} from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef]);

  return (
    <nav className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to={isAuthenticated ? "/home" : "/"}
            className="text-2xl font-bold"
          >
            <span className="text-yellow-300">Sri</span>
            <span className="text-white">Match</span>
            <span className="text-pink-300">♥</span>
          </Link>
          {isAuthenticated ? (
            <>
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white focus:outline-none"
                >
                  {isMenuOpen ? (
                    <XIcon className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
              {/* Desktop navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/home"
                  className="hover:text-pink-200 transition duration-200 flex items-center"
                >
                  <SearchIcon className="h-4 w-4 mr-1" />
                  Browse
                </Link>
                <Link
                  to="/messages"
                  className="hover:text-pink-200 transition duration-200 flex items-center"
                >
                  <MessageCircleIcon className="h-4 w-4 mr-1" />
                  Messages
                </Link>
                <Link
                  to="/verification"
                  className="hover:text-pink-200 transition duration-200 flex items-center"
                >
                  <HeartIcon className="h-4 w-4 mr-1" />
                  Matches
                </Link>
                <div className="flex items-center space-x-4">
                  <Link to="/messages" className="relative">
                    <MessageCircleIcon className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                  <Link to="/notifications" className="relative">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      5
                    </span>
                  </Link>
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                    >
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <UserIcon className="h-5 w-5" />
                        </div>
                      )}
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 origin-top-right ring-1 ring-black ring-opacity-5">
                        <Link
                          to="/my-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-pink-200 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition duration-200"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
        {/* Mobile menu */}
        {isAuthenticated && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500">
            <Link
              to="/home"
              className="block py-2 hover:text-pink-200 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              Browse
            </Link>
            <Link
              to="/messages"
              className="block py-2 hover:text-pink-200 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageCircleIcon className="h-4 w-4 mr-2" />
              Messages
            </Link>
            <Link
              to="/verification"
              className="block py-2 hover:text-pink-200 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <HeartIcon className="h-4 w-4 mr-2" />
              Matches
            </Link>
            <Link
              to="/my-profile"
              className="block py-2 hover:text-pink-200 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              My Profile
            </Link>
            <Link
              to="/settings"
              className="block py-2 hover:text-pink-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block py-2 text-left w-full hover:text-pink-200"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
