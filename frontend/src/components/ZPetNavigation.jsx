import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ZPetNavigation.css";
import zenveZIcon from "../assets/logo/zenve-z-icon.png";

/**
 * 4-Pointed Luxury Sparkle Star
 */
const SparkleStar = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`z-sparkle-star ${className}`}
    aria-hidden="true"
  >
    <path
      d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z"
      fill="#FFF1A8"
    />
  </svg>
);

/**
 * Dog Profile Silhouette Icon matching the exact uploaded image
 */
const DogProfileSilhouetteIcon = () => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="pet-icon-svg"
    aria-hidden="true"
  >
    <path
      d="M 39.6 10.3 L 30.4 13.9 L 24.3 19.4 L 7.2 41.4 L 6.0 44.5 L 6.0 50.0 L 9.1 56.1 L 16.4 62.8 L 24.3 66.5 L 29.8 66.5 L 32.9 65.3 L 37.2 60.4 L 38.4 56.1 L 38.4 48.2 L 37.8 47.6 L 37.8 43.9 L 37.2 43.3 L 37.2 39.6 L 35.9 35.9 L 35.3 29.2 L 34.1 26.2 L 34.7 24.9 L 35.9 26.2 L 42.1 46.9 L 42.7 54.9 L 43.3 55.5 L 42.7 56.1 L 42.1 61.6 L 40.2 65.3 L 35.9 69.6 L 31.7 71.4 L 24.3 71.4 L 18.8 68.9 L 17.0 75.1 L 24.3 81.8 L 34.7 87.3 L 47.6 90.3 L 57.9 90.3 L 58.6 89.7 L 61.0 89.7 L 62.8 89.1 L 61.6 86.1 L 61.0 80.6 L 60.4 79.9 L 60.4 72.6 L 62.8 65.3 L 67.1 61.0 L 75.7 59.2 L 82.4 55.5 L 86.1 51.8 L 88.5 46.9 L 90.9 43.9 L 92.2 40.2 L 93.4 29.8 L 92.2 27.4 L 88.5 26.2 L 75.7 26.2 L 73.2 24.3 L 68.9 16.4 L 66.5 13.9 L 61.0 10.9 L 56.1 9.7 L 51.8 9.7 L 51.2 9.1 Z M 63.4 47.6 L 64.7 46.9 L 67.1 48.8 L 69.6 50.0 L 70.8 50.0 L 71.4 50.6 L 77.5 50.6 L 78.1 51.2 L 76.9 52.4 L 69.6 52.4 L 67.1 51.2 Z M 59.2 21.9 L 62.2 21.9 L 64.7 24.9 L 64.1 27.4 L 61.0 29.8 L 59.2 29.2 L 57.3 27.4 L 57.3 26.2 L 56.7 25.6 L 57.3 23.7 Z"
      fillRule="evenodd"
    />
  </svg>
);

/**
 * Cat Profile Silhouette Icon matching the exact uploaded image
 */
const CatProfileSilhouetteIcon = () => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="pet-icon-svg"
    aria-hidden="true"
  >
    <path
      d="M 66.4 15.3 L 64.8 15.8 L 61.0 18.5 L 55.6 23.9 L 61.6 25.5 L 66.4 27.7 Z M 45.4 11.0 L 44.4 12.1 L 43.8 12.1 L 36.8 19.6 L 33.6 24.4 L 30.4 30.9 L 29.3 35.2 L 25.5 39.5 L 22.8 43.8 L 19.1 51.3 L 17.5 55.6 L 16.4 60.0 L 15.8 65.3 L 16.9 69.6 L 18.5 72.9 L 21.2 76.6 L 26.6 82.0 L 31.4 85.2 L 39.5 89.0 L 60.0 89.0 L 58.9 86.3 L 58.3 82.5 L 58.9 77.7 L 60.0 75.0 L 63.2 71.8 L 65.9 70.7 L 69.1 70.7 L 71.2 70.2 L 75.0 68.6 L 77.2 66.4 L 77.2 65.9 L 81.5 62.1 L 82.5 59.4 L 82.5 57.8 L 84.2 55.1 L 84.2 53.0 L 77.7 46.5 L 76.6 41.7 L 74.5 36.8 L 69.6 32.0 L 66.4 29.8 L 62.6 28.2 L 57.3 26.6 L 54.0 26.6 L 51.9 25.0 L 49.7 18.5 L 46.5 12.1 Z M 69.1 60.5 L 67.5 62.1 L 62.1 65.3 L 55.6 71.2 L 54.0 70.7 L 54.0 69.6 L 61.6 62.6 L 66.9 59.4 L 68.0 59.4 Z M 68.0 57.3 L 67.5 59.4 L 62.6 60.0 L 55.1 62.1 L 50.8 63.7 L 43.3 67.5 L 41.7 66.9 L 41.7 65.9 L 42.7 64.8 L 53.5 60.0 L 62.6 57.3 L 66.4 56.7 Z M 68.0 55.1 L 67.5 56.7 L 57.3 56.7 L 48.1 58.9 L 45.4 57.8 L 46.5 56.7 L 55.1 54.6 L 65.3 54.0 Z M 65.3 41.7 L 67.5 41.7 L 69.6 44.4 L 69.6 46.0 L 69.1 47.0 L 68.0 48.1 L 66.4 48.7 L 65.3 48.1 L 63.2 45.4 L 63.7 43.3 Z M 44.9 18.5 L 46.0 19.6 L 49.7 29.8 L 48.7 30.9 L 46.5 31.4 L 40.6 34.7 L 40.6 30.9 L 41.7 25.5 L 43.3 20.7 Z"
      fillRule="evenodd"
    />
  </svg>
);

/**
 * Three Horizontal Lines / Sliders Icon for Other Pets & Specialized Category Filters
 */
const ThreeHorizontalSlidersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pet-icon-svg"
    aria-hidden="true"
  >
    {/* Line 1 with knob */}
    <path
      d="M3.5 6H12.5M17.5 6H20.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="15" cy="6" r="2.5" fill="currentColor" />

    {/* Line 2 with knob */}
    <path
      d="M3.5 12H6.5M11.5 12H20.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="12" r="2.5" fill="currentColor" />

    {/* Line 3 with knob */}
    <path
      d="M3.5 18H13.5M18.5 18H20.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="16" cy="18" r="2.5" fill="currentColor" />
  </svg>
);

/**
 * Professional AI Robot Assistant Vector Icon
 * Clean, solid geometric robot silhouette with cutout eyes, speaker grille, antenna, and mechanical ear nodes.
 * Matches the solid silhouette aesthetic of the Dog and Cat icons and renders crisply with currentColor.
 */
const AIAssistantIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="pet-icon-svg"
    aria-hidden="true"
  >
    {/* Top Antenna Beacon & Signal Stem */}
    <circle cx="12" cy="2" r="1.5" />
    <path d="M11.1 3.5H12.9V5.8H11.1V3.5Z" />

    {/* Precision Left Ear Pod */}
    <rect x="0.8" y="10" width="2" height="5.5" rx="1" />

    {/* Precision Right Ear Pod */}
    <rect x="21.2" y="10" width="2" height="5.5" rx="1" />

    {/* Main Robot Head with Cutout Eyes & Speaker Slit (evenodd) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 5.8H17C19.3198 5.8 21.2 7.6802 21.2 10V15.5C21.2 17.8198 19.3198 19.7 17 19.7H7C4.6802 19.7 2.8 17.8198 2.8 15.5V10C2.8 7.6802 4.6802 5.8 7 5.8ZM8.5 10C7.56112 10 6.8 10.7611 6.8 11.7C6.8 12.6389 7.56112 13.4 8.5 13.4C9.43888 13.4 10.2 12.6389 10.2 11.7C10.2 10.7611 9.43888 10 8.5 10ZM15.5 10C14.5611 10 13.8 10.7611 13.8 11.7C13.8 12.6389 14.5611 13.4 15.5 13.4C16.4389 13.4 17.2 12.6389 17.2 11.7C17.2 10.7611 16.4389 10 15.5 10ZM8.5 16C8.05817 16 7.7 16.3582 7.7 16.8C7.7 17.2418 8.05817 17.6 8.5 17.6H15.5C15.9418 17.6 16.3 17.2418 16.3 16.8C16.3 16.3582 15.9418 16 15.5 16H8.5Z"
    />

    {/* Mechanical Neck / Collar Mount */}
    <path d="M8.8 20.6H15.2C15.6 20.6 16 20.9 15.9 21.3L15.5 22.4C15.3 22.8 14.9 23 14.5 23H9.5C9.1 23 8.7 22.8 8.5 22.4L8.1 21.3C8 20.9 8.4 20.6 8.8 20.6Z" />
  </svg>
);

const SUGGESTED_QUESTIONS = [
  "Find products for my pet",
  "Find toys and accessories",
  "Help me choose grooming products",
  "Track my order",
  "Help with shopping and checkout",
];

/**
 * Render Markdown-style bold (**text**), links ([text](url)), and line breaks safely
 */
const renderFormattedChatText = (raw) => {
  if (!raw) return "";
  // Normalize Windows CRLF and CR to standard LF so lines align cleanly without extra trailing boxes/spaces
  const cleaned = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = cleaned.split("\n");
  return lines.map((line, lIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return (
      <React.Fragment key={lIdx}>
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (linkMatch) {
            return (
              <a
                key={pIdx}
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#b45309",
                  textDecoration: "underline",
                  fontWeight: "600",
                  wordBreak: "break-all",
                }}
              >
                {linkMatch[1]}
              </a>
            );
          }
          return part;
        })}
        {lIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

/**
 * Typewriter Text Component with interactive typing cursor and streaming effect
 */
const TypewriterText = React.memo(({ text, isNew, onProgress, onComplete }) => {
  const [displayedLength, setDisplayedLength] = useState(isNew ? 0 : (text ? text.length : 0));
  const [isTyping, setIsTyping] = useState(Boolean(isNew && text && text.length > 0));

  useEffect(() => {
    if (!isNew || !text) {
      setDisplayedLength(text ? text.length : 0);
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    let current = 0;
    const total = text.length;
    const step = total > 200 ? 3 : (total > 80 ? 2 : 1);
    const intervalMs = 16;

    const timer = setInterval(() => {
      current = Math.min(current + step, total);
      setDisplayedLength(current);
      if (onProgress) {
        onProgress();
      }
      if (current >= total) {
        clearInterval(timer);
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isNew, text, onComplete, onProgress]);

  const visibleText = text ? text.slice(0, displayedLength) : "";

  return (
    <span
      className="zenve-typewriter-content"
      style={{
        display: "block",
        width: "100%",
        textAlign: "justify",
        textAlignLast: "left",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    >
      {renderFormattedChatText(visibleText)}
      {isTyping && <span className="zenve-typing-cursor" aria-hidden="true" />}
    </span>
  );
});

/**
 * Assistant Message Bubble with typewriter delivery & progressive reveal
 */
const AssistantMessageBubble = React.memo(({
  msg,
  onProgress,
  onNavigate,
  onCloseChat,
  onStartNewChat,
}) => {
  const [typingDone, setTypingDone] = useState(!msg.isNew);

  const handleComplete = useCallback(() => {
    setTypingDone(true);
    if (onProgress) {
      setTimeout(() => onProgress(), 60);
    }
  }, [onProgress]);

  const isLimitMsg =
    msg.limitReached ||
    msg.provider === "support_limit" ||
    (typeof msg.text === "string" && msg.text.includes("question limit"));

  return (
    <div className={`zenve-msg-bubble assistant ${msg.isError ? "error" : ""}`}>
      <div className="zenve-msg-text">
        <TypewriterText
          text={msg.text}
          isNew={msg.isNew}
          onProgress={onProgress}
          onComplete={handleComplete}
        />
      </div>

      {/* Show disclaimer, orders, products, and new chat CTA once typing finishes */}
      {typingDone && (
        <div className="zenve-fade-in-content">
          {/* Medical Disclaimer */}
          {msg.disclaimer && (
            <div className="zenve-chat-disclaimer">
              {msg.disclaimer}
            </div>
          )}

          {/* Start New Chat Session Button if question limit is reached */}
          {isLimitMsg && onStartNewChat && (
            <div className="zenve-limit-action-wrap">
              <button
                type="button"
                className="zenve-new-chat-action-btn"
                onClick={onStartNewChat}
              >
                <span className="zenve-new-chat-icon">↺</span>
                <span>Start New Chat Session</span>
              </button>
            </div>
          )}

          {/* Order Details Card */}
          {msg.orders && msg.orders.length > 0 && (
            <div className="zenve-chat-orders-card">
              <h5 className="zenve-orders-heading">📦 Your Order Details</h5>
              {msg.orders.map((ord) => (
                <div key={ord.id} className="zenve-order-item">
                  <div className="zenve-order-id">Order #{ord.id}</div>
                  <div className="zenve-order-meta">
                    <span className={`zenve-order-status ${ord.status.toLowerCase()}`}>
                      {ord.status}
                    </span>
                    <span className="zenve-order-price">₹{ord.total_amount.toFixed(2)}</span>
                  </div>
                  <small className="zenve-order-date">{ord.order_date}</small>
                </div>
              ))}
            </div>
          )}

          {/* Grounded Products Cards */}
          {msg.products && msg.products.length > 0 && (
            <div className="zenve-chat-products-grid">
              {msg.products.map((p) => (
                <div key={p.id} className="zenve-chat-product-card">
                  <div className="zenve-product-thumb">
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <div className="zenve-product-placeholder">🐾</div>
                    )}
                    <span className="zenve-product-tag">{p.pet_type}</span>
                  </div>
                  <div className="zenve-product-details">
                    <div className="zenve-product-name" title={p.name}>
                      {p.name}
                    </div>
                    <div className="zenve-product-footer">
                      <span className="zenve-product-price">₹{p.price.toFixed(2)}</span>
                      <button
                        type="button"
                        className="zenve-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseChat();
                          onNavigate(p.url);
                        }}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

const SESSION_MESSAGES_KEY = "zenve_chatbot_messages";
const SESSION_COUNT_KEY = "zenve_chatbot_question_count";
const SESSION_ID_KEY = "zenve_chatbot_session_id";
const INITIAL_CHAT_MESSAGES = [
  {
    id: 1,
    sender: "assistant",
    text: "Hi! Welcome to our pet store. How can I help you and your pet today?",
    products: [],
    orders: [],
    disclaimer: null,
    time: "Online",
  },
];
const LIMIT_EXCEEDED_MESSAGE = `Contact Zenve Customer Support & Human Escalation:
Our human support team is ready to assist you:
• Email: [support@zenve.com](mailto:support@zenve.com)
• Toll-Free Helpline: 1800-ZENVE-PET (1800-936-8373)
• WhatsApp Support: +91 98765 43210
• Operating Hours: Monday to Sunday, 9:00 AM – 9:00 PM IST.
Feel free to drop a message anytime and an executive will get in touch!`;

/**
 * ZPetNavigation Component - Premium Gold Edition with Shimmer & Sparkles
 *
 * Primary Color: #D4AF37
 * Radial 4-Icon Layout:
 *   1. Cat (Far Upper-Left: 157.5°)
 *   2. Dog (Upper-Left-Center: 112.5°)
 *   3. Other Pets (Upper-Right-Center: 67.5°)
 *   4. AI Assistant (Far Upper-Right: 22.5°)
 */
export default function ZPetNavigation({
  onSelectPet,
  customRoutes = {
    Dog: "/products/dogs",
    Cat: "/products/cats",
    Setting: "/products/other-pets",
    Filter: "/products/other-pets",
    Other: "/products/other-pets",
  },
  className = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [sessionId, setSessionId] = useState(() => {
    try {
      const existing = sessionStorage.getItem(SESSION_ID_KEY);
      if (existing) return existing;
      const newId = `zenve_sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_ID_KEY, newId);
      return newId;
    } catch (e) {
      return `zenve_sess_${Date.now()}`;
    }
  });

  const [questionCount, setQuestionCount] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_COUNT_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    } catch (e) {}
    return 0;
  });

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m) => ({ ...m, isNew: false }));
        }
      }
    } catch (e) {}
    return INITIAL_CHAT_MESSAGES;
  });

  const leaveTimerRef = useRef(null);
  const wrapperRef = useRef(null);
  const chatPanelRef = useRef(null);
  const chatMessagesContainerRef = useRef(null);
  const chatMessagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const prevChatOpenRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Persist conversation and question limit count to sessionStorage across routes & remounts
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(chatMessages));
    } catch (e) {}
  }, [chatMessages]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_COUNT_KEY, String(questionCount));
    } catch (e) {}
  }, [questionCount]);

  const handleTypingProgress = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current > 70) {
      lastScrollTimeRef.current = now;
      if (chatMessagesEndRef.current) {
        chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, []);

  const currentPath = location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(location.search);
  const currentPet = (searchParams.get("pet") || searchParams.get("pet_type") || "").toLowerCase();
  const isDogActive = currentPath === "/products/dogs" || currentPath === "/products/dog" || currentPet === "dog";
  const isCatActive = currentPath === "/products/cats" || currentPath === "/products/cat" || currentPet === "cat";
  const isSettingActive =
    currentPath === "/products/other-pets" ||
    currentPath === "/products/others" ||
    currentPath === "/products/other" ||
    ["others", "other", "other-pets", "setting", "settings", "filter"].includes(currentPet);
  const isChatActive = isChatOpen && !isMinimized;
  const hasActiveExperience = isDogActive || isCatActive || isSettingActive || isChatActive;

  // When opening or reopening the chat panel, instantly position at bottom without scrolling from start
  useLayoutEffect(() => {
    if (isChatOpen && !isMinimized) {
      const jumpToBottom = () => {
        if (chatMessagesContainerRef.current) {
          chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
        }
        if (chatMessagesEndRef.current) {
          chatMessagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
      };

      jumpToBottom();
      const t1 = setTimeout(jumpToBottom, 15);
      const t2 = setTimeout(jumpToBottom, 50);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isChatOpen, isMinimized]);

  // Auto-scroll chat smoothly only for new incoming messages while chat is already actively open
  useEffect(() => {
    if (isChatOpen && !isMinimized && prevChatOpenRef.current) {
      const frameId = requestAnimationFrame(() => {
        chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
      return () => cancelAnimationFrame(frameId);
    }
    prevChatOpenRef.current = isChatOpen && !isMinimized;
  }, [chatMessages, isChatOpen, isMinimized, isLoading]);

  // Clean up timers and abort pending requests on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Start genuinely new chat session (resets question count, input, and messages)
  const handleStartNewChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newSessionId = `zenve_sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setSessionId(newSessionId);
    setQuestionCount(0);
    setChatInput("");
    setErrorMessage("");
    setChatMessages(INITIAL_CHAT_MESSAGES);
    try {
      sessionStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(INITIAL_CHAT_MESSAGES));
      sessionStorage.setItem(SESSION_COUNT_KEY, "0");
      sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
    } catch (e) {}

    // Notify backend to reset session tracker
    fetch("http://127.0.0.1:8000/api/chatbot/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "new_session", new_session: true, session_id: newSessionId }),
    }).catch(() => {});
  }, []);

  // Minimize Chatbot Handler - closes the chat panel but preserves chat history
  const handleMinimizeChat = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setChatMessages((prev) => prev.map((m) => ({ ...m, isNew: false })));
    setIsChatOpen(false);
    setIsMinimized(false);
  }, []);

  // Explicit Chatbot Close Handler - closes and erases conversation
  const handleCloseChat = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsChatOpen(false);
    setIsMinimized(false);
    handleStartNewChat();
  }, [handleStartNewChat]);

  // Global Escape-key listener to close chat panel or radial menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isChatOpen) {
          handleMinimizeChat();
        } else if (isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isChatOpen, isExpanded, handleMinimizeChat]);

  // Handle outside click to collapse radial menu (does not touch chat panel)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isExpanded &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        (!chatPanelRef.current || !chatPanelRef.current.contains(event.target))
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("pointerdown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isExpanded]);

  // Mobile background scroll lock when chat is actively open
  useEffect(() => {
    const isMobile = window.innerWidth <= 640;
    if (isChatOpen && !isMinimized && isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isChatOpen, isMinimized]);

  // Radial menu hover enter (debounced)
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsExpanded(true);
  };

  // Radial menu hover leave (debounced to prevent jitter)
  const handleMouseLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 180);
  };

  // Toggle radial menu for click / touch devices
  const handleMainClick = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  // Send message to AI Chatbot backend with request cancellation support & 2-question limit
  const handleSendChatMessage = async (presetText) => {
    const query = (presetText || chatInput).trim();
    if (!query || isLoading || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setErrorMessage("");
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Send all questions directly to the backend trained Q&A engine
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    // Cancel prior in-flight request if user sends another prompt
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const historyPayload = chatMessages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: query,
          conversation_history: historyPayload,
          session_id: sessionId,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botMsg = {
        id: Date.now() + 1,
        sender: "assistant",
        text: data.reply || "Here is what I found for you:",
        products: data.products || [],
        orders: data.orders || [],
        disclaimer: data.disclaimer || null,
        provider: data.provider,
        limitReached: Boolean(data.limit_reached),
        isNew: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Update message history only — NEVER alter chatbot visibility
      setChatMessages((prev) => [...prev, botMsg]);
      setQuestionCount((c) => c + 1);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      console.error("Chatbot request failed:", err);
      setErrorMessage("Unable to connect to assistant service right now. Please check your network or try again.");
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text: "I am having trouble reaching the store catalog right now. Please check your connection or explore our categories directly!",
          products: [],
          orders: [],
          isError: true,
          isNew: true,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Handle radial menu icon selection
  const handleItemClick = (key) => {
    setIsExpanded(false);

    // AI Chatbot: open floating chat panel explicitly without navigation
    if (key === "Chatbot" || key === "AI") {
      setChatMessages((prev) => prev.map((m) => ({ ...m, isNew: false })));
      setIsChatOpen(true);
      setIsMinimized(false);
      if (onSelectPet) {
        onSelectPet("Chatbot");
      }
      return;
    }

    if (onSelectPet) {
      onSelectPet(key);
      return;
    }

    let target = "/products";
    if (key === "Dog") {
      target = "/products/dogs";
    } else if (key === "Cat") {
      target = "/products/cats";
    } else if (key === "Setting" || key === "Filter" || key === "Other") {
      target = "/products/other-pets";
    } else if (customRoutes && customRoutes[key]) {
      target = customRoutes[key];
    }

    navigate(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <>
      {/* =====================================================
          FLOATING AI CHATBOT PANEL (ZENVE PET ASSISTANT)
          Rendered outside z-pet-nav-wrapper so hover/mouse events
          never leak into the radial menu
      ===================================================== */}
      {isChatOpen && (
        <div
          ref={chatPanelRef}
          className={`zenve-chat-panel ${isMinimized ? "minimized" : ""}`}
          role="dialog"
          aria-modal={typeof window !== "undefined" && window.innerWidth <= 540}
          aria-label="Zenve Pet Assistant"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="zenve-chat-header">
            <div className="zenve-chat-header-info">
              <div className="zenve-chat-avatar">
                <AIAssistantIcon />
              </div>
              <div>
                <h3 className="zenve-chat-title">Zenve Pet Assistant</h3>
                <div className="zenve-chat-status">
                  <span className="zenve-status-dot" />
                  <span>Online • AI Assistant</span>
                </div>
              </div>
            </div>
            <div className="zenve-chat-header-actions">
              <button
                type="button"
                className="zenve-chat-ctrl-btn minimize-btn"
                onClick={handleMinimizeChat}
                title="Minimize chat"
                aria-label="Minimize Pet Assistant"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button
                type="button"
                className="zenve-chat-ctrl-btn close-btn"
                onClick={handleCloseChat}
                title="Close and erase chat"
                aria-label="Close and erase Pet Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body (only when expanded) */}
          {!isMinimized && (
            <>
              <div className="zenve-chat-body">
                {/* Messages stream */}
                <div ref={chatMessagesContainerRef} className="zenve-chat-messages">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`zenve-msg-row ${msg.sender}`}>
                      {msg.sender === "assistant" ? (
                        <AssistantMessageBubble
                          msg={msg}
                          onProgress={handleTypingProgress}
                          onNavigate={navigate}
                          onCloseChat={handleMinimizeChat}
                          onStartNewChat={handleStartNewChat}
                        />
                      ) : (
                        <div className="zenve-msg-bubble user">
                          <p className="zenve-msg-text">{msg.text}</p>
                        </div>
                      )}
                      <span className="zenve-msg-time">{msg.time}</span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="zenve-msg-row assistant">
                      <div className="zenve-msg-bubble assistant typing-bubble">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  )}

                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="zenve-chat-error-banner">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Suggested / Recommended Questions Vertical View */}
                <div className="zenve-chat-suggestions">
                  <div className="zenve-suggestions-list">
                    {SUGGESTED_QUESTIONS.map((question, i) => (
                      <button
                        key={i}
                        type="button"
                        className="zenve-suggestion-chip"
                        onClick={() => handleSendChatMessage(question)}
                        disabled={isLoading || isSubmittingRef.current}
                      >
                        <span className="zenve-chip-bullet">💬</span>
                        <span className="zenve-chip-text">{question}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Input Footer with multiline & Enter/Shift+Enter support */}
              <form
                className="zenve-chat-input-bar"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
              >
                <textarea
                  rows={1}
                  placeholder="Ask me anything about your pet or shopping..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                  disabled={isLoading || isSubmittingRef.current}
                  className="zenve-chat-textarea"
                  aria-label="Ask me anything about your pet or shopping"
                />
                <button
                  type="submit"
                  className="zenve-chat-send-btn"
                  disabled={isLoading || isSubmittingRef.current || !chatInput.trim()}
                  aria-label="Send Message"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* =====================================================
          FLOATING RADIAL PET NAVIGATION (GOLDEN Z MENU)
      ===================================================== */}
      <div
        ref={wrapperRef}
        className={`z-pet-nav-wrapper ${isExpanded ? "expanded" : ""} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Pet Category and AI Assistant Navigation"
      >
        <div className="z-pet-nav-envelope">
          {/* Golden glow pulse indicator ring */}
          <div className="z-main-glow" aria-hidden="true" />

          {/* =====================================================
              CONNECTOR STEMS (Radiating from Gold Z to all 4 icons)
          ===================================================== */}
          <div className="z-connector z-connector-cat" aria-hidden="true" />
          <div className="z-connector z-connector-dog" aria-hidden="true" />
          <div className="z-connector z-connector-filter" aria-hidden="true" />
          <div className="z-connector z-connector-chatbot" aria-hidden="true" />

          {/* =====================================================
              1. CAT ICON (Far Upper-Left of Z: 157.5°)
          ===================================================== */}
          <button
            type="button"
            className={`pet-btn pet-btn-cat ${isCatActive ? "active" : ""}`}
            onClick={() => handleItemClick("Cat")}
            aria-label="Cat Products"
            title="Cat Products"
            tabIndex={isExpanded ? 0 : -1}
          >
            <CatProfileSilhouetteIcon />
            <span className="pet-tooltip-badge">Cats</span>
          </button>

          {/* =====================================================
              2. DOG ICON (Upper-Left-Center of Z: 112.5°)
          ===================================================== */}
          <button
            type="button"
            className={`pet-btn pet-btn-dog ${isDogActive ? "active" : ""}`}
            onClick={() => handleItemClick("Dog")}
            aria-label="Dog Products"
            title="Dog Products"
            tabIndex={isExpanded ? 0 : -1}
          >
            <DogProfileSilhouetteIcon />
            <span className="pet-tooltip-badge">Dogs</span>
          </button>

          {/* =====================================================
              3. OTHERS ICON (Upper-Right-Center of Z: 67.5°)
          ===================================================== */}
          <button
            type="button"
            className={`pet-btn pet-btn-filter pet-btn-setting ${isSettingActive ? "active" : ""}`}
            onClick={() => handleItemClick("Setting")}
            aria-label="Other Pets Products"
            title="Other Pets Products"
            tabIndex={isExpanded ? 0 : -1}
          >
            <ThreeHorizontalSlidersIcon />
            <span className="pet-tooltip-badge">Other Pets</span>
          </button>

          {/* =====================================================
              4. AI CHATBOT ICON (Far Upper-Right of Z: 22.5°)
          ===================================================== */}
          <button
            type="button"
            className={`pet-btn pet-btn-chatbot ${isChatActive ? "active" : ""}`}
            onClick={() => handleItemClick("Chatbot")}
            aria-label="AI Assistant"
            title="AI Assistant — Chat with Zenve Pet AI"
            tabIndex={isExpanded ? 0 : -1}
          >
            <AIAssistantIcon />
            <span className="pet-tooltip-badge">AI Assistant</span>
          </button>

          {/* =====================================================
              MAIN GOLD Z BUTTON WITH SHIMMER
          ===================================================== */}
          <button
            type="button"
            className={`z-main-btn ${hasActiveExperience ? "has-active-experience" : ""}`}
            onClick={handleMainClick}
            aria-label={
              hasActiveExperience
                ? isDogActive
                  ? "Dog Products active — Click to switch or close"
                  : isCatActive
                  ? "Cat Products active — Click to switch or close"
                  : isChatActive
                  ? "AI Assistant open — Click to toggle"
                  : "Other Pets Products active — Click to switch or close"
                : isExpanded
                ? "Close pet navigation"
                : "Open pet navigation"
            }
            aria-expanded={isExpanded}
            aria-haspopup="true"
          >
            {/* Moving diagonal metallic gold shimmer reflection */}
            <span className="z-shimmer" aria-hidden="true" />

            {/* Custom Zenve Pet Z Logo Icon */}
            <img
              src={zenveZIcon}
              alt="Zenve Z"
              className="z-logo-img"
              aria-hidden="true"
            />

            {/* Active experience indicator dot */}
            {hasActiveExperience && (
              <span className="z-active-badge" aria-hidden="true" />
            )}
          </button>

          {/* =====================================================
              TINY SPARKLING PARTICLES (Outer Rim)
          ===================================================== */}
          <div className="z-sparkles" aria-hidden="true">
            <SparkleStar className="z-sparkle-1" />
            <SparkleStar className="z-sparkle-2" />
            <SparkleStar className="z-sparkle-3" />
          </div>
        </div>
      </div>
    </>
  );
}
