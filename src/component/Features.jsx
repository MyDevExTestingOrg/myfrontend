import React from 'react'

function Features() {
  return (
    <div className="">
    <div className="mt-10 min-w-screen ">
        <h1 className="text-7xl font-extrabold mb-2 justify center mx-110 ">
            Why DevExMonitor ?
         </h1>
       <div className="flex flex-justify gap-5 border-2 bg-violet-100 p-5  ">
         
         <div className="text-black bg-white w-80 justify-center  border-2  rounded-2xl m-10 p-5 ">
              <h1 className="text-2xl font-black">Pinpoint Bottlenecks</h1>
              <h3 className="font-black">See exactly where time is being wasted</h3>
            <br/>

              <p>Get a clear visual view of every stage in your development cycle —
                 <p >Coding → Review → Deploy.</p>
                
                Quickly spot the exact stage where work slows down and delays happen,
                so teams can fix problems early instead of guessing.</p>
         </div>
         <div className="text-black bg-white w-80 justify-center  border-2  rounded-2xl m-10 p-5 ">
              <h1 className="text-2xl font-black">Accelerate Code Reviews</h1>
              <h3 className="font-black">Stop chasing reviewers. Let the system do it.</h3>
             <br/>

              <p>No more manual follow-ups or Slack reminders.
                 Our smart system automatically detects pull requests that are waiting too long
                  and notifies the right reviewers at the right time.
                  This keeps code moving and reduces review delays.
              </p>
         </div>
         <div className="text-black bg-white w-80 justify-center  border-2  rounded-2xl m-10 p-5 ">
              <h1 className="text-2xl font-black">Data-Driven Coaching</h1>
              <h3 className="font-black">Coach teams using facts, not opinions</h3>
            <br/>

              <p>End performance reviews based on feelings or assumptions.
                 DevExMonitor provides fair, consistent, and objective metrics
                 to help managers guide teams in the right direction.
                 This builds trust and improves team performance.
              </p>
         </div>
         <div className="text-black bg-white w-80 justify-center  border-2  rounded-2xl m-10 p-5 ">
              <h1 className="text-2xl font-black">Measure What Matters</h1>
              <h3 className="font-black">Track impact, not just activity</h3>
              <br/>
              <p>Don’t judge productivity by commits or lines of code.
                 Align engineering work with real business outcomes using proven metrics
                 like Deployment Frequency and Lead Time (DORA metrics).
                 Focus on what truly drives growth and reliability.
              </p>
         </div>
          
       </div>
   
     
    </div>
    </div>
  )
}

export default Features