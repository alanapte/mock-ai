from openai import OpenAI
import json
import os

# Initialize the OpenAI client
client = OpenAI()

# Open the target audio file
with open("mock_recording_compressed.wav", "rb") as audio_file:
    response = client.audio.transcriptions.create(
        file=audio_file,
        model="whisper-1",
        response_format="verbose_json",
        timestamp_granularities=["word"]
    )

    # Get the relevant data from the response
    relevant_data = {
        "duration": response.duration,
        "text": response.text,
        "words": response.words
    }

    # Serialize the extracted data to JSON and save it to file
    with open('transcription_result.json', 'w') as json_file:
        json.dump(relevant_data, json_file, indent=4)

    # In production, we would likely store the data in our database instead of saving it to json file
