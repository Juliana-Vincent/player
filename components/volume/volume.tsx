"use client"; 
import React, { useRef, useEffect, useCallback } from 'react';
import './style.css';

interface VolumeControlProps {
  volume: number;
  setVolume: (volume: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>; 
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, setVolume, audioRef }) => {
  const volumeControlRef = useRef<HTMLInputElement | null>(null);
  const volumeImgRef = useRef<HTMLImageElement | null>(null);

  const updateVolumeImage = useCallback((imgRef: HTMLImageElement | null, volume: number) => {
    if (imgRef) {
      if (volume === 0) {
        imgRef.src = '/img/volume-xmark-light.svg';
      } else if (volume < 0.5) {
        imgRef.src = '/img/volume-low-light.svg';
      } else {
        imgRef.src = '/img/volume-light.svg';
      }
    }
  }, []);

  const updateVolumeControl = useCallback((controlRef: HTMLInputElement | null, volume: number) => {
    if (controlRef) {
      const value = volume * 100;
      controlRef.style.background = `linear-gradient(to right, #4545ff 0%, #4545ff ${value}%, rgb(92, 92, 92) ${value}%, rgb(92, 92, 92) 100%)`;
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = parseFloat(e.target.value);
    setVolume(volumeValue);

    // Apply volume to audio element
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }

    updateVolumeImage(volumeImgRef.current, volumeValue);
    updateVolumeControl(volumeControlRef.current, volumeValue);
  };

  const handleVolumeIconClick = () => {
    const newVolume = volume > 0 ? 0 : 0.6;
    setVolume(newVolume);

    // Apply volume to audio element
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    updateVolumeImage(volumeImgRef.current, newVolume);
    updateVolumeControl(volumeControlRef.current, newVolume);
  };

  useEffect(() => {
    updateVolumeControl(volumeControlRef.current, volume);
    updateVolumeImage(volumeImgRef.current, volume);
  }, [volume, updateVolumeControl, updateVolumeImage]);

  return (
    <div className="volume">
      <img ref={volumeImgRef} onClick={handleVolumeIconClick} alt="volume" />
      <input
        type="range"
        id="volumeControl"
        ref={volumeControlRef}
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default VolumeControl;
