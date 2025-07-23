import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Settings,
  X
} from 'lucide-react';
import { useBreakpoint, useTouch, ResponsiveGameFrame, TouchButton } from './ResponsiveUtils';

interface MobileGamePlayerProps {
  gameUrl: string;
  gameName: string;
  gameImage: string;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

/**
 * Mobile-optimized game player component with touch controls
 */
export const MobileGamePlayer: React.FC<MobileGamePlayerProps> = ({
  gameUrl,
  gameName,
  gameImage,
  onPlay,
  onPause,
  className = ''
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const isTouch = useTouch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (screen.orientation) {
        setOrientation(screen.orientation.angle === 0 || screen.orientation.angle === 180 ? 'portrait' : 'landscape');
      }
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  // Auto-hide controls on mobile
  useEffect(() => {
    if (isPlaying && (isMobile || isTablet)) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isMobile, isTablet, showControls]);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause?.();
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.warn('Fullscreen not supported or failed:', error);
    }
  };

  const handleRestart = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you'd communicate with the iframe to mute/unmute
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'relative bg-black rounded-lg overflow-hidden';
    
    if (isFullscreen) {
      return `${baseClasses} fixed inset-0 z-50 rounded-none`;
    }
    
    if (isMobile) {
      return `${baseClasses} w-full ${orientation === 'landscape' ? 'h-screen' : 'aspect-video'}`;
    }
    
    return `${baseClasses} w-full max-w-4xl mx-auto aspect-video`;
  };

  const getControlsClasses = () => {
    const baseClasses = 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300';
    return `${baseClasses} ${showControls ? 'opacity-100' : 'opacity-0'}`;
  };

  return (
    <div className={`${className}`}>
      <div 
        ref={containerRef}
        className={getContainerClasses()}
        onClick={showControlsTemporarily}
        onTouchStart={showControlsTemporarily}
      >
        {!isPlaying ? (
          // Game preview with play button
          <div className="relative w-full h-full">
            <img 
              src={gameImage} 
              alt={gameName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <TouchButton
                onClick={handlePlay}
                variant="primary"
                size="lg"
                className="bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm"
              >
                <Play className="w-8 h-8 mr-2" />
                Play {gameName}
              </TouchButton>
            </div>
            
            {/* Preview controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {(isMobile || isTablet) && (
                <TouchButton
                  onClick={handleFullscreen}
                  variant="secondary"
                  size="sm"
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <Maximize className="w-4 h-4" />
                </TouchButton>
              )}
            </div>
          </div>
        ) : (
          // Game iframe
          <div className="relative w-full h-full">
            <ResponsiveGameFrame
              src={gameUrl}
              title={gameName}
              className="w-full h-full"
            />
            
            {/* Game controls overlay */}
            <div className={getControlsClasses()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TouchButton
                    onClick={handlePause}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    <Pause className="w-4 h-4" />
                  </TouchButton>
                  
                  <TouchButton
                    onClick={handleRestart}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </TouchButton>
                  
                  <TouchButton
                    onClick={handleMute}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </TouchButton>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TouchButton
                    onClick={() => setShowSettings(!showSettings)}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    <Settings className="w-4 h-4" />
                  </TouchButton>
                  
                  <TouchButton
                    onClick={handleFullscreen}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </TouchButton>
                </div>
              </div>
            </div>
            
            {/* Settings panel */}
            {showSettings && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white min-w-[200px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Game Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sound</span>
                    <button
                      onClick={handleMute}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        isMuted ? 'bg-gray-600' : 'bg-blue-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        isMuted ? 'translate-x-1' : 'translate-x-5'
                      }`} />
                    </button>
                  </div>
                  
                  {isMobile && (
                    <div className="text-xs text-white/70">
                      <p>• Rotate device for better experience</p>
                      <p>• Tap screen to show/hide controls</p>
                      <p>• Use fullscreen for immersive play</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Fullscreen exit hint */}
        {isFullscreen && (
          <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Tap to show controls
          </div>
        )}
      </div>
      
      {/* Mobile-specific game tips */}
      {(isMobile || isTablet) && !isPlaying && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Mobile Gaming Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Rotate your device for the best experience</li>
            <li>• Use fullscreen mode for immersive gameplay</li>
            <li>• Ensure stable internet connection</li>
            {isTouch && <li>• Game optimized for touch controls</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileGamePlayer;