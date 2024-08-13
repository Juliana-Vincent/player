"use client"; 
import React, { useRef, useState, useEffect, useCallback } from 'react';
import './style.css';

interface Props {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayingContainer: React.FC<Props> = ({ audioRef, isPlaying, setIsPlaying }) => {
  const playPauseImgRef = useRef<HTMLImageElement>(null);
  const [transformStyle, setTransformStyle] = useState('none');
  const [transformStyle1, setTransformStyle1] = useState('none');

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioRef, setIsPlaying]);

  const handleForwardClick = useCallback(() => {
    if (!audioRef.current) return;

    const maxTime = audioRef.current.duration;
    if (maxTime) {
      const newTime = Math.min(maxTime, audioRef.current.currentTime + 10);
      audioRef.current.currentTime = newTime;

      setTransformStyle('matrix(0.71, 0.71, -0.71, 0.71, 0, 0)');
      setTimeout(() => {
        setTransformStyle('none');
      }, 500);
    }
  }, [audioRef]);

  const handleBackwardClick = useCallback(() => {
    if (!audioRef.current) return;

    const newTime = Math.max(0, audioRef.current.currentTime - 10);
    audioRef.current.currentTime = newTime;

    setTransformStyle1('matrix(0.71, -0.71, 0.71, 0.71, 0, 0)');
    setTimeout(() => {
      setTransformStyle1('none');
    }, 500);
  }, [audioRef]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      const handleEnded = () => {
        setIsPlaying(false);
        if (playPauseImgRef.current) {
          playPauseImgRef.current.src = '/img/play.svg';
          playPauseImgRef.current.alt = 'Play';
        }
      };

      audioElement.addEventListener('ended', handleEnded);

      return () => {
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef, setIsPlaying]);

  useEffect(() => {
    if (playPauseImgRef.current) {
      playPauseImgRef.current.src = isPlaying ? '/img/pause.svg' : '/img/play.svg';
      playPauseImgRef.current.alt = isPlaying ? 'Pause' : 'Play';
    }
  }, [isPlaying]);

  return (
    <div className="playing-container">
      <div className="arrow" onClick={handleBackwardClick}>
        <img
          src="/img/arrow.svg"
          id="rotateImage"
          alt="backward"
          style={{ transform: transformStyle1, transition: 'transform 0.5s' }}
        />
        <p className="arrowText">10</p>
      </div>
      
      <button className="play-pause-button" onClick={handlePlayPause}>
        <img ref={playPauseImgRef} src="/img/play.svg" alt="Play" />
      </button>

      <div className="arrow1" onClick={handleForwardClick}>
        <img
          src="/img/arrow1.svg"
          id="rotateImage1"
          alt="forward"
          style={{ transform: transformStyle, transition: 'transform 0.5s' }}
        />
        <p className="arrowText1">10</p>
      </div>
    </div>
  );
};

export default PlayingContainer;
