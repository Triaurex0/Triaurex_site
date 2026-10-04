import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  ChevronDown,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import './Chatbot.css';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome-1',
  role: 'assistant',
  content: "Hi! 👋 I'm **Aurora**, your TRIAUREX digital assistant. I can answer questions about our design & engineering services, tech stack, past case studies, pricing, and project timelines. How can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const DEFAULT_SUGGESTIONS = [
  "What services does TRIAUREX offer?",
  "What is your typical project timeline & pricing?",
  "Do you build native Android apps?",
  "How do I start a project with TRIAUREX?"
];

// Lightweight, secure Markdown renderer for chat responses
function formatMarkdown(text) {
  if (!text) return { __html: '' };

  let html = text
    // Escape HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Inline code: `code`
    .replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>')
    // Markdown links: [text](url)
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1 <span class="ext-icon">↗</span></a>');

  // Convert line breaks and bullet points
  const lines = html.split('\n');
  let formatted = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        formatted += '<ul class="chat-list">';
        inList = true;
      }
      formatted += `<li>${line.substring(2)}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        formatted += '<ol class="chat-list ordered">';
        inList = true;
      }
      const itemContent = line.replace(/^\d+\.\s/, '');
      formatted += `<li>${itemContent}</li>`;
    } else {
      if (inList) {
        formatted += inList === 'ordered' ? '</ol>' : '</ul>';
        inList = false;
      }
      if (line === '') {
        formatted += '<div class="chat-paragraph-gap"></div>';
      } else {
        formatted += `<p class="chat-p">${line}</p>`;
      }
    }
  }

  if (inList) {
    formatted += '</ul>';
  }

  return { __html: formatted };
}

export default function Chatbot({ apiBaseUrl = 'http://127.0.0.1:5000' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('triaurex_chat_messages');
      return saved ? JSON.parse(saved) : [DEFAULT_WELCOME_MESSAGE];
    } catch {
      return [DEFAULT_WELCOME_MESSAGE];
    }
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(DEFAULT_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist messages in sessionStorage for the browser session
  useEffect(() => {
    try {
      sessionStorage.setItem('triaurex_chat_messages', JSON.stringify(messages));
    } catch (e) {
      // sessionStorage disabled or quota exceeded
    }
  }, [messages]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setHasUnread(false);
    }
  }, [isOpen, isMinimized]);

  // Fetch remote suggested questions if available
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/chat/suggested`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.suggestedQuestions) && data.suggestedQuestions.length > 0) {
            setSuggestedQuestions(data.suggestedQuestions);
          }
        }
      } catch {
        // Use default fallback questions
      }
    };
    fetchSuggested();
  }, [apiBaseUrl]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setShowSuggestions(false);

    const userMessageObj = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update UI immediately with user message
    const updatedHistory = [...messages, userMessageObj];
    setMessages(updatedHistory);
    setInputMessage('');
    setIsLoading(true);

    // Prepare history payload for multi-turn conversation
    const conversationPayload = updatedHistory
      .filter(m => m.id !== 'welcome-1')
      .slice(-8)
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query,
          conversation: conversationPayload
        })
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const botMessageObj = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessageObj]);
        if (Array.isArray(data.suggestedQuestions) && data.suggestedQuestions.length > 0) {
          setSuggestedQuestions(data.suggestedQuestions);
        }
      } else {
        const fallbackText = data.reply || "**TRIAUREX provides end-to-end digital craftsmanship across several core services:**\n\n• **UI/UX Design**: Research, wireframes, interactive prototypes, and design systems\n• **Web Development**: High-performance web apps built with React and modern backend architecture\n• **Android App Development**: Native Android solutions with Kotlin and Jetpack Compose\n• **Branding & Identity**: Strategic positioning, visual identity, and brand assets\n\nWe also support milestone-based projects, sprint retainers, and team augmentation. If you want, we can help plan your next digital build. You can reach us at [triaurex0@gmail.com](mailto:triaurex0@gmail.com) or [+91 80157 12990](tel:+918015712990).";
        const botErrorObj = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botErrorObj]);
      }
    } catch (err) {
      console.warn("Backend chat endpoint unreachable, activating client fallback:", err);
      const offlineMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: "**TRIAUREX provides end-to-end digital craftsmanship across several core services:**\n\n• **UI/UX Design**: Research, wireframes, interactive prototypes, and design systems\n• **Web Development**: High-performance web apps built with React and modern backend architecture\n• **Android App Development**: Native Android solutions with Kotlin and Jetpack Compose\n• **Branding & Identity**: Strategic positioning, visual identity, and brand assets\n\nWe also support milestone-based projects, sprint retainers, and team augmentation. If you want, we can help plan your next digital build. You can reach us at [triaurex0@gmail.com](mailto:triaurex0@gmail.com) or [+91 80157 12990](tel:+918015712990).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, offlineMsg]);
    } finally {
      setIsLoading(false);
      if (!isOpen) {
        setHasUnread(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([DEFAULT_WELCOME_MESSAGE]);
      setSuggestedQuestions(DEFAULT_SUGGESTIONS);
      setShowSuggestions(true);
      try {
        sessionStorage.removeItem('triaurex_chat_messages');
      } catch {}
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="triaurex-chatbot-root">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="triaurex-chatbot-trigger"
          className="chat-floating-btn"
          onClick={toggleChat}
          aria-label="Open TRIAUREX AI Assistant"
          title="Chat with Aurora"
        >
          <div className="chat-btn-glow"></div>
          <div className="chat-btn-inner">
            <MessageSquare size={24} className="chat-icon-primary" />
            <Sparkles size={14} className="chat-sparkle-badge" />
          </div>
          {hasUnread && <span className="chat-unread-dot"></span>}
          <span className="chat-btn-tooltip">Chat with Aurora</span>
        </button>
      )}

      {/* Modern Glassmorphic Chat Window */}
      {isOpen && (
        <div
          id="triaurex-chatbot-window"
          className={`chat-window ${isMinimized ? 'minimized' : ''}`}
          role="dialog"
          aria-labelledby="chat-heading"
        >
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-profile">
              <div className="chat-avatar-wrapper">
                <div className="chat-avatar-glow"></div>
                <div className="chat-avatar">
                  <Bot size={20} color="#00f0ff" />
                </div>
                <span className="chat-status-indicator" title="Online & Ready"></span>
              </div>
              <div className="chat-header-meta">
                <div className="chat-title-row">
                  <h3 id="chat-heading" className="chat-title">Aurora</h3>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                type="button"
                className="chat-action-btn"
                onClick={() => window.open(window.location.href, '_blank')}
                title="Open in new tab"
                aria-label="Open in new tab"
              >
                <ExternalLink size={15} />
              </button>
              <button
                type="button"
                className="chat-action-btn"
                onClick={handleClearChat}
                title="Clear conversation"
                aria-label="Clear chat conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                className="chat-action-btn"
                onClick={() => setIsMinimized(prev => !prev)}
                title={isMinimized ? "Expand" : "Minimize"}
                aria-label="Minimize chat"
              >
                <ChevronDown size={18} className={isMinimized ? 'rotate-180' : ''} />
              </button>
              <button
                type="button"
                className="chat-action-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat window"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="chat-messages-container">
                <div className="chat-messages-scroll">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`chat-bubble-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="bubble-avatar bot">
                          <Bot size={14} color="#00f0ff" />
                        </div>
                      )}

                      <div className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                        {msg.role === 'assistant' ? (
                          <div
                            className="chat-markdown-content"
                            dangerouslySetInnerHTML={formatMarkdown(msg.content)}
                          />
                        ) : (
                          <div className="chat-user-text">{msg.content}</div>
                        )}
                        <div className="chat-timestamp">{msg.timestamp}</div>
                      </div>

                      {msg.role === 'user' && (
                        <div className="bubble-avatar user">
                          <User size={14} color="#ffffff" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading / Typing Indicator */}
                  {isLoading && (
                    <div className="chat-bubble-row bot-row">
                      <div className="bubble-avatar bot">
                        <Bot size={14} color="#00f0ff" />
                      </div>
                      <div className="chat-bubble bot-bubble typing-bubble">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="typing-label">Aurora is typing...</span>
                      </div>
                    </div>
                  )}

                  {/* Suggested Question Chips: Shown on new tab/chat, hidden during conversation until clicked */}
                  {!isLoading && suggestedQuestions && suggestedQuestions.length > 0 && (
                    <div className="chat-suggestions-section">
                      {messages.length <= 1 ? (
                        /* When opened in new tab / new chat: show open by default */
                        <>
                          <div className="chat-suggestions-title">
                            <Sparkles size={12} color="#00f0ff" />
                            <span>Suggested questions</span>
                          </div>
                          <div className="chat-chips-grid">
                            {suggestedQuestions.map((q, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="chat-chip-btn"
                                onClick={() => handleSendMessage(q)}
                              >
                                <span>{q}</span>
                                <span className="chip-arrow">→</span>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        /* Otherwise during conversation: hide list and show toggle button that opens when clicked */
                        <>
                          <button
                            type="button"
                            className={`chat-suggestions-toggle-btn ${showSuggestions ? 'active' : ''}`}
                            onClick={() => setShowSuggestions(prev => !prev)}
                            title={showSuggestions ? "Hide suggestions" : "Click to view suggested questions"}
                          >
                            <div className="toggle-left">
                              <Sparkles size={12} color="#00f0ff" />
                              <span>Suggested questions</span>
                            </div>
                            <ChevronDown size={14} className={showSuggestions ? 'rotate-180' : ''} />
                          </button>

                          {showSuggestions && (
                            <div className="chat-chips-grid chat-chips-expanded">
                              {suggestedQuestions.map((q, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className="chat-chip-btn"
                                  onClick={() => {
                                    setShowSuggestions(false);
                                    handleSendMessage(q);
                                  }}
                                >
                                  <span>{q}</span>
                                  <span className="chip-arrow">→</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="chat-input-area">
                <form
                  className="chat-input-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <input
                    ref={inputRef}
                    id="triaurex-chatbot-input"
                    type="text"
                    className="chat-input-field"
                    placeholder="Ask about our services, pricing, tech stack..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    maxLength={1000}
                    autoComplete="off"
                  />
                  <button
                    id="triaurex-chatbot-send-btn"
                    type="submit"
                    className="chat-send-btn"
                    disabled={isLoading || !inputMessage.trim()}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div className="chat-footer-note">
                  <ShieldCheck size={12} color="#00f0ff" />
                  <span>Powered by TRIAUREX studio data. Privacy protected.</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
