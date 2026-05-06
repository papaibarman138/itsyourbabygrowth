import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Search, BarChart3, Activity } from 'lucide-react'
import TrackPage from './TrackPage'
import ChartsPage from './ChartsPage'
import HealthDataPage from './HealthDataPage'

export default function App() {
  return (
    <HashRouter>
      <div className="h-full flex flex-col bg-[rgb(var(--color-bg))]">
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
          <Routes>
            <Route path="/" element={<TrackPage />} />
            <Route path="/charts" element={<ChartsPage />} />
            <Route path="/health" element={<HealthDataPage />} />
          </Routes>
        </div>

        {/* Bottom Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-20 pb-[env(safe-area-inset-bottom,0px)]">
          <div className="flex items-center justify-around h-[4.5rem] max-w-md mx-auto">
            <TabItem to="/" icon={Search} label="Track" />
            <TabItem to="/charts" icon={BarChart3} label="Charts" />
            <TabItem to="/health" icon={Activity} label="Health Data" />
          </div>
        </div>
      </div>
    </HashRouter>
  )
}

function TabItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 ${
          isActive
            ? 'text-primary'
            : 'text-gray-400 hover:text-gray-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] font-semibold ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </>
      )}
    </NavLink>
  )
}
