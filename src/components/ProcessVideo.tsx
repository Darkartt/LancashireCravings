'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProcessVideoProps {
  src: string;
  title: string;
  description?: string;
  poster?: string;
  duration?: string;
  processStep?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

const ProcessVideo: React.FC<ProcessVideoProps> = ({
  src,
  title,
  description,
  poster,
  duration,
  processStep,
  autoPlay = false,
  showControls = true,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setTotalDuration(video.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * totalDuration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value) / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <motion.div 
      className={`process-video relative bg-[var(--surface-elevated)] rounded-2xl overflow-hidden shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Process Step Badge */}
      {processStep && (
        <div className="absolute top-4 left-4 z-20 bg-[var(--accent-primary)] text-white px-3 py-1 rounded-full text-sm font-medium">
          Step {processStep}
        </div>
      )}

      {/* Duration Badge */}
      {duration && (
        <div className="absolute top-4 right-4 z-20 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {duration}
        </div>
      )}

      {/* Video Element */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          muted={autoPlay} // Auto-playing videos should be muted
          playsInline
          preload="metadata"
        />

        {/* Custom Play Button Overlay */}
        {!isPlaying && (
          <motion.button
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-300"
            onClick={togglePlayPause}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-[var(--accent-primary)] ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </div>
          </motion.button>
        )}

        {/* Loading Indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Custom Controls */}
      {showControls && isLoaded && (
        <div className="p-4 bg-[var(--surface-elevated)]">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-2 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${progress}%, var(--border-subtle) ${progress}%, var(--border-subtle) 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 bg-[var(--accent-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--accent-warm)] transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.838 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.838l3.545-3.776z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.838 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.838l3.545-3.776zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.972 7.972 0 0017 10c0-1.18-.2-2.319-.571-3.371a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-.757 2.828 1 1 0 11-1.415-1.656A3.989 3.989 0 0013 10a3.989 3.989 0 00-.172-.828 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${isMuted ? 0 : volume * 100}%, var(--border-subtle) ${isMuted ? 0 : volume * 100}%, var(--border-subtle) 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Info */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <h3 className="font-semibold text-[var(--foreground)] mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>
        )}
      </div>

      {/* Custom Styles for Range Inputs */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </motion.div>
  );
};

export default ProcessVideo;
