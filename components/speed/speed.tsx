"use client"; 
import React from 'react';
import './style.css';

interface SpeedControlProps {
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  showSpeedOptions: boolean;
  setShowSpeedOptions: (show: boolean) => void;
}

const SpeedControl: React.FC<SpeedControlProps> = ({
  playbackRate,
  setPlaybackRate,
  showSpeedOptions,
  setShowSpeedOptions,
}) => {
  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedOptions(false);
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement) {
      audioElement.playbackRate = speed;
    }
  };

  return (
    <div className="speed-container">
      <div
        className={`speed ${showSpeedOptions ? 'show' : ''}`}
        onClick={() => setShowSpeedOptions(!showSpeedOptions)}
      >
        <p>{playbackRate}×</p>
        <img
          className={`shevron ${showSpeedOptions ? 'clicked' : ''}`}
          src="/img/shevron.svg"
          alt="speed"
        />
        {showSpeedOptions && (
          <div className="dropdown-content">
            {['0.5×', '0.75×', '1×', '1.25×', '1.5×', '1.75×', '2×'].map((option) => (
              <div
                key={option}
                className="speed-option"
                onClick={() => handleSpeedChange(parseFloat(option.replace('×', '')))}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedControl;
