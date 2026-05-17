"use client";

import { useState, useRef, useEffect } from "react";

const ACADEMY_NAME = "Padel Pro Academy";
const WHATSAPP_NUMBER = "+966500000000";

function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-2.5 animate-[fadeUp_0.25s_ease-out]">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D14028] to-[#EA553B] flex items-center justify-center text-xs flex-shrink-0 shadow-[0_0_8px_rgba(234,85,59,0.3)]">🎾</div>
      <div className="bg-[rgba(209,64,40,0.15)] border border-[rgba(234,85,59,0.2)] rounded-[4px_16px_16px_16px] px-3 py-2 flex gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#EA553B] block animate-[bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ role, text }: { role: string; text: string }) {
  const rtl = isArabic(text);
  return (
    <div className={`flex mb-2.5 animate-[fadeUp_0.25s_ease-out] ${role === "bot" ? "justify-start" : "justify-end"}`}>
      {role === "bot" && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D14028] to-[#EA553B] flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 shadow-[0_0_8px_rgba(234,85,59,0.3)]">🎾</div>
      )}
      <div className={`max-w-[76%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${rtl ? "direction-rtl text-right" : ""} ${
        role === "bot"
          ? "bg-[rgba(209,64,40,0.15)] border border-[rgba(234,85,59,0.2)] rounded-[4px_16px_16px_16px] text-[#FFE8E4]"
          : "bg-gradient-to-r from-[#D14028] to-[#EA553B] rounded-[16px_4px_16px_16px] text-[#FFF5F3]"
      }`}>
        {text}
      </div>
    </div>
  );
}

function SuccessOverlay({
  data, onClose,
}: {
  data: { name: string; level: string; interest: string; schedule: string; phone: string };
  onClose: () => void;
}) {
  const msgBody = `مرحباً! أنا ${data.name}، أهتم بـ ${data.interest} في ${ACADEMY_NAME} جدة.\nالمستوى: ${data.level}\nالوقت المفضل: ${data.schedule}`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(msgBody)}`;

  const rows: [string, string, string][] = [
    ["👤", "Name", data.name],
    ["🎾", "Level", data.level],
    ["🏋️", "Interest", data.interest],
    ["📅", "Schedule", data.schedule],
    ["📱", "Phone", data.phone],
  ];

  return (
    <div className="absolute inset-0 bg-[rgba(10,10,10,0.96)] flex items-center justify-center z-10 rounded-[20px] p-5 animate-[fadeIn_0.35s_ease-out]">
      <div className="text-center w-full">
        <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-gradient-to-br from-[#D14028] to-[#EA553B] flex items-center justify-center text-2xl shadow-[0_0_28px_rgba(234,85,59,0.5)]">✓</div>
        <h3 className="text-[#FFF5F3] text-[17px] font-bold mb-1">You&apos;re all set, {data.name}!</h3>
        <p className="text-[#FF8A6F] text-xs mb-4 leading-relaxed">
          Our head coach will WhatsApp you <strong className="text-[#EA553B]">within 1 hour</strong> to book your <strong className="text-[#EA553B]">FREE trial session</strong>.
        </p>
        <div className="bg-[rgba(209,64,40,0.15)] border border-[rgba(234,85,59,0.25)] rounded-xl px-3.5 py-2.5 mb-4 text-left">
          {rows.map(([icon, label, value]) => (
            <div key={label} className="flex justify-between text-[11.5px] mb-1 last:mb-0">
              <span className="text-[#FF6B4F]">{icon} {label}</span>
              <span className="text-[#FFF5F3] font-medium">{value || "—"}</span>
            </div>
          ))}
        </div>
        <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-2.5 px-4 font-semibold text-[13px] mb-2 no-underline hover:opacity-90 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.997 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.418A9.945 9.945 0 0011.997 22C17.517 22 22 17.523 22 12S17.517 2 11.997 2zm0 18c-1.68 0-3.25-.46-4.6-1.26l-.33-.196-3.403.968.932-3.374-.214-.347A8 8 0 1120 12a7.997 7.997 0 01-8.003 8z"/></svg>
          Message us on WhatsApp
        </a>
        <button onClick={onClose} className="bg-transparent border border-[rgba(255,138,111,0.25)] text-[#FF8A6F] rounded-lg py-1.5 px-4 text-xs cursor-pointer w-full">Close</button>
      </div>
    </div>
  );
}

export default function LeadCaptureWidget() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<{ name: string; level: string; interest: string; schedule: string; phone: string } | null>(null);
  const [started, setStarted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      callAPI(null);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  async function callAPI(userText: string | null) {
    setLoading(true);
    const newHistory = userText
      ? [...history, { role: "user" as const, content: userText }]
      : [{ role: "user" as const, content: "Hello! I want to know more about the academy." }];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      const raw: string = data.content?.[0]?.text ?? "Something went wrong. Please try again! 🎾";
      const leadMatch = raw.match(/\[LEAD:(\{[\s\S]*?\})\]/);
      const cleanText = raw.replace(/\[LEAD:[\s\S]*?\]/, "").trim();
      setMessages(prev => [...prev, { role: "bot", text: cleanText }]);
      setHistory([...newHistory, { role: "assistant", content: cleanText }]);
      if (leadMatch) {
        try {
          const ld = JSON.parse(leadMatch[1]);
          setTimeout(() => setLeadData(ld), 900);
        } catch (_) {}
      }
    } catch (_) {
      setMessages(prev => [...prev, { role: "bot", text: "Connection issue — please refresh and try again! 🎾" }]);
    } finally {
      setLoading(false);
    }
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || loading || leadData) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    callAPI(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const sendActive = input.trim().length > 0 && !loading && !leadData;

  return (
    <>
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.2);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(234,85,59,0.5)} 50%{box-shadow:0 0 0 16px rgba(234,85,59,0)} }
      `}</style>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-[99998] animate-[fadeIn_0.3s_ease-out]" onClick={() => setOpen(false)} />
      )}

      {/* Chat Popup */}
      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none" style={{ fontFamily: "'Inter','DM Sans',sans-serif" }}>
          <div className="pointer-events-auto w-full max-w-[480px] h-[640px] max-h-[90vh] max-[480px]:fixed max-[480px]:inset-0 max-[480px]:max-h-full max-[480px]:rounded-none rounded-[20px] bg-[#0F0F0F] border border-[rgba(234,85,59,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#222] px-4 py-3.5 flex-shrink-0 border-b border-[rgba(234,85,59,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D14028] to-[#EA553B] flex items-center justify-center text-xl shadow-[0_0_14px_rgba(234,85,59,0.4)] flex-shrink-0">🎾</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#FFF5F3] font-semibold text-[14px] truncate">Malik · Padel Pro Academy</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA553B] shadow-[0_0_5px_#EA553B] inline-block" />
                    <span className="text-[#FF8A6F] text-[11px]">Online · Jeddah 🇸🇦</span>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="ml-auto bg-[rgba(255,255,255,0.06)] border-none text-[#FF8A6F] rounded-lg w-7 h-7 text-lg cursor-pointer flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors">×</button>
              </div>
              <div className="mt-2.5 bg-[rgba(234,85,59,0.1)] rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 border border-[rgba(234,85,59,0.2)] text-[11px] text-[#FF8A6F]">
                🎁 First session FREE — no commitment
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col scroll-smooth" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(234,85,59,0.15) transparent" }}>
              {messages.map((m, i) => <ChatMessage key={i} role={m.role} text={m.text} />)}
              {loading && <TypingIndicator />}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-[rgba(234,85,59,0.1)] bg-[#0F0F0F] flex-shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={loading || !!leadData}
                  className="flex-1 bg-[rgba(209,64,40,0.1)] border border-[rgba(234,85,59,0.2)] rounded-xl px-3.5 py-2.5 text-[14px] text-[#FFE8E4] outline-none transition-[border-color] duration-200 placeholder:text-[#6B2A1A] disabled:opacity-40"
                  style={{ fontFamily: "'Inter','DM Sans',sans-serif" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!sendActive}
                  className={`w-10 h-10 rounded-xl border-none flex items-center justify-center flex-shrink-0 transition-[background,transform] duration-200 active:scale-90 ${sendActive ? "bg-[#D14028] cursor-pointer" : "bg-[rgba(209,64,40,0.2)] cursor-default"}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF5F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-center text-[#5B2010] text-[10px] mt-1.5">AI-powered · Private & secure</p>
            </div>

            {leadData && <SuccessOverlay data={leadData} onClose={() => { setLeadData(null); setOpen(false); }} />}
          </div>
        </div>
      )}

      {/* FAB Button (only shows when closed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[99999] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D14028] to-[#EA553B] border border-[rgba(234,85,59,0.4)] shadow-[0_4px_20px_rgba(234,85,59,0.45)] animate-[pulse-ring_2.5s_ease-in-out_infinite]"
          style={{ fontFamily: "'Inter','DM Sans',sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          <span className="text-white text-sm font-semibold">Chat with us</span>
        </button>
      )}
    </>
  );
}
