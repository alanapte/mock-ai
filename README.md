## Mockup Viewing Instructions

The mockup is accessible at https://mock-ai.netlify.app

Due to the size of the audio file and the simplified method of serving it, it may take 20-60 seconds for the sound wave visualizer to fully load.

Here is the mock interview I used: https://www.youtube.com/watch?v=clMJ8BwCGa0&t=109s

## Design Choices

My design goal was to create an aesthetic that was consistent with the existing MockAI platform. I chose to create a simple layout that would be user friendly and familiar, using cards to break up the dashboard's three main sections.

Transcript: For this area, I wanted an easily navigable and familiar layout. I emulated YouTube's transcript look and functionality to ensure users could immediately start navigating the transcript without much thought.

Sound Wave Visualizer: For this area, I did not want to create a design that was over the top or provided too much insight into audio data. I felt that the bulk of user value would come from going through the transcript and AI improvements area, not from navigating through the audio. So, I chose the sound wave design allowing users to immediately visualize important spikes in conversation as well as less important areas of silence. I kept this area minimal with simple playback controls. 

AI Improvements: For this area, I wanted to clearly define and separate the differing sections of the interview. So, I chose a layout that initially displays each sections name, time, and number of AI improvements. Users can quickly understand which sections are of importance. I added click-to-expand areas to each section so that the detailed information of each section is only visible upon user interaction, ensuring that this area does not become cluttered with text.

Overall, my focus was on the following: 
- creating a consistent aesthetic with the existing MockAI platform
- ensuring an easy-to-use user interaction and navigation experience
- efficiently visualizing information without bombarding the user with too much data

## Dashboard Features

The dashboard is separated into three main areas: transcript, sound wave visualizer, and AI improvements.

Transcript: This area allows users to read the full audio transcript. The transcript is delineated into 5 second intervals, and users can click a line to move audio to that time. Additionally, users can enable and disable AutoScroll functionality.

Sound Wave Visualizer: This area allows users to visualize the audio file as a sound wave. Users can click or drag to move audio time. Additionally, they can play/pause recording, skip 15 seconds forward, and skip 15 seconds backward. 

AI Improvements: This area allows users to understand the sections of the interview. Each section initially displays the section start and end times, title, and number of AI improvements. Users can click on a section to see an expanded view. This view shows a summary of the section as well as the list of AI improvements. Users can click on the summary or improvements time stamps to move both the audio and transcript to that time.

Overall, I focused on the core functionality necessary to visualize and understand the interview, as well as a few supporting features to enhance user experience.