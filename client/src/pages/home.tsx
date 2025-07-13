import { DollarSign, TrendingUp, PieChart, BarChart3, Mic, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Assistant Icon */}
        <div className="flex justify-between items-center pt-8 pb-4">
          <div>
            <p className="text-sm text-gray-600">9:11</p>
            <div className="flex items-center gap-2 mt-2">
              <Brain className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">With Assistant Icon</span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Balance Cards Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card-modern p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">$142,05</p>
            <p className="text-xs text-gray-600 mt-1">Total Balance</p>
          </div>
          <div className="glass-card-modern p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">$118,95</p>
            <p className="text-xs text-gray-600 mt-1">Available</p>
          </div>
          <div className="glass-card-modern p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">$20,100</p>
            <p className="text-xs text-gray-600 mt-1">Savings</p>
          </div>
        </div>

        {/* Weekly Spending Section */}
        <div className="glass-card-subtle p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Spending</h3>
            <div className="flex gap-2">
              <span className="text-xs text-gray-500">Current Week</span>
              <span className="text-xs text-gray-500">Previous Week</span>
            </div>
          </div>

          {/* Donut Charts Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Food Chart */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray="75 25"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="3"
                    strokeDasharray="50 50"
                    strokeDashoffset="-25"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-700">$242,00</p>
              <p className="text-xs text-gray-500">Food</p>
            </div>

            {/* Shopping Chart */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    strokeDasharray="60 40"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray="40 60"
                    strokeDashoffset="-40"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-700">$130,00</p>
              <p className="text-xs text-gray-500">Shopping</p>
            </div>

            {/* Beauty Chart */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="3"
                    strokeDasharray="80 20"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    strokeDasharray="20 80"
                    strokeDashoffset="-20"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-700">$50,00</p>
              <p className="text-xs text-gray-500">Beauty</p>
            </div>

            {/* Transport Chart */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray="90 10"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-700">$240,00</p>
              <p className="text-xs text-gray-500">Transport</p>
            </div>
          </div>
        </div>

        {/* Income Breakdown Chart */}
        <div className="glass-card-subtle p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Income Breakdown</h3>
            <div className="flex gap-4 text-xs">
              <span className="text-pink-500">● Online Sales</span>
              <span className="text-blue-500">● Offline</span>
            </div>
          </div>

          {/* Animated Line Chart Placeholder */}
          <div className="h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 400 120">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 24" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Line charts */}
              <path
                d="M 0 80 Q 100 60, 200 70 T 400 50"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 100 Q 100 90, 200 85 T 400 75"
                fill="none"
                stroke="#f472b6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Chart Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Oct 12</span>
            <span>Oct 13</span>
            <span>Oct 14</span>
            <span>Oct 15</span>
          </div>
        </div>

        {/* Smart Budget Track */}
        <div className="glass-card-subtle p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Budget Track</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">$210,00</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-600">4.42% more than last</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">$24,000 budget this month</p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div className="flex gap-2">
                <span className="text-pink-500 text-xs">$16,000.00</span>
                <span className="text-gray-400 text-xs">Available balance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 glass-card-modern m-4 p-4">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button className="flex flex-col items-center gap-1">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <span className="text-xs text-gray-600">Statistics</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <PieChart className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Card</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <TrendingUp className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Insights</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <DollarSign className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Archive</span>
            </button>
          </div>
        </div>

        {/* AI Assistant Floating Button */}
        <div className="ai-floating-button">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}