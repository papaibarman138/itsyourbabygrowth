import { useState, useEffect } from 'react'
import { db } from '../lib/db'
import { Plus, ChevronRight, Sparkles, Ruler, Weight, Baby, Trash2, Info, X } from 'lucide-react'
import {
  getAgeDisplay, getAgeDecimal, predictAdultHeight, predictHealthyWeight,
  getCurrentBMI, getBMIStatus, getHeightPercentile, getWeightPercentile
} from '../hooks/useGrowth'
import AddChildModal from '../components/AddChildModal'
import ChildCard from '../components/ChildCard'

const HERO_IMG = 'https://api.whacka.app/storage/v1/object/public/app-images/projects/92e44335-0275-4f78-867a-53d164b5dc61/gen-a15acd51-1777205664717.png'
const APP_LOGO = 'https://api.whacka.app/storage/v1/object/public/app-images/92e44335-0275-4f78-867a-53d164b5dc61/bc5b7753-0969-4763-b5ff-8adb7ecac4a4.jpeg'

export default function TrackPage() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedChild, setSelectedChild] = useState(null)

  useEffect(() => {
    loadChildren()
  }, [])

  async function loadChildren() {
    try {
      const data = await db.select('children', {}, { order: '-createdAt' })
      setChildren(data)
      if (data.length > 0 && !selectedChild) {
        setSelectedChild(data[0])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddChild(child) {
    try {
      const record = await db.insert('children', child)
      const updated = [record, ...children]
      setChildren(updated)
      setSelectedChild(record)
      setShowAdd(false)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDeleteChild(id) {
    try {
      await db.delete('children', id)
      const updated = children.filter(c => c.id !== id)
      setChildren(updated)
      if (selectedChild?.id === id) {
        setSelectedChild(updated[0] || null)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleUpdateMeasurement(id, height, weight) {
    try {
      const record = await db.update('children', id, { height, weight, lastMeasured: new Date().toISOString() })
      const updated = children.map(c => c.id === id ? { ...c, height, weight, lastMeasured: record.lastMeasured } : c)
      setChildren(updated)
      setSelectedChild(prev => prev?.id === id ? { ...prev, height, weight, lastMeasured: record.lastMeasured } : prev)
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-[env(safe-area-inset-top)] min-h-full">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 px-5 pt-6 pb-4">
          <div className="relative rounded-2xl overflow-hidden mb-4 shadow-sm">
            <img
              src={HERO_IMG}
              alt="NutriTrack"
              className="w-full h-40 object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-3">
              <img
                src={APP_LOGO}
                alt="NutriTrack Logo"
                className="w-10 h-10 rounded-xl object-cover shadow-md border-2 border-white/80"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <h1 className="font-display text-2xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
                NutriTrack
              </h1>
            </div>
          </div>

          {/* Children selector */}
          {children.length > 0 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedChild?.id === child.id
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-white text-gray-600 border border-gray-100 shadow-sm'
                  }`}
                >
                  <span>{child.gender === 'boy' ? '👦' : '👧'}</span>
                  {child.name}
                </button>
              ))}
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold text-primary bg-primary/10 border border-primary/20 whitespace-nowrap"
              >
                <Plus size={16} />
                Add Child
              </button>
            </div>
          )}
        </div>
      </div>

      {/* About the App */}
      <AboutApp />

      {/* Content */}
      <div className="px-5 pb-8">
        {children.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : selectedChild ? (
          <ChildCard
            child={selectedChild}
            onUpdate={handleUpdateMeasurement}
            onDelete={handleDeleteChild}
          />
        ) : null}
      </div>

      {showAdd && (
        <AddChildModal
          onClose={() => setShowAdd(false)}
          onSave={handleAddChild}
        />
      )}
    </div>
  )
}

function AboutApp() {
  const [open, setOpen] = useState(false)

  return (
    <div className="px-5 mt-2">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-primary/80 font-semibold active:scale-95 transition-transform"
      >
        <Info size={16} />
        About this App
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-fade-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <img
                src={APP_LOGO}
                alt="NutriTrack Logo"
                className="w-16 h-16 rounded-2xl object-cover shadow-md"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-gray-800">About NutriTrack</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                NutriTrack helps you track and forecast your child's growth using WHO standards. Monitor height, weight, BMI, and nutritional status with ease.
              </p>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-800 font-semibold">
                  Developed by
                </p>
                <p className="text-sm text-primary font-bold mt-1">
                  Dr. Papai Barman
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  PhD, MPhil, Public Health Researcher
                </p>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                © 2026. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-up">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Baby size={36} className="text-primary" />
      </div>
      <h2 className="font-display text-xl font-bold text-gray-800 mb-2">Start Tracking Growth</h2>
      <p className="text-gray-400 text-sm text-center mb-8 max-w-[260px]">
        Add your child's details to get growth predictions and track their progress
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
      >
        <Plus size={20} />
        Add Your Child
      </button>
    </div>
  )
}
