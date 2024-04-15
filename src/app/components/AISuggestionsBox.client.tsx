import React, { useState } from 'react';
import styles from './AISuggestionsBox.module.css'; 

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

interface AISuggestionsBoxProps {
    sections: Section[]; // Prop that stores sections array with relevant section data
    sectionsLoading: boolean; // Prop that tracks section loading state
    setAudioTime: (time: number) => void; // Prop to change audio time via non-sound wave components
    formatTime: (seconds: number) => string; // Prop to change seconds into minute time format
}

const AISuggestionsBox: React.FC<AISuggestionsBoxProps> = ({ sections, sectionsLoading, setAudioTime, formatTime }) => {
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    // Function to toggle expansion of a section
    const toggleExpand = (index: number) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    // Function to handle time stamp click
    const handleTimeClick = (time: number) => {
        setAudioTime(time);
    };

    return (
        <div className={styles.suggestionsContainer}>
            <div className={styles.suggestionsTitle}>AI Improvements</div>
            {sectionsLoading ? (<p>Loading interview information...</p>) : (
                <div className={styles.suggestionsSections}>
                    {sections.map((section, index) => (
                        <div key={index} className={`${styles.section} ${expandedSection === index ? styles.expanded : ''}`}>
                            <button className={styles.sectionTitle} onClick={() => toggleExpand(index)}>
                            {`${formatTime(section.start_time)} - ${formatTime(section.end_time)}: ${section.title} - ${section.improvements.length} AI Improvements`}
                            </button>
                            <div className={styles.details}>
                                <div className={styles.detailsTitle}>
                                    Summary <span className={styles.summaryTime} onClick={() => handleTimeClick(section.start_time)}>[{formatTime(section.start_time)}]</span>
                                    <span className={styles.summaryTime}> - </span>
                                    <span className={styles.summaryTime} onClick={() => handleTimeClick(section.end_time)}>[{formatTime(section.end_time)}]</span>
                                </div>
                                <div className={styles.detailsText}>{section.description}</div>
                                {section.improvements.length > 0 && (
                                    <>
                                    <div className={styles.detailsTitle}>Improvements</div>
                                    {section.improvements.map((improvement, idx) => (
                                        <div key={idx} className={styles.detailsText}>
                                            {improvement.text} <span className={styles.improvementTime} onClick={() => handleTimeClick(improvement.timestamp)}>[{formatTime(improvement.timestamp)}]</span>
                                        </div>
                                    ))}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AISuggestionsBox;
