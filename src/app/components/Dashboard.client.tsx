'use client'

import React, { useState, useEffect }from 'react';
import SoundWaveVisualizer from './SoundWaveVisualizer.client';
import AudioTranscript from './AudioTranscript.client';
import AISuggestionsBox from './AISuggestionsBox.client';
import styles from './Dashboard.module.css';

// Define type for interview transcript data
interface TranscriptData {
  duration: number;
  text: string;
  words: { word: string; start: number; end: number; }[];
}

// Define type for sections improvements array
type Improvement = {
  text: string;
  timestamp: number;
};

// Define type for a single section
type Section = {
  title: string;
  start_time: number;
  end_time: number;
  description: string;
  improvements: Improvement[];
};

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<number>(0); // State used to track audio current time
  const [audioTime, setAudioTime] = useState<number>(0); // State used to change audio time via non-sound wave components
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined); // State to store audio file url
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null); // State that stores the pre-generated interview transcript data
  const [sections, setSections] = useState<Section[]>([]); // State that stores the pre-generated sections of the interview
  const [transcriptLoading, setTranscriptLoading] = useState<boolean>(true);
  const [sectionsLoading, setSectionsLoading] = useState<boolean>(true);
  const [audioLoading, setAudioLoading] = useState<boolean>(true);
  

  useEffect(() => {

    // Fetch interview audio wav file
    const fetchAudio = async () => {
      setAudioLoading(true);
      try {
        const response = await fetch('/api/audio');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const audioUrl = response.url;
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error('Failed to fetch audio:', error);
      } finally {
        setAudioLoading(false);
      }
    };

    // Fetch interview sections
    const fetchInterviewSections = async () => {
      try {
          const response = await fetch('/api/suggestions', { method: 'GET' });
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSections(data);
      } catch (error) {
          console.error('Failed to fetch interview sections:', error);
      } finally {
        setSectionsLoading(false);
      }
    };

    // Fetch interview transcript
    const fetchTranscript = async () => {
      try {
        const response = await fetch('/api/transcription', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const transcript = await response.json();
        setTranscriptData(transcript);
      } catch (error) {
        console.error('Failed to fetch transcript:', error);
      } finally {
        setTranscriptLoading(false);
      }
    };

    fetchAudio();
    fetchInterviewSections();
    fetchTranscript();
  }, []);

  // Function to convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    return `${Math.floor(seconds / 60)}:${pad(Math.floor(seconds % 60))}`;
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.transcriptBox}>
        <AudioTranscript transcriptData={transcriptData} transcriptLoading={transcriptLoading} currentTime={currentTime} 
          setAudioTime={setAudioTime} formatTime={formatTime} />
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.soundWaveVisualizerContainer}>
          <SoundWaveVisualizer audioUrl={audioUrl} audioLoading={audioLoading} audioTime={audioTime} 
            setCurrentTime={setCurrentTime} formatTime={formatTime}/>
        </div>
        <div className={styles.aiSuggestionsBox}>
          <AISuggestionsBox sections={sections} sectionsLoading={sectionsLoading} setAudioTime={setAudioTime} 
            formatTime={formatTime}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
