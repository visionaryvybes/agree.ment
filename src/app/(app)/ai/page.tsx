'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Globe, FileText, Scale, AlertTriangle, Mic, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { countries } from '@/data/countries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PROMPTS = [
  { icon: Scale, text: 'What are my rights if someone defaults on a personal loan?', tag: 'Rights' },
  { icon: FileText, text: 'Draft a formal demand letter for an unpaid debt of $3,000.', tag: 'Document' },
  { icon: AlertTriangle, text: 'How do I file a small claims court case?', tag: 'Legal Action' },
  { icon: Globe, text: 'What interest rate can I legally charge on a personal loan?', tag: 'Regulation' },
  { icon: FileText, text: 'Explain what makes a informal agreement legally binding.', tag: 'Education' },
  { icon: Scale, text: 'What is the difference between mediation and arbitration?', tag: 'ADR' },
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [jurisdiction, setJurisdiction] = useState('');
  const [showJurisdictions, setShowJurisdictions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          jurisdiction,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Unable to reach the AI service. Please check your connection and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>AI Legal Advisor</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Powered by Gemini · 195+ jurisdictions</div>
          </div>
        </div>

        {/* Jurisdiction selector */}
        <div style={{ position: 'relative' }}>
          <Button
            variant="outline"
            onClick={() => setShowJurisdictions(v => !v)}
            size="sm"
          >
            <Globe size={13} />
            {jurisdiction || 'Set jurisdiction'}
            <ChevronDown size={11} />
          </Button>
          {showJurisdictions && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 6px)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                zIndex: 50,
                width: 200,
                maxHeight: 280,
                overflowY: 'auto',
                padding: 4,
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => { setJurisdiction(''); setShowJurisdictions(false); }}
              >
                All jurisdictions
              </Button>
              {countries.map(c => (
                <Button
                  key={c.code}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => { setJurisdiction(c.name); setShowJurisdictions(false); }}
                  style={{ fontWeight: jurisdiction === c.name ? 600 : 400, fontSize: 12 }}
                >
                  {c.flag} {c.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div className="heading-display" style={{ fontSize: '1.4rem', marginBottom: 8 }}>
                  Legal guidance, instantly.
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: 14, maxWidth: 420, margin: '0 auto' }}>
                  Ask about contract rights, dispute escalation, demand letters, or jurisdiction-specific laws.
                  {jurisdiction && <strong style={{ color: 'var(--blue)' }}> Focused on {jurisdiction}.</strong>}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {PROMPTS.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => send(p.text)}
                      className="card"
                      style={{ padding: '14px 16px', textAlign: 'left', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}
                    >
                      <div style={{ width: 28, height: 28, background: 'var(--blue-subtle)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Icon size={13} style={{ color: 'var(--blue)' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 600 }}>{p.tag}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.4 }}>{p.text}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className="slide-up"
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: 10,
                  alignItems: 'flex-end',
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }}>
                    <Sparkles size={13} color="#fff" />
                  </div>
                )}
                <div style={{ maxWidth: '78%' }}>
                  <div className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}>
                    {msg.role === 'assistant' ? (
                      <div className="prose-legal">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.content}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ width: 28, height: 28, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={13} color="#fff" />
                </div>
                <div className="bubble-ai" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '12px 16px' }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '8px 12px', transition: 'border-color 0.12s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <textarea
              ref={inputRef}
              className="field"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask a legal question… e.g., 'Can I charge interest on a loan in Kenya?'"
              rows={1}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                resize: 'none',
                maxHeight: 120,
                overflowY: 'auto',
                padding: '4px 0',
                boxShadow: 'none',
                fontSize: 14,
                lineHeight: 1.5,
              }}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
              }}
            />
            <Button
              variant="premium"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              size="icon"
              style={{ flexShrink: 0 }}
            >
              <Send size={14} />
            </Button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 8 }}>
            Legal information only — not legal advice. Consult a qualified attorney for your specific matter.
          </p>
        </div>
      </div>
    </div>
  );
}
