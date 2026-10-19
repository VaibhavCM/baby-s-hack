import { useEffect, useRef, useState } from "react";
import "./AskAI.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL =
  import.meta.env.VITE_AI_API_URL || "http://localhost:3001";

const welcomeMessage = {
  role: "assistant",
  content:
    "Welcome to Vibe's AI World — it gives clarity and remedy to your Conundrum.",
};

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// Clean Markdown formatting so the browser reads the answer naturally.
function cleanTextForSpeech(text) {
  return text
    // Remove fenced code blocks and replace them with a short spoken note.
    .replace(/```[\s\S]*?```/g, " Code example omitted. ")

    // Keep the visible text from Markdown images and links.
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

    // Remove inline code backticks while keeping the code words.
    .replace(/`([^`]+)`/g, "$1")

    // Remove Markdown heading markers.
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")

    // Remove bold, italic, and strikethrough markers.
    .replace(/\*\*(.*?)\*\*/gs, "$1")
    .replace(/__(.*?)__/gs, "$1")
    .replace(/~~(.*?)~~/gs, "$1")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "$1")
    .replace(/(?<!_)_([^_\n]+)_(?!_)/g, "$1")

    // Remove blockquote and list markers.
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")

    // Remove horizontal rules and Markdown table separator rows.
    .replace(/^\s*([-*_])\1{2,}\s*$/gm, "")
    .replace(/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*$/gm, "")

    // Turn table boundaries into pauses between cells.
    .replace(/\|/g, ". ")

    // Avoid reading URLs aloud.
    .replace(/https?:\/\/\S+/gi, "")

    // Remove leftover Markdown formatting symbols.
    .replace(/[#*_`~]/g, "")

    // Normalize whitespace and punctuation.
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

export default function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const requestRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    inputRef.current?.focus();
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeakingId(null);
  }

  function speakAnswer(text, id) {
    if (!("speechSynthesis" in window)) {
      setError("Spoken replies are not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = cleanTextForSpeech(text);

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.05;

    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    setError("");

    const Recognition = getSpeechRecognition();

    if (!Recognition) {
      setError(
        "Microphone input is not supported in this browser. Try Chrome or type your question."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new Recognition();

      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;

        if (transcript) {
          setInput((current) =>
            current.trim()
              ? `${current.trim()} ${transcript}`
              : transcript
          );
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          setError(
            "Microphone access was denied. Allow microphone access in your browser settings."
          );
        } else if (event.error !== "no-speech") {
          setError("I couldn't hear that clearly. Please try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setError("Unable to start the microphone. Please try again.");
    }
  }

  async function sendMessage(event) {
    event?.preventDefault();

    const question = input.trim();

    if (!question || isLoading || requestRef.current) return;

    setError("");
    setInput("");
    stopSpeaking();

    const nextMessages = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setIsLoading(true);
    requestRef.current = true;

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) =>
              ["user", "assistant"].includes(message.role)
            )
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "The assistant couldn't respond. Please try again."
        );
      }

      if (!data.reply) {
        throw new Error("The assistant returned an empty answer.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Couldn't connect to Vibe AI. Check that the backend is running."
      );
    } finally {
      setIsLoading(false);
      requestRef.current = false;
    }
  }

  function handleClose() {
    setIsOpen(false);
    recognitionRef.current?.stop();
    setIsListening(false);
    stopSpeaking();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  }

  return (
    <div className="ask-ai-widget">
      {isOpen && (
        <section
          className="ask-ai-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="ask-ai-title"
        >
          <header className="ask-ai-header">
            <div className="ask-ai-avatar" aria-hidden="true">
              ✳
            </div>

            <div className="ask-ai-heading">
              <h2 id="ask-ai-title">Vibe's AI World</h2>
              <p>
                <span className="ask-ai-status-dot" />
                Your AI assistant
              </p>
            </div>

            <button
              className="ask-ai-icon-button"
              type="button"
              onClick={handleClose}
              aria-label="Close Vibe AI"
              title="Close"
            >
              ×
            </button>
          </header>

          <div
            className="ask-ai-messages"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message, index) => (
              <article
                className={`ask-ai-message ${
                  message.role === "user"
                    ? "ask-ai-message-user"
                    : "ask-ai-message-assistant"
                }`}
                key={`${index}-${message.role}`}
              >
                <div className="ask-ai-bubble">
                  <div className="ask-ai-markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {message.role === "assistant" && index !== 0 && (
                    <button
                      className="ask-ai-speak-button"
                      type="button"
                      onClick={() =>
                        speakingId === index
                          ? stopSpeaking()
                          : speakAnswer(message.content, index)
                      }
                      aria-label={
                        speakingId === index
                          ? "Stop speaking"
                          : "Read answer aloud"
                      }
                      title={
                        speakingId === index
                          ? "Stop speaking"
                          : "Read answer aloud"
                      }
                    >
                      {speakingId === index ? "■ Stop" : "🔊 Listen"}
                    </button>
                  )}
                </div>
              </article>
            ))}

            {isLoading && (
              <div className="ask-ai-thinking" role="status">
                <span />
                <span />
                <span />
                <small>Vibe AI is thinking...</small>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <p className="ask-ai-error" role="alert">
              {error}
            </p>
          )}

          <form className="ask-ai-composer" onSubmit={sendMessage}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Vibe AI anything..."
              aria-label="Your question"
              rows={2}
              maxLength={2000}
              disabled={isLoading}
            />

            <div className="ask-ai-composer-actions">
              <button
                className={`ask-ai-mic-button ${
                  isListening ? "is-listening" : ""
                }`}
                type="button"
                onClick={startListening}
                aria-label={
                  isListening ? "Stop microphone" : "Speak your question"
                }
                title={
                  isListening ? "Stop microphone" : "Speak your question"
                }
                disabled={isLoading}
              >
                {isListening ? "■" : "🎙"}
              </button>

              <span className="ask-ai-input-hint">
                {isListening ? "Listening..." : "Enter to send"}
              </span>

              <button
                className="ask-ai-send-button"
                type="submit"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? "Sending..." : "Send ↑"}
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        className={`ask-ai-launcher ${isOpen ? "is-open" : ""}`}
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          setError("");
        }}
        aria-label={isOpen ? "Close Vibe AI" : "Open Vibe AI"}
        aria-expanded={isOpen}
      >
        <span className="ask-ai-launcher-icon" aria-hidden="true">
          {isOpen ? "×" : "✦"}
        </span>
        <span>{isOpen ? "Close AI" : "Ask AI"}</span>
      </button>
    </div>
  );
}
