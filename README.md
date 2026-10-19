# 🌙 Vibe's World

**A little dreamer with a big dream of becoming a software engineer.**

Vibe's World is a creative and interactive portfolio about a young boy who dreams of becoming a software engineer. It brings his imagination to life through a beautiful visual experience, storytelling, and AI-powered features.

The idea behind this project is to show how a simple dream can turn into something meaningful with creativity, curiosity, and a passion for coding.

I built this project as part of my learning and hackathon journey to explore web development and AI while creating something unique and enjoyable.

## ✨ Features

- **Creative portfolio:** A dream-inspired website built around Vibe's journey.
- **Original character:** A young dreamer with a passion for technology and coding.
- **AI assistant:** An interactive chat feature powered by the Groq API.
- **Voice input:** Ask questions using your microphone.
- **Text-to-speech:** Listen to the AI assistant's responses.
- **Responsive design:** A user-friendly experience on desktop and mobile devices.
- **Interactive storytelling:** A creative way to share a character's dream and ambitions.

## 🛠️ Technologies Used

- **React** – To build the user interface.
- **Vite** – To run the frontend development server and build the website.
- **JavaScript** – To handle the website's functionality.
- **CSS** – To style the website and make it visually appealing.
- **Node.js** – To run the backend.
- **Express.js** – To create backend API endpoints.
- **Groq API** – To power the AI assistant.

## 📁 Project Structure

The project is divided into a frontend and a backend. The frontend displays the website, while the backend handles AI requests.

```text
pip-dream-world/
├── public/
│   └── ...                  # Public images and other assets
│
├── src/
│   ├── AskAI.jsx             # AI chat and voice features
│   ├── App.jsx               # Main React application
│   └── ...                   # Other components and styles
│
├── server/
│   ├── index.js              # Express server and API routes
│   └── ...                   # Other backend files, if present
│
├── index.html                # Main HTML page
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── vite.config.js            # Vite configuration
├── .gitignore                # Files Git should ignore
└── README.md                 # Project documentation
```

*Note: This is a guide to the expected structure. Some filenames may differ in the actual project.*

## 🚀 Getting Started

Follow these steps to run the project on your computer.

### Prerequisites

Before you start, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm, which comes with Node.js
- A Groq API key to use the AI assistant

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/VaibhavCM/baby-s-hack.git
cd baby-s-hack
```

### 2. Install Frontend Dependencies

From the project root, run:

```bash
npm install
```

If the `server` directory has its own `package.json`, install the backend dependencies separately:

```bash
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

The AI assistant needs a Groq API key to communicate with the AI service.

Create a `.env` file in the backend directory if your backend is configured to load environment variables from there.

Add the following configuration:

```env
PORT=3001
GROQ_API_KEY=your_groq_api_key
FRONTEND_ORIGIN=http://localhost:5173
```

Replace `your_groq_api_key` with your own key.

**Important:** Keep your API key private. Never upload your real `.env` file to GitHub or expose your secret key in frontend code.

### 4. Start the Backend

Open a terminal in the project root and run:

```bash
node server/index.js
```

Keep this terminal running while you use the AI assistant.

### 5. Start the Frontend

Open a second terminal in the project root and run:

```bash
npm run dev
```

Vite will display a local URL in your terminal. Open that URL in your browser. It is usually:

http://localhost:5173

You should now be able to explore the website locally.

*These instructions assume the project uses the scripts and folder setup shown above. Follow your actual `package.json` files if they differ.*

## 🤖 How the AI Assistant Works

The AI assistant sends questions from the frontend to the Express backend. The backend communicates with the Groq API and returns the response to the website.

Keeping the API key on the backend helps protect it from being exposed in the browser.

The assistant also supports voice input and spoken responses, depending on browser permissions and speech support.

## 🌐 Deployment

The website's frontend and backend need to be configured correctly for the AI assistant to work online.

### Frontend

Deploy the React and Vite application using a frontend hosting service.

Set the following environment variable in your frontend hosting dashboard:

```env
VITE_AI_API_URL=https://your-backend-url
```

Replace the example URL with your actual deployed backend URL.

### Backend

Deploy the Express server using a service that supports Node.js applications.

Configure these environment variables in the backend hosting dashboard:

```env
GROQ_API_KEY=your_groq_api_key
FRONTEND_ORIGIN=https://your-frontend-url
```

Set `PORT` according to your hosting provider's requirements. The server should listen on the port supplied by the hosting environment when required.

After configuring the frontend and backend, rebuild or redeploy the frontend so it uses the correct backend URL.

**Remember:** `localhost` refers to the current computer, so a deployed website cannot use your local backend address to reach a backend running on your computer.

## 🔗 Live Demo

**Live website:** Add your deployed website URL here.

**GitHub repository:** https://github.com/VaibhavCM/baby-s-hack

## 🎯 Project Vision

Vibe's World is about the curiosity and imagination that help people discover what they want to become.

Through this project, I wanted to combine a simple story with web development and AI to create an experience that feels personal and interactive.

It also represents my own journey of learning, experimenting, solving problems, and turning ideas into working projects.

## 🔮 Future Improvements

There are several things I would like to improve as the project grows:

- Add more animations and interactive elements.
- Make the AI assistant more helpful.
- Improve the voice interaction experience.
- Refine the mobile layout and accessibility.
- Add more details to Vibe's story and dream world.
- Improve error handling and deployment reliability.

## 👨‍💻 About the Developer

Built by **Vaibhav** as a learning and hackathon project.

I'm exploring web development, backend programming, and AI integration by building projects and learning from the challenges along the way.

---

*Every big dream starts with a little imagination. 💙*
