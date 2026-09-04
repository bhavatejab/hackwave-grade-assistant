import React from 'react'
import { motion } from 'framer-motion'
import { CheckCheck, Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

export const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
      case 'danger':
        return <XCircle className="w-4 h-4 text-red-500 shrink-0" />
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Notifications
          </h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No notifications</div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                !item.read
                  ? 'bg-blue-50/30 dark:bg-blue-950/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {getIcon(item.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}
