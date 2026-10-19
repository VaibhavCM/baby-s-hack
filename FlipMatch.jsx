import { useEffect, useState } from "react";
import "./FlipMatch.css";

const DAILY_LIMIT = 15 * 60;
const STORAGE_KEY = "vibe-flip-match-usage";

const ANIMALS = [
  { emoji: "🐻", name: "Bear", color: "bear" },
  { emoji: "🐱", name: "Cat", color: "cat" },
  { emoji: "🐼", name: "Panda", color: "panda" },
  { emoji: "🐸", name: "Frog", color: "frog" },
  { emoji: "🦊", name: "Fox", color: "fox" },
  { emoji: "🐰", name: "Bunny", color: "bunny" },
];

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readUsage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved?.date === todayKey()) {
      return Math.min(
        DAILY_LIMIT,
        Math.max(0, Number(saved.seconds) || 0)
      );
    }
  } catch {
    // The game can still work if browser storage is unavailable.
  }

  return 0;
}

function saveUsage(seconds) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: todayKey(),
        seconds,
      })
    );
  } catch {
    // Storage may be disabled by the browser.
  }
}

function createDeck() {
  const cards = ANIMALS.flatMap((animal, index) => [
    { ...animal, id: `${index}-a` },
    { ...animal, id: `${index}-b` },
  ]);

  // Shuffle the cards.
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export default function FlipMatch() {
  const [cards, setCards] = useState(() => createDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [usedSeconds, setUsedSeconds] = useState(readUsage);

  const timeLeft = Math.max(0, DAILY_LIMIT - usedSeconds);
  const isLocked = timeLeft === 0;
  const hasWon = matched.length === cards.length;

  // Track only active gameplay time.
  useEffect(() => {
    if (!playing || isLocked) return undefined;

    const interval = window.setInterval(() => {
      // Do not count time while the browser tab is hidden.
      if (document.visibilityState !== "visible") return;

      // Reset the daily allowance on the next local calendar day.
      const savedDate = (() => {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY))?.date;
        } catch {
          return null;
        }
      })();

      if (savedDate && savedDate !== todayKey()) {
        saveUsage(0);
        setUsedSeconds(0);
        return;
      }

      setUsedSeconds((current) => {
        const next = Math.min(current + 1, DAILY_LIMIT);
        saveUsage(next);
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [playing, isLocked]);

  // Lock the game when the daily allowance is exhausted.
  useEffect(() => {
    if (usedSeconds >= DAILY_LIMIT) {
      setPlaying(false);
      setFlipped([]);
    }
  }, [usedSeconds]);

  // If two cards are flipped, check whether they match.
  useEffect(() => {
    if (flipped.length !== 2) return undefined;

    const [firstId, secondId] = flipped;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (firstCard?.name === secondCard?.name) {
      const timeout = window.setTimeout(() => {
        setMatched((current) => {
          const next = [...current, firstId, secondId];

          if (next.length === cards.length) {
            setPlaying(false);
          }

          return next;
        });

        setFlipped([]);
      }, 350);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setFlipped([]);
    }, 850);

    return () => window.clearTimeout(timeout);
  }, [flipped, cards]);

  function startGame() {
    if (isLocked) return;

    setCards(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setPlaying(true);
  }

  function flipCard(card) {
    if (
      !playing ||
      isLocked ||
      flipped.length === 2 ||
      flipped.includes(card.id) ||
      matched.includes(card.id)
    ) {
      return;
    }

    const nextFlipped = [...flipped, card.id];

    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((current) => current + 1);
    }
  }

  return (
    <section className="flip-section" id="games">
      <div className="flip-heading">
        <span className="flip-eyebrow">
          ✨ A LITTLE PLAYTIME
        </span>

        <h2>
          Dreamy Game <span>Corner</span>
        </h2>

        <p>
          Match the cute animal faces and collect little victories!
        </p>
      </div>

      <div className="flip-game-panel">
        <div className="flip-game-top">
          <div className="flip-game-title">
            <span className="flip-teddy">🧸</span>

            <div>
              <h3>Flip &amp; Match</h3>
              <p>Find all 6 matching pairs!</p>
            </div>
          </div>

          <div className="flip-time-box">
            <span>Today's playtime</span>
            <strong>{formatTime(timeLeft)}</strong>
          </div>
        </div>

        <div
          className="flip-time-track"
          role="progressbar"
          aria-label="Daily playtime used"
          aria-valuemin={0}
          aria-valuemax={DAILY_LIMIT}
          aria-valuenow={usedSeconds}
        >
          <div
            className="flip-time-fill"
            style={{
              width: `${(usedSeconds / DAILY_LIMIT) * 100}%`,
            }}
          />
        </div>

        <div className="flip-stats">
          <div>
            <span>Moves</span>
            <strong>{moves}</strong>
          </div>

          <div>
            <span>Pairs found</span>
            <strong>{matched.length / 2} / 6</strong>
          </div>

          <div>
            <span>Time left</span>
            <strong>{formatTime(timeLeft)}</strong>
          </div>
        </div>

        {isLocked ? (
          <div className="flip-message flip-locked">
            <div className="flip-message-emoji">😴</div>
            <h3>Our little adventure is over!</h3>
            <p>
              You've used today's 15 minutes of playtime.
              Rest your eyes and come back tomorrow for more fun!
            </p>
            <span className="flip-locked-label">
              🔒 Game resting until tomorrow
            </span>
          </div>
        ) : hasWon ? (
          <div className="flip-message flip-won">
            <div className="flip-message-emoji">🎉</div>
            <h3>You matched every face!</h3>
            <p>
              Wonderful work, little dreamer! You found all six pairs
              in {moves} moves.
            </p>

            <button className="flip-primary-button" onClick={startGame}>
              Play Again ↻
            </button>
          </div>
        ) : !playing ? (
          <div className="flip-message">
            <div className="flip-message-emoji">🐻</div>
            <h3>Ready, little dreamer?</h3>
            <p>
              Flip two cards at a time and find all the matching
              animal faces.
            </p>

            <button className="flip-primary-button" onClick={startGame}>
              Play Now ✨
            </button>
          </div>
        ) : (
          <>
            <div className="flip-card-grid">
              {cards.map((card) => {
                const isFaceUp =
                  flipped.includes(card.id) || matched.includes(card.id);

                const isMatched = matched.includes(card.id);

                return (
                  <button
                    type="button"
                    key={card.id}
                    className={[
                      "flip-card",
                      isFaceUp ? "is-flipped" : "",
                      isMatched ? "is-matched" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => flipCard(card)}
                    aria-label={
                      isFaceUp
                        ? `${card.name}${isMatched ? ", matched" : ""}`
                        : "Reveal a card"
                    }
                    aria-pressed={isFaceUp}
                    disabled={isMatched || flipped.includes(card.id)}
                  >
                    <span className="flip-card-inner">
                      <span className="flip-card-back">✦</span>

                      <span
                        className={`flip-card-front animal-${card.color}`}
                      >
                        <span className="flip-animal">
                          {card.emoji}
                        </span>
                        <span className="flip-animal-name">
                          {card.name}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="flip-hint">
              💡 Remember the faces. Matching pairs stay open!
            </p>

            <button
              type="button"
              className="flip-restart-button"
              onClick={startGame}
            >
              ↻ Restart game
            </button>
          </>
        )}
      </div>

      <p className="flip-footer-note">
        💗 Little games, happy minds. Playtime is limited to 15 minutes a day.
      </p>
    </section>
  );
}