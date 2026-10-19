
import { useEffect, useState } from "react";
import entryBoy from "./entryboy.png";
import entryBoy2 from "./entryboy2.png";
import dreamImage from "./dream.png";
import Story from "./Story";
import AskAI from "./AskAI";
import "./App.css";
import "./SiteBackground.css";

const projects = [
  {
    number: "01",
    icon: "🌐",
    title: "DreamBuilder",
    category: "FRONTEND DEVELOPMENT",
    description:
      "A creative website built from imagination, curiosity, and code.",
    tags: ["HTML", "CSS", "React"],
  },
  {
    number: "02",
    icon: "🐛",
    title: "Bug Buster",
    category: "PROBLEM SOLVING",
    description:
      "Learning to find bugs, understand errors, and turn problems into victories.",
    tags: ["JavaScript", "Debugging", "Logic"],
  },
  {
    number: "03",
    icon: "⚡",
    title: "Little API Lab",
    category: "BACKEND DEVELOPMENT",
    description:
      "Exploring APIs, server communication, and the magic behind websites.",
    tags: ["Python", "APIs", "JSON"],
  },
];

function SparkleCursor() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let lastTime = 0;
    let activeParticles = 0;

    function createSparkle(event) {
      if (event.pointerType === "touch" || document.hidden) return;

      const now = performance.now();
      if (now - lastTime < 70 || activeParticles >= 14) return;

      lastTime = now;

      const particle = document.createElement("span");
      particle.className = "cursor-sparkle";
      particle.textContent = ["✦", "✧", "⋆", "·"][
        Math.floor(Math.random() * 4)
      ];

      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      particle.style.setProperty(
        "--drift",
        `${Math.random() * 36 - 18}px`
      );
      particle.style.setProperty(
        "--particle-size",
        `${10 + Math.random() * 10}px`
      );

      document.body.appendChild(particle);
      activeParticles++;

      particle.addEventListener(
        "animationend",
        () => {
          particle.remove();
          activeParticles--;
        },
        { once: true }
      );
    }

    window.addEventListener("pointermove", createSparkle, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", createSparkle);
      document.querySelectorAll(".cursor-sparkle").forEach((particle) => {
        particle.remove();
      });
    };
  }, []);

  return null;
}

function SiteBackground() {
  return (
    <div className="site-background" aria-hidden="true">
      <video
        className="site-background-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/background1.mp4" type="video/mp4" />
      </video>

      <div className="site-background-overlay" />
    </div>
  );
}

export default function App() {
  const [scene, setScene] = useState("welcome");
  const [speaking, setSpeaking] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("vibe-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const dreamTimer = window.setTimeout(() => {
      setScene("dream");
    }, 4200);

    const portfolioTimer = window.setTimeout(() => {
      setScene("portfolio");
    }, 8200);

    return () => {
      window.clearTimeout(dreamTimer);
      window.clearTimeout(portfolioTimer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("vibe-theme", theme);
    } catch {
      // The theme still works if storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  function toggleGreeting() {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support speech playback.");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const greeting = new SpeechSynthesisUtterance(
      "Hi there, friend! Welcome to my little world. " +
        "I'm Vibe, a little boy with a big dream. " +
        "Come and discover my journey!"
    );

    greeting.rate = 0.9;
    greeting.pitch = 1.25;
    greeting.volume = 1;
    greeting.onend = () => setSpeaking(false);
    greeting.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(greeting);
  }

  return (
    <main className="app">
      <SparkleCursor />

      {/* Welcome and dream introduction */}
      {scene !== "portfolio" && (
        <section className={`intro intro--${scene}`} key={scene}>
          <div className="intro-glow" aria-hidden="true" />

          <div className="intro-stars" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <span
                key={index}
                style={{
                  "--x": `${(index * 37 + 11) % 100}%`,
                  "--delay": `${(index % 6) * -0.7}s`,
                  "--i": index,
                }}
              >
                {index % 3 === 0 ? "✦" : "✧"}
              </span>
            ))}
          </div>

          {scene === "welcome" ? (
            <section className="welcome-scene">
              <div className="welcome-copy">
                <span className="eyebrow">
                  A LITTLE WORLD OF BIG DREAMS
                </span>

                <h1>
                  Oh, hello
                  <br />
                  <span>there, friend!</span>
                </h1>

                <p>
                  I'm Vibe. A little boy with a big dream.
                  <br />
                  There's something magical I want to show you.
                </p>

                <button className="voice-button" onClick={toggleGreeting}>
                  {speaking ? "Ⅱ Stop greeting" : "♫ Hear my hello"}
                </button>
              </div>

              <div className="entry-art">
                <div className="entry-halo" aria-hidden="true" />

                <img
                  src={entryBoy}
                  className="entry-boy"
                  alt="Vibe arriving to welcome the visitor"
                />

                <span className="art-sparkle sparkle-one">✦</span>
                <span className="art-sparkle sparkle-two">✧</span>
                <span className="art-sparkle sparkle-three">✦</span>
              </div>

              <div className="scene-indicator" aria-hidden="true">
                <span className="indicator-active" />
                <span />
                <span />
              </div>
            </section>
          ) : (
            <section className="dream-scene">
              <img
                src={dreamImage}
                className="dream-art"
                alt="Vibe dreaming among clouds and stars"
              />

              <div className="dream-overlay" aria-hidden="true" />

              <div className="dream-caption">
                <span className="eyebrow">
                  EVERY GREAT JOURNEY STARTS SMALL
                </span>

                <h2>A little dream...</h2>
                <p>...and a world of possibilities.</p>
              </div>

              <div className="scene-indicator" aria-hidden="true">
                <span />
                <span className="indicator-active" />
                <span />
              </div>
            </section>
          )}
        </section>
      )}

      {/* Main portfolio */}
      {scene === "portfolio" && (
        <section className="site site--video-background">
          <SiteBackground />

          <div className="site-content">
            <header className="site-header">
              <a className="brand" href="#home">
                <span className="brand-icon">✳</span>
                Vibe's World
              </a>

              <nav className="navigation" aria-label="Main navigation">
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="/games/flip-match">Games</a>
                <a href="#story">My Story</a>
                <a href="#journey">My Journey</a>

                <a
                  className="resume-nav-link"
                  href="/Vibe_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Vibe's resume PDF in a new tab"
                >
                  Resume <span aria-hidden="true">↗</span>
                </a>
              </nav>

              <div className="header-actions">
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${
                    theme === "light" ? "dark" : "light"
                  } mode`}
                >
                  <span aria-hidden="true">
                    {theme === "light" ? "☾" : "☀"}
                  </span>

                  <span className="theme-label">
                    {theme === "light" ? "Dark mode" : "Light mode"}
                  </span>
                </button>

                <a className="header-cta" href="#projects">
                  Explore my work <span>↗</span>
                </a>
              </div>
            </header>

            {/* Hero */}
            <section className="hero" id="home">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="status-dot" />
                  FUTURE JUNIOR SOFTWARE ENGINEER
                </span>

                <h1>
                  Little boy.
                  <br />
                  <span>Big dreams.</span>
                </h1>

                <p className="hero-description">
                  Hello, I'm Vibe! Every big idea starts with a little
                  curiosity. I'm learning to code, solving tiny puzzles,
                  and building my way toward becoming a software engineer.
                </p>

                <div className="hero-actions">
                  <a className="primary-button" href="#projects">
                    Discover my projects <span>↗</span>
                  </a>

                  <a className="secondary-button" href="#about">
                    Get to know me
                  </a>
                </div>

                <div className="hero-note">
                  <span>✦</span>
                  Currently learning, always dreaming.
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-image-glow" />

                <div className="hero-image-frame">
                  <img
                    src={dreamImage}
                    alt="Vibe dreaming among the clouds"
                  />
                </div>

                <div className="floating-note note-top">
                  <span>✧</span> Big ideas ahead
                </div>

                <div className="floating-note note-bottom">
                  <span>♡</span> Made with curiosity
                </div>

                <span className="hero-star star-a">✦</span>
                <span className="hero-star star-b">✧</span>
              </div>

              <a className="scroll-cue" href="#about">
                <span className="scroll-line" />
                SCROLL TO EXPLORE
              </a>
            </section>

            {/* About */}
            <section className="about-section section-wrap" id="about">
              <div className="section-heading">
                <span className="eyebrow">A LITTLE INTRODUCTION</span>

                <h2>
                  Small steps. <span>Wonderful things.</span>
                </h2>

                <p>
                  I'm just getting started, but I have a big imagination
                  and plenty of things I want to build.
                </p>
              </div>

              <div className="about-grid">
                <article className="about-card about-card-main">
                  <span className="card-symbol">☁</span>
                  <span className="card-kicker">THE DREAMER</span>
                  <h3>Curious by nature.</h3>

                  <p>
                    I love discovering how things work, asking questions,
                    and turning random ideas into something real.
                  </p>
                </article>

                <article className="about-card">
                  <span className="card-symbol">⌘</span>
                  <span className="card-kicker">THE BUILDER</span>
                  <h3>Learning by doing.</h3>

                  <p>
                    Every project helps me learn something new, from
                    beautiful interfaces to solving problems.
                  </p>
                </article>

                <article className="about-card">
                  <span className="card-symbol">✦</span>
                  <span className="card-kicker">THE BIG IDEA</span>
                  <h3>Make it meaningful.</h3>

                  <p>
                    My dream is to build useful things that make
                    somebody's day a little brighter.
                  </p>
                </article>
              </div>
            </section>

            {/* Projects */}
            <section className="projects-section" id="projects">
              <div className="section-wrap">
                <div className="section-heading projects-heading">
                  <span className="eyebrow">MY LITTLE WORKSHOP</span>

                  <h2>
                    Ideas becoming <span>real things.</span>
                  </h2>

                  <p>
                    Three little windows into what I'm learning and
                    building on my journey.
                  </p>
                </div>

                <div className="project-grid">
                  {projects.map((project) => (
                    <article className="project-card" key={project.number}>
                      <div className="project-topline">
                        <span className="project-number">
                          {project.number}
                        </span>

                        <span className="project-icon">
                          {project.icon}
                        </span>
                      </div>

                      <span className="project-category">
                        {project.category}
                      </span>

                      <h3>{project.title}</h3>
                      <p>{project.description}</p>

                      <div className="project-tags">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Story */}
            <Story />

            {/* Journey */}
            <section className="journey-section section-wrap" id="journey">
              <div className="journey-art">
                <img
                  src={entryBoy2}
                  alt="Vibe, an aspiring junior software engineer, ready for his next adventure"
                />
              </div>

              <div className="journey-copy">
                <span className="eyebrow">THE STORY CONTINUES</span>

                <h2>
                  One dream. <span>One line of code at a time.</span>
                </h2>

                <p>
                  Every developer starts somewhere. My story begins with
                  curiosity, continues through little mistakes and
                  discoveries, and grows with every project I build.
                </p>

                <div className="journey-steps">
                  <div>
                    <span>01</span>
                    <p>
                      <strong>Imagine</strong> something wonderful.
                    </p>
                  </div>

                  <div>
                    <span>02</span>
                    <p>
                      <strong>Learn</strong> how to bring it to life.
                    </p>
                  </div>

                  <div>
                    <span>03</span>
                    <p>
                      <strong>Build</strong> and keep getting better.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Closing */}
            <section className="closing-section">
              <span className="closing-star">✧</span>

              <span className="eyebrow">
                THANKS FOR VISITING MY LITTLE WORLD
              </span>

              <h2>
                The dream is only <span>the beginning.</span>
              </h2>

              <p>
                Here's to little beginnings and wonderful possibilities.
              </p>

              <a href="#home" className="primary-button">
                Back to the beginning ↑
              </a>
            </section>

            {/* Footer */}
            <footer className="site-footer">
              <a className="brand" href="#home">
                <span className="brand-icon">✳</span>
                Vibe's World
              </a>

              <p>
                Made with curiosity, a little code, and a big dream. ♡
              </p>

              <a href="#home" aria-label="Back to top">
                ↑
              </a>
            </footer>
          </div>
        </section>
      )}

      {/* Floating AI assistant: available throughout the portfolio */}
      {scene === "portfolio" && <AskAI />}
    </main>
  );
}
