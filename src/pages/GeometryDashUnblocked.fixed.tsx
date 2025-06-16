import React from 'react';
import { Helmet } from 'react-helmet';

export default function GeometryDashUnblocked() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Geometry Dash Unblocked - Full Game Access</title>
        <meta name="description" content="Play the full version of Geometry Dash Unblocked with all levels and features" />
      </Helmet>

      <h1 className="text-4xl font-bold mb-8 text-green-400">Geometry Dash Unblocked Edition</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl">
          <iframe
            className="w-full h-96 rounded-lg"
            src="https://st.8games.net/igry-geometriya-dash/GeoDash"
            title="Geometry Dash Full Version"
            allowFullScreen
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-3 text-gray-300">
            <li>✅ 21 Official Levels</li>
            <li>🎮 Save/Load Progress</li>
            <li>🔥 Custom Skins Support</li>
            <li>🏆 Achievement System</li>
          </ul>

          <div className="mt-6 bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Controls</h3>
            <p>Spacebar / Click: Jump</p>
            <p>Shift: Practice Mode</p>
          </div>
        </div>
      </div>

      <section className="mt-12 bg-gray-800 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Level Selector</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Stereo Madness', 'Back On Track', 'Polargeist', 'Dry Out'].map((level) => (
            <button 
              key={level}
              className="bg-gray-700 hover:bg-green-600 p-3 rounded-lg transition-colors"
            >
              {level}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}