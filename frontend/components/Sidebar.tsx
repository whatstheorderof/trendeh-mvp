import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Bookmark, 
  GraduationCap, 
  Zap,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [imageError, setImageError] = useState(false);
  const { user, login, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'Generate PDF Ideas', icon: Lightbulb },
    { id: 'saved', label: 'Saved PDF Ideas', icon: Bookmark },
    { id: 'course', label: 'Step by Step Course', icon: GraduationCap },
  ] as const;

  return (
    <div className="w-64 bg-gray-50/50 border-r border-gray-100 h-full flex flex-col print:hidden">
      <div className="p-8 pb-6">
        {!imageError ? (
          <img 
            src="./logo.png" 
            alt="trendeh" 
            className="h-10 w-auto object-contain mb-1"
            onError={() => setImageError(true)}
          />
        ) : (
          <h1 className="font-serif font-bold text-4xl tracking-tighter text-gray-900 mb-1">
            trendeh
          </h1>
        )}
        <p className="text-xs text-gray-500 font-medium ml-1">PDF Trend Lab</p>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-pink-600 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-pink-500' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 space-y-4">
        {/* Pro Plan Banner (Hide if already Pro) */}
        {(!user || !user.isPro) && (
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span className="text-sm font-bold text-gray-900">Pro Plan</span>
              </div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">Unlock unlimited searches and AI generation.</p>
              <button 
                onClick={() => setCurrentView('upgrade')}
                className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 transition-colors shadow-sm"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="pt-4 border-t border-gray-200">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {user.displayName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.isPro ? 'Pro Member' : 'Free Plan'}</p>
                </div>
              </div>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-900 transition-colors" title="Log out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <UserIcon className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
