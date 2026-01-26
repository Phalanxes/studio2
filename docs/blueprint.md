# **App Name**: StoryFlow Studio

## Core Features:

- Dynamic Timeline Table: Interactive table displaying video scenes with adjustable time, visuals, and audio script.
- Visual Media Selection: Modal for adding visuals via stock videos, user uploads (Firebase Storage), or AI-generated videos (mocked).
- AI Video Generation (Mocked): Simulate video creation based on user-provided text prompts; allow the user to generate a video using an LLM tool, based on text.
- Text-to-Speech Integration: Text area input to add/edit script with the option to choose an AI Voice Persona for a specific scene.
- Firestore Persistence: Save project and scene data to Firestore including duration, chosen media and audio details. Scenes have fields for `id`, `orderIndex`, `duration`, `visual` (type, URL, prompt), and `audio` (type, scriptText, voiceId).
- Compile Video Button: Button to trigger the backend stitching process. (This feature triggers a job, that is external to the frontend.)
- Add Scene: Allow the user to add scenes to the timeline

## Style Guidelines:

- Primary color: A vibrant purple (#A050BE) to evoke creativity and visual storytelling.
- Background color: A light gray (#F0F0F3), almost the same hue as purple but significantly desaturated for a subtle, professional backdrop.
- Accent color: A brighter pink (#E64980), for an analogous contrast used on active interface elements like the "Compile Video" button and scene selection.
- Body and headline font: 'Inter', sans-serif. Note: currently only Google Fonts are supported.
- Code font: 'Source Code Pro' for any displayed code (e.g., in tutorials).
- Clean and modern line icons for scene actions, media types, and general UI elements.
- A table layout with clear sections for time, visuals, audio and actions.
- Subtle transitions and animations when adding, deleting, or reordering scenes.