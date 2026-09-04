import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Settings,
  Sparkles,
  Calendar,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { SearchBar } from '../ui/SearchBar'
import { NotificationPanel } from '../dashboard/NotificationPanel'
import { DeleteConfirmModal } from '../reports/DeleteConfirmModal'

export interface TopNavbarProps {
  onToggleMobileSidebar: () => void
  isSidebarCollapsed: boolean
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileSidebar,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()

  const [searchQuery, setSearchQuery] = useState('')
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Current Date Formatter required by prompt
  const currentDateFormatted = new Date('2026-09-04T16:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Dynamic Page Title required by prompt
  const getPageTitle = () => {
    const p = location.pathname
    if (p === '/') return 'Dashboard Overview'
    if (p.startsWith('/evaluations/new')) return 'Create New Evaluation'
    if (p.startsWith('/uploads')) return 'Evaluation Queue'
    if (p.startsWith('/manual-review')) return 'Teacher Manual Review'
    if (p.startsWith('/students')) return 'Student Directory'
    if (p.startsWith('/history') || p.startsWith('/reports')) return 'Evaluation Reports'
    if (p.startsWith('/analytics')) return 'Institutional Analytics'
    if (p.startsWith('/archived')) return 'Archived Reports'
    if (p.startsWith('/settings')) return 'Settings & Thresholds'
    if (p.startsWith('/help')) return 'Help & Support Center'
    return 'Smart Grade Assistant'
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-20 w-full h-18 bg-white/85 dark:bg-[#020617]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-[#334155] transition-colors duration-200 shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 gap-4">
        {/* Left Side: Mobile Sidebar Trigger & Dynamic Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1E293B]"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight leading-snug">
              {getPageTitle()}
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#94A3B8]">
              <Calendar className="w-3 h-3 text-[#22C55E]" />
              <span>{currentDateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search evaluations, anonymous UUIDs, courses..."
          />
        </div>

        {/* Right Side: Demo Badge, Help Link, Theme Toggle, Notifications, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Demo Mode Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Demo Mode: ON</span>
          </div>

          {/* Help Link */}
          <button
            onClick={() => navigate('/help')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Help & Support"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Notifications Toggle */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <NotificationPanel onClose={() => setIsNotifOpen(false)} />
              )}
            </AnimatePresence>
          </div>

          {/* Teacher Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-green-500/20"
              />
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 divide-y divide-slate-100 dark:divide-slate-800"
                >
                  <div className="p-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-[10px] font-semibold border border-green-200 dark:border-green-800">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{user.role}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        navigate('/settings')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings & Thresholds</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        navigate('/help')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>Help & Support</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        setIsLogoutModalOpen(true)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <DeleteConfirmModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={logout}
          title="Logout Confirmation"
          description="Are you sure you want to sign out of Smart Grade Assistant?"
          confirmText="Confirm Logout"
          isPermanent={false}
        />
      )}
    </header>
  )
}
