import React from 'react';
import { Helmet } from 'react-helmet';






export default function SpaceWaves() {
  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Space Waves Click Challenge - Geometry Dash Spam</title>
        <meta name="description" content="Professional Space Waves..." />
      </Helmet>
      <iframe
        title="Space Waves"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-[600px]"
        src="https://files.twoplayergames.org/files/games/g1/geometry-vibes-v11/index.html"
      />
    </div>
  );
}


<div className="iframe-container">
  <iframe 
    title="GeometryDash"
    src="https://files.twoplayergames.org/files/games/g1/geometry-vibes-v11/index.html"
  />
</div>