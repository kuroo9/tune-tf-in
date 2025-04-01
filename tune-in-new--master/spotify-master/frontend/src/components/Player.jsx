import React, { useEffect, useRef, useState } from "react";
import { SongData } from "../context/Song";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";
import { UserData } from "../context/User";
import ErrorBoundary from "./ErrorBoundary";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #121212;
    color: #ccc;
    transition: background-color 0.3s, color 0.3s;
  }

  ::selection {
    background: #00FF00;
    color: #fff;
  }
`;

// Black and Grey Theme with Glowing Accents
const darkTheme = {
  bg: "#121212",
  text: "#ccc", // White for general text
  primary: "#00FF00", // Neon Green
  secondary: "#8B0000", // Dark Red (used sparingly)
};

// Styled Components
const PlayerContainer = styled.div`
  height: 64px; /* Reduced vertical height */
  background: linear-gradient(45deg, #121212, #222);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.text};
  padding: 0 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 255, 0, 0.1), rgba(255, 0, 0, 0.1));
    opacity: 0.3;
    z-index: -1;
    border-radius: 8px;
  }
`;

const SongDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .info {
    display: none;

    @media (min-width: 768px) {
      display: block;

      h3 {
        font-size: 14px;
        margin: 0;
        color: ${(props) => props.theme.text}; /* White text */
      }

      p {
        font-size: 10px;
        color: ${(props) => props.theme.text}; /* Changed from secondary to text (white) */
        margin-top: 2px;
      }
    }
  }
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .progress-bar {
    width: 200px;
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    outline: none;
    border-radius: 2px;
    overflow: hidden;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 8px;
      height: 8px;
      background: ${(props) => props.theme.primary};
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 6px ${(props) => props.theme.primary};
    }
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 12px;

    button {
      background: transparent;
      border: none;
      color: ${(props) => props.theme.text};
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: ${(props) => props.theme.primary};
      }
    }

    .play-pause {
      background: ${(props) => props.theme.primary};
      color: #000;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="range"] {
    width: 80px;
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    outline: none;
    border-radius: 2px;
    overflow: hidden;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 8px;
      height: 8px;
      background: ${(props) => props.theme.primary};
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 6px ${(props) => props.theme.primary};
    }
  }
`;

const Player = () => {
  const {
    song = {},
    fetchSingleSong,
    selectedSong,
    isPlaying = false,
    setIsPlaying,
    nextMusic,
    prevMusic,
  } = SongData() || {};

  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch song only when selectedSong changes
  useEffect(() => {
    if (selectedSong) {
      fetchSingleSong?.();
    }
  }, [selectedSong]);

  // Handle audio metadata and progress updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }
    setIsPlaying?.(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (!isNaN(newVolume) && audioRef.current) {
      setVolume(newVolume);
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && duration > 0 && audioRef.current) {
      const newTime = (newValue / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <ErrorBoundary>
        <div>
          {song?.audio?.url && (
            <PlayerContainer>
              {/* Song Details */}
              <SongDetails>
                <img
                  src={song.thumbnail?.url || "/fallback-image.jpg"}
                  alt={song.title || "Current track"}
                />
                <div className="info">
                  <h3>{song.title || "Untitled Song"}</h3>
                  <p>{(song.description || "").slice(0, 30)}...</p>
                </div>
              </SongDetails>

              {/* Audio Controls */}
              <AudioControls>
                <audio
                  ref={audioRef}
                  src={song.audio.url}
                  {...(isPlaying ? { autoPlay: true } : {})}
                />

                <input
                  type="range"
                  min={0}
                  max={100}
                  className="progress-bar"
                  value={duration > 0 ? (progress / duration) * 100 : 0}
                  onChange={handleProgressChange}
                />

                <div className="controls">
                  <button onClick={prevMusic}>
                    <GrChapterPrevious />
                  </button>
                  <button className="play-pause" onClick={handlePlayPause}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={nextMusic}>
                    <GrChapterNext />
                  </button>
                </div>
              </AudioControls>

              {/* Volume Control */}
              <VolumeControl>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </VolumeControl>
            </PlayerContainer>
          )}
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default Player;