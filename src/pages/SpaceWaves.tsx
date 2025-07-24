import React from 'react';
import { SEOHead } from '../components/SEO';

export default function SpaceWaves() {
  return (
    <>
      <SEOHead
        title="Space Waves Click Challenge - Geometry Dash Spam"
        description="Professional Space Waves click challenge game. Test your reflexes and timing skills in this exciting geometry-based adventure."
        keywords={['space waves', 'click challenge', 'geometry dash', 'reflexes', 'timing']}
      />
      <div className="container mx-auto p-4">
        <iframe
          title="Space Waves"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-[600px]"
          src="https://files.twoplayergames.org/files/games/g1/geometry-vibes-v11/index.html"
        />
      </div>
    </>
  );
}