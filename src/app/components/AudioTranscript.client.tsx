import React, { useState, useEffect, useRef } from 'react';
import styles from './AudioTranscript.module.css'; 

// Define type for word data in interview
interface Word {
  word: string;
  start: number;
  end: number;
}

// Define type for transcript data info
interface TranscriptData {
  duration: number;
  text: string;
  words: Word[];
}

// Define type for transcript line info
interface Line {
  startTime: number;
  text: string;
}

interface AudioTranscriptProps {  
  transcriptData: TranscriptData | null; // Prop that contains the interview transcript data
  transcriptLoading: boolean; // Prop representing transcript data loading state
  currentTime: number; // Prop representing current time of audio
  setAudioTime: (time: number) => void; // Prop to change sound wave's current time via non-sound wave components
  formatTime: (seconds: number) => string; // Prop to change seconds into minute time format
}

const AudioTranscript: React.FC<AudioTranscriptProps> = ({ transcriptData, transcriptLoading, currentTime, setAudioTime, formatTime }) => {
  const [lines, setLines] = useState<Line[]>([]); // State that maps start times to appropriate line indices
  const [lineMap, setLineMap] = useState<number[]>([]); // State that maps start times to appropriate line indices
  const [activeLine, setActiveLine] = useState<number>(0) // State that tracks "active" (highlighted) line in transcript
  const [autoScroll, setAutoScroll] = useState<boolean>(false); // State to manage auto-scroll on/off

  const transcriptLinesRef = useRef<HTMLDivElement | null>(null); // Used to manage transcript autoScroll
  const lineInterval = 5; // Time interval that dilineates lines and timestamps

  // Create transcript split up into lines by time interval
  useEffect(() => {
    if (transcriptData) {
      let tempLineMap: number[] = [];
      let tempLines: Line[] = [];
      let currentIntervalStart = 0;
      let lastLineIndex = 0;
      let lineText = '';

      // Concat all words that have start times within the same time interval into a line and repeat
      transcriptData.words.forEach((word) => {
        if (word.start >= currentIntervalStart + lineInterval) {
          if (lineText) {
            tempLines.push({ startTime: currentIntervalStart, text: lineText });
            for (let i = currentIntervalStart; i < word.start; i++) {
              tempLineMap[i] = lastLineIndex;
            }
            lastLineIndex++;
          }
          currentIntervalStart = Math.floor(word.start / lineInterval) * lineInterval;
          lineText = '';
        }
        lineText += (lineText ? ' ' : '') + word.word;
      });

      // Ensure the last text block is added
      if (lineText) {
        tempLines.push({ startTime: currentIntervalStart, text: lineText });
        for (let i = currentIntervalStart; i <= transcriptData.duration; i++) {
          tempLineMap[i] = lastLineIndex;
        }
      }

      setLines(tempLines);
      setLineMap(tempLineMap);
    }
  }, [transcriptData]);

  // Set line index as currentTime updates
  useEffect(() => {
    const lineIndex = lineMap[Math.floor(currentTime)];
    setActiveLine(lineIndex);

    if (autoScroll && activeLine > -1) {
      const activeElement = document.getElementById(`line-${activeLine}`);
      if (activeElement && transcriptLinesRef.current) {
        transcriptLinesRef.current.scrollTo({
          top: activeElement.offsetTop - transcriptLinesRef.current.offsetTop - 100,
          behavior: 'auto'
        });
      }
    }
  }, [currentTime, autoScroll, activeLine, lineMap]);

  // Handle time stamp click and update sound wave audio time
  const handleLineClick = (index: number, startTime: number) => {
    setActiveLine(index);
    setAudioTime(startTime);
  };

  return (
    <div className={styles.transcriptContainer} >
      <div className={styles.transcriptHeader}>
        <h2 className={styles.transcriptTitle}>Transcript</h2>
        <button className={`${styles.autoScrollButton} ${autoScroll ? styles.on : ''}`} onClick={() => setAutoScroll(!autoScroll)}>
          AutoScroll
        </button>
      </div>
      {transcriptLoading ? (<p>Loading transcript...</p>) : (
        <div className={styles.transcriptLines} ref={transcriptLinesRef}>
          {lines.length > 0 && lines.map((line, index) => (
            <div key={index} id={`line-${index}`} className={`${styles.line} ${index === activeLine ? styles.activeLine : ''}`}
                 onClick={() => handleLineClick(index, line.startTime)}>
              <span className={styles.timestamp}>{formatTime(line.startTime)}</span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioTranscript;
