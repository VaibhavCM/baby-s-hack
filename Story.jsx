import { useCallback, useEffect, useRef, useState } from "react";

import story1 from "./story1.png";
import story2 from "./story2.png";
import story3 from "./story3.png";
import story4 from "./story4.png";
import story5 from "./story5.png";

import "./Story.css";

const STORY_DURATION = 10000;

const chapters = [
  {
    number: "01",
    label: "THE BEGINNING",
    title: "A Little Dream",
    subtitle: "Every great journey starts with a little imagination.",
    description:
      "One quiet evening, Vibe looked at the stars and imagined a world where he could create amazing things. He dreamed of building websites, applications, games, and clever little tools. His journey toward becoming a software engineer began with imagination.",
    image: story1,
    imageAlt: "Vibe dreaming among clouds, stars, and a magical rocket adventure",
    emoji: "☁️",
    background: "dream",
  },
  {
    number: "02",
    label: "THE FIRST STEP",
    title: "Curiosity Meets Code",
    subtitle: "A tiny idea becomes his first adventure.",
    description:
      "Vibe opened his computer and began exploring programming. Every symbol looked like a secret waiting to be discovered. He started learning how websites work and how a few lines of code can bring an idea to life.",
    image: story2,
    imageAlt: "Vibe excitedly learning to code at his laptop",
    emoji: "💻",
    background: "coding",
  },
  {
    number: "03",
    label: "THE CHALLENGE",
    title: "The Mystery of the Bugs",
    subtitle: "Not every line of code works the first time.",
    description:
      "One day, Vibe's program refused to work. A tiny mistake was hiding somewhere in his code. Instead of giving up, he checked the errors, tested his ideas, and tried again. He learned that debugging takes patience and problem-solving.",
    image: story3,
    imageAlt: "Vibe facing coding bugs and learning to debug his program",
    emoji: "🐛",
    background: "bugs",
  },
  {
    number: "04",
    label: "THE FIRST CREATION",
    title: "An Idea Comes Alive",
    subtitle: "His imagination finds a home on the screen.",
    description:
      "After learning, experimenting, and fixing mistakes, Vibe created his first little website. It wasn't perfect, but it worked! He discovered that he could turn his imagination into something real that other people could explore.",
    image: story4,
    imageAlt: "Vibe celebrating his first creation coming alive on a screen",
    emoji: "✨",
    background: "success",
  },
  {
    number: "05",
    label: "THE NEXT CHAPTER",
    title: "A Developer in the Making",
    subtitle: "The dream is growing, one line at a time.",
    description:
      "Vibe wants to learn Python, build backend APIs, create useful applications, and work with other curious minds. He knows that becoming a software engineer takes practice, and he is excited to keep learning. His journey is only beginning.",
    image: story5,
    imageAlt: "Vibe imagining his future as a software developer",
    emoji: "🚀",
    background: "future",
  },
];

export default function Story() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [remaining, setRemaining] = useState(STORY_DURATION);

  const sectionRef = useRef(null);
  const timerRef = useRef(null);
  const deadlineRef = useRef(0);
  const remainingRef = useRef(STORY_DURATION);

  const chapter = chapters[current];

  // Pause the slideshow while the story section is off-screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(
          entry.isIntersecting && entry.intersectionRatio >= 0.15
        );
      },
      { threshold: [0, 0.15, 0.5] }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Automatically advance every 10 seconds while visible.
  useEffect(() => {
    if (!isVisible || isPaused) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (deadlineRef.current) {
        const timeLeft = Math.max(
          0,
          deadlineRef.current - performance.now()
        );

        remainingRef.current = timeLeft;
        setRemaining(timeLeft);
        deadlineRef.current = 0;
      }

      return;
    }

    if (remainingRef.current <= 0) {
      remainingRef.current = STORY_DURATION;
      setRemaining(STORY_DURATION);
    }

    deadlineRef.current =
      performance.now() + remainingRef.current;

    timerRef.current = window.setTimeout(() => {
      setCurrent((previous) => (previous + 1) % chapters.length);

      remainingRef.current = STORY_DURATION;
      setRemaining(STORY_DURATION);
      deadlineRef.current = 0;
      timerRef.current = null;
    }, remainingRef.current);

    const progressInterval = window.setInterval(() => {
      const timeLeft = Math.max(
        0,
        deadlineRef.current - performance.now()
      );

      setRemaining(timeLeft);
    }, 50);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      window.clearInterval(progressInterval);

      if (deadlineRef.current) {
        remainingRef.current = Math.max(
          0,
          deadlineRef.current - performance.now()
        );

        deadlineRef.current = 0;
      }
    };
  }, [current, isVisible, isPaused]);

  // Manually select a chapter.
  const goToChapter = useCallback((index) => {
    const nextIndex =
      (index + chapters.length) % chapters.length;

    setCurrent(nextIndex);
    remainingRef.current = STORY_DURATION;
    setRemaining(STORY_DURATION);
    deadlineRef.current = 0;
  }, []);

  const goNext = useCallback(() => {
    goToChapter(current + 1);
  }, [current, goToChapter]);

  const goPrevious = useCallback(() => {
    goToChapter(current - 1);
  }, [current, goToChapter]);

  // Allow left/right arrow navigation.
  useEffect(() => {
    function handleKeyDown(event) {
      if (!isVisible) return;

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(
            target.tagName
          ))
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, goNext, goPrevious]);

  const progress = Math.min(
    100,
    Math.max(
      0,
      ((STORY_DURATION - remaining) / STORY_DURATION) * 100
    )
  );

  return (
    <section
      className="story-section"
      id="story"
      ref={sectionRef}
      aria-label="Vibe's story"
    >
      <div className="story-heading">
        <span className="story-eyebrow">
          ✦ &nbsp; A STORY WRITTEN IN DREAMS
        </span>

        <h2>
          The journey of <span>Vibe.</span>
        </h2>

        <p>
          From a little dream to a future in software engineering.
          One chapter at a time.
        </p>
      </div>

      <div
        className={`story-frame story-frame--${chapter.background}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className="story-visual"
          key={`visual-${current}`}
        >
          <div
            className="story-image-glow"
            aria-hidden="true"
          />

          <img
            className="story-image"
            src={chapter.image}
            alt={chapter.imageAlt}
          />

          <span
            className="story-floating-icon"
            aria-hidden="true"
          >
            {chapter.emoji}
          </span>

          <span className="story-scene-number">
            CHAPTER {chapter.number}
          </span>
        </div>

        <div
          className="story-content"
          key={`content-${current}`}
        >
          <span className="story-chapter-label">
            {chapter.label}
          </span>

          <h3>{chapter.title}</h3>

          <p className="story-subtitle">
            {chapter.subtitle}
          </p>

          <p className="story-description">
            {chapter.description}
          </p>

          <div className="story-footer">
            <span className="story-count">
              {String(current + 1).padStart(2, "0")}
              <span> / </span>
              {String(chapters.length).padStart(2, "0")}
            </span>

            <div className="story-controls">
              <button
                className="story-arrow"
                type="button"
                onClick={goPrevious}
                aria-label="Previous chapter"
              >
                ←
              </button>

              <button
                className="story-play"
                type="button"
                onClick={() =>
                  setIsPaused((paused) => !paused)
                }
                aria-label={
                  isPaused
                    ? "Resume automatic story"
                    : "Pause automatic story"
                }
              >
                {isPaused ? "▶" : "Ⅱ"}
                <span>{isPaused ? "Play" : "Pause"}</span>
              </button>

              <button
                className="story-arrow story-arrow--next"
                type="button"
                onClick={goNext}
                aria-label="Next chapter"
              >
                →
              </button>
            </div>
          </div>

          <div
            className="story-progress-track"
            role="progressbar"
            aria-label="Chapter time elapsed"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="story-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="story-status" aria-live="off">
            {!isVisible
              ? "Story paused while off screen"
              : isPaused
                ? "Automatic story paused"
                : "Next chapter coming up..."}
          </p>
        </div>
      </div>

      <div
        className="story-chapter-picker"
        aria-label="Choose a chapter"
      >
        {chapters.map((item, index) => (
          <button
            key={item.number}
            type="button"
            className={`story-chapter-dot ${
              current === index
                ? "story-chapter-dot--active"
                : ""
            }`}
            onClick={() => goToChapter(index)}
            aria-label={`Go to chapter ${item.number}: ${item.title}`}
            aria-current={
              current === index ? "step" : undefined
            }
          >
            <span className="story-dot-number">
              {item.number}
            </span>

            <span className="story-dot-title">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      <p className="story-hint">
        ✦ The story plays when you reach this section. Use the
        arrows to explore at your own pace.
      </p>
    </section>
  );
}
