function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        
        <div>
          <h2 className="text-xl font-bold text-white">DevEx Monitor</h2>
          <p className="mt-3 text-sm">
            Simple engineering insights for growing teams.
          </p>
        </div>

       
        <div>
          <h3 className="text-white font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>Platform</li>
            <li>Features</li>
            <li>Why DevEx</li>
            <li>Pricing</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>Documentation</li>
            <li>FAQs</li>
            <li>Contact</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Built By</h3>
          <p className="text-sm">
            Prashant Pagare<br />
            Solo Founder 🇮🇳
          </p>
        </div>

      </div>

      
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        © 2025 DevEx Monitor. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
