import Link from "next/link";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Your Fair Price Cheat Sheet
          </h1>
        </header>

        {/* Download Section */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Download Your Cheat Sheet</h2>
            
            <a 
              href="/api/download-cheatsheet" 
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200"
            >
              Click Here to Download PDF
            </a>
            
            <p className="text-sm text-gray-400 mt-4">
              Save this to your phone for easy reference during your trip
            </p>
          </div>
        </div>

        {/* P.S. Section - Re-pitch Trip Pass */}
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            P.S. Don't Forget About Quality...
          </h3>
          <p className="text-gray-300 mb-4">
            The cheat sheet gives you fair prices, but it can't tell you which girls are "starfish" or which venues are running scams right now.
          </p>
          <p className="text-gray-300 mb-4">
            For less than the cost of one bad experience, get our 7-Day Trip Pass and access:
          </p>
          <ul className="space-y-2 text-gray-300 mb-4">
            <li>• Real-time quality scores for every venue</li>
            <li>• Current scam alerts</li>
            <li>• The "Starfish Detector" ratings</li>
            <li>• Live interactive maps</li>
          </ul>
          <Link 
            href="/thank-you-offer"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200"
          >
            Get Your 7-Day Trip Pass for $29
          </Link>
        </div>

        {/* Additional Value Content */}
        <div className="space-y-6 text-gray-300">
          <h3 className="text-2xl font-bold text-white">Quick Tips for Using Your Cheat Sheet:</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-yellow-400 mb-2">1. These are "fair" prices, not minimum prices</h4>
              <p className="text-sm">Paying these rates gets you treated well. Going too low often results in poor service.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-yellow-400 mb-2">2. Time of day matters</h4>
              <p className="text-sm">Daytime rates are typically 20-30% lower than nighttime rates.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h4 className="font-bold text-yellow-400 mb-2">3. YMMV (Your Mileage May Vary)</h4>
              <p className="text-sm">Prices can fluctuate based on your appearance, nationality, and negotiation skills.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Data compiled from analysis of 2.6M+ forum posts</p>
          <p className="mt-2">
            Questions? Reply to your welcome email or contact support
          </p>
        </div>
      </div>
    </main>
  );
}