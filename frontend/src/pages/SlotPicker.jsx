import { useEffect, useState } from 'react'

const packages = [
  { code: 'BASIC', label: 'ตรวจสุขภาพพื้นฐาน' },
  { code: 'PREMIUM', label: 'ตรวจสุขภาพพรีเมียม' },
]

const today = new Date().toISOString().slice(0, 10)

const mockSlots = {
  BASIC: [
    { id: 'basic-0900', startTime: '09:00', remaining: 4 },
    { id: 'basic-1300', startTime: '13:00', remaining: 2 },
  ],
  PREMIUM: [
    { id: 'premium-1000', startTime: '10:00', remaining: 1 },
    { id: 'premium-1400', startTime: '14:00', remaining: 3 },
  ],
}

// Supports FR-BKG-01 and FR-BKG-06 with the API mock used by this task.
export function mockLoadSlots({ packageCode }) {
  return Promise.resolve(mockSlots[packageCode] ?? [])
}

// Supports FR-BKG-01 and FR-BKG-06 package and slot selection.
export default function SlotPicker({ loadSlots = mockLoadSlots }) {
  const [packageCode, setPackageCode] = useState(packages[0].code)
  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    loadSlots({ dateFrom: date, packageCode }).then((nextSlots) => {
      if (active) {
        setSlots(nextSlots)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [date, loadSlots, packageCode])

  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6 text-slate-900">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">จองคิวตรวจสุขภาพ</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">เลือกแพ็กเกจและช่วงเวลา</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold">
          <span>แพ็กเกจ</span>
          <select
            aria-label="แพ็กเกจ"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            value={packageCode}
            onChange={(event) => setPackageCode(event.target.value)}
          >
            {packages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold">
          <span>วันที่ตรวจ</span>
          <input
            aria-label="วันที่ตรวจ"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>

      <div aria-busy={loading} aria-live="polite">
        <h2 className="text-lg font-bold">ช่วงเวลาที่ว่าง</h2>
        {loading ? (
          <p className="mt-3 text-slate-600">กำลังโหลดช่วงเวลา...</p>
        ) : slots.length === 0 ? (
          <p className="mt-3 text-slate-600">ไม่มีช่วงเวลาว่าง</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {slots.map((slot) => (
              <button
                className="flex items-center justify-between rounded-lg border border-slate-300 bg-white p-4 text-left shadow-sm hover:border-teal-600"
                key={slot.id}
                type="button"
              >
                <span className="font-semibold">{slot.startTime} น.</span>
                <span className="text-sm text-slate-600">เหลือ {slot.remaining} ที่นั่ง</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}