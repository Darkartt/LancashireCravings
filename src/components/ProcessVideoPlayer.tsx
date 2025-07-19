'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MediaItem } from '@/lib/media-organized';

interface VideoChapter {
  id: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
}

interface ProcessVideoPlayerProps {
  video: MediaItem;
  title?: string;
  description?: string;
  chapters?: VideoChapter[];
  autoPlay?: boolean;
  showControls?: boolean;
  showChapters?: boolean;
  showPlaybackSpeed?: boolean;
  posterImage?: MediaItem;
  variant?: 'standard' | 'cinematic' | 'minimal';
}

const ProcessVideoPlayer: React.FC<ProcessVideoPlayerProps> = ({
  video,
  title = "Process Documentation",
  description = "Watch the transformation unfold",
  chapters = [],
  autoPlay = false,
  showControls = true,
  showChapters = true,
  showPlaybackSpeed = true,
  posterImage,
  variant = 'cinematic'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  const [activeChapter, setActiveChapter] = useState<VideoChapter | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update current time and active chapter
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      
      // Find active chapter
      const current = chapters.find(
        chapter => video.currentTime >= chapter.startTime && video.currentTime <= chapter.endTime
      );
      setActiveChapter(current || null);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [chapters]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControlsOverlay) return;

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControlsOverlay(false);
      }
    }, 3000);

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControlsOverlay, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

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

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await videoRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const jumpToChapter = (chapter: VideoChapter) => {
    handleSeek(chapter.startTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
          {title}
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-3">
          <div 
            className={`
              relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl
              ${variant === 'cinematic' ? 'border-4 border-neutral-800' : 'border border-neutral-200'}
            `}
            onMouseMove={() => setShowControlsOverlay(true)}
            onMouseLeave={() => isPlaying && setShowControlsOverlay(false)}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              src={video.src}
              poster={posterImage?.src}
              className="w-full h-full object-cover"
              autoPlay={autoPlay}
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Loading Overlay */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-sm">Loading video...</span>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            {!isPlaying && isLoaded && (
              <motion.button
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-200"
              >
                <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-8 h-8 text-accent-primary ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.button>
            )}

            {/* Active Chapter Indicator */}
            <AnimatePresence>
              {activeChapter && isPlaying && (
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg"
                >
                  <h4 className="font-semibold text-sm">{activeChapter.title}</h4>
                  <p className="text-xs opacity-90">{activeChapter.description}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls Overlay */}
            <AnimatePresence>
              {showControls && showControlsOverlay && (
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                >
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-white text-xs mb-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div className="relative h-1 bg-white/20 rounded-full cursor-pointer">
                      <div 
                        className="absolute top-0 left-0 h-full bg-accent-primary rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-accent-primary transition-colors duration-200"
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      {/* Volume */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-accent-primary transition-colors duration-200"
                        >
                          {isMuted ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.697 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.697l3.686-3.814zm7.824 5.138a1 1 0 010 1.414L15.414 11l1.793 1.793a1 1 0 11-1.414 1.414L14 12.414l-1.793 1.793a1 1 0 01-1.414-1.414L12.586 11l-1.793-1.793a1 1 0 011.414-1.414L14 9.586l1.793-1.793a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.697 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.697l3.686-3.814zM6 8H4v4h2V8zm4 0v4l3.429 2.826A.5.5 0 0014 14.5v-9a.5.5 0 00-.571-.485L10 8z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Playback Speed */}
                      {showPlaybackSpeed && (
                        <select
                          value={playbackRate}
                          onChange={(e) => changePlaybackRate(Number(e.target.value))}
                          className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20"
                        >
                          <option value={0.25}>0.25x</option>
                          <option value={0.5}>0.5x</option>
                          <option value={1}>1x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                      )}
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:text-accent-primary transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chapters Sidebar */}
        {showChapters && chapters.length > 0 && (
          <div className="lg:col-span-1">
            <h3 className="text-xl font-serif font-semibold text-accent-primary mb-4">
              Chapters
            </h3>
            <div className="space-y-3">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => jumpToChapter(chapter)}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-all duration-200
                    ${activeChapter?.id === chapter.id
                      ? 'bg-accent-primary/10 border-accent-primary'
                      : 'bg-background border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {chapter.thumbnail && (
                      <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={chapter.thumbnail}
                          alt={chapter.title}
                          width={48}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-accent-primary truncate">
                        {chapter.title}
                      </h4>
                      <p className="text-xs text-foreground/60 line-clamp-2">
                        {chapter.description}
                      </p>
                      <span className="text-xs text-accent-secondary font-medium">
                        {formatTime(chapter.startTime)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProcessVideoPlayer;
