import React from 'react'

function Founder() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6">

       
        <img
          src="./images/prashan.png"
          alt="Founder"
          className="w-60 h-50 rounded-full object-cover shadow-lg"
        />

       
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            Built by a Solo Founder, for Growing Teams
          </h1>

          <p className="text-gray-900 text-lg leading-relaxed mb-4">
            This product started with a simple observation:
            Indian startups, especially in Tier-2 cities, need clarity—not complexity.
            Built independently after real market research, this tool focuses on saving
            engineering time, reducing delivery delays, and helping teams make better
            decisions—without expensive tools.
          </p>

          <p className="text-gray-800  font-black">
            Founder: <span className="font-semibold">Prashant Pagare</span>
          </p>
        </div>

      </div>
    </section>
  )
}

export default Founder
