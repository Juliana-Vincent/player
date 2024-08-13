"use client"; 
import React, { useRef, useEffect, useCallback } from 'react';
import TimeDisplay, { formatTime } from '../time/time';
import './style.css';

interface ProgressContainerProps {
  currentTime: number;
  duration: number;
  onProgressChange: (newTime: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  formatTime: (time: number) => string;
  setHoverTime: React.Dispatch<React.SetStateAction<number>>;
}

const ProgressContainer: React.FC<ProgressContainerProps> = ({
  currentTime,
  audioRef,
  duration,
  onProgressChange
}) => {
  const progressContainerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const hoverRectRef = useRef<HTMLDivElement | null>(null);

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progressBarValue = parseFloat(e.target.value);
    const newTime = (progressBarValue / 100) * duration;
    onProgressChange(newTime);
  };

  const generateRectangles = useCallback((duration: number) => {
    const screenWidth = window.innerWidth;
    const totalRectangles = screenWidth <= 480 ? Math.floor((progressContainerRef.current?.clientWidth || 0) / 3) : Math.floor((progressContainerRef.current?.clientWidth || 0) / 5);

    if (progressContainerRef.current) {
      progressContainerRef.current.innerHTML = '';

      for (let i = 0; i < totalRectangles; i++) {
        const rect = document.createElement('div');
        rect.classList.add('rect');
        rect.style.height = `${Math.random() * (screenWidth <= 499 ? 17 : 25) + 1}px`;
        progressContainerRef.current.appendChild(rect);
        rect.style.width = screenWidth <= 499 ? '2px' : '5px';
      }
    }
  }, []);

  useEffect(() => {
    generateRectangles(duration);
  }, [duration, generateRectangles]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && hoverRectRef.current && progressContainerRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const hoverX = e.clientX - rect.left;
      const width = progressBarRef.current.clientWidth;
      const setHoverTime = (hoverX / width) * duration;


      hoverRectRef.current.style.width = '60px';
      hoverRectRef.current.style.height = '30px';
      hoverRectRef.current.style.left = `${hoverX - 30}px`;
      hoverRectRef.current.style.top = `-35px`;
      hoverRectRef.current.textContent = formatTime(setHoverTime);
      hoverRectRef.current.style.display = 'block';

      const totalRectangles = progressContainerRef.current.children.length;
      const hoverIndex = Math.floor((hoverX / width) * totalRectangles);
      for (let i = 0; i < totalRectangles; i++) {
        if (i <= hoverIndex) {
          progressContainerRef.current.children[i].classList.add('hover-left');
        } else {
          progressContainerRef.current.children[i].classList.remove('hover-left');
        }
      }
    }
  };

  useEffect(() => {
    if (progressContainerRef.current) {
      const totalRectangles = progressContainerRef.current.children.length;
      const currentRectIndex = Math.floor((currentTime / duration) * totalRectangles);
      for (let i = 0; i < totalRectangles; i++) {
        if (i <= currentRectIndex && currentTime > 0) {
          progressContainerRef.current.children[i].classList.add('played');
        } else {
          progressContainerRef.current.children[i].classList.remove('played');
        }
      }
    }
  }, [currentTime, duration]);

  const handleMouseLeave = () => {
    if (hoverRectRef.current && progressContainerRef.current) {
      hoverRectRef.current.style.display = 'none';

      const totalRectangles = progressContainerRef.current.children.length;
      for (let i = 0; i < totalRectangles; i++) {
        progressContainerRef.current.children[i].classList.remove('hover-left');
      }
    }
  };

  return (
    <div className="progress-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div ref={progressContainerRef} className="progress-container"></div>
      <input
        ref={progressBarRef}
        id="progressBar"
        type="range"
        min="0"
        max="100"
        step="0.01"
        value={duration ? (currentTime / duration) * 100 : 0}
        onChange={handleProgressBarChange}
      />
      <div ref={hoverRectRef} className="hover-rect"></div>
    </div>
  );
};

export default ProgressContainer;

