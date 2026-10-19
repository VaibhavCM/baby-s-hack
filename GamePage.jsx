
import FlipMatch from "./FlipMatch";
import "./GamePage.css";

export default function GamePage() {
  return (
    <main className="game-page">
      <header className="game-page-header">
        <a href="/" className="game-back-link">
          <span aria-hidden="true">←</span>
          Back to Vibe's World
        </a>

        <span className="game-page-label">
          VIBE'S ARCADE
        </span>
      </header>

      <section className="game-page-intro">
        <span className="game-kicker">
          THINK · FLIP · MATCH
        </span>

        <h1>
          Flip &amp; Match<span>.</span>
        </h1>

        <p>
          Six pairs. Twelve cards. One little brain challenge.
          Find every matching pair and see how well you can do.
        </p>

        <div className="game-instructions">
          <span>🎴 Flip two cards</span>
          <span>🧠 Remember their positions</span>
          <span>⭐ Match all six pairs</span>
        </div>
      </section>

      <section
        className="game-board-section"
        aria-label="Memory game"
      >
        <FlipMatch />
      </section>

      <footer className="game-page-footer">
        <p>Made with curiosity, imagination, and code.</p>
        <a href="/">Return to the portfolio ↑</a>
      </footer>
    </main>
  );
}
