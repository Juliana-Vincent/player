import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const playPauseImgRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressContainerRef = useRef(null);
  const hoverRectRef = useRef(null);
  const volumeControlRef = useRef(null);
  const volumeImgRef = useRef(null);
  const currentTimeDisplayRef = useRef(null);
  const durationDisplayRef = useRef(null);

  const [audioEnded, setAudioEnded] = useState(false);
  const [transformStyle, setTransformStyle] = useState('none');
  const [transformStyle1, setTransformStyle1] = useState('none');
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const generateRectangles = useCallback((duration) => {
    const screenWidth = window.innerWidth;
    const totalRectangles = screenWidth <= 480 ? Math.floor(progressContainerRef.current.clientWidth / 3)
      : Math.floor(progressContainerRef.current.clientWidth / 5);

      progressContainerRef.current.innerHTML = '';
  
    for (let i = 0; i < totalRectangles; i++) {
      const rect = document.createElement('div');
      rect.classList.add('rect');
      rect.style.height = `${Math.random() * (screenWidth <= 360 ? 13 : screenWidth <= 480 ? 19 : 25) + 1}px`;

  
      rect.addEventListener('mouseenter', () => {
        hoverRectRef.current.style.display = 'block';
        hoverRectRef.current.textContent = formatTime((i / totalRectangles) * duration);
  
        for (let j = 0; j <= i; j++) {
          progressContainerRef.current.children[j].classList.add('hover-left');
        }
      });
  
      rect.addEventListener('mouseleave', () => {
        hoverRectRef.current.style.display = 'none';
      });
    
      progressContainerRef.current.appendChild(rect);
    }
  }, []);
  
  useEffect(() => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;

    const handleTimeUpdate = () => {
        updateProgressBar();
      };    


    const handleMouseMove = (e) => {
      const rect = progressBar.getBoundingClientRect();
      const hoverX = e.clientX - rect.left;
      const width = progressBar.clientWidth;
      const newHoverTime = (hoverX / width) * audio.duration;

      setHoverTime(newHoverTime);

      const hoverRectWidth = 60;
      const hoverRectHeight = 30;

      hoverRectRef.current.style.width = `${hoverRectWidth}px`;
      hoverRectRef.current.style.height = `${hoverRectHeight}px`;
      hoverRectRef.current.style.left = `${hoverX - hoverRectWidth / 2}px`;
      hoverRectRef.current.style.top = `-${hoverRectHeight + 5}px`;
      hoverRectRef.current.textContent = formatTime(newHoverTime);
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
    };

    const handleMouseLeave = () => {
      hoverRectRef.current.style.display = 'none';

      const totalRectangles = progressContainerRef.current.children.length;
      for (let i = 0; i < totalRectangles; i++) {
        progressContainerRef.current.children[i].classList.remove('hover-left');
      }
    };

    progressBar.addEventListener('mousemove', handleMouseMove);            
    progressBar.addEventListener('mouseleave', handleMouseLeave);

    const updateProgressBar = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;

        if (!isNaN(duration) && duration > 0) {
        const progressPercentage = (currentTime / duration) * 100;
        progressBar.value = progressPercentage;
        setCurrentTime(currentTime);
        };
        
        const totalRectangles = progressContainerRef.current.children.length;            
          const currentRectIndex = Math.floor((currentTime / duration) * totalRectangles);            
          for (let i = 0; i < totalRectangles; i++) {            
            if (i <= currentRectIndex) {            
              progressContainerRef.current.children[i].classList.add('played');            
            } else {            
              progressContainerRef.current.children[i].classList.remove('played');            
            }            
          }             
    };

    const handleLoadedMetadata = () => {
        const duration = audio.duration;
        setDuration(duration);
        durationDisplayRef.current.textContent = formatTime(duration);
        progressBar.max = 100; 
        generateRectangles(duration);
      };

    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      setDuration(duration);
      durationDisplayRef.current.textContent = formatTime(duration);
      progressBar.max = Math.floor(duration);
      generateRectangles(duration);
    });

    audio.addEventListener('timeupdate', handleTimeUpdate);            
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      progressBar.removeEventListener('mousemove', handleMouseMove);
      progressBar.removeEventListener('mouseleave', handleMouseLeave);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [generateRectangles]);

  const handleProgressBarChange = (e) => {
    const progressBarValue = e.target.value;
    const newTime = (progressBarValue / 100) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const updateVolumeImage = useCallback(() => {
    if (volume === 0) {
      volumeImgRef.current.src = 'img/volume-xmark-light.svg';
    } else if (volume < 0.5) {
      volumeImgRef.current.src = 'img/volume-low-light.svg';
    } else {
      volumeImgRef.current.src = 'img/volume-light.svg';
    }
  }, [volume]);

  const updateVolumeControl = useCallback(() => {
    const value = volume * 100;
    volumeControlRef.current.style.background = `linear-gradient(to right, #4545ff 0%, #4545ff ${value}%, rgb(92, 92, 92) ${value}%, rgb(92, 92, 92) 100%)`;
  }, [volume]);

  useEffect(() => {
    updateVolumeControl();
    updateVolumeImage();
  }, [updateVolumeControl, updateVolumeImage, hoverTime]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      playPauseImgRef.current.src = 'img/pause.svg';
      playPauseImgRef.current.alt = 'Pause';
    } else {
      audio.pause();
      playPauseImgRef.current.src = 'img/play.svg';
      playPauseImgRef.current.alt = 'Play';
    }
  };
  const handleAudioEnd = () => {
    setAudioEnded(true);
    playPauseImgRef.current.src = 'img/play.svg';
    playPauseImgRef.current.alt = 'Play';
  };

  const handleForwardClick = () => {
    const maxTime = audioRef.current.duration;
    const newTime = Math.min(maxTime, audioRef.current.currentTime - 10);
    audioRef.current.currentTime = newTime;

    setTransformStyle('matrix(0.71, -0.71, 0.71, 0.71, 0, 0)');
    setTimeout(() => {
      setTransformStyle('none');
    }, 500);
  };

  const handleBackwardClick = () => {
    const maxTime = audioRef.current.duration;
    const newTime = Math.min(maxTime, audioRef.current.currentTime + 10);
    audioRef.current.currentTime = newTime;

    setTransformStyle1('matrix(0.71, 0.71, -0.71, 0.71, 0, 0)');
    setTimeout(() => {
      setTransformStyle1('none');
    }, 500);
  };

  const handleVolumeChange = (e) => {
    const volumeValue = parseFloat(e.target.value);
    setVolume(volumeValue);
    audioRef.current.volume = volumeValue;
    updateVolumeImage();
    updateVolumeControl();
  };

  const handleVolumeIconClick = () => {
    const audio = audioRef.current;
    if (volume > 0) {
      setVolume(0);
      audio.volume = 0;
    } else {
      setVolume(0.4);
      audio.volume = 0.5;
    }
    updateVolumeImage();
    updateVolumeControl();
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    audioRef.current.playbackRate = speed;
  };

  return (
    <div className="container">
      <div className="rectangle">
        <div className="volume">
          <img src="img/volume-light.svg" alt="volume" ref={volumeImgRef} onClick={handleVolumeIconClick} />
          <input type="range" id="volumeControl" ref={volumeControlRef} min="0" max="1" step="0.01" 
            value={volume} onChange={handleVolumeChange} />
        </div>
        <div className="progress-wrapper">
          <audio ref={audioRef} onEnded={handleAudioEnd} src="Ghostemane-Lady-Madini-slowed-reverb.m4a"></audio>
          <div ref={progressContainerRef} className="progress-container"></div>
          <input
            ref={progressBarRef}
            id="progressBar"
            type="range"
            min="0"
            max="100"
            step="0.01"
            value={(currentTime / duration) * 100}
            onChange={handleProgressBarChange}
          />
          <div ref={hoverRectRef} className="hover-rect"></div>
        </div>
        <div className="playing-container">
          <div className="arrow" onClick={handleForwardClick}>
            <img 
              src="img/arrow.svg" 
              id="rotateImage" 
              alt="backward"
              style={{ transform: transformStyle, transition: 'transform 0.5s' }} />
            <p className="arrowText">10</p>
          </div>
          <button onClick={handlePlayPause} id="playPauseBtn">
            <img ref={playPauseImgRef} src="img/play.svg" alt="play" />
          </button>
          <div className="arrow1" onClick={handleBackwardClick}>
            <img 
              src="img/arrow1.svg" 
              id="rotateImage1" 
              alt="forward" 
              style={{ transform: transformStyle1, transition: 'transform 0.5s' }}/>
            <p className="arrowText">10</p>
          </div>
        </div>
        <div className={`speed ${showSpeedOptions ? 'show' : ''}`} onClick={() => setShowSpeedOptions(!showSpeedOptions)}>
          <p>{playbackRate}×</p>
          <img className={`shevron ${showSpeedOptions ? 'clicked' : ''}`} src="img/shevron.svg" alt="speed" />
          {showSpeedOptions && (
            <div className="dropdown-content">
              {['0.5×', '0.75×', '1×', '1.25×', '1.5×', '1.75×', '2×'].map((option) => (
                <div
                  key={option}
                  className="speed-option"
                  onClick={() => {
                    handleSpeedChange(parseFloat(option.replace('×', '')));
                    setShowSpeedOptions(false);
                  }}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="time">
          <span id="currentTime" ref={currentTimeDisplayRef}>
            {formatTime(currentTime)}
          </span>
          <span id="duration" ref={durationDisplayRef}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
      <div className="links-container">
        <div className="links">
          <p>Poslouchejte na</p>
          <a href="https://www.apple.com/apple-podcasts/">
            <img src="img/apple-podcasts-icon.svg" alt="Apple Podcasts" />
          </a>
          <a href="https://podcasts.google.com/">
            <img src="img/googlepodcasts.svg" alt="Google Podcasts" />
          </a>
          <a href="https://open.spotify.com/">
            <img src="img/spotify-icon.svg" alt="Spotify" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
