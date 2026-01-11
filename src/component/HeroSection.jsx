import React from 'react'

function HeroSection() {
  return (
    <div >
   <div className="flex flex-col items-center justify-center text-center mt-20 gap-5 bg-white px-2">
     <h1 className="text-7xl font-extrabold mb-2 ">
      The DevEx analytics platform for engineering leaders
    </h1>
  <p className="text-2xl mb-8 font-black">
    Improve cycle time, code quality, and developer experience — all in one place.
  </p>
  <div className="flex gap-4">
    <button className="px-6 py-3 bg-black text-white rounded-full font-semibold">
      Start Free Trial
    </button>
    <button className="px-6 py-3 border rounded-full font-semibold">
      Book a Demo
    </button>
   </div>
</div>


<div className="max-w-7xl mx-auto px-7 py-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

    

    <div className="bg-white dark:bg-gray-400 shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">The Problem</h2>
      <img src="./images/frustrate.jpeg" alt="" className="" />

      <p className="font-black mb-4">
        Engineering time is your most valuable asset, yet most of it is spent waiting—not coding. 
        Your current metrics are too vague to pinpoint the true blockers slowing down innovation.
      </p>

      <ul className="list-disc ml-5 space-y-2 text-black font-black">
        <li>
          <h1>The PR Paradox:</h1> 
          <p>Pull Requests sit idle for days, significantly inflating Lead Time and 
          frustrating developers.</p>
        </li>
       <li>
          <h1>Unaccounted Wait Time:</h1> 
          <p>You only track commits, not the critical time spent in Review, Pickup, and Deployment</p>
       </li>      
       <li>
          <h1>Biased Performance:</h1> 
          <p>Review discussions are based on gut feelings and blame, lacking objective, data-driven coaching tools.</p>
       </li>    
       <li>
          <h1>closing:</h1> 
          <p>Stop guessing where your time goes. Start measuring..</p>
       </li>         
         
      </ul>
    </div>

   <div className="bg-white dark:bg-gray-400 shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Our Solution</h2>
      <img src="./images/Happ.jpeg" alt="" className="" />

      <p className="font-black mb-4">
        Our AI-powered platform turns noisy GitHub data into clear, actionable metrics. 
        We break down the end-to-end development cycle so you know exactly where to apply resources.
      </p>

      <ul className="list-disc ml-5 space-y-2 text-black font-black">
        <li>
          <h1>Full Cycle Breakdown:</h1> 
          <p>Visually map the journey from Code to Deploy. Identify bottlenecks at the Coding, Review, 
            or Deployment stage.</p>
        </li>
       <li>
          <h1>Actionable AI Nudges:</h1> 
          <p>Receive real-time suggestions to unblock stuck PRs and notify slow reviewers before the delay 
            becomes critical.</p>
       </li>      
       <li>
          <h1>Objective Coaching Tools:</h1> 
          <p>Use consistent, objective scorecards like Median PR Review Time and Deployment Frequency for fair,
             data-backed performance conversations.</p>
       </li>    
       <li>
          <h1>closing:</h1> 
          <p>Integrate with GitHub in minutes. See results today.</p>
       </li>         
         
      </ul>
    </div>
  </div>
</div>
</div>
  


  )
}

export default HeroSection