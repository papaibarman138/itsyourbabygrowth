import { useState, useEffect } from 'react'
import { Ruler, Weight, Sparkles, TrendingUp, Trash2, Edit3, Check, X, Star, Clock, Plus, Calendar, ArrowUpRight, AlertTriangle } from 'lucide-react'
import {
  getAgeDisplay, getAgeMonths,
  getCurrentBMI, getBMIStatus, getHeightPercentile, getWeightPercentile,
  forecastShortTerm, getNutritionSummary
} from './useGrowth'

export default function ChildCard({ child, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [height, setHeight] = useState(child.height?.toString() || '')
  const [weight, setWeight] = useState(child.weight?.toString() || '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [measurements, setMeasurements] = useState([])
  const [showAddHistory, setShowAddHistory] = useState(false)
  const [histDate, setHistDate] = useState('')
  const [histHeight, setHistHeight] = useState('')
  const [histWeight, setHistWeight] = useState('')
  const [savingHist, setSavingHist] = useState(false)

  const ageYears = getAgeMonths(child.dob)
  const ageDisplay = getAgeDisplay(child.dob)
  const bmi = getCurrentBMI(child.height, child.weight)
  const bmiStatus = getBMIStatus(bmi, ageYears, child.gender)
  const heightPercentile = child.height ? getHeightPercentile(child.gender, ageYears, child.height) : null
  const weightPercentile = child.weight ? getWeightPercentile(child.gender, ageYears, child.weight) : null
  const isBoy = child.gender === 'boy'
  const nutrition = getNutritionSummary(child.gender, ageYears, child.height, child.weight)

  

 async function loadMeasurements() {
  try {
    setMeasurements(child.measurements || [])
  } catch (e) {
    console.error(e)
  }
}
// Load measurement history
useEffect(() => {
  loadMeasurements()
}, [child.id])
  
  // Short-term forecast
  const allMeasurements = [
    ...measurements,
    ...(child.height || child.weight ? [{ date: child.lastMeasured || new Date().toISOString(), height: child.height, weight: child.weight }] : [])
  ]
  allMeasurements.sort(
  (a, b) => new Date(a.date) - new Date(b.date)
)
  const forecast = forecastShortTerm(child.gender, child.dob, child.height, child.weight, allMeasurements)

  function handleSaveMeasurement() {
    const h = height ? parseFloat(height) : null
    const w = weight ? parseFloat(weight) : null
    onUpdate(child.id, h, w)
    setEditing(false)
  }

 async function handleAddHistory() {
  if (!histDate || (!histHeight && !histWeight) || savingHist) return

  setSavingHist(true)

  try {
    const updatedChildren = JSON.parse(
      localStorage.getItem("baby_growth_children")
    ) || []

    const updated = updatedChildren.map((c) => {
      if (c.id === child.id) {
        return {
          ...c,
          measurements: [
            ...(c.measurements || []),
            {
              id: Date.now(),
              date: histDate,
              height: histHeight ? parseFloat(histHeight) : null,
              weight: histWeight ? parseFloat(histWeight) : null,
            },
          ],
        }
      }

      return c
    })

    localStorage.setItem(
      "baby_growth_children",
      JSON.stringify(updated)
    )

    const selected = updated.find(c => c.id === child.id)

    setMeasurements(selected.measurements || [])

    setHistDate('')
    setHistHeight('')
    setHistWeight('')
    setShowAddHistory(false)

  } catch (e) {
    console.error(e)
  } finally {
    setSavingHist(false)
  }
}

  async function handleDeleteMeasurement(id) {
  try {
    const children = JSON.parse(
      localStorage.getItem("baby_growth_children")
    ) || []

    const updated = children.map((c) => {
      if (c.id === child.id) {
        return {
          ...c,
          measurements: (c.measurements || []).filter(
            (m) => m.id !== id
          ),
        }
      }

      return c
    })

    localStorage.setItem(
      "baby_growth_children",
      JSON.stringify(updated)
    )

    const selected = updated.find(c => c.id === child.id)

    setMeasurements(selected.measurements || [])

  } catch (e) {
    console.error(e)
  }
}
  // Get the last 3 months cutoff
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  const recentMeasurements = measurements.filter(
  m => m.date && new Date(m.date) >= threeMonthsAgo
)

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Child Info Header */}
      <div className={`bg-gradient-to-br ${isBoy ? 'from-blue-50 to-cyan-50' : 'from-pink-50 to-purple-50'} rounded-3xl p-5 relative overflow-hidden`}>
        <div className="absolute top-2 right-3 opacity-20">
          <Sparkles size={60} className={isBoy ? 'text-blue-300' : 'text-pink-300'} />
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${isBoy ? 'bg-blue-100' : 'bg-pink-100'} flex items-center justify-center text-2xl shadow-sm`}>
            {isBoy ? '👦' : '👧'}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-gray-800">{child.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{ageDisplay} old</p>
            <p className="text-xs text-gray-400 mt-0.5">Born {new Date(child.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-xl bg-white/60 text-gray-400 active:bg-red-50 active:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Current Measurements */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display text-sm font-bold text-gray-700 uppercase tracking-wider">Current Measurements</h4>
          {!editing && (
            <button
              onClick={() => { setEditing(true); setHeight(child.height?.toString() || ''); setWeight(child.weight?.toString() || '') }}
              className="flex items-center gap-1 text-primary text-xs font-bold active:opacity-70"
            >
              <Edit3 size={12} />
              Update
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-400 mb-1 block">Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} step="0.1" min="0" placeholder="cm"
                  className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-400 mb-1 block">Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" min="0" placeholder="kg"
                  className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveMeasurement}
                className="flex-1 flex items-center justify-center gap-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform">
                <Check size={16} /> Save
              </button>
              <button onClick={() => setEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm active:scale-95 transition-transform">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <MeasurementBox icon={<Ruler size={18} />} label="Height"
              value={child.height ? `${child.height} cm` : '—'}
              percentile={heightPercentile} isPrimary={true} />
            <MeasurementBox icon={<Weight size={18} />} label="Weight"
              value={child.weight ? `${child.weight} kg` : '—'}
              percentile={weightPercentile} isPrimary={false} />
          </div>
        )}

        {bmi && bmiStatus && (
          <div className="mt-3 bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold">BMI-for-Age</span>
                <span className="font-bold text-gray-700">{bmi}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                bmiStatus.category === 'normal' ? 'bg-emerald-100 text-emerald-600' :
                bmiStatus.category === 'overweight' ? 'bg-amber-100 text-amber-600' :
                bmiStatus.category === 'obese' ? 'bg-red-100 text-red-600' :
                bmiStatus.category === 'thin' ? 'bg-orange-100 text-orange-600' :
                'bg-red-100 text-red-600'
              }`}>{bmiStatus.label}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-gray-400">z-score:</span>
              <span className={`text-[11px] font-bold ${bmiStatus.color}`}>{bmiStatus.z}</span>
              <span className="text-[10px] text-gray-300 ml-1">WHO LMS method</span>
            </div>
          </div>
        )}
      </div>

      {/* Nutrition Status — Stunting, Wasting, Underweight */}
      {(nutrition.stunting || nutrition.wasting || nutrition.underweight) && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <h4 className="font-display text-sm font-bold text-gray-700 uppercase tracking-wider">Nutrition Status</h4>
          </div>
          <div className="space-y-2.5">
            {nutrition.stunting && (
              <NutritionBadge
                label="Stunting"
                sublabel="Height-for-Age"
                status={nutrition.stunting}
              />
            )}
            {nutrition.underweight && (
              <NutritionBadge
                label="Underweight"
                sublabel="Weight-for-Age"
                status={nutrition.underweight}
              />
            )}
            {nutrition.wasting && (
              <NutritionBadge
                label="Wasting"
                sublabel="Weight-for-Height"
                status={nutrition.wasting}
              />
            )}
          </div>
          <p className="text-[10px] text-gray-300 mt-3 text-center">Based on WHO z-score classifications</p>
        </div>
      )}

      {/* Measurement History (Last 3 Months) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h4 className="font-display text-sm font-bold text-gray-700 uppercase tracking-wider">Last 3 Months</h4>
          </div>
          <button
            onClick={() => setShowAddHistory(!showAddHistory)}
            className="flex items-center gap-1 text-primary text-xs font-bold active:opacity-70"
          >
            <Plus size={12} />
            Add Entry
          </button>
        </div>

        {/* Add History Entry Form */}
        {showAddHistory && (
          <div className="mb-4 p-4 bg-primary/5 rounded-2xl space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Date</label>
              <input type="date" value={histDate} onChange={e => setHistDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min={threeMonthsAgo.toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-100 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-400 mb-1 block">Height (cm)</label>
                <input type="number" value={histHeight} onChange={e => setHistHeight(e.target.value)} step="0.1" min="0" placeholder="cm"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-100 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-400 mb-1 block">Weight (kg)</label>
                <input type="number" value={histWeight} onChange={e => setHistWeight(e.target.value)} step="0.1" min="0" placeholder="kg"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-100 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddHistory} disabled={!histDate || (!histHeight && !histWeight) || savingHist}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform ${
                  histDate && (histHeight || histWeight) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-300'
                }`}>
                <Check size={14} /> {savingHist ? 'Saving...' : 'Save Entry'}
              </button>
              <button onClick={() => setShowAddHistory(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm active:scale-95 transition-transform">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* History List */}
        {recentMeasurements.length === 0 ? (
          <div className="text-center py-6">
            <Calendar size={28} className="text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No recent measurements</p>
            <p className="text-[10px] text-gray-300 mt-1">Add entries to improve forecast accuracy</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentMeasurements.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-gray-50 group">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-600">
                    {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {m.height && <span className="text-xs text-primary font-semibold">{m.height} cm</span>}
                    {m.weight && <span className="text-xs text-secondary font-semibold">{m.weight} kg</span>}
                  </div>
                </div>
                <button onClick={() => handleDeleteMeasurement(m.id)}
                  className="p-1.5 rounded-lg text-gray-300 active:text-red-400 active:bg-red-50">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Short-term Forecast */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpRight size={16} className="text-emerald-500" />
          <h4 className="font-display text-sm font-bold text-gray-700 uppercase tracking-wider">Short-term Forecast</h4>
        </div>

        {(!forecast.height3m && !forecast.weight3m) ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">Enter current measurements to see forecasts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 3-month forecast */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-600 mb-2">📅 In 3 Months</p>
              <div className="flex gap-4">
                {forecast.height3m && (
                  <div className="flex-1">
                    <p className="text-[10px] text-emerald-500 font-semibold uppercase">Height</p>
                    <p className="font-display text-xl font-bold text-emerald-700">{forecast.height3m} <span className="text-xs font-semibold">cm</span></p>
                    {child.height && (
                      <p className="text-[10px] text-emerald-500 mt-0.5">+{(forecast.height3m - child.height).toFixed(1)} cm</p>
                    )}
                  </div>
                )}
                {forecast.weight3m && (
                  <div className="flex-1">
                    <p className="text-[10px] text-emerald-500 font-semibold uppercase">Weight</p>
                    <p className="font-display text-xl font-bold text-emerald-700">{forecast.weight3m} <span className="text-xs font-semibold">kg</span></p>
                    {child.weight && (
                      <p className="text-[10px] text-emerald-500 mt-0.5">+{(forecast.weight3m - child.weight).toFixed(1)} kg</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 6-month forecast */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-blue-600 mb-2">📅 In 6 Months</p>
              <div className="flex gap-4">
                {forecast.height6m && (
                  <div className="flex-1">
                    <p className="text-[10px] text-blue-500 font-semibold uppercase">Height</p>
                    <p className="font-display text-xl font-bold text-blue-700">{forecast.height6m} <span className="text-xs font-semibold">cm</span></p>
                    {child.height && (
                      <p className="text-[10px] text-blue-500 mt-0.5">+{(forecast.height6m - child.height).toFixed(1)} cm</p>
                    )}
                  </div>
                )}
                {forecast.weight6m && (
                  <div className="flex-1">
                    <p className="text-[10px] text-blue-500 font-semibold uppercase">Weight</p>
                    <p className="font-display text-xl font-bold text-blue-700">{forecast.weight6m} <span className="text-xs font-semibold">kg</span></p>
                    {child.weight && (
                      <p className="text-[10px] text-blue-500 mt-0.5">+{(forecast.weight6m - child.weight).toFixed(1)} kg</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {recentMeasurements.length >= 2 && (
              <p className="text-[10px] text-emerald-500 text-center font-semibold">✨ Using your measurement history for better accuracy</p>
            )}
          </div>
        )}
      </div>

      
        

      {/* Disclaimer */}
      <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-100">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium">
            This tool is designed to support screening and monitoring of child growth. It does not replace clinical judgment. Final decisions should be made in consultation with trained health professionals.
          </p>
        </div>
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setConfirmDelete(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-gray-800 mb-2">Remove {child.name}?</h3>
            <p className="text-sm text-gray-400 mb-6">This will delete all their growth data. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm active:scale-95">Cancel</button>
              <button onClick={() => { onDelete(child.id); setConfirmDelete(false) }}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NutritionBadge({ label, sublabel, status }) {
  const bgMap = {
    normal: 'bg-emerald-100',
    moderate: 'bg-orange-100',
    severe: 'bg-red-100',
    overweight: 'bg-amber-100',
    obese: 'bg-red-100',
  }
  return (
    <div className={`flex items-center justify-between py-3 px-4 rounded-2xl ${status.bg} border ${status.border}`}>
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-700">{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{sublabel} · z-score: {status.z}</p>
      </div>
      <div className={`px-3 py-1.5 rounded-xl ${bgMap[status.status] || 'bg-gray-100'}`}>
        <span className={`text-[11px] font-bold ${status.color}`}>{status.label}</span>
      </div>
    </div>
  )
}

function MeasurementBox({ icon, label, value, percentile, isPrimary }) {
  return (
    <div className={isPrimary ? 'bg-primary/5 rounded-2xl p-4' : 'bg-secondary/5 rounded-2xl p-4'}>
      <div className={`flex items-center gap-2 mb-2 ${isPrimary ? 'text-primary' : 'text-secondary'}`}>
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-xl font-bold text-gray-800">{value}</p>
      {percentile !== null && (
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp size={12} className="text-emerald-500" />
          <span className="text-xs font-semibold text-gray-400">{percentile}th percentile</span>
        </div>
      )}
    </div>
  )
}
