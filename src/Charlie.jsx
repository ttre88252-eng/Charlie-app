import React, { useState, useRef, useEffect } from "react";
import {
  Plus, Mic, Paperclip, Send, Square, Copy, Check, RotateCcw, X,
  Sun, Moon, Menu, Trash2, MessageSquare, FileText,
  Image as ImageIcon, ThumbsUp, ThumbsDown, Settings,
  SlidersHorizontal, Globe, User, History as HistoryIcon, Database,
  KeyRound, Eye, EyeOff, AlertTriangle, Camera, FileUp, HelpCircle, Mail
} from "lucide-react";

/* ---------------------------------------------------------
   CHARLIE — conversational AI workspace
   Layout inspired by modern AI chat apps: left rail of chats,
   central conversation column, settings as a tabbed dialog.
   Tokens: paper bg, ink text, signal-violet primary, amber signature.
--------------------------------------------------------- */

const GEMINI_MODEL = "gemini-2.5-flash";

// Correo de soporte/contacto, usado en Ajustes → Ayuda para el botón "Enviar correo".
const SUPPORT_EMAIL = "Kaled82dc@gmail.com";

const THEME = {
  light: {
    bg: "#FAF8F4", surface: "#FFFFFF", surfaceAlt: "#F1EEE7",
    border: "#E4DFD4", text: "#211F1C", textMuted: "#6B665D",
    primary: "#4B4ACF", primarySoft: "#ECEBFC", accent: "#E8871E",
    danger: "#C24B3F", dangerSoft: "#FBEAE7", bubbleUser: "#EFEDFF",
    codeBg: "#1E1C24", codeText: "#EDEBF5", overlay: "rgba(20,18,14,0.45)"
  },
  dark: {
    bg: "#131219", surface: "#1C1A23", surfaceAlt: "#242230",
    border: "#33303E", text: "#EEEBF6", textMuted: "#9C97AC",
    primary: "#9B97FF", primarySoft: "#2B2740", accent: "#F0A83C",
    danger: "#E27C6E", dangerSoft: "#3A2420", bubbleUser: "#2A2740",
    codeBg: "#0F0E14", codeText: "#EDEBF5", overlay: "rgba(0,0,0,0.6)"
  }
};

const STR = {
  es: {
    newChat: "Nuevo chat", placeholder: "Escribe un mensaje a Charlie…",
    hello: "Hola, soy Charlie", sub: "Pregúntame lo que sea, súbeme un archivo o háblame con el micrófono.",
    thinking: "Pensando…", disclaimer: "Charlie puede cometer errores. Comprueba la información importante.",
    settings: "Ajustes", general: "Apariencia", personalize: "Personalizar", language: "Idioma",
    account: "Cuenta", history: "Historial", storage: "Almacenamiento", apikey: "Clave de API",
    darkMode: "Modo oscuro", lightMode: "Modo claro", deleteChat: "Eliminar chat",
    deleteAll: "Eliminar todos los chats", noChats: "No tienes chats guardados.",
    displayName: "Nombre para mostrar", saveHistoryLabel: "Guardar historial de chats",
    saveHistoryDesc: "Cuando está desactivado, tus conversaciones no se guardan entre sesiones.",
    storageUsed: "Almacenamiento usado", clearStorage: "Borrar todos los datos guardados",
    clearStorageDesc: "Esto elimina todos los chats, preferencias y la clave de API guardadas en este navegador.",
    customLabel: "¿Cómo debería responder Charlie?", customPlaceholder: "Ej: sé breve, usa un tono cercano, responde siempre con ejemplos…",
    apiKeyLabel: "Clave de API personalizada", apiKeyDesc: "Añade tu propia clave de API para que Charlie se conecte a tu proveedor de IA en lugar del modelo integrado.",
    apiKeyPlaceholder: "Pega tu clave aquí", remember: "Recordar esta clave en este navegador",
    save: "Guardar", remove: "Quitar clave", usingGemini: "Usando tu clave de Gemini",
    usingClaude: "Usando tu clave de Anthropic (Claude)", usingBuiltin: "Añade una clave de API en Ajustes para empezar a chatear",
    close: "Cerrar", anthropicLabel: "Clave de Anthropic (Claude)", geminiLabel: "Clave de Google (Gemini)",
    apiPriorityNote: "Si añades ambas claves, Charlie usará primero Anthropic.",
    themeLabel: "Tema", namePlaceholder: "Tu nombre", nameNote: "Se usa solo para personalizar el saludo, no se comparte con nadie.",
    confirmQuestion: "¿Seguro?", cancel: "Cancelar", confirm: "Confirmar",
    takePhoto: "Tomar foto", uploadFile: "Subir archivo", gallery: "Galería / Google Fotos",
    attach: "Adjuntar", speak: "Hablar", stopSpeak: "Detener grabación", send: "Enviar", stop: "Detener",
    noResponse: "No he podido generar una respuesta.", stoppedGen: "_(generación detenida)_",
    connError: "Ha ocurrido un error al conectar con la IA", checkKey: " (revisa tu clave de API en Ajustes)",
    regenError: "Error al regenerar la respuesta.", noKeyError: "Añade una clave de API de Anthropic o Gemini en Ajustes → Clave de API para poder chatear.",
    micUnavailable: "El reconocimiento de voz no está disponible en este navegador.", guest: "Invitado",
    help: "Ayuda", helpTitle: "¿Necesitás ayuda?", helpDesc: "Escribinos si tenés dudas, encontraste un error o querés sugerir algo.",
    sendEmailBtn: "Enviar correo"
  },
  en: {
    newChat: "New chat", placeholder: "Message Charlie…",
    hello: "Hi, I'm Charlie", sub: "Ask me anything, upload a file, or talk to me with the microphone.",
    thinking: "Thinking…", disclaimer: "Charlie can make mistakes. Check important info.",
    settings: "Settings", general: "Appearance", personalize: "Personalize", language: "Language",
    account: "Account", history: "History", storage: "Storage", apikey: "API key",
    darkMode: "Dark mode", lightMode: "Light mode", deleteChat: "Delete chat",
    deleteAll: "Delete all chats", noChats: "You have no saved chats.",
    displayName: "Display name", saveHistoryLabel: "Save chat history",
    saveHistoryDesc: "When off, your conversations won't be saved between sessions.",
    storageUsed: "Storage used", clearStorage: "Clear all saved data",
    clearStorageDesc: "This removes all chats, preferences and the saved API key in this browser.",
    customLabel: "How should Charlie respond?", customPlaceholder: "e.g. be concise, use a friendly tone, always include examples…",
    apiKeyLabel: "Custom API key", apiKeyDesc: "Add your own API key so Charlie connects to your AI provider instead of the built-in model.",
    apiKeyPlaceholder: "Paste your key here", remember: "Remember this key on this browser",
    save: "Save", remove: "Remove key", usingGemini: "Using your Gemini key",
    usingClaude: "Using your Anthropic (Claude) key", usingBuiltin: "Add an API key in Settings to start chatting",
    close: "Close", anthropicLabel: "Anthropic (Claude) key", geminiLabel: "Google (Gemini) key",
    apiPriorityNote: "If you add both keys, Charlie will use Anthropic first.",
    themeLabel: "Theme", namePlaceholder: "Your name", nameNote: "Only used to personalize the greeting, never shared with anyone.",
    confirmQuestion: "Are you sure?", cancel: "Cancel", confirm: "Confirm",
    takePhoto: "Take photo", uploadFile: "Upload file", gallery: "Gallery / Google Photos",
    attach: "Attach", speak: "Speak", stopSpeak: "Stop recording", send: "Send", stop: "Stop",
    noResponse: "I couldn't generate a response.", stoppedGen: "_(generation stopped)_",
    connError: "There was an error connecting to the AI", checkKey: " (check your API key in Settings)",
    regenError: "Error regenerating the response.", noKeyError: "Add an Anthropic or Gemini API key in Settings → API key to start chatting.",
    micUnavailable: "Speech recognition isn't available in this browser.", guest: "Guest",
    help: "Help", helpTitle: "Need help?", helpDesc: "Write to us if you have questions, found a bug, or want to suggest something.",
    sendEmailBtn: "Send email"
  }
};

const LOGO_DATA_URI = "data:image/jpeg;base64,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";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const newConversation = () => ({ id: uid(), title: "New chat", createdAt: Date.now(), messages: [] });

/* ---------- lightweight markdown-ish renderer ---------- */
function InlineText({ text, c }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("`") && p.endsWith("`")) {
          return (
            <code key={i} style={{ background: c.surfaceAlt, padding: "1px 5px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88em" }}>
              {p.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function RenderedMessage({ content, c }) {
  const blocks = content.split(/```/g);
  return (
    <div style={{ lineHeight: 1.65 }}>
      {blocks.map((block, idx) => {
        if (idx % 2 === 1) {
          const lines = block.split("\n");
          const lang = lines[0].trim();
          const code = lines.slice(1).join("\n") || lines.join("\n");
          return (
            <pre key={idx} style={{ background: c.codeBg, color: c.codeText, padding: "12px 14px", borderRadius: 10, overflowX: "auto", margin: "10px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              {lang && <div style={{ opacity: 0.5, fontSize: 11, marginBottom: 6 }}>{lang}</div>}
              <code>{code}</code>
            </pre>
          );
        }
        return block.split("\n").map((line, li) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("- ")) {
            return (
              <div key={idx + "-" + li} style={{ display: "flex", gap: 8, margin: "3px 0" }}>
                <span style={{ color: c.primary }}>•</span>
                <span><InlineText text={trimmed.slice(2)} c={c} /></span>
              </div>
            );
          }
          if (trimmed === "") return <div key={idx + "-" + li} style={{ height: 8 }} />;
          return <p key={idx + "-" + li} style={{ margin: "4px 0" }}><InlineText text={line} c={c} /></p>;
        });
      })}
    </div>
  );
}

function Orb({ size = 28, active = false, c }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <img
        src={LOGO_DATA_URI}
        alt="Charlie"
        style={{
          width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover",
          border: `1px solid ${c.border}`,
          animation: active ? "charlie-pulse 1.4s ease-in-out infinite" : "none"
        }}
      />
      <style>{`@keyframes charlie-pulse {0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(0.82);opacity:0.7;}}`}</style>
    </div>
  );
}

/* ================= SETTINGS DIALOG ================= */
function SettingsDialog({
  c, t, onClose, theme, setTheme, uiLang, setUiLang, customInstructions, setCustomInstructions,
  accountName, setAccountName, saveHistory, setSaveHistory, conversations, deleteConversation,
  deleteAllConversations, storageBytes, clearAllData, geminiKey, setGeminiKey, anthropicKey, setAnthropicKey,
  rememberKey, setRememberKey, isMobile
}) {
  const [tab, setTab] = useState("general");
  const [geminiInput, setGeminiInput] = useState(geminiKey || "");
  const [anthropicInput, setAnthropicInput] = useState(anthropicKey || "");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const tabs = [
    { id: "general", label: t.general, icon: Sun },
    { id: "personalize", label: t.personalize, icon: SlidersHorizontal },
    { id: "language", label: t.language, icon: Globe },
    { id: "account", label: t.account, icon: User },
    { id: "history", label: t.history, icon: HistoryIcon },
    { id: "storage", label: t.storage, icon: Database },
    { id: "apikey", label: t.apikey, icon: KeyRound },
    { id: "help", label: t.help, icon: HelpCircle },
  ];

  return (
    <div style={{ background: c.overlay }} className={`fixed inset-0 z-50 flex ${isMobile ? "" : "items-center justify-center p-4"}`} onClick={onClose}>
      <div
        style={
          isMobile
            ? { background: c.surface, width: "100%", height: "100%" }
            : { background: c.surface, border: `1px solid ${c.border}`, width: 720, maxWidth: "100%", height: 520, maxHeight: "90vh" }
        }
        className={`shadow-2xl flex overflow-hidden ${isMobile ? "flex-col" : "rounded-2xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* nav: sidebar on desktop, horizontal scroll strip on mobile */}
        {isMobile ? (
          <div style={{ borderBottom: `1px solid ${c.border}`, background: c.surfaceAlt }} className="flex-shrink-0 flex items-center justify-between px-3 py-2.5">
            <span style={{ color: c.text }} className="text-sm font-semibold">{t.settings}</span>
            <button onClick={onClose} style={{ color: c.textMuted }} className="tap-target -mr-2" aria-label={t.close}><X size={20} /></button>
          </div>
        ) : null}
        <div
          style={
            isMobile
              ? { borderBottom: `1px solid ${c.border}`, background: c.surfaceAlt }
              : { width: 190, borderRight: `1px solid ${c.border}`, background: c.surfaceAlt }
          }
          className={isMobile ? "flex-shrink-0 flex overflow-x-auto px-2 py-2 gap-1" : "flex-shrink-0 py-3 px-2 overflow-y-auto"}
        >
          {!isMobile && <div style={{ color: c.text }} className="px-2.5 py-2 text-sm font-semibold">{t.settings}</div>}
          {tabs.map((tb) => {
            const Icon = tb.icon;
            const isActive = tab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                style={{ background: isActive ? c.primarySoft : "transparent", color: isActive ? c.primary : c.text }}
                className={isMobile ? "flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap" : "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5 text-left"}
              >
                <Icon size={15} /> {tb.label}
              </button>
            );
          })}
        </div>

        {/* right content */}
        <div className="flex-1 flex flex-col min-w-0">
          {!isMobile && (
            <div style={{ borderBottom: `1px solid ${c.border}` }} className="flex items-center justify-between px-5 py-3 flex-shrink-0">
              <span style={{ color: c.text }} className="font-medium text-sm">{tabs.find((x) => x.id === tab)?.label}</span>
              <button onClick={onClose} style={{ color: c.textMuted }} className="tap-target -mr-2" aria-label={t.close}><X size={18} /></button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {tab === "general" && (
              <div className="space-y-3">
                <div style={{ color: c.textMuted }} className="text-xs mb-1">{t.themeLabel}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    style={{ background: theme === "light" ? c.primarySoft : c.surfaceAlt, color: theme === "light" ? c.primary : c.text, border: `1px solid ${c.border}` }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm"
                  >
                    <Sun size={16} /> {t.lightMode}
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    style={{ background: theme === "dark" ? c.primarySoft : c.surfaceAlt, color: theme === "dark" ? c.primary : c.text, border: `1px solid ${c.border}` }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm"
                  >
                    <Moon size={16} /> {t.darkMode}
                  </button>
                </div>
              </div>
            )}

            {tab === "personalize" && (
              <div>
                <div style={{ color: c.text }} className="text-sm font-medium mb-1.5">{t.customLabel}</div>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder={t.customPlaceholder}
                  rows={6}
                  style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
                  className="w-full rounded-xl p-3 text-sm outline-none resize-none"
                />
              </div>
            )}

            {tab === "language" && (
              <div className="space-y-2">
                {[{ id: "es", label: "Español" }, { id: "en", label: "English" }].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setUiLang(l.id)}
                    style={{ background: uiLang === l.id ? c.primarySoft : c.surfaceAlt, color: uiLang === l.id ? c.primary : c.text, border: `1px solid ${c.border}` }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm"
                  >
                    {l.label} {uiLang === l.id && <Check size={15} />}
                  </button>
                ))}
              </div>
            )}

            {tab === "account" && (
              <div>
                <div style={{ color: c.text }} className="text-sm font-medium mb-1.5">{t.displayName}</div>
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
                  className="w-full rounded-xl p-3 text-sm outline-none"
                />
                <p style={{ color: c.textMuted }} className="text-xs mt-2">{t.nameNote}</p>
              </div>
            )}

            {tab === "history" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div style={{ color: c.text }} className="text-sm font-medium">{t.saveHistoryLabel}</div>
                    <div style={{ color: c.textMuted }} className="text-xs">{t.saveHistoryDesc}</div>
                  </div>
                  <button
                    onClick={() => setSaveHistory(!saveHistory)}
                    style={{ background: saveHistory ? c.primary : c.border }}
                    className="w-10 h-6 rounded-full relative flex-shrink-0 transition"
                  >
                    <div style={{ left: saveHistory ? 18 : 2, transition: "left 0.15s" }} className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" />
                  </button>
                </div>

                <div style={{ borderTop: `1px solid ${c.border}` }} className="pt-3 space-y-1 max-h-56 overflow-y-auto">
                  {conversations.length === 0 && <div style={{ color: c.textMuted }} className="text-sm">{t.noChats}</div>}
                  {conversations.map((cv) => (
                    <div key={cv.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ color: c.text }}>
                      <span className="truncate text-sm flex-1">{cv.title === "New chat" ? t.newChat : cv.title}</span>
                      <button onClick={() => deleteConversation(cv.id)} style={{ color: c.danger }} className="tap-target-sm -mr-1.5" title={t.deleteChat} aria-label={t.deleteChat}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {conversations.length > 0 && (
                  <button
                    onClick={deleteAllConversations}
                    style={{ color: c.danger, background: c.dangerSoft }}
                    className="mt-3 w-full py-2 rounded-xl text-sm font-medium"
                  >
                    {t.deleteAll}
                  </button>
                )}
              </div>
            )}

            {tab === "storage" && (
              <div>
                <div style={{ color: c.text }} className="text-sm font-medium">{t.storageUsed}</div>
                <div style={{ color: c.textMuted }} className="text-sm mt-1">
                  {storageBytes < 1024 ? `${storageBytes} B` : `${(storageBytes / 1024).toFixed(1)} KB`}
                </div>
                <div style={{ background: c.surfaceAlt, borderRadius: 999 }} className="h-2 mt-2 mb-4 overflow-hidden">
                  <div style={{ width: `${Math.min(100, (storageBytes / 500000) * 100)}%`, background: c.primary, height: "100%" }} />
                </div>

                {!confirmClear ? (
                  <button
                    onClick={() => setConfirmClear(true)}
                    style={{ color: c.danger, background: c.dangerSoft }}
                    className="w-full py-2.5 rounded-xl text-sm font-medium"
                  >
                    {t.clearStorage}
                  </button>
                ) : (
                  <div style={{ background: c.dangerSoft, border: `1px solid ${c.danger}` }} className="rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2" style={{ color: c.danger }}>
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">{t.confirmQuestion}</span>
                    </div>
                    <p style={{ color: c.text }} className="text-xs mb-3">{t.clearStorageDesc}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmClear(false)} style={{ color: c.text, background: c.surfaceAlt }} className="flex-1 py-2 rounded-lg text-sm">{t.cancel}</button>
                      <button onClick={() => { clearAllData(); setConfirmClear(false); }} style={{ color: "#fff", background: c.danger }} className="flex-1 py-2 rounded-lg text-sm">{t.confirm}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "apikey" && (
              <div>
                <div style={{ color: c.text }} className="text-sm font-medium mb-1">{t.apiKeyLabel}</div>
                <p style={{ color: c.textMuted }} className="text-xs mb-3">{t.apiKeyDesc}</p>

                <div style={{ color: c.text }} className="text-xs font-semibold mb-1.5">{t.anthropicLabel}</div>
                <div className="relative mb-3">
                  <input
                    type={showAnthropicKey ? "text" : "password"}
                    value={anthropicInput}
                    onChange={(e) => setAnthropicInput(e.target.value)}
                    placeholder={t.apiKeyPlaceholder}
                    style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
                    className="w-full rounded-xl p-3 pr-10 text-sm outline-none font-mono"
                  />
                  <button onClick={() => setShowAnthropicKey((s) => !s)} style={{ color: c.textMuted }} className="tap-target-sm absolute right-0 top-1/2 -translate-y-1/2" aria-label={showAnthropicKey ? "Ocultar clave" : "Mostrar clave"}>
                    {showAnthropicKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div style={{ color: c.text }} className="text-xs font-semibold mb-1.5">{t.geminiLabel}</div>
                <div className="relative mb-3">
                  <input
                    type={showGeminiKey ? "text" : "password"}
                    value={geminiInput}
                    onChange={(e) => setGeminiInput(e.target.value)}
                    placeholder={t.apiKeyPlaceholder}
                    style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
                    className="w-full rounded-xl p-3 pr-10 text-sm outline-none font-mono"
                  />
                  <button onClick={() => setShowGeminiKey((s) => !s)} style={{ color: c.textMuted }} className="tap-target-sm absolute right-0 top-1/2 -translate-y-1/2" aria-label={showGeminiKey ? "Ocultar clave" : "Mostrar clave"}>
                    {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <p style={{ color: c.textMuted }} className="text-xs mb-3">{t.apiPriorityNote}</p>

                <label className="flex items-center gap-2 mb-4 text-sm" style={{ color: c.text }}>
                  <input type="checkbox" checked={rememberKey} onChange={(e) => setRememberKey(e.target.checked)} />
                  {t.remember}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setAnthropicKey(anthropicInput.trim()); setGeminiKey(geminiInput.trim()); }}
                    style={{ background: c.primary, color: "#fff" }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  >
                    {t.save}
                  </button>
                  {(geminiKey || anthropicKey) && (
                    <button
                      onClick={() => { setGeminiKey(""); setAnthropicKey(""); setGeminiInput(""); setAnthropicInput(""); }}
                      style={{ background: c.dangerSoft, color: c.danger }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    >
                      {t.remove}
                    </button>
                  )}
                </div>
                <div style={{ background: c.surfaceAlt }} className="mt-4 rounded-xl p-3 text-xs flex items-center gap-2" >
                  <div style={{ background: (geminiKey || anthropicKey) ? c.accent : c.textMuted, width: 7, height: 7, borderRadius: "50%" }} />
                  <span style={{ color: c.text }}>{anthropicKey ? t.usingClaude : geminiKey ? t.usingGemini : t.usingBuiltin}</span>
                </div>
              </div>
            )}

            {tab === "help" && (
              <div>
                <div style={{ color: c.text }} className="text-sm font-medium mb-1">{t.helpTitle}</div>
                <p style={{ color: c.textMuted }} className="text-xs mb-4">{t.helpDesc}</p>

                <div style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }} className="flex items-center gap-2.5 rounded-xl p-3 mb-3">
                  <Mail size={16} style={{ color: c.primary, flexShrink: 0 }} />
                  <span style={{ color: c.text }} className="text-sm font-mono break-all">{SUPPORT_EMAIL}</span>
                </div>

                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  style={{ background: c.primary, color: "#fff" }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium no-underline"
                >
                  <Send size={15} /> {t.sendEmailBtn}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN APP ================= */
export default function Charlie() {
  const [theme, setTheme] = useState("light");
  const c = THEME[theme];
  const [uiLang, setUiLang] = useState("es");
  const t = STR[uiLang];

  const [conversations, setConversations] = useState([newConversation()]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 768 : true));
  const [copiedId, setCopiedId] = useState(null);
  const [reactions, setReactions] = useState({});
  const [storageReady, setStorageReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);

  const [customInstructions, setCustomInstructions] = useState("");
  const [accountName, setAccountName] = useState("");
  const [saveHistory, setSaveHistory] = useState(true);
  const [geminiKey, setGeminiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [rememberKey, setRememberKey] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const active = conversations.find((cv) => cv.id === activeId) || conversations[0];

  /* ---- responsive: track viewport size for Android/mobile layout ---- */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---- load persisted state ---- */
  useEffect(() => {
    (async () => {
      try {
        const [conv, prefs, geminiK, anthropicK] = await Promise.allSettled([
          window.storage.get("charlie-conversations", false),
          window.storage.get("charlie-prefs", false),
          window.storage.get("charlie-gemini-key", false),
          window.storage.get("charlie-anthropic-key", false),
        ]);
        if (conv.status === "fulfilled" && conv.value?.value) {
          const parsed = JSON.parse(conv.value.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConversations(parsed);
            setActiveId(parsed[0].id);
          }
        }
        if (prefs.status === "fulfilled" && prefs.value?.value) {
          const p = JSON.parse(prefs.value.value);
          if (p.theme) setTheme(p.theme);
          if (p.uiLang) setUiLang(p.uiLang);
          if (typeof p.customInstructions === "string") setCustomInstructions(p.customInstructions);
          if (typeof p.accountName === "string") setAccountName(p.accountName);
          if (typeof p.saveHistory === "boolean") setSaveHistory(p.saveHistory);
        }
        if (geminiK.status === "fulfilled" && geminiK.value?.value) {
          setGeminiKey(geminiK.value.value);
          setRememberKey(true);
        }
        if (anthropicK.status === "fulfilled" && anthropicK.value?.value) {
          setAnthropicKey(anthropicK.value.value);
          setRememberKey(true);
        }
      } catch (e) { /* first run, nothing saved yet */ }
      setActiveId((prev) => prev || conversations[0].id);
      setStorageReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- persist conversations ---- */
  useEffect(() => {
    if (!storageReady) return;
    if (saveHistory) {
      window.storage.set("charlie-conversations", JSON.stringify(conversations), false).catch(() => {});
    } else {
      window.storage.delete("charlie-conversations", false).catch(() => {});
    }
  }, [conversations, storageReady, saveHistory]);

  /* ---- persist prefs ---- */
  useEffect(() => {
    if (!storageReady) return;
    window.storage.set("charlie-prefs", JSON.stringify({ theme, uiLang, customInstructions, accountName, saveHistory }), false).catch(() => {});
  }, [theme, uiLang, customInstructions, accountName, saveHistory, storageReady]);

  /* ---- persist api keys ---- */
  useEffect(() => {
    if (!storageReady) return;
    if (rememberKey && geminiKey) {
      window.storage.set("charlie-gemini-key", geminiKey, false).catch(() => {});
    } else {
      window.storage.delete("charlie-gemini-key", false).catch(() => {});
    }
  }, [geminiKey, rememberKey, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    if (rememberKey && anthropicKey) {
      window.storage.set("charlie-anthropic-key", anthropicKey, false).catch(() => {});
    } else {
      window.storage.delete("charlie-anthropic-key", false).catch(() => {});
    }
  }, [anthropicKey, rememberKey, storageReady]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const storageBytes = JSON.stringify(conversations).length + customInstructions.length + accountName.length;

  /* ---------------- speech recognition ---------------- */
  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert(t.micUnavailable); return; }
    if (recording) { recognitionRef.current?.stop(); setRecording(false); return; }
    const rec = new SR();
    rec.lang = uiLang === "es" ? "es-ES" : "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    let baseText = input ? input + " " : "";
    rec.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      setInput(baseText + transcript);
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setRecording(true);
  };

  /* ---------------- file attachments ---------------- */
  const readFile = (file) =>
    new Promise((resolve) => {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      const reader = new FileReader();
      reader.onload = () => {
        if (isImage || isPdf) {
          const base64 = reader.result.split(",")[1];
          resolve({ id: uid(), name: file.name, kind: isImage ? "image" : "pdf", mediaType: file.type, base64, size: file.size });
        } else {
          resolve({ id: uid(), name: file.name, kind: "text", text: String(reader.result).slice(0, 8000), size: file.size });
        }
      };
      reader.onerror = () => resolve({ id: uid(), name: file.name, kind: "error", size: file.size });
      if (isImage || isPdf) reader.readAsDataURL(file); else reader.readAsText(file);
    });

  const handleFiles = async (fileList) => {
    const read = await Promise.all(Array.from(fileList).map(readFile));
    setAttachments((prev) => [...prev, ...read]);
  };
  const removeAttachment = (id) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  /* ---------------- conversation management ---------------- */
  const startNewChat = () => {
    const conv = newConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setInput(""); setAttachments([]);
    if (isMobile) setSidebarOpen(false);
  };

  const deleteConversation = (id) => {
    setConversations((prev) => {
      const next = prev.filter((cv) => cv.id !== id);
      if (next.length === 0) {
        const conv = newConversation();
        setActiveId(conv.id);
        return [conv];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const deleteAllConversations = () => {
    const conv = newConversation();
    setConversations([conv]);
    setActiveId(conv.id);
  };

  const clearAllData = async () => {
    const conv = newConversation();
    setConversations([conv]);
    setActiveId(conv.id);
    setCustomInstructions(""); setAccountName(""); setGeminiKey(""); setAnthropicKey(""); setRememberKey(false);
    setTheme("light"); setUiLang("es");
    try {
      await window.storage.delete("charlie-conversations", false);
      await window.storage.delete("charlie-prefs", false);
      await window.storage.delete("charlie-gemini-key", false);
      await window.storage.delete("charlie-anthropic-key", false);
    } catch (e) {}
  };

  const updateActive = (updater) => setConversations((prev) => prev.map((cv) => (cv.id === active.id ? updater(cv) : cv)));

  /* ---------------- AI calls ---------------- */
  const buildAnthropicMessages = (history) =>
    history.map((m) => {
      if (m.role === "user" && m.attachments?.length) {
        const blocks = [];
        m.attachments.forEach((a) => {
          if (a.kind === "image") blocks.push({ type: "image", source: { type: "base64", media_type: a.mediaType, data: a.base64 } });
          else if (a.kind === "pdf") blocks.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: a.base64 } });
          else if (a.kind === "text") blocks.push({ type: "text", text: `[Archivo adjunto: ${a.name}]\n${a.text}` });
        });
        if (m.content) blocks.push({ type: "text", text: m.content });
        return { role: "user", content: blocks };
      }
      return { role: m.role, content: m.content };
    });

  const buildGeminiContents = (history) =>
    history.map((m) => {
      const parts = [];
      if (m.attachments?.length) {
        m.attachments.forEach((a) => {
          if (a.kind === "image") parts.push({ inline_data: { mime_type: a.mediaType, data: a.base64 } });
          else if (a.kind === "pdf") parts.push({ inline_data: { mime_type: "application/pdf", data: a.base64 } });
          else if (a.kind === "text") parts.push({ text: `[Archivo adjunto: ${a.name}]\n${a.text}` });
        });
      }
      if (m.content) parts.push({ text: m.content });
      if (parts.length === 0) parts.push({ text: "" });
      return { role: m.role === "assistant" ? "model" : "user", parts };
    });

  const systemPrompt = () => {
    const base = uiLang === "es"
      ? "Eres Charlie, un asistente de IA cercano, claro y útil. Usa formato markdown sencillo cuando ayude a la claridad."
      : "You are Charlie, a warm, clear, helpful AI assistant. Use simple markdown formatting when it helps clarity.";
    return customInstructions ? `${base}\n\nInstrucciones del usuario: ${customInstructions}` : base;
  };

  const callClaude = async (history, signal) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        // Required for calling the Anthropic API directly from a browser (Vite/Android WebView),
        // since this app has no backend proxy. The key never leaves the device except to Anthropic.
        "anthropic-dangerous-direct-browser-access": "true"
      },
      signal,
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system: systemPrompt(),
        messages: buildAnthropicMessages(history)
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "Error de la API");
    return (data.content || []).map((b) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n");
  };

  const callGemini = async (history, signal) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
      signal,
      body: JSON.stringify({
        contents: buildGeminiContents(history),
        systemInstruction: { parts: [{ text: systemPrompt() }] }
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "Error de la API");
    const parts = data.candidates?.[0]?.content?.parts || [];
    return parts.map((p) => p.text || "").join("\n");
  };

  const callAI = (history, signal) => {
    if (anthropicKey) return callClaude(history, signal);
    if (geminiKey) return callGemini(history, signal);
    return Promise.reject(new Error(t.noKeyError));
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && attachments.length === 0) return;
    if (loading) return;

    const userMsg = { id: uid(), role: "user", content: text, attachments, ts: Date.now() };
    const historyForApi = [...active.messages, userMsg];
    updateActive((cv) => ({ ...cv, title: cv.messages.length === 0 ? (text || attachments[0]?.name || t.newChat).slice(0, 40) : cv.title, messages: historyForApi }));

    setInput(""); setAttachments([]); setLoading(true);
    const assistantId = uid();
    updateActive((cv) => ({ ...cv, messages: [...cv.messages, { id: assistantId, role: "assistant", content: "", ts: Date.now() }] }));

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const textOut = await callAI(historyForApi, controller.signal);
      updateActive((cv) => ({ ...cv, messages: cv.messages.map((m) => (m.id === assistantId ? { ...m, content: textOut || t.noResponse } : m)) }));
    } catch (err) {
      const msg = err.name === "AbortError" ? t.stoppedGen : `${t.connError}${(geminiKey || anthropicKey) ? t.checkKey : ""}: ${err.message || ""}`;
      updateActive((cv) => ({ ...cv, messages: cv.messages.map((m) => (m.id === assistantId ? { ...m, content: msg } : m)) }));
    } finally {
      setLoading(false); abortRef.current = null;
    }
  };

  const stopGenerating = () => abortRef.current?.abort();

  const regenerate = async (assistantMsgId) => {
    if (loading) return;
    const idx = active.messages.findIndex((m) => m.id === assistantMsgId);
    if (idx === -1) return;
    const trimmed = active.messages.slice(0, idx);
    updateActive((cv) => ({ ...cv, messages: trimmed }));
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const newId = uid();
    updateActive((cv) => ({ ...cv, messages: [...cv.messages, { id: newId, role: "assistant", content: "", ts: Date.now() }] }));
    try {
      const textOut = await callAI(trimmed, controller.signal);
      updateActive((cv) => ({ ...cv, messages: cv.messages.map((m) => (m.id === newId ? { ...m, content: textOut } : m)) }));
    } catch (err) {
      updateActive((cv) => ({ ...cv, messages: cv.messages.map((m) => (m.id === newId ? { ...m, content: t.regenError } : m)) }));
    } finally {
      setLoading(false); abortRef.current = null;
    }
  };

  const copyMessage = async (id, content) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback for insecure origins (e.g. opening the app via a LAN IP
        // instead of localhost), where navigator.clipboard doesn't exist.
        const ta = document.createElement("textarea");
        ta.value = content;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      alert(uiLang === "es" ? "No se pudo copiar (abrí la app con http://localhost:5173 para habilitar el portapapeles)." : "Couldn't copy (open the app via http://localhost:5173 to enable the clipboard).");
    }
  };

  const toggleReaction = (id, kind) => {
    setReactions((prev) => ({ ...prev, [id]: prev[id] === kind ? null : kind }));
  };

  const onKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const fmtSize = (bytes) => (bytes < 1024 ? bytes + " B" : bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + " KB" : (bytes / (1024 * 1024)).toFixed(1) + " MB");

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: "'Inter', sans-serif" }} className="w-full h-screen flex overflow-hidden">
      {settingsOpen && (
        <SettingsDialog
          c={c} t={t} onClose={() => setSettingsOpen(false)}
          theme={theme} setTheme={setTheme} uiLang={uiLang} setUiLang={setUiLang}
          customInstructions={customInstructions} setCustomInstructions={setCustomInstructions}
          accountName={accountName} setAccountName={setAccountName}
          saveHistory={saveHistory} setSaveHistory={setSaveHistory}
          conversations={conversations} deleteConversation={deleteConversation} deleteAllConversations={deleteAllConversations}
          storageBytes={storageBytes} clearAllData={clearAllData}
          geminiKey={geminiKey} setGeminiKey={setGeminiKey} anthropicKey={anthropicKey} setAnthropicKey={setAnthropicKey}
          rememberKey={rememberKey} setRememberKey={setRememberKey}
          isMobile={isMobile}
        />
      )}

      {/* ---------------- SIDEBAR ---------------- */}
      {isMobile && sidebarOpen && (
        <div style={{ background: c.overlay }} className="fixed inset-0 z-30" onClick={() => setSidebarOpen(false)} />
      )}
      <div
        style={
          isMobile
            ? { position: "fixed", top: 0, bottom: 0, left: 0, width: 280, background: c.surface, borderRight: `1px solid ${c.border}`, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.22s ease", zIndex: 40 }
            : { width: sidebarOpen ? 264 : 0, background: c.surface, borderRight: `1px solid ${c.border}`, transition: "width 0.2s ease", overflow: "hidden", flexShrink: 0 }
        }
        className="h-full flex flex-col"
      >
        <div style={{ width: "100%" }} className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3">
            <Orb size={26} c={c} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19 }}>Charlie</span>
          </div>

          <div className="px-3">
            <button onClick={startNewChat} style={{ background: c.primary, color: "#fff", borderRadius: 12 }} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium hover:opacity-90 transition">
              <Plus size={16} /> {t.newChat}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 mt-4 space-y-0.5">
            {conversations.map((cv) => (
              <div key={cv.id} onClick={() => { setActiveId(cv.id); if (isMobile) setSidebarOpen(false); }} style={{ background: cv.id === active?.id ? c.primarySoft : "transparent", color: cv.id === active?.id ? c.primary : c.text }} className="group flex items-center gap-2 pl-2.5 pr-1 py-1 rounded-lg cursor-pointer text-sm mx-1">
                <MessageSquare size={15} style={{ flexShrink: 0, opacity: 0.7 }} />
                <span className="truncate flex-1">{cv.title === "New chat" ? t.newChat : cv.title}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteConversation(cv.id); }} style={{ color: c.textMuted }} className="tap-target-sm opacity-70 md:opacity-0 md:group-hover:opacity-100 transition" title={t.deleteChat} aria-label={t.deleteChat}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${c.border}` }} className="p-3">
            <button onClick={() => setSettingsOpen(true)} style={{ color: c.text }} className="w-full flex items-center gap-2.5 px-2 py-2.5 text-sm rounded-lg hover:opacity-80">
              <div style={{ background: c.primarySoft, color: c.primary }} className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                {(accountName || "C")[0].toUpperCase()}
              </div>
              <span className="flex-1 text-left truncate">{accountName || t.guest}</span>
              <Settings size={16} style={{ color: c.textMuted }} />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- MAIN ---------------- */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div
          style={{ borderBottom: `1px solid ${c.border}` }}
          className="safe-top flex items-center justify-between px-2 py-1 flex-shrink-0"
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              style={{ color: c.textMuted }}
              className="tap-target hover:opacity-70 active:opacity-50 transition"
              title={uiLang === "es" ? "Menú" : "Menu"}
              aria-label={uiLang === "es" ? "Abrir menú" : "Open menu"}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }} className="text-sm font-semibold ml-1">Charlie</span>
          </div>
          <div className="flex items-center gap-1">
            {(geminiKey || anthropicKey) && (
              <div style={{ background: c.primarySoft, color: c.primary }} className="text-xs px-2.5 py-1 rounded-full font-medium mr-1">{uiLang === "es" ? "API propia" : "Custom API"}</div>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              style={{ color: c.textMuted }}
              className="tap-target hover:opacity-70 active:opacity-50 transition"
              title={t.settings}
              aria-label={t.settings}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {(!active || active.messages.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center">
              <Orb size={56} c={c} />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.text }} className="mt-5 text-3xl font-semibold">
                {accountName ? `${t.hello.split(",")[0]}, ${accountName}` : t.hello}
              </h1>
              <p style={{ color: c.textMuted }} className="mt-2 text-sm max-w-sm">{t.sub}</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {active.messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  {m.role === "assistant" ? <Orb size={26} c={c} active={loading && m.content === ""} /> : (
                    <div style={{ background: c.primarySoft, color: c.primary }} className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {(accountName || "T")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {m.attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {m.attachments.map((a) => (
                          <div key={a.id} style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs">
                            {a.kind === "image" ? <ImageIcon size={13} /> : <FileText size={13} />}
                            <span className="max-w-[140px] truncate">{a.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ background: m.role === "user" ? c.bubbleUser : "transparent", borderRadius: 14, padding: m.role === "user" ? "10px 14px" : "0", display: "inline-block", maxWidth: "100%" }}>
                      {m.content === "" && loading ? <span style={{ color: c.textMuted }} className="text-sm">{t.thinking}</span> : <RenderedMessage content={m.content} c={c} />}
                    </div>
                    {m.role === "assistant" && m.content && (
                      <div className="flex items-center -ml-2.5 mt-0.5">
                        <button onClick={() => copyMessage(m.id, m.content)} style={{ color: c.textMuted }} className="tap-target-sm hover:opacity-70 active:opacity-50 transition" title="Copiar" aria-label="Copiar">{copiedId === m.id ? <Check size={14} /> : <Copy size={14} />}</button>
                        <button onClick={() => regenerate(m.id)} style={{ color: c.textMuted }} className="tap-target-sm hover:opacity-70 active:opacity-50 transition" title="Regenerar" aria-label="Regenerar"><RotateCcw size={14} /></button>
                        <button style={{ color: reactions[m.id] === "up" ? c.primary : c.textMuted }} onClick={() => toggleReaction(m.id, "up")} className="tap-target-sm hover:opacity-70 active:opacity-50 transition" title="Me gusta" aria-label="Me gusta">
                          <ThumbsUp size={14} fill={reactions[m.id] === "up" ? c.primary : "none"} />
                        </button>
                        <button style={{ color: reactions[m.id] === "down" ? c.danger : c.textMuted }} onClick={() => toggleReaction(m.id, "down")} className="tap-target-sm hover:opacity-70 active:opacity-50 transition" title="No me gusta" aria-label="No me gusta">
                          <ThumbsDown size={14} fill={reactions[m.id] === "down" ? c.danger : "none"} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <div className="max-w-3xl mx-auto">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((a) => (
                  <div key={a.id} style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }} className="flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg text-xs">
                    {a.kind === "image" ? <ImageIcon size={13} /> : <FileText size={13} />}
                    <span className="max-w-[140px] truncate">{a.name}</span>
                    <span style={{ color: c.textMuted }}>{fmtSize(a.size)}</span>
                    <button onClick={() => removeAttachment(a.id)} style={{ color: c.textMuted }} className="tap-target-sm -mr-1" aria-label={uiLang === "es" ? "Quitar adjunto" : "Remove attachment"}><X size={13} /></button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 20 }} className="flex items-end gap-2 px-3 py-2.5 shadow-sm relative">
              {/* hidden inputs for each source */}
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }} />
              <input ref={fileInputRef} type="file" multiple accept="*/*" className="hidden" onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }} />
              <input ref={galleryInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }} />

              <div className="relative">
                <button onClick={() => setAttachMenuOpen((o) => !o)} style={{ color: c.textMuted }} className="tap-target hover:opacity-70 active:opacity-50 transition -ml-1.5" title={t.attach} aria-label={t.attach}>
                  <Paperclip size={19} />
                </button>
                {attachMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAttachMenuOpen(false)} />
                    <div style={{ background: c.surface, border: `1px solid ${c.border}` }} className="absolute bottom-full left-0 mb-2 w-56 rounded-xl shadow-lg overflow-hidden z-20">
                      <button
                        onClick={() => { setAttachMenuOpen(false); cameraInputRef.current?.click(); }}
                        style={{ color: c.text }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm hover:opacity-80"
                      >
                        <Camera size={16} style={{ color: c.primary }} /> {t.takePhoto}
                      </button>
                      <button
                        onClick={() => { setAttachMenuOpen(false); fileInputRef.current?.click(); }}
                        style={{ color: c.text }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm hover:opacity-80"
                      >
                        <FileUp size={16} style={{ color: c.primary }} /> {t.uploadFile}
                      </button>
                      <button
                        onClick={() => { setAttachMenuOpen(false); galleryInputRef.current?.click(); }}
                        style={{ color: c.text }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm hover:opacity-80"
                      >
                        <ImageIcon size={16} style={{ color: c.primary }} /> {t.gallery}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder={t.placeholder} rows={1} style={{ color: c.text, background: "transparent" }} className="flex-1 resize-none outline-none text-sm py-1.5 max-h-[200px]" />

              <button onClick={toggleMic} style={{ color: recording ? "#fff" : c.textMuted, background: recording ? c.danger : "transparent" }} className="tap-target hover:opacity-80 active:opacity-60 transition" title={recording ? t.stopSpeak : t.speak} aria-label={recording ? t.stopSpeak : t.speak}><Mic size={19} /></button>

              {loading ? (
                <button onClick={stopGenerating} style={{ background: c.text, color: c.bg }} className="tap-target transition" title={t.stop} aria-label={t.stop}><Square size={15} fill={c.bg} /></button>
              ) : (
                <button onClick={sendMessage} disabled={!input.trim() && attachments.length === 0} style={{ background: (!input.trim() && attachments.length === 0) ? c.surfaceAlt : c.primary, color: (!input.trim() && attachments.length === 0) ? c.textMuted : "#fff" }} className="tap-target transition" title={t.send} aria-label={t.send}><Send size={15} /></button>
              )}
            </div>
            <p style={{ color: c.textMuted }} className="text-center text-xs mt-2">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
