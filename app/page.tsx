"use client"; 
import React, { useRef, useState, useCallback, useEffect } from 'react';
import VolumeControl from '../components/volume/volume';
import PlayingContainer from '../components/playing-container/playing-container';
import SpeedControl from '../components/speed/speed';
import ProgressContainer from '../components/progress/progress';
import TimeDisplay, { formatTime } from '../components/time/time';
import './style.css';
import './globals.css';

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0.6);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState<boolean>(false);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration);
      };

      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      if (audioElement.readyState >= 1) {
        handleLoadedMetadata();
      }

      return () => {
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setCurrentTime(0);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleProgressChange = useCallback((newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  return (
    <div className="container">
      <div className="player-bg">
        <div className="top-control">
        <audio
          ref={audioRef}
          src='/audio/Ghostemane-Lady-Madini-slowed-reverb.m4a'
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
        ></audio>
          <VolumeControl volume={volume} setVolume={setVolume} audioRef={audioRef} />
        
          <PlayingContainer
            audioRef={audioRef}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying} 
          />
          <SpeedControl
            playbackRate={playbackRate}
            setPlaybackRate={setPlaybackRate}
            showSpeedOptions={showSpeedOptions}
            setShowSpeedOptions={setShowSpeedOptions}
          />
        </div>
        <ProgressContainer
          audioRef={audioRef}
          currentTime={currentTime}
          formatTime={formatTime} 
          duration={duration}
          setHoverTime={setHoverTime}
          onProgressChange={handleProgressChange}
        />
        <TimeDisplay currentTime={currentTime} duration={duration} />
      </div>
      <div className="links-container">
        <div className="links">
          <p>Poslouchejte na</p>
          <a href="https://www.apple.com/apple-podcasts/" target="_blank" rel="noopener noreferrer">
            <img src='/img/apple-podcasts-icon.svg' alt="Apple Podcasts" />
          </a>
          <a href="https://podcasts.google.com/" target="_blank" rel="noopener noreferrer">
            <img src='/img/googlepodcasts.svg' alt="Google Podcasts" />
          </a>
          <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">
            <img src='/img/spotify-icon.svg' alt="Spotify" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
