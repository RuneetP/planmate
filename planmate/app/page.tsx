'use client'

import jsPDF from 'jspdf'
import { motion } from 'framer-motion'
import { useState } from 'react'


export default function Home() {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic')
  const [itinerary, setItinerary] = useState<any[] | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const travelCreators = [
  {
    name: 'Drew Binsky',
    platform: 'YouTube',
    description: 'Cultural travel & people stories around the world',
    url: 'https://www.youtube.com/@DrewBinsky',
  },
  {
    name: 'Kara and Nate',
    platform: 'YouTube',
    description: 'Adventure travel, van life & destinations',
    url: 'https://www.youtube.com/@KaraandNate',
  },
  {
    name: 'Rick Steves',
    platform: 'Blog / YouTube',
    description: 'Classic cultural and European travel guidance',
    url: 'https://www.youtube.com/@RickSteves',
  },
]

  function exportItineraryToCSV() {
  if (!itinerary) return

  const rows = [
    ['Day', 'Title', 'Activity']
  ]

  itinerary.forEach((day) => {
    day.activities.forEach((activity: string) => {
      rows.push([
        `Day ${day.day}`,
        day.title,
        activity
      ])
    })
  })

  const csvContent = rows
    .map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    )
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'planmate-itinerary.csv'
  link.click()

  URL.revokeObjectURL(url)
}

function exportItineraryToPDF() {
  if (!itinerary) return

  const doc = new jsPDF()
  let y = 20

  doc.setFontSize(18)
  doc.text('PlanMate Itinerary', 14, y)
  y += 10

  itinerary.forEach((day) => {
    doc.setFontSize(14)
    doc.text(`Day ${day.day}: ${day.title}`, 14, y)
    y += 8

    doc.setFontSize(11)
    day.activities.forEach((activity: string) => {
      doc.text(`• ${activity}`, 18, y)
      y += 6

      // Add new page if needed
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })

    y += 6
  })

  doc.save('planmate-itinerary.pdf')
}

  function getDaysBetween(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const days = Math.max(
    1,
    Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
  )
  return days
}

  function generateBasicItinerary() {
  // guard: must choose both dates
  if (!startDate || !endDate) {
    alert('Please select start and end dates')
    return
  }

  const days = getDaysBetween(startDate, endDate)

  const generated = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1} highlights`,
    activities: [
      'Morning exploration',
      'Lunch break',
      'Afternoon sightseeing',
      'Evening relax',
    ],
  }))

  setItinerary(generated)
}


function generateAdvancedItinerary() {
  setItinerary([
    {
      day: 1,
      title: '08:00 – 20:00 | Structured day',
      activities: [
        '08:00 Breakfast',
        '09:00 Must-visit attraction',
        '13:00 Lunch',
        '15:00 Secondary activity',
        '19:00 Dinner',
      ],
    },
    {
      day: 2,
      title: 'Custom paced exploration',
      activities: [
        'Morning nature walk',
        'Midday rest',
        'Evening cultural event',
      ],
    },
  ])
}


  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen font-sans">
      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-xl font-semibold">PlanMate</h1>
        <div className="flex gap-6 text-sm text-neutral-300">
          <a className="cursor-pointer">Features</a>
          <a className="cursor-pointer">Blogs</a>
          <a className="cursor-pointer">Pricing</a>
          <a className="cursor-pointer">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-10 py-32 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-semibold leading-tight"
        >
          Plan smarter trips.
          <br />
          Not longer ones.
        </motion.h2>

        <p className="mt-6 text-xl text-neutral-400 max-w-2xl">
          PlanMate creates precise, time-aware travel itineraries — automatically
          or manually — so you spend less time planning and more time traveling.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="px-6 py-3 bg-white text-black rounded-lg font-medium">
            Start Planning
          </button>
          <button className="px-6 py-3 border border-neutral-700 rounded-lg">
            View Demo
          </button>
        </div>
      </section>

      {/* ITINERARY BUILDER */}
<section className="px-10 py-24 bg-[#111]">
  <div className="max-w-4xl mx-auto">
    <h3 className="text-3xl font-semibold">Build your itinerary</h3>
    <p className="mt-3 text-neutral-400">
      Choose a quick plan or go deep with advanced preferences.
    </p>

    {/* Toggle */}
    <div className="mt-8 flex gap-4">
      <button
        onClick={() => setMode('basic')}
        className={`px-5 py-2 rounded-lg font-medium ${
          mode === 'basic'
            ? 'bg-white text-black'
            : 'border border-neutral-700'
        }`}
      >
        Basic
      </button>
      <button
        onClick={() => setMode('advanced')}
        className={`px-5 py-2 rounded-lg font-medium ${
          mode === 'advanced'
            ? 'bg-white text-black'
            : 'border border-neutral-700'
        }`}
      >
        Advanced
      </button>
    </div>

    {/* BASIC FORM */}
    {mode === 'basic' && (
      <div className="mt-10 grid gap-4">
        <input
          placeholder="Destination"
          className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
        />
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
             type="date"
            className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

        </div>
        <input
          placeholder="Interests (food, culture, nature)"
          className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
        />

        <button
  onClick={generateBasicItinerary}
  className="mt-4 px-6 py-3 bg-white text-black rounded-lg font-medium"
>
  Generate itinerary
</button>

      </div>
    )}

    {/* ADVANCED FORM */}
    {mode === 'advanced' && (
      <div className="mt-10 grid gap-4">
        <input
          placeholder="Destination"
          className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
          />
          <input
            type="date"
            className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Daily start time (e.g. 8:00)"
            className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
          />
          <input
            placeholder="Daily end time (e.g. 20:00)"
            className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
          />
          <select className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700">
            <option>Balanced pace</option>
            <option>Packed</option>
            <option>Relaxed</option>
          </select>
        </div>

        <input
          placeholder="Must-visit places (comma separated)"
          className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700"
        />

        <select className="px-4 py-3 rounded-lg bg-[#161616] border border-neutral-700">
          <option>Walking</option>
          <option>Public transport</option>
          <option>Car</option>
        </select>

        <button
          onClick={generateAdvancedItinerary}
          className="mt-4 px-6 py-3 bg-white text-black rounded-lg font-medium"
        >
          Generate advanced itinerary
        </button>
      </div>
    )}
    {/* ITINERARY OUTPUT */}
    {itinerary && (
      <div className="mt-16 space-y-6">
        <div className="flex items-center justify-between gap-4">
  <h4 className="text-2xl font-semibold">Your itinerary</h4>

  <div className="flex gap-3">
    <button
      onClick={exportItineraryToCSV}
      className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium"
    >
      Export CSV
    </button>

    <button
      onClick={exportItineraryToPDF}
      className="px-4 py-2 rounded-lg border border-neutral-600 text-sm"
    >
      Export PDF
    </button>
  </div>
</div>



        {itinerary.map((day, index) => (
          <div
            key={index}
            className="p-6 bg-[#161616] rounded-2xl border border-neutral-800"
          >
            <h5 className="font-medium">
              Day {day.day} — {day.title}
            </h5>

            <ul className="mt-3 list-disc list-inside text-neutral-400">
              {day.activities.map((activity: string, i: number) => (
                <li key={i}>{activity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </div>
</section>


{/* BLOGS / VLOGS */}
{/* TRAVEL INSPIRATION */}
<section className="px-10 py-24 bg-[#0f0f0f]">
  <div className="max-w-6xl mx-auto">
    <h3 className="text-3xl font-semibold">Travel inspiration</h3>
    <p className="mt-3 text-neutral-400">
      Learn from experienced travelers and creators before you go.
    </p>

    <div className="mt-10 grid md:grid-cols-3 gap-6">
      {travelCreators.map((creator) => (
        <a
          key={creator.name}
          href={creator.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 bg-[#161616] rounded-2xl border border-neutral-800 hover:border-neutral-600 transition"
        >
          <div className="text-sm text-neutral-500">{creator.platform}</div>
          <h4 className="mt-2 text-lg font-medium">{creator.name}</h4>
          <p className="mt-2 text-neutral-400 text-sm">
            {creator.description}
          </p>
          <div className="mt-4 text-sm text-white">
            Visit channel →
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="px-10 py-10 text-sm text-neutral-500 border-t border-neutral-800">
        © {new Date().getFullYear()} PlanMate
      </footer>
    </main>
  )
}
