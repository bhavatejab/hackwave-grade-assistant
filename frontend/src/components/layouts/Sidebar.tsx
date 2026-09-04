import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  PlusCircle,
  UploadCloud,
  CheckSquare,
  History,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../contexts/AuthContext'

export interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { logout } = useAuth()

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'New Evaluation', path: '/evaluations/new', icon: PlusCircle },
    { label: 'Student Uploads', path: '/uploads', icon: UploadCloud },
    { label: 'Manual Review', path: '/manual-review', icon: CheckSquare, badge: '3 Pending' },
    { label: 'Evaluation History', path: '/history', icon: History },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Students', path: '/students', icon: Users },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help & FAQ', path: '/help', icon: HelpCircle },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div
        className={cn(
          'flex items-center h-18 border-b border-slate-800 shrink-0 transition-all duration-300 ease-in-out relative',
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        )}
      >
        <div
          onClick={isCollapsed ? onToggleCollapse : undefined}
          className={cn(
            'flex items-center gap-3 min-w-0',
            isCollapsed && 'cursor-pointer'
          )}
          title={isCollapsed ? 'Click to expand sidebar' : undefined}
        >
          {/* Logo Icon Box - Uncropped, Crisp Aspect Ratio */}
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/25 transition-transform duration-300">
            <GraduationCap className="w-6 h-6 shrink-0 text-white" />
          </div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col min-w-0 truncate"
            >
              <span className="font-bold text-sm tracking-tight text-white truncate">
                Smart Grade
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase truncate">
                Enterprise AI
              </span>
            </motion.div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 ml-2"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* FERPA Anonymizer Banner */}
      {!isCollapsed && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-[11px] text-slate-300 shrink-0">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-tight truncate">Anonymized UUID Active</span>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60',
                  isCollapsed && 'justify-center px-0'
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button
          onClick={logout}
          title={isCollapsed ? 'Logout' : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Flex Sidebar */}
      <aside
        className={cn(
          'hidden md:block h-screen sticky top-0 shrink-0 z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 bottom-0 left-0 w-64 z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
