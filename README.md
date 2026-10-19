
# Vibe's World

A little dreamer with a big dream of becoming a software engineer.

## About the Project

Vibe's World is an interactive portfolio that tells the story of a young boy who dreams of becoming a software engineer. It presents his journey, interests, and passion for coding through a creative web experience.

The website includes an AI assistant that helps visitors explore the project and ask questions. It combines storytelling, creativity, and technology in one interactive experience.

## Features

- Interactive portfolio experience
- Original character and dream-inspired story
- AI assistant powered by the Groq API
- Voice input through the microphone
- Text-to-speech for AI responses
- Responsive design for desktop and mobile devices

## Technologies Used

- React
- Vite
- JavaScript
- CSS
- Node.js
- Express
- Groq API

## Getting Started

### Prerequisites

- Node.js
- npm
- A Groq API key for the AI assistant

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd pip-dream-world
npm install
```

If the backend has a separate package.json, install its dependencies:

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_ORIGIN=http://localhost:5173
```

Replace the placeholder with your own API key. Never upload your real API key to GitHub.

### Run the Project

Start the backend from the project root:

```bash
node server/index.js
```

Open another terminal in the project root and start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Live Demo

Add your deployed website URL here after deployment.

## Project Vision

Vibe's World represents the curiosity, creativity, and ambition of a young dreamer who wants to become a software engineer. It shows how a personal story can be presented through web development and interactive AI technology.
