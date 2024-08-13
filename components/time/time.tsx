// ../time/time.ts
"use client"; 
import React from 'react';
import './style.css';

export const formatTime = (time: number): string => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, duration }) => {
  return (
    <div className="time-margin">
      <div className="time-container">
        <div className="time">
          <span id="currentTime">
            {formatTime(currentTime)}
          </span>
          <span id="duration">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
    
  );
};

export default TimeDisplay;
