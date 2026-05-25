import { useState, useEffect } from 'react'
import { db } from './db'
import { BarChart3, Ruler, Weight, AlertTriangle } from 'lucide-react'
import { getAgeMonths, getGrowthCurve, getWHOBands } from './useGrowth'

export default function ChartsPage() {
  const [children, setChildren] = useState([])
  const [selected, setSelected] = useState(null)
  const [chartType, setChartType] = useState('height')
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
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <BarChart3 size={28} className="text-primary" />
        </div>
        <h2 className="font-display text-lg font-bold text-gray-700 mb-2">No Data Yet</h2>
        <p className="text-sm text-gray-400 text-center">Add a child in the Track tab to see growth charts</p>
      </div>
    )
  }

  const curve = selected ? getGrowthCurve(selected.gender, chartType) : []
  const currentAgeMonths = selected ? getAgeMonths(selected.dob) : 0
  const currentAge = currentAgeMonths / 12
  const currentValue = selected ? (chartType === 'height' ? selected.height : selected.weight) : null

  // Prepare child's data points for the chart (measurements + current)
  const dataPoints = []
  const dobDate = selected ? new Date(selected.dob) : new Date()
  measurements.forEach(m => {
    const val = chartType === 'height' ? m.height : m.weight
    if (val) {
      const ageAtMeasurement = (new Date(m.date) - dobDate) / (365.25 * 24 * 60 * 60 * 1000)
      if (ageAtMeasurement >= 0 && ageAtMeasurement <= 18) {
        dataPoints.push({ age: ageAtMeasurement, value: val })
      }
    }
  })
  // Add current measurement if not already covered
  if (currentValue && currentAge >= 0 && currentAge <= 18) {
    const alreadyHas = dataPoints.some(d => Math.abs(d.age - currentAge) < 0.01)
    if (!alreadyHas) {
      dataPoints.push({ age: currentAge, value: currentValue })
    }
  }
  dataPoints.sort((a, b) => a.age - b.age)

  return (
    <div className="pt-[env(safe-area-inset-top)] min-h-full">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-gray-800 mb-1">WHO Growth Charts</h1>
        <p className="text-sm text-gray-400">Percentile bands with your child's data</p>
      </div>

      {/* Child selector */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {children.map(child => (
            <button key={child.id} onClick={() => setSelected(child)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selected?.id === child.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}>
              {child.gender === 'boy' ? '👦' : '👧'} {child.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart type toggle */}
      <div className="px-5 mb-6">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button onClick={() => setChartType('height')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              chartType === 'height' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
            }`}>
            <Ruler size={16} /> Height
          </button>
          <button onClick={() => setChartType('weight')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              chartType === 'weight' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400'
            }`}>
            <Weight size={16} /> Weight
          </button>
        </div>
      </div>

      {/* WHO Growth Chart with Percentile Bands */}
      <div className="px-5">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-gray-600 uppercase tracking-wider">
              WHO {chartType === 'height' ? 'Height' : 'Weight'} for Age
            </h3>
            <span className="text-[10px] font-semibold text-gray-300">
              {selected?.gender === 'boy' ? 'Boys' : 'Girls'} 0–18y
            </span>
          </div>
          <WHOGrowthChart
            gender={selected?.gender || 'boy'}
            chartType={chartType}
            curve={curve}
            currentAge={currentAge}
            currentValue={currentValue}
            dataPoints={dataPoints}
          />
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 px-1">
            <LegendItem color="rgba(32,172,172,0.08)" border="rgba(32,172,172,0.2)" label="3rd–97th" />
            <LegendItem color="rgba(32,172,172,0.15)" border="rgba(32,172,172,0.3)" label="15th–85th" />
            <LegendItem color="none" border="rgb(32,172,172)" label="50th (median)" line />
            <LegendDot label="Your child" />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-5 mt-4">
        <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium">
              This tool is designed to support screening and monitoring of child growth. It does not replace clinical judgment. Final decisions should be made in consultation with trained health professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="px-5 mt-4 pb-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-display text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">
            WHO Percentile Table
          </h3>
          <div className="space-y-0.5 max-h-[280px] overflow-y-auto hide-scrollbar">
            <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-1.5 border-b border-gray-100 sticky top-0 bg-white">
              <span className="w-12">Age</span>
              <span className="flex-1 text-center">3rd</span>
              <span className="flex-1 text-center">15th</span>
              <span className="flex-1 text-center font-extrabold text-primary">50th</span>
              <span className="flex-1 text-center">85th</span>
              <span className="flex-1 text-center">97th</span>
            </div>
            {curve.map((point, i) => {
              const isNearAge = Math.abs(point.age - currentAge) < 0.75
              return (
                <div key={i}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs ${
                    isNearAge ? 'bg-primary/10' : i % 2 === 0 ? 'bg-gray-50/50' : ''
                  }`}>
                  <span className={`w-12 font-semibold ${isNearAge ? 'text-gray-800' : 'text-gray-500'}`}>
                    {point.age < 1 ? `${Math.round(point.age * 12)}m` : `${point.age}y`}
                  </span>
                  <span className="flex-1 text-center text-gray-400">{point.p3}</span>
                  <span className="flex-1 text-center text-gray-500">{point.p15}</span>
                  <span className={`flex-1 text-center font-bold ${isNearAge ? 'text-primary' : 'text-gray-700'}`}>{point.p50}</span>
                  <span className="flex-1 text-center text-gray-500">{point.p85}</span>
                  <span className="flex-1 text-center text-gray-400">{point.p97}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, border, label, line }) {
  return (
    <div className="flex items-center gap-1.5">
      {line ? (
        <div className="w-4 h-0 border-t-2" style={{ borderColor: border }} />
      ) : (
        <div className="w-3 h-3 rounded-sm" style={{ background: color, border: `1px solid ${border}` }} />
      )}
      <span className="text-[9px] font-semibold text-gray-400">{label}</span>
    </div>
  )
}

function LegendDot({ label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white shadow-sm" />
      <span className="text-[9px] font-semibold text-gray-400">{label}</span>
    </div>
  )
}

function WHOGrowthChart({ gender, chartType, curve, currentAge, currentValue, dataPoints }) {
  const width = 310
  const height = 220
  const pad = { top: 15, right: 15, bottom: 28, left: 36 }

  const maxAge = 18
  const minVal = chartType === 'height' ? 40 : 0
  const maxVal = chartType === 'height' ? 200 : 85

  const x = (age) => pad.left + ((age / maxAge) * (width - pad.left - pad.right))
  const y = (val) => height - pad.bottom - (((val - minVal) / (maxVal - minVal)) * (height - pad.top - pad.bottom))

  // Generate smooth band paths using interpolated values at each integer year + extra early points
  const ageSteps = [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  function bandPath(lowField, highField) {
    const forward = ageSteps.map(a => `${x(a)},${y(curve.find(c => c.age === a)?.[highField] ?? 0)}`)
    const backward = [...ageSteps].reverse().map(a => `${x(a)},${y(curve.find(c => c.age === a)?.[lowField] ?? 0)}`)
    return `M ${forward.join(' L ')} L ${backward.join(' L ')} Z`
  }

  const medianPath = ageSteps.map((a, i) => {
    const val = curve.find(c => c.age === a)?.p50 ?? 0
    return `${i === 0 ? 'M' : 'L'} ${x(a)} ${y(val)}`
  }).join(' ')

  const accentColor = chartType === 'height' ? 'rgb(32,172,172)' : 'rgb(147,130,210)'

  // Child's data line
  const childPath = dataPoints.length >= 2
    ? dataPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.age)} ${y(d.value)}`).join(' ')
    : null

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Grid lines */}
      {[0, 3, 6, 9, 12, 15, 18].map(age => (
        <line key={`gx-${age}`} x1={x(age)} y1={pad.top} x2={x(age)} y2={height - pad.bottom}
          stroke="#f0f0f0" strokeWidth="0.5" />
      ))}
      {(chartType === 'height' ? [50, 80, 110, 140, 170, 200] : [0, 20, 40, 60, 80]).map(val => (
        <line key={`gy-${val}`} x1={pad.left} y1={y(val)} x2={width - pad.right} y2={y(val)}
          stroke="#f0f0f0" strokeWidth="0.5" />
      ))}

      {/* 3rd–97th percentile band (outer, lighter) */}
      <path d={bandPath('p3', 'p97')} fill={chartType === 'height' ? 'rgba(32,172,172,0.08)' : 'rgba(147,130,210,0.08)'} />

      {/* 15th–85th percentile band (inner, darker) */}
      <path d={bandPath('p15', 'p85')} fill={chartType === 'height' ? 'rgba(32,172,172,0.15)' : 'rgba(147,130,210,0.15)'} />

      {/* 50th percentile (median) line */}
      <path d={medianPath} fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Percentile labels at right edge */}
      {['p3', 'p15', 'p50', 'p85', 'p97'].map(pKey => {
        const val = curve[curve.length - 1]?.[pKey]
        if (!val) return null
        const label = pKey.replace('p', '')
        return (
          <text key={pKey} x={width - pad.right + 2} y={y(val) + 3}
            fontSize="6" fill="#999" fontWeight="500">{label}th</text>
        )
      })}

      {/* Child's measurement line */}
      {childPath && (
        <path d={childPath} fill="none" stroke="#f59e0b" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
      )}

      {/* Child's data points */}
      {dataPoints.map((d, i) => (
        <g key={i}>
          <circle cx={x(d.age)} cy={y(d.value)} r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
          {dataPoints.length <= 5 && (
            <text x={x(d.age)} y={y(d.value) - 7} textAnchor="middle" fontSize="7" fill="#f59e0b" fontWeight="bold">
              {d.value}
            </text>
          )}
        </g>
      ))}

      {/* Current position if no dataPoints match */}
      {currentValue && currentAge <= 18 && dataPoints.length === 0 && (
        <>
          <circle cx={x(currentAge)} cy={y(currentValue)} r="5" fill="#f59e0b" stroke="white" strokeWidth="2" />
          <text x={x(currentAge)} y={y(currentValue) - 10} textAnchor="middle" fontSize="8" fill="#f59e0b" fontWeight="bold">
            {currentValue}
          </text>
        </>
      )}

      {/* X axis labels */}
      {[0, 3, 6, 9, 12, 15, 18].map(age => (
        <text key={`xl-${age}`} x={x(age)} y={height - 6} textAnchor="middle" fontSize="8" fill="#999" fontWeight="500">
          {age}y
        </text>
      ))}

      {/* Y axis labels */}
      {(chartType === 'height'
        ? [50, 80, 110, 140, 170, 200]
        : [0, 20, 40, 60, 80]
      ).map(val => (
        <text key={`yl-${val}`} x={pad.left - 5} y={y(val) + 3} textAnchor="end" fontSize="7" fill="#bbb" fontWeight="500">
          {val}
        </text>
      ))}
    </svg>
  )
}
