import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layouts/Sidebar'
import { TopNavbar } from '../components/layouts/TopNavbar'

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-row antialiased transition-colors duration-200">
      {/* Responsive Sidebar Column */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Right Column Container: TopNavbar + Resizable Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <TopNavbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden transition-all duration-300 ease-in-out">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
