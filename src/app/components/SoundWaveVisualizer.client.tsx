import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';
import PlayIcon from '../../../public/playWhite.svg';
import PauseIcon from '../../../public/pauseWhite.svg';
import Forward15sIcon from '../../../public/forward15sWhite.svg';
import Backward15sIcon from '../../../public/backward15sWhite.svg';

import styles from './SoundWaveVisualizer.module.css'; // Adjust the path as necessary

interface SoundWaveVisualizerProps {
  audioUrl: string | undefined; // Prop that has interview audio wav file
  audioLoading: boolean; // Prop to track audio loading state
  audioTime: number; // Prop to change audio time via non-sound wave components
  setCurrentTime: (time: number) => void; // Prop to share audio's currentTime with other components
  formatTime: (seconds: number) => string; // Prop to change seconds into minute time format
}

const SoundWaveVisualizer: React.FC<SoundWaveVisualizerProps> = ({ audioUrl, audioLoading, audioTime, setCurrentTime, formatTime }) => {
  const [playTime, setPlayTime] = useState<string>('0:00'); // State to display the active play time
  const [endTime, setEndTime] = useState<string>('0:00'); // State to display the end time of the audio
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing or paused
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;
    
    // Defined timeline settings to match 10 minute recording, change to match 60 min recordings
    const timeLine = TimelinePlugin.create({
      height: 20,
      timeInterval: 60,
      primaryLabelInterval: 120,
      style: {
        fontSize: '10px',
        color: 'rgb(24, 24, 27)',
      },
    })

    // Define wave form settings
    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'lightgrey',
      progressColor: 'rgb(24, 24, 27)',
      cursorColor: 'rgb(24, 24, 27)',
      height: 100,
      dragToSeek: true,
      plugins: [timeLine],
    });

    // Load in audio file to generate wave form
    waveSurfer.load(audioUrl);
    waveSurferRef.current = waveSurfer;
    

    // Event listener for when the audio is ready, to set the end time
    waveSurfer.on('ready', () => {
      const duration = waveSurfer.getDuration();
      setEndTime(formatTime(duration));
    });

    // Event listener for audio play and pause
    waveSurfer.on('play', () => setIsPlaying(true));
    waveSurfer.on('pause', () => setIsPlaying(false));

    // Event listener that updates current time as audio's time changes
    waveSurfer.on('timeupdate', (time) => {
      setCurrentTime(time);
      setPlayTime(formatTime(time));
    })

    return () => waveSurfer.destroy();
  }, [audioUrl]);

  // If we receive update in audioTime from other components, update current time
  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.setTime(audioTime);
    }
  }, [audioTime]);

  const handlePlayPause = () => {
    waveSurferRef.current?.playPause();
  };

  const handleSkipForward = () => {
    waveSurferRef.current?.skip(15);
  };

  const handleSkipBackward = () => {
    waveSurferRef.current?.skip(-15);
  };

  return (
    <div className={styles.visualizerContainer}>
      {audioLoading ? (<p>Loading interview audio...</p>) : (
        <div ref={waveformRef} className={styles.waveformContainer}></div>
      )}
      <div className={styles.controlsContainer}>
        <button onClick={handleSkipBackward} className={styles.controlButton}>
          <Image priority src={Backward15sIcon} alt="Backward 15s" height={15} width={15}/>
        </button>
        <button onClick={handlePlayPause} className={styles.controlButton}>
          <Image priority src={isPlaying ? PauseIcon : PlayIcon} alt={isPlaying ? "Pause" : "Play"} height={15} width={15}/>
        </button>
        <button onClick={handleSkipForward} className={styles.controlButton}>
          <Image priority src={Forward15sIcon} alt="Forward 15s" height={15} width={15}/>
        </button>
        <div className={styles.timeContainer}>
          <span className={styles.playTime}>{playTime} / {endTime}</span>
        </div>
      </div>
    </div>
  );
};

export default SoundWaveVisualizer;
