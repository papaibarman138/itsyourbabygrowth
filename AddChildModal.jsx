import { useState } from 'react'
import { X, Baby, ChevronDown } from 'lucide-react'

export default function AddChildModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [saving, setSaving] = useState(false)

  const canSave = name.trim() && dob && gender

  async function handleSave() {
    if (!canSave || saving) return
    setSaving(true)
    await onSave({
      name: name.trim(),
      dob,
      gender,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      lastMeasured: height || weight ? new Date().toISOString() : null,
    })
    setSaving(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end justify-center"
      style={{ height: 'var(--visual-height, 100dvh)' }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-3xl p-6 overflow-y-auto animate-slide-up"
        style={{ maxHeight: 'calc(var(--visual-height, 100dvh) - 2rem)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-gray-800">Add Child</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-100 active:bg-gray-200">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Papai Barman"
              className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 font-semibold text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 font-semibold text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Gender</label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender('boy')}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  gender === 'boy'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                }`}
              >
                👦 Boy
              </button>
              <button
                onClick={() => setGender('girl')}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  gender === 'girl'
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                }`}
              >
                👧 Girl
              </button>
            </div>
          </div>

          {/* Height & Weight */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="e.g. 75"
                step="0.1"
                min="0"
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 font-semibold text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 10"
                step="0.1"
                min="0"
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 font-semibold text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <p className="text-xs text-gray-300 text-center">Height and weight are optional — you can add them later</p>

          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
              canSave
                ? 'bg-primary text-white shadow-lg shadow-primary/30 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-300'
            }`}
          >
            {saving ? 'Saving...' : 'Add Child'}
          </button>
        </div>
      </div>
    </div>
  )
}
