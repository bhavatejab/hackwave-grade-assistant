import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  PlusCircle,
  UploadCloud,
  CheckSquare,
  History,
  BarChart3,
  Users,
  Archive,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Lock,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../contexts/AuthContext'
import { useEvaluation } from '../../contexts/EvaluationContext'

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
  const { user, logout } = useAuth()
  const location = useLocation()
  const { reportsCount, archivedCount, queueCount, pendingReviewCount } = useEvaluation()

  const isPathActive = (itemPath: string) => {
    const pathname = location.pathname
    if (itemPath === '/') return pathname === '/'
    if (itemPath === '/evaluations/new') return pathname.startsWith('/evaluations/new')
    if (itemPath === '/uploads') {
      return (
        pathname.startsWith('/uploads') ||
        pathname.startsWith('/evaluations/upload') ||
        pathname.startsWith('/evaluations/progress')
      )
    }
    if (itemPath === '/manual-review') {
      return (
        pathname.startsWith('/manual-review') ||
        pathname.startsWith('/evaluations/review') ||
        pathname.startsWith('/evaluations/results') ||
        pathname.startsWith('/evaluations/success')
      )
    }
    if (itemPath === '/history') return pathname.startsWith('/history') || pathname.startsWith('/reports')
    if (itemPath === '/archived') return pathname.startsWith('/archived')
    if (itemPath === '/analytics') return pathname.startsWith('/analytics')
    if (itemPath === '/students') return pathname.startsWith('/students')
    if (itemPath === '/settings') return pathname.startsWith('/settings')
    if (itemPath === '/help') return pathname.startsWith('/help')
    return pathname === itemPath
  }

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Create Evaluation', path: '/evaluations/new', icon: PlusCircle },
    {
      label: 'Evaluation Queue',
      path: '/uploads',
      icon: UploadCloud,
      badge: queueCount > 0 ? `${queueCount} Active` : undefined,
      badgeType: 'info' as const,
    },
    {
      label: 'Teacher Review',
      path: '/manual-review',
      icon: CheckSquare,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} Flagged` : undefined,
      badgeType: 'warning' as const,
    },
    { label: 'Students', path: '/students', icon: Users },
    {
      label: 'Reports',
      path: '/history',
      icon: History,
      badge: reportsCount > 0 ? `${reportsCount}` : undefined,
      badgeType: 'success' as const,
    },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    {
      label: 'Archive',
      path: '/archived',
      icon: Archive,
      badge: archivedCount > 0 ? `${archivedCount}` : undefined,
      badgeType: 'slate' as const,
    },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help', path: '/help', icon: HelpCircle },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] border-r border-slate-200/80 dark:border-[#334155] select-none">
      {/* Brand Header */}
      <div
        className={cn(
          'flex items-center h-18 border-b border-slate-200/80 dark:border-[#334155] shrink-0 transition-all duration-300 ease-in-out relative',
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
          {/* Logo Icon Box */}
          <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-sm">
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
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                Smart Grade
              </span>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold tracking-wider uppercase truncate">
                Enterprise AI
              </span>
            </motion.div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors shrink-0 ml-2"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* DPDP 2023 Anonymizer Banner */}
      {!isCollapsed && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#334155] flex items-center gap-2 text-[11px] text-slate-600 dark:text-[#CBD5E1] shrink-0">
          <Lock className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span className="leading-tight truncate font-medium">Anonymized UUID Active</span>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isPathActive(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group relative',
                  isActive
                    ? 'bg-[#22C55E] text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]',
                  isCollapsed && 'justify-center px-0'
                )
              }
            >
              <div className="relative flex items-center justify-center">
                <Icon className="w-4 h-4 shrink-0" />
                {isCollapsed && item.badge && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ring-white dark:ring-[#0F172A]',
                      item.badgeType === 'warning'
                        ? 'bg-amber-500'
                        : item.badgeType === 'info'
                        ? 'bg-blue-500'
                        : item.badgeType === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    )}
                  />
                )}
              </div>

              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.badge}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className={cn(
                      'px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 transition-colors',
                      item.badgeType === 'warning'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20'
                        : item.badgeType === 'info'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20'
                        : item.badgeType === 'success'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
                      isActive && 'bg-white/20 text-white border-white/30'
                    )}
                  >
                    {item.badge}
                  </motion.span>
                </AnimatePresence>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Bottom Teacher Profile Card */}
      <div className="p-3 border-t border-slate-200/80 dark:border-[#334155] shrink-0 space-y-2">
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-green-500/30 shrink-0"
              />
              <div className="min-w-0 truncate text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC] truncate leading-snug">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] truncate">{user.institution}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {isCollapsed && (
          <button
            onClick={logout}
            title="Logout"
            className="w-full flex items-center justify-center p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Flex Sidebar */}
      <aside
        className={cn(
          'hidden md:block h-screen sticky top-0 shrink-0 z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-[280px]'
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
              className="fixed top-0 bottom-0 left-0 w-[280px] z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

