import { useState, useEffect } from 'react'
import { db } from './db'
import { Activity, Ruler, Weight, TrendingUp, Heart, AlertCircle, AlertTriangle, Calendar, ArrowUpRight, Clock } from 'lucide-react'
import {
  getAgeDisplay, getAgeMonths,
  getCurrentBMI, getBMIStatus, getHeightPercentile, getWeightPercentile,
  forecastShortTerm, getNutritionSummary
} from './useGrowth'

export default function HealthDataPage() {
  const [children, setChildren] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [measurements, setMeasurements] = useState([])

  useEffect(() => {
    loadChildren()
  }, [])

  useEffect(() => {
    if (selected) loadMeasurements(selected.id)
  }, [selected?.id])

  async function loadChildren() {
    try {
      const data = await db.getChildren()
      setChildren(data)
      if (data.length > 0) setSelected(data[0])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function loadMeasurements(childId) {
    try {
      setMeasurements([])
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

  if (children.length === 0) {
    return (
      <div className="pt-[env(safe-area-inset-top)] min-h-full flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
          <Activity size={28} className="text-secondary" />
        </div>
        <h2 className="font-display text-lg font-bold text-gray-700 mb-2">No Health Data</h2>
        <p className="text-sm text-gray-400 text-center">Add a child in the Track tab to see health insights</p>
      </div>
    )
  }

  const child = selected
  const ageYears = child ? getAgeMonths(child.dob) : 0
  const ageDisplay = child ? getAgeDisplay(child.dob) : ''
  const bmi = child ? getCurrentBMI(child.height, child.weight) : null
  const bmiStatus = bmi ? getBMIStatus(bmi, ageYears, child.gender) : null
  const heightPerc = child?.height ? getHeightPercentile(child.gender, ageYears, child.height) : null
  const weightPerc = child?.weight ? getWeightPercentile(child.gender, ageYears, child.weight) : null
  const isBoy = child?.gender === 'boy'

  const nutrition = child ? getNutritionSummary(child.gender, ageYears, child.height, child.weight) : {}

  const allMeasurements = [
    ...measurements,
    ...(child?.height || child?.weight ? [{ date: child.lastMeasured || new Date().toISOString(), height: child.height, weight: child.weight }] : [])
  ]
  const forecast = child ? forecastShortTerm(child.gender, child.dob, child.height, child.weight, allMeasurements) : {}

  
  return (
    <div className="pt-[env(safe-area-inset-top)] min-h-full">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-gray-800 mb-1">Health Data</h1>
        <p className="text-sm text-gray-400">Comprehensive growth overview</p>
      </div>

      {/* Child selector */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selected?.id === c.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}>
              {c.gender === 'boy' ? '👦' : '👧'} {c.name}
            </button>
          ))}
        </div>
      </div>

      {child && (
        <div className="px-5 pb-8 space-y-4 animate-fade-up">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Ruler size={18} />} label="Current Height"
              value={child.height ? `${child.height} cm` : 'Not set'}
              sub={heightPerc ? `${heightPerc}th percentile` : null}
              bg="bg-primary/5" iconColor="text-primary" />
            <StatCard icon={<Weight size={18} />} label="Current Weight"
              value={child.weight ? `${child.weight} kg` : 'Not set'}
              sub={weightPerc ? `${weightPerc}th percentile` : null}
              bg="bg-secondary/5" iconColor="text-secondary" />
            <StatCard icon={<Heart size={18} />} label="BMI-for-Age"
              value={bmi || 'N/A'}
              sub={bmiStatus ? `${bmiStatus.label} (z: ${bmiStatus.z})` : null}
              bg={bmiStatus?.category === 'normal' ? 'bg-emerald-50' : bmiStatus?.category === 'overweight' ? 'bg-amber-50' : bmiStatus?.category === 'obese' ? 'bg-red-50' : 'bg-orange-50'}
              iconColor={bmiStatus?.category === 'normal' ? 'text-emerald-500' : bmiStatus?.category === 'overweight' ? 'text-amber-500' : bmiStatus?.category === 'obese' ? 'text-red-500' : 'text-orange-500'}
              subColor={bmiStatus?.color} />
            <StatCard icon={<Calendar size={18} />} label="Age"
              value={ageDisplay}
              sub={`${Math.round(ageYears * 12)} months`}
              bg="bg-blue-50" iconColor="text-blue-500" />
          </div>

          {/* Nutrition Status */}
          {(nutrition.stunting || nutrition.wasting || nutrition.underweight) && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-amber-500" />
                <h3 className="font-display text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Nutrition Status
                </h3>
              </div>
              <div className="space-y-2.5">
                {nutrition.stunting && (
                  <NutritionRow label="Stunting" sublabel="Height-for-Age" status={nutrition.stunting} />
                )}
                {nutrition.underweight && (
                  <NutritionRow label="Underweight" sublabel="Weight-for-Age" status={nutrition.underweight} />
                )}
                {nutrition.wasting && (
                  <NutritionRow label="Wasting" sublabel="Weight-for-Height" status={nutrition.wasting} />
                )}
              </div>
              <p className="text-[10px] text-gray-300 mt-3 text-center">Based on WHO z-score classifications</p>
            </div>
          )}

          {/* Short-term Forecast Summary */}
          {(forecast.height3m || forecast.weight3m) && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpRight size={16} className="text-emerald-500" />
                <h3 className="font-display text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Growth Projections
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* 3-Month */}
                <div className="bg-emerald-50 rounded-2xl p-3.5">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2 flex items-center gap-1">
                    <Clock size={10} /> 3 Months
                  </p>
                  {forecast.height3m && (
                    <div className="mb-1.5">
                      <span className="text-xs text-emerald-500">Height</span>
                      <p className="font-display text-lg font-bold text-emerald-700">{forecast.height3m} cm</p>
                    </div>
                  )}
                  {forecast.weight3m && (
                    <div>
                      <span className="text-xs text-emerald-500">Weight</span>
                      <p className="font-display text-lg font-bold text-emerald-700">{forecast.weight3m} kg</p>
                    </div>
                  )}
                </div>
                {/* 6-Month */}
                <div className="bg-blue-50 rounded-2xl p-3.5">
                  <p className="text-[10px] font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                    <Clock size={10} /> 6 Months
                  </p>
                  {forecast.height6m && (
                    <div className="mb-1.5">
                      <span className="text-xs text-blue-500">Height</span>
                      <p className="font-display text-lg font-bold text-blue-700">{forecast.height6m} cm</p>
                    </div>
                  )}
                  {forecast.weight6m && (
                    <div>
                      <span className="text-xs text-blue-500">Weight</span>
                      <p className="font-display text-lg font-bold text-blue-700">{forecast.weight6m} kg</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          

        

          {/* Measurement History Count */}
          {measurements.length > 0 && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="font-display text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Measurement History
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-700">{measurements.length}</span> measurement{measurements.length !== 1 ? 's' : ''} recorded
              </p>
              <p className="text-xs text-gray-400 mt-1">Add more data points in the Track tab for better forecasts</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium">
                This tool is designed to support screening and monitoring of child growth. It does not replace clinical judgment. Final decisions should be made in consultation with trained health professionals.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, sub, bg, iconColor, subColor }) {
  return (
    <div className={`${bg} rounded-2xl p-4`}>
      <div className={`${iconColor} mb-2`}>{icon}</div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-display text-lg font-bold text-gray-800">{value}</p>
      {sub && <p className={`text-xs font-semibold mt-0.5 ${subColor || 'text-gray-400'}`}>{sub}</p>}
    </div>
  )
}


function NutritionRow({ label, sublabel, status }) {
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
