import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Play, SkipForward, Activity, Layers, Skull, Image as ImageIcon, Settings, X, Sun, Moon, Swords, Volume2, VolumeX, ArrowLeft, ArrowLeftRight, Target, Droplet, Shield, CloudRain, LogOut, Users, Share2, Copy, Wifi, WifiOff, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { Peer } from 'peerjs';
import $ from 'jquery';
import 'jquery.ripples';
import { AI_CHARACTERS, AI_DIFFICULTIES, AI_DIFFICULTY_LABELS, AI_SPEED, CARDS, DANDAN_NAME, DEFAULT_AI_CHARACTER_ID, FULL_DECKLIST, LAND_TYPE_CHOICES, PREDICT_OPTIONS, SHARED_DECK_SIZE, canDandanAttackDefender, checkHasActions, chooseAiAction, controlsIsland, createGameReducer, getAiCharacter, getAiPendingActions, getAiPolicyForActor, getAvailableMana, getManaPool, initialState, isActivatable, isCastable, isCyclable, isValidTarget } from './src/game/engine';
import { buildPeerGuestViewState, inflatePeerGuestViewState, mapGuestActionToCanonical } from './src/game/peerView';
import archivistPortrait from './img/Archivist.png';
import cartographerPortrait from './img/Cartographer.png';
import eelPortrait from './img/Eel.png';
import hermitPortrait from './img/Hermit.png';
import leviathanPortrait from './img/Leviathan.png';
import piranhaPortrait from './img/Piranha.png';
import sharkPortrait from './img/shark.png';
import sirenPortrait from './img/siren.png';
import tortoisePortrait from './img/Tortoise.png';
import undertowPortrait from './img/Undertow.png';
import wall1Background from './img/wall1.jpg';
import wall2Background from './img/wall2.jpg';
import wall3Background from './img/wall3.png';
import wall4Background from './img/wall4.png';

// --- ADVANCED AUDIO ENGINE ---
const AudioEngine = {
  ctx: null,
  muted: false,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  playTone(freq, type, duration, vol=0.1, slideFreq=null, filterDrop=false) {
    if (!this.ctx || this.muted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (slideFreq) {
         osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration * 0.8);
      }
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterDrop ? 2000 : 5000, this.ctx.currentTime);
      if (filterDrop) {
         filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(vol, this.ctx.currentTime + 0.05);
      gain.gain.setTargetAtTime(0.001, this.ctx.currentTime + duration * 0.5, duration * 0.2);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  },
  playSplash(startFreq=220, endFreq=90, duration=0.32, vol=0.08) {
    if (!this.ctx || this.muted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    try {
      const now = this.ctx.currentTime;
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * duration), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / data.length;
        const envelope = (1 - t) * (1 - t);
        data[i] = (Math.random() * 2 - 1) * envelope;
      }

      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      source.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(startFreq, now);
      filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      filter.Q.setValueAtTime(1.2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      source.start(now);
      source.stop(now + duration);
    } catch(e) {}
  },
  playBubble(freq=620, duration=0.14, vol=0.05) {
    this.playTone(freq, 'sine', duration, vol, freq * 1.45);
  },
  playDraw() {
    this.playBubble(520, 0.12, 0.045);
    setTimeout(() => this.playBubble(720, 0.11, 0.04), 55);
  },
  playLand() {
    this.playSplash(260, 95, 0.38, 0.075);
    this.playTone(140, 'triangle', 0.26, 0.06, 95, true);
  },
  playCast() { 
    this.playSplash(500, 180, 0.22, 0.04);
    this.playTone(280, 'triangle', 0.25, 0.04, 640);
    setTimeout(() => this.playBubble(840, 0.12, 0.03), 80);
  },
  playAttack() { 
    this.playTone(150, 'square', 0.2, 0.1, 100, true); 
    this.playTone(800, 'sawtooth', 0.1, 0.05, 400);
  },
  playPhase() { 
    this.playSplash(340, 140, 0.24, 0.035);
    this.playTone(430, 'sine', 0.2, 0.028, 520);
    setTimeout(() => this.playBubble(660, 0.12, 0.022), 70);
  },
  playLandingRipple() {
    if (!this.ctx || this.muted) return;
    const variants = [
      () => {
        this.playSplash(210, 78, 0.36, 0.06);
        setTimeout(() => this.playBubble(430, 0.12, 0.022), 36);
      },
      () => {
        this.playSplash(280, 102, 0.32, 0.055);
        this.playTone(170, 'triangle', 0.18, 0.018, 118, true);
        setTimeout(() => this.playBubble(560, 0.09, 0.018), 58);
      },
      () => {
        this.playSplash(175, 68, 0.42, 0.065);
        setTimeout(() => this.playBubble(520, 0.08, 0.017), 44);
        setTimeout(() => this.playBubble(690, 0.07, 0.014), 94);
      }
    ];
    variants[Math.floor(Math.random() * variants.length)]();
  },
  playResolve() { 
    this.playSplash(780, 220, 0.28, 0.05);
    this.playTone(620, 'triangle', 0.22, 0.04, 980); 
    setTimeout(() => this.playBubble(1120, 0.13, 0.03), 120);
  },
  playMatchFound() {
    this.playTone(440, 'triangle', 0.14, 0.03, 660);
    setTimeout(() => this.playBubble(720, 0.11, 0.03), 70);
    setTimeout(() => this.playTone(880, 'sine', 0.18, 0.045, 1180), 140);
  }
};

const gameReducer = createGameReducer({
  initAudio: () => AudioEngine.init(),
  playDraw: () => AudioEngine.playDraw(),
  playLand: () => AudioEngine.playLand(),
  playCast: () => AudioEngine.playCast(),
  playResolve: () => AudioEngine.playResolve(),
  playPhase: () => AudioEngine.playPhase()
});

// --- CENTERED PHASE TRACKER COMPONENT ---
const PhaseTracker = ({ currentPhase, turn }) => {
  const phases = [
    { id: 'upkeep', icon: <CloudRain size={14} />, label: 'UPK' },
    { id: 'main1', icon: <Sun size={14} />, label: 'M1' },
    { id: 'combat', icon: <Swords size={14} />, label: 'ATK' },
    { id: 'main2', icon: <Moon size={14} />, label: 'M2' },
    { id: 'cleanup', icon: <Droplet size={14} />, label: 'END' }
  ];
  const isPlayerTurn = turn === 'player';

  return (
    <div className="flex items-center bg-slate-900/95 rounded-full border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-1.5 shrink-0 backdrop-blur-md h-14 sm:h-16">
      <div className={`w-[84px] sm:w-[98px] min-w-[84px] sm:min-w-[98px] flex items-center justify-center text-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 sm:px-3 py-1.5 rounded-full transition-all duration-500 mr-2 border ${
         isPlayerTurn ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-red-900/30 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(153,27,27,0.3)]'
      }`}>
          {isPlayerTurn ? 'Your Turn' : "Opponent"}
       </div>
       <div className="flex items-center pr-1 gap-0.5 sm:gap-1">
         {phases.map((p, index) => {
           const isActive = currentPhase === p.id || (p.id === 'combat' && (currentPhase === 'declare_attackers' || currentPhase === 'declare_blockers'));
           const activeColor = isPlayerTurn ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.9)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.9)]';
           return (
             <React.Fragment key={p.id}>
                <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                   isActive ? `bg-slate-800 border border-slate-500 ${activeColor} scale-110 z-10 shadow-lg ring-1 ring-white/10` : 'text-slate-600'
                }`} title={p.label}>
                   {p.icon}
                </div>
                {index < phases.length - 1 && (
                   <div className="h-[2px] w-1.5 sm:w-2 mx-0.5 rounded-full opacity-0" />
                )}
             </React.Fragment>
           )
         })}
       </div>
    </div>
  );
};

const MatchClockPill = ({ valueMs, running }) => {
  const toneClass = valueMs <= 10_000
    ? 'border-rose-400/55 bg-rose-500/18 text-rose-100'
    : valueMs <= 30_000
      ? 'border-amber-300/55 bg-amber-500/16 text-amber-100'
      : running
        ? 'border-emerald-300/45 bg-emerald-500/14 text-emerald-100'
        : 'border-slate-600/80 bg-slate-950/72 text-slate-200';

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] shadow-[0_10px_20px_rgba(2,6,23,0.28)] ${toneClass}`}>
      <span className="font-mono text-xs tracking-[0.08em]">{formatPeerClockMs(valueMs)}</span>
    </div>
  );
};

const getCardTypeRank = (card) => {
  if (card?.type?.includes('Creature')) return 0;
  if (card?.type?.includes('Instant')) return 1;
  if (card?.type?.includes('Sorcery')) return 2;
  if (card?.type?.includes('Enchantment')) return 3;
  if (card?.isLand || card?.type?.includes('Land')) return 5;
  return 4;
};

const getGroupedList = (zoneList, sortMode = 'count') => {
  const groups = {};
  zoneList.forEach(c => {
     const key = `${c.name}|${c.fullImage || c.image || ''}`;
     if(!groups[key]) groups[key] = { ...c, count: 0, groupKey: key };
     groups[key].count++;
  });
  return Object.values(groups).sort((a, b) => {
    if (sortMode === 'deck') {
      const typeDiff = getCardTypeRank(a) - getCardTypeRank(b);
      if (typeDiff !== 0) return typeDiff;
      const costDiff = (a.cost || 0) - (b.cost || 0);
      if (costDiff !== 0) return costDiff;
      const nameDiff = a.name.localeCompare(b.name);
      if (nameDiff !== 0) return nameDiff;
      return (a.fullImage || a.image || '').localeCompare(b.fullImage || b.image || '');
    }

    return b.count - a.count || a.name.localeCompare(b.name);
  });
};

const POLICY_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How Forgetfull Fish handles data',
    sections: [
      {
        heading: 'What This Site Stores',
        body: 'Forgetfull Fish stores a few gameplay and preference values in your browser so the app can work correctly. This includes your current saved game, your adventure progress, your preferred online nickname, and a visual preference for the landing background.'
      },
      {
        heading: 'What This Site Does Not Collect',
        body: 'This site does not ask for your real name, email address, or account details. If you use online matchmaking, you can set a nickname that stays in your browser and is only used to coordinate peer-to-peer rooms. The app also does not use advertising trackers or analytics tools in the current version.'
      },
      {
        heading: 'Third-Party Requests',
        body: 'Official card art is loaded from Scryfall. When those images are requested, your browser may contact Scryfall or its delivery infrastructure as part of normal image loading.'
      },
      {
        heading: 'Your Control',
        body: 'You can clear this data at any time by clearing your browser site data or local storage. Doing that will remove saved progress and current-game continuation data.'
      }
    ]
  },
  storage: {
    title: 'Cookie / Local Storage',
    subtitle: 'Storage used by this app',
    sections: [
      {
        heading: 'Cookies',
        body: 'Forgetfull Fish does not currently set its own tracking cookies for advertising or analytics.'
      },
      {
        heading: 'Local Storage',
        body: 'The app uses browser local storage for functional features: saving an unfinished match so you can continue later, storing adventure progress, remembering your online nickname, and remembering the landing background selection.'
      },
      {
        heading: 'Why It Is Used',
        body: 'This storage is used to make the game work as expected. If local storage is disabled or cleared, continue-game and progress features may stop working or reset.'
      },
      {
        heading: 'Third-Party Content',
        body: 'Card images can be loaded from Scryfall. Those image requests are separate from the app local storage and depend on your browser contacting that external service.'
      }
    ]
  }
};

const PolicyOverlay = ({ policyKey, onClose }) => {
  const policy = POLICY_CONTENT[policyKey];
  if (!policy) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center overflow-y-auto bg-[rgba(2,6,23,0.84)] p-4 backdrop-blur-sm sm:p-6">
      <div className="my-auto w-full max-w-2xl rounded-[1.9rem] border border-white/10 bg-slate-950/96 p-5 text-left shadow-[0_30px_80px_rgba(2,6,23,0.72)] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-arena-display text-2xl tracking-[0.08em] text-white sm:text-[2rem]">{policy.title}</h2>
            <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-slate-300/78">{policy.subtitle}</div>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 transition-all hover:bg-slate-800 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {policy.sections.map((section) => (
            <div key={section.heading} className="rounded-[1.35rem] border border-slate-800 bg-slate-900/72 p-4">
              <div className="font-arena-display text-[1.05rem] tracking-[0.05em] text-cyan-100">{section.heading}</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{section.body}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-5 w-full rounded-2xl border border-sky-200/70 bg-[#38bdf8] py-3.5 font-bold uppercase tracking-[0.04em] text-slate-950 shadow-[0_14px_28px_rgba(56,189,248,0.22)] transition-colors hover:bg-[#22c7ff]">
          Close
        </button>
      </div>
    </div>
  );
};

const CardCollectionOverlay = ({ viewingZone, cards = [], official, onClose, onZoom = null }) => {
  if (!viewingZone) return null;

  const explorerGroups = viewingZone === 'deck'
    ? getGroupedList(FULL_DECKLIST, 'deck')
    : getGroupedList(cards);
  const isExplorerEmpty = explorerGroups.length === 0;

  return (
    <div className="absolute inset-0 bg-black/95 z-[160] flex flex-col p-4 sm:p-8 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-arena-display text-2xl font-bold tracking-[0.12em] uppercase text-white flex items-center gap-3">
          {viewingZone === 'deck' ? <Layers size={28} className="text-blue-400" /> : <Skull size={28} className="text-slate-400" />}
          {viewingZone === 'deck' ? 'Library' : 'Graveyard'}
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar grid grid-cols-2 justify-items-stretch content-start gap-x-2 gap-y-8 pt-5 pb-20 sm:gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {explorerGroups.map(group => (
          <div key={group.groupKey || `${group.name}-${group.count}`} className="relative group flex w-full min-w-0 flex-col items-center animate-in zoom-in-95 duration-300">
            <Card card={group} zone="explorer" official={official} onZoom={onZoom} />
            <div className="absolute -top-3 -right-3 bg-[rgb(79_88_106_/_61%)] text-slate-100 font-black px-3 py-1 rounded-full border-2 border-slate-900 shadow-xl z-10 text-sm">
              x{group.count}
            </div>
          </div>
        ))}
        {isExplorerEmpty && (
          <div className="col-span-full text-slate-500 text-2xl font-bold mt-32 flex flex-col items-center gap-4">
            {viewingZone === 'deck' ? <Layers size={48} /> : <Skull size={48} />}
            Empty
          </div>
        )}
      </div>
    </div>
  );
};

const BattlefieldPeekHandle = ({ onPeekStart, onPeekEnd }) => (
  <div className="absolute inset-x-0 bottom-4 z-[140] flex justify-center pointer-events-none px-4">
    <button
      type="button"
      onPointerDown={onPeekStart}
      onPointerUp={onPeekEnd}
      onPointerCancel={onPeekEnd}
      onLostPointerCapture={onPeekEnd}
      onContextMenu={(e) => e.preventDefault()}
      className="pointer-events-auto rounded-full border border-cyan-200/35 bg-slate-950/88 px-4 py-2 text-[11px] sm:text-xs font-bold text-cyan-100/90 shadow-[0_0_24px_rgba(2,6,23,0.72)] backdrop-blur-md select-none touch-none"
    >
      holding here to see the battlefield
    </button>
  </div>
);

const PeekableDialogOverlay = ({
  peekActive = false,
  onPeekStart,
  onPeekEnd,
  overlayClassName = 'z-[100] flex flex-col items-center justify-center p-4 pb-24',
  backdropClassName = 'bg-black/80',
  children
}) => (
  <>
    <div
      className={`absolute inset-0 ${overlayClassName} transition-all duration-150 ${
        peekActive
          ? 'bg-transparent backdrop-blur-0 pointer-events-none'
          : `${backdropClassName} backdrop-blur-md`
      }`}
    >
      <div
        className={`transition-all duration-150 ease-out ${
          peekActive ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
        }`}
      >
        {children}
      </div>
    </div>
    <BattlefieldPeekHandle onPeekStart={onPeekStart} onPeekEnd={onPeekEnd} />
  </>
);

const getHandFanStyle = (index, total, side = 'bottom') => {
  const center = (total - 1) / 2;
  const distanceFromCenter = index - center;
  const spread = Math.min(42, 240 / Math.max(1, total - 1));
  const offsetX = distanceFromCenter * spread;
  const rotation = distanceFromCenter * 4.5;
  const arcDepth = Math.pow(Math.abs(distanceFromCenter), 1.35) * 5;
  const offsetY = side === 'bottom' ? arcDepth : -arcDepth;

  return {
    transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`,
    zIndex: 20 + index
  };
};

const getLandStackRevealRatio = (total) => {
  if (total <= 1) return 1;
  if (total === 2) return 0.72;
  if (total === 3) return 0.62;
  if (total === 4) return 0.54;
  if (total === 5) return 0.46;
  if (total === 6) return 0.4;
  if (total === 7) return 0.34;
  return 0.28;
};

const getLandStackStep = (total) => {
  const revealRatio = getLandStackRevealRatio(total);
  return {
    mobile: Math.max(12, Math.round(64 * revealRatio)),
    desktop: Math.max(16, Math.round(80 * revealRatio))
  };
};

const ASSET_BASE_URL = import.meta.env.BASE_URL;

const DIFFICULTY_ART = {
  easy: `${ASSET_BASE_URL}difficulty/deathfish.png`,
  medium: `${ASSET_BASE_URL}difficulty/redfish.png`,
  hard: `${ASSET_BASE_URL}difficulty/shark.png`
};
const CHARACTER_ART = {
  tortoise: tortoisePortrait,
  shark: sharkPortrait,
  archivist: archivistPortrait,
  eel: eelPortrait,
  siren: sirenPortrait,
  undertow: undertowPortrait,
  cartographer: cartographerPortrait,
  piranha: piranhaPortrait,
  hermit: hermitPortrait,
  leviathan: leviathanPortrait
};
const getCharacterPortrait = (characterId, difficulty = 'medium') => CHARACTER_ART[characterId] || DIFFICULTY_ART[difficulty] || DIFFICULTY_ART.medium;
const APP_VERSION = 'v0.3.1';
const ADVENTURE_ROUTE = ['shark', 'archivist', 'eel', 'siren', 'undertow', 'cartographer', 'piranha', 'hermit', 'tortoise', 'leviathan'];
const ADVENTURE_MAP_LAYOUT = [
  { left: 12, top: 78 },
  { left: 28, top: 68 },
  { left: 45, top: 75 },
  { left: 65, top: 62 },
  { left: 84, top: 72 },
  { left: 74, top: 42 },
  { left: 54, top: 30 },
  { left: 33, top: 40 },
  { left: 18, top: 19 },
  { left: 56, top: 10 }
];
const ADVENTURE_FIXED_DIFFICULTY = 'hard';
const ADVENTURE_BOSS_ID = ADVENTURE_ROUTE[ADVENTURE_ROUTE.length - 1];
const RIVAL_PROGRESS_STORAGE_KEY = 'forgetful-fish-rival-progress-v1';
const CURRENT_GAME_STORAGE_KEY = 'forgetful-fish-current-game-v1';
const PEER_SESSION_STORAGE_KEY = 'forgetful-fish-peer-session-v1';
const PEER_PROTOCOL_VERSION = 1;
const ONLINE_PROFILE_STORAGE_KEY = 'forgetful-fish-online-profile-v1';
const ONLINE_PROTOCOL_VERSION = 1;
const PEER_RECONNECT_DELAY_MS = 1600;
const PEER_DISCONNECT_GRACE_MS = 12000;
const PEER_CLOCK_BASE_MS = 5 * 60 * 1000;
const PEER_CLOCK_INCREMENT_MS = 5 * 1000;
const PEER_CLOCK_MAX_MS = PEER_CLOCK_BASE_MS + PEER_CLOCK_INCREMENT_MS;
const ONLINE_MATCH_BUCKET_MS = 6 * 60 * 60 * 1000;
const ONLINE_NAME_MAX_LENGTH = 24;
const ONLINE_LOBBY_HOST_PREFIX = 'ff-online-lobby';
const ONLINE_MATCH_PREFIX = 'ff-online-match';
const LANDING_BACKGROUNDS = [wall1Background, wall2Background, wall3Background, wall4Background];
const MENU_PRELOAD_URLS = Array.from(new Set([
  ...Object.values(DIFFICULTY_ART),
  ...Object.values(CHARACTER_ART),
  ...LANDING_BACKGROUNDS
]));
const CARD_PRELOAD_URLS = Array.from(new Set(
  Object.values(CARDS).flatMap((card) => [card.image, card.fullImage]).filter(Boolean)
));
const APP_PRELOAD_URLS = Array.from(new Set([
  ...MENU_PRELOAD_URLS,
  ...CARD_PRELOAD_URLS
]));
const LANDING_BACKGROUND_STORAGE_KEY = 'forgetful-fish-landing-bg-v1';
const PEER_GAME_ACTIONS = new Set([
  'ACTIVATE_LAND_NOW',
  'CANCEL_PENDING_ACTION',
  'CANCEL_TARGETING',
  'CAST_SPELL',
  'CAST_WITH_TARGET',
  'CYCLE_CARD',
  'KEEP_HAND',
  'MULLIGAN',
  'PASS_PRIORITY',
  'PLAY_LAND',
  'PROMPT_ACTIVATE_LAND',
  'PROMPT_HAND_LAND_ACTION',
  'REORDER_HALIMAR',
  'SUBMIT_PENDING_ACTION',
  'SURRENDER',
  'TOGGLE_ATTACK',
  'TOGGLE_BLOCK',
  'TOGGLE_PENDING_SELECT',
  'UPDATE_TELLING_TIME'
]);
const generatePeerToken = (prefix = 'ff') => {
  if (typeof crypto?.randomUUID === 'function') return `${prefix}-${crypto.randomUUID()}`;
  const values = new Uint32Array(4);
  crypto.getRandomValues(values);
  return `${prefix}-${Array.from(values, value => value.toString(36)).join('')}`;
};
const buildPeerSharePayload = (roomId, token, inviteUrl) => ({
  title: 'Forgetful Fish',
  text: `Join my Forgetful Fish friend match.\nRoom code: ${roomId}\nSecurity key: ${token}`,
  url: inviteUrl
});
const buildPeerInviteUrl = (roomId, token) => {
  if (typeof window === 'undefined') return '';
  const inviteUrl = new URL(window.location.href);
  inviteUrl.searchParams.set('peerRoom', roomId);
  inviteUrl.searchParams.set('peerToken', token);
  inviteUrl.searchParams.set('peerMode', 'join');
  return inviteUrl.toString();
};
const readPeerInviteParams = () => {
  if (typeof window === 'undefined') return { roomId: '', token: '', mode: '' };
  const url = new URL(window.location.href);
  return {
    roomId: url.searchParams.get('peerRoom') || '',
    token: url.searchParams.get('peerToken') || '',
    mode: url.searchParams.get('peerMode') || ''
  };
};
const getPeerClientOptions = () => {
  const options = {
    debug: import.meta.env.DEV ? 1 : 0
  };
  const host = import.meta.env.VITE_PEER_HOST;
  const portValue = import.meta.env.VITE_PEER_PORT;
  const path = import.meta.env.VITE_PEER_PATH;
  const secureValue = import.meta.env.VITE_PEER_SECURE;
  const iceServersValue = import.meta.env.VITE_PEER_ICE_SERVERS_JSON;

  if (host) {
    options.host = host;
    if (portValue) options.port = Number(portValue);
    if (path) options.path = path;
    options.secure = secureValue !== 'false';
  }

  if (iceServersValue) {
    try {
      const parsed = JSON.parse(iceServersValue);
      if (Array.isArray(parsed) && parsed.length > 0) {
        options.config = { iceServers: parsed };
      }
    } catch (_error) {}
  }

  return options;
};
const loadPeerSessionDraft = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(PEER_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
};
const savePeerSessionDraft = (draft) => {
  if (typeof window === 'undefined') return;
  try {
    if (!draft) {
      window.sessionStorage.removeItem(PEER_SESSION_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(PEER_SESSION_STORAGE_KEY, JSON.stringify(draft));
  } catch (_error) {}
};
const sanitizeOnlinePlayerName = (value = '') => value
  .replace(/[^\p{L}\p{N} ._-]+/gu, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, ONLINE_NAME_MAX_LENGTH);
const normalizeOnlinePlayerName = (value = '') => sanitizeOnlinePlayerName(value).toLowerCase().replace(/\s+/g, '-');
const loadOnlineProfile = () => {
  if (typeof window === 'undefined') return { playerName: '' };
  try {
    const raw = window.localStorage.getItem(ONLINE_PROFILE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      playerName: sanitizeOnlinePlayerName(parsed?.playerName || '')
    };
  } catch (_error) {
    return { playerName: '' };
  }
};
const saveOnlineProfile = (profile) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ONLINE_PROFILE_STORAGE_KEY, JSON.stringify({
      playerName: sanitizeOnlinePlayerName(profile?.playerName || '')
    }));
  } catch (_error) {}
};
const getOnlineBucketInfo = (now = Date.now()) => {
  const bucketIndex = Math.floor(now / ONLINE_MATCH_BUCKET_MS);
  const bucketStartMs = bucketIndex * ONLINE_MATCH_BUCKET_MS;
  const bucketEndMs = bucketStartMs + ONLINE_MATCH_BUCKET_MS;
  return {
    bucketIndex,
    bucketStartMs,
    bucketEndMs,
    lobbyRoomId: `${ONLINE_LOBBY_HOST_PREFIX}-${bucketIndex.toString(36)}`,
    bucketLabel: new Date(bucketStartMs).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    rotationLabel: new Date(bucketEndMs).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};
const compareOnlineMatchPlayers = (left, right) => (
  left.normalizedName.localeCompare(right.normalizedName) ||
  left.clientId.localeCompare(right.clientId)
);
const hashOnlineValue = async (value) => {
  if (typeof crypto?.subtle?.digest === 'function') {
    const encoded = new TextEncoder().encode(value);
    const buffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(buffer), (part) => part.toString(16).padStart(2, '0')).join('');
  }

  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const fallback = (hash >>> 0).toString(16).padStart(8, '0');
  return fallback.repeat(8);
};
const buildOnlineMatchDescriptor = async ({ bucketStartMs, players }) => {
  const orderedPlayers = players
    .map((player) => {
      const safeName = sanitizeOnlinePlayerName(player?.name || '') || `Player ${String(player?.clientId || '').slice(-4)}`;
      return {
        clientId: player?.clientId || generatePeerToken('online'),
        name: safeName,
        normalizedName: normalizeOnlinePlayerName(safeName) || String(player?.clientId || '').toLowerCase()
      };
    })
    .sort(compareOnlineMatchPlayers);
  const roomHash = await hashOnlineValue(`room|${bucketStartMs}|${orderedPlayers.map((player) => player.normalizedName).join('|')}`);
  const tokenHash = await hashOnlineValue(`token|${bucketStartMs}|${orderedPlayers.map((player) => player.clientId).join('|')}|${orderedPlayers.map((player) => player.normalizedName).join('|')}`);

  return {
    type: 'online-match-found',
    protocol: ONLINE_PROTOCOL_VERSION,
    bucketStartMs,
    roomId: `${ONLINE_MATCH_PREFIX}-${roomHash.slice(0, 24)}`,
    token: `key-${tokenHash.slice(0, 24)}`,
    hostClientId: orderedPlayers[0]?.clientId || '',
    players: orderedPlayers
  };
};
const getOnlineMatchRole = (match, localClientId) => (
  match?.hostClientId && match.hostClientId === localClientId ? 'host' : 'guest'
);
const getOnlineMatchOpponent = (match, localClientId) => (
  match?.players?.find((player) => player.clientId !== localClientId)?.name || 'Opponent'
);
const isUnavailablePeerIdError = (error) => error?.type === 'unavailable-id' || /taken|unavailable/i.test(error?.message || '');
const getPeerGuestActionSeat = (state, action) => {
  switch (action.type) {
    case 'ACTIVATE_LAND_NOW':
    case 'CAST_SPELL':
    case 'CYCLE_CARD':
    case 'PASS_PRIORITY':
    case 'PLAY_LAND':
    case 'PROMPT_ACTIVATE_LAND':
    case 'PROMPT_HAND_LAND_ACTION':
    case 'SURRENDER':
    case 'TOGGLE_ATTACK':
    case 'TOGGLE_BLOCK':
      return action.player || null;
    case 'KEEP_HAND':
    case 'MULLIGAN':
      return state.phase === 'mulligan' ? state.priority : null;
    case 'CAST_WITH_TARGET':
    case 'CANCEL_TARGETING':
      return state.pendingTargetSelection?.player || null;
    case 'CANCEL_PENDING_ACTION':
    case 'REORDER_HALIMAR':
    case 'SUBMIT_PENDING_ACTION':
    case 'TOGGLE_PENDING_SELECT':
    case 'UPDATE_TELLING_TIME':
      return state.pendingAction?.player || null;
    default:
      return null;
  }
};
const canApplyGuestPeerAction = (state, action) => {
  if (!action || !PEER_GAME_ACTIONS.has(action.type)) return false;
  if (!state?.started || state.gameMode !== 'peer' || state.winner) return false;
  return getPeerGuestActionSeat(state, action) === 'ai';
};
const clampPeerClockMs = (value, maxMs = PEER_CLOCK_MAX_MS) => Math.max(0, Math.min(Math.round(value), maxMs));
const createPeerClockState = (now = Date.now()) => ({
  enabled: true,
  baseMs: PEER_CLOCK_BASE_MS,
  incrementMs: PEER_CLOCK_INCREMENT_MS,
  maxMs: PEER_CLOCK_MAX_MS,
  remainingMs: { player: PEER_CLOCK_BASE_MS, ai: PEER_CLOCK_BASE_MS },
  runningFor: null,
  turn: 'player',
  lastStartedAt: null,
  updatedAt: now
});
const getPeerClockRunner = (viewState) => {
  if (!viewState?.started || viewState.gameMode !== 'peer' || viewState.winner) return null;
  if (viewState.pendingAction?.player) return viewState.pendingAction.player;
  if (viewState.pendingTargetSelection?.player) return viewState.pendingTargetSelection.player;
  if (viewState.stackResolving) return null;
  return viewState.priority || null;
};
const settlePeerClock = (clock, now = Date.now()) => {
  if (!clock) return null;
  if (!clock.runningFor || !clock.lastStartedAt) return { ...clock, updatedAt: now };
  const elapsed = Math.max(0, now - clock.lastStartedAt);
  if (!elapsed) return { ...clock, updatedAt: now };
  return {
    ...clock,
    remainingMs: {
      ...clock.remainingMs,
      [clock.runningFor]: clampPeerClockMs((clock.remainingMs?.[clock.runningFor] || 0) - elapsed, clock.maxMs)
    },
    updatedAt: now
  };
};
const syncPeerClockWithState = (clock, viewState, now = Date.now()) => {
  const baseClock = clock ? structuredClone(clock) : createPeerClockState(now);
  const settledClock = settlePeerClock(baseClock, now);
  const nextClock = {
    ...settledClock,
    remainingMs: { ...(settledClock?.remainingMs || createPeerClockState(now).remainingMs) }
  };

  if (nextClock.turn && viewState?.turn && nextClock.turn !== viewState.turn) {
    nextClock.remainingMs[nextClock.turn] = clampPeerClockMs(
      (nextClock.remainingMs?.[nextClock.turn] || 0) + (nextClock.incrementMs || PEER_CLOCK_INCREMENT_MS),
      nextClock.maxMs || PEER_CLOCK_MAX_MS
    );
  }

  const nextRunner = getPeerClockRunner(viewState);
  nextClock.turn = viewState?.turn || nextClock.turn;
  nextClock.runningFor = nextRunner;
  nextClock.lastStartedAt = nextRunner ? now : null;
  nextClock.updatedAt = now;
  return nextClock;
};
const getDisplayedPeerClockMs = (clock, seat, now = Date.now()) => {
  if (!clock) return 0;
  let remainingMs = clock.remainingMs?.[seat] || 0;
  if (clock.runningFor === seat && clock.lastStartedAt) {
    remainingMs -= Math.max(0, now - clock.lastStartedAt);
  }
  return Math.max(0, Math.round(remainingMs));
};
const formatPeerClockMs = (value) => {
  const totalSeconds = Math.ceil(Math.max(0, value) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const buildPeerGuestClockState = (clock) => {
  if (!clock) return null;
  return {
    ...structuredClone(clock),
    remainingMs: {
      player: clock.remainingMs?.ai || 0,
      ai: clock.remainingMs?.player || 0
    },
    runningFor: clock.runningFor === 'player' ? 'ai' : clock.runningFor === 'ai' ? 'player' : clock.runningFor,
    turn: clock.turn === 'player' ? 'ai' : clock.turn === 'ai' ? 'player' : clock.turn
  };
};
const canOptimisticallyApplyGuestAction = (state, action) => {
  if (!action) return false;
  switch (action.type) {
    case 'CANCEL_PENDING_ACTION':
    case 'CANCEL_TARGETING':
    case 'CAST_SPELL':
    case 'CAST_WITH_TARGET':
    case 'KEEP_HAND':
    case 'PROMPT_ACTIVATE_LAND':
    case 'PROMPT_HAND_LAND_ACTION':
    case 'REORDER_HALIMAR':
    case 'SURRENDER':
    case 'TOGGLE_ATTACK':
    case 'TOGGLE_BLOCK':
    case 'TOGGLE_PENDING_SELECT':
    case 'UPDATE_TELLING_TIME':
      return true;
    case 'SUBMIT_PENDING_ACTION':
      return ['LAND_TYPE_CHOICE', 'BRAINSTORM', 'DISCARD', 'TELLING_TIME', 'HALIMAR_DEPTHS', 'MULLIGAN_BOTTOM', 'DISCARD_CLEANUP', 'MYSTIC_SANCTUARY'].includes(state?.pendingAction?.type);
    default:
      return false;
  }
};
const clampAdventureProgress = (value) => Math.max(0, Math.min(Number.isFinite(value) ? value : 0, ADVENTURE_ROUTE.length));
const getRandomLandingBackground = (exclude = null) => {
  const options = exclude ? LANDING_BACKGROUNDS.filter(background => background !== exclude) : LANDING_BACKGROUNDS;
  const pool = options.length > 0 ? options : LANDING_BACKGROUNDS;
  return pool[Math.floor(Math.random() * pool.length)] || LANDING_BACKGROUNDS[0];
};
const loadLandingBackground = () => {
  if (typeof window === 'undefined') return LANDING_BACKGROUNDS[0];
  try {
    const lastBackground = window.localStorage.getItem(LANDING_BACKGROUND_STORAGE_KEY);
    const nextBackground = getRandomLandingBackground(lastBackground);
    window.localStorage.setItem(LANDING_BACKGROUND_STORAGE_KEY, nextBackground);
    return nextBackground;
  } catch (_error) {
    return getRandomLandingBackground();
  }
};
const storeLandingBackground = (background) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANDING_BACKGROUND_STORAGE_KEY, background);
  } catch (_error) {}
};
const loadRivalProgress = () => {
  if (typeof window === 'undefined') return { adventureWinsCount: 0 };
  try {
    const raw = window.localStorage.getItem(RIVAL_PROGRESS_STORAGE_KEY);
    if (!raw) return { adventureWinsCount: 0 };
    const parsed = JSON.parse(raw);
    return {
      adventureWinsCount: clampAdventureProgress(parsed?.adventureWinsCount)
    };
  } catch (_error) {
    return { adventureWinsCount: 0 };
  }
};
const saveRivalProgress = (adventureWinsCount) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RIVAL_PROGRESS_STORAGE_KEY, JSON.stringify({
      adventureWinsCount: clampAdventureProgress(adventureWinsCount)
    }));
  } catch (_error) {}
};
const isRestorableGameSnapshot = (snapshot) => Boolean(
  snapshot?.started &&
  !snapshot?.winner &&
  snapshot?.player &&
  snapshot?.ai &&
  Array.isArray(snapshot?.deck)
);
const loadCurrentGameSnapshot = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_GAME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const snapshot = parsed?.snapshot ?? parsed?.state ?? parsed;
    return isRestorableGameSnapshot(snapshot) ? snapshot : null;
  } catch (_error) {
    return null;
  }
};
const saveCurrentGameSnapshot = (snapshot) => {
  if (typeof window === 'undefined' || !isRestorableGameSnapshot(snapshot)) return;
  try {
    window.localStorage.setItem(CURRENT_GAME_STORAGE_KEY, JSON.stringify({
      savedAt: Date.now(),
      snapshot
    }));
  } catch (_error) {}
};
const clearCurrentGameSnapshot = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CURRENT_GAME_STORAGE_KEY);
  } catch (_error) {}
};
const SESSION_PRELOADED_IMAGES = new Map();
const SESSION_IMAGE_PRELOADS = new Map();
const preloadSingleImage = (url) => {
  if (!url || typeof window === 'undefined') return Promise.resolve();
  if (SESSION_PRELOADED_IMAGES.has(url)) return Promise.resolve();
  const existingPreload = SESSION_IMAGE_PRELOADS.get(url);
  if (existingPreload) return existingPreload;

  const preloadPromise = new Promise((resolve) => {
    const img = new window.Image();
    let settled = false;
    const finish = (didLoad) => {
      if (settled) return;
      settled = true;
      if (didLoad) {
        SESSION_PRELOADED_IMAGES.set(url, img);
      }
      SESSION_IMAGE_PRELOADS.delete(url);
      resolve();
    };

    img.decoding = 'sync';
    img.loading = 'eager';
    try {
      img.fetchPriority = 'high';
    } catch (_error) {}

    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {}).finally(() => finish(true));
      } else {
        finish(true);
      }
    };
    img.onerror = () => finish(false);
    img.src = url;

    if (img.complete) {
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {}).finally(() => finish(true));
      } else {
        finish(true);
      }
    }
  });

  SESSION_IMAGE_PRELOADS.set(url, preloadPromise);
  return preloadPromise;
};
const preloadImageUrls = (urls, onProgress = null) => {
  const uniqueUrls = Array.from(new Set((urls || []).filter(Boolean)));
  if (typeof window === 'undefined' || uniqueUrls.length === 0) {
    onProgress?.(100);
    return Promise.resolve();
  }

  let loaded = 0;
  const total = uniqueUrls.length;
  const reportProgress = () => {
    onProgress?.(Math.floor((loaded / total) * 100));
  };

  reportProgress();

  return Promise.all(
    uniqueUrls.map((url) =>
      preloadSingleImage(url).finally(() => {
        loaded += 1;
        reportProgress();
      })
    )
  ).then(() => {
    onProgress?.(100);
  });
};

const LAND_TYPE_BUTTON_STYLES = {
  Plains: 'bg-amber-100 hover:bg-amber-50 text-slate-900',
  Island: 'bg-sky-600 hover:bg-sky-500 text-white',
  Swamp: 'bg-violet-700 hover:bg-violet-600 text-white',
  Mountain: 'bg-rose-700 hover:bg-rose-600 text-white',
  Forest: 'bg-emerald-700 hover:bg-emerald-600 text-white'
};
const getStackEntryTargetDescriptor = (entry) => {
  const target = entry?.target;
  if (!target) return null;
  if (target.card?.id) {
    return { zone: 'stack', id: target.card.id };
  }
  if (target.id) {
    return { zone: 'board', id: target.id };
  }
  return null;
};
const getStackTargetDescriptors = (state, selectedStackEntryId = null) => {
  const descriptors = [];
  const pushDescriptor = (descriptor) => {
    if (!descriptor) return;
    if (descriptors.some(existing => existing.zone === descriptor.zone && existing.id === descriptor.id)) return;
    descriptors.push(descriptor);
  };

  pushDescriptor(getStackEntryTargetDescriptor(state?.stack?.[state.stack.length - 1]));
  if (selectedStackEntryId) {
    const selectedEntry = state?.stack?.find(entry => entry.card?.id === selectedStackEntryId) || null;
    pushDescriptor(getStackEntryTargetDescriptor(selectedEntry));
  }

  return descriptors;
};
const isStackTargetHighlighted = (card, zone, state, selectedStackEntryId = null) => {
  return getStackTargetDescriptors(state, selectedStackEntryId)
    .some(descriptor => descriptor.zone === zone && descriptor.id === card?.id);
};

// --- PRELOADER COMPONENT ---
const Preloader = ({ onComplete }) => {
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    let active = true;
    let completeTimer = null;
    const revealTimers = [
      window.setTimeout(() => {
        if (active) setRevealStep(1);
      }, 140),
      window.setTimeout(() => {
        if (active) setRevealStep(2);
      }, 560),
      window.setTimeout(() => {
        if (active) setRevealStep(3);
      }, 1020)
    ];

    const minimumRevealPromise = new Promise((resolve) => {
      const resolveTimer = window.setTimeout(resolve, 1240);
      revealTimers.push(resolveTimer);
    });

    const preloadPromise = APP_PRELOAD_URLS.length > 0
      ? preloadImageUrls(APP_PRELOAD_URLS)
      : Promise.resolve();

    Promise.all([preloadPromise, minimumRevealPromise]).then(() => {
      if (!active) return;
      completeTimer = window.setTimeout(() => {
        if (active) onComplete();
      }, 180);
    });

    return () => {
      active = false;
      if (completeTimer) window.clearTimeout(completeTimer);
      revealTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onComplete]);

  return (
    <div className="h-dvh bg-[#05101b] flex items-center justify-center overflow-hidden relative p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(56,189,248,0.1),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(103,232,249,0.08),transparent_30%),linear-gradient(180deg,#03101c_0%,#082035_52%,#04111b_100%)]" />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
      <div className="absolute left-[-3rem] top-10 w-44 h-44 rounded-full bg-cyan-300/16 blur-3xl" />
      <div className="absolute right-[-2rem] bottom-10 w-48 h-48 rounded-full bg-sky-300/12 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className={`transition-all duration-700 ease-out ${revealStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div
            className="font-arena-display text-[3rem] leading-[0.92] tracking-[0.08em] text-white sm:text-[4.3rem]"
            style={{
              textShadow: '0 0 24px rgba(34,211,238,0.16), 0 0 42px rgba(15,23,42,0.35)'
            }}
          >
            Forgetful
            <br />
            Fish
          </div>
        </div>

        <div className={`mt-7 text-[11px] uppercase tracking-[0.34em] text-cyan-100/80 transition-all duration-700 ease-out ${revealStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Loading Every Card
        </div>

        <div className={`mt-3 text-sm text-slate-300/82 transition-all duration-700 ease-out ${revealStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Preparing rivals, difficulty art, and full card images for this session.
        </div>

        <div className="relative mt-10 h-12 w-24">
          <div className="absolute left-[12%] top-[26%] h-2.5 w-2.5 rounded-full border border-cyan-100/40 bg-cyan-200/10 bubble-rise-1" />
          <div className="absolute left-[50%] top-[58%] h-1.5 w-1.5 rounded-full border border-cyan-100/35 bg-cyan-200/10 bubble-rise-2" />
          <div className="absolute right-[14%] top-[36%] h-2 w-2 rounded-full border border-cyan-100/40 bg-cyan-200/10 bubble-rise-3" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fish-bob">
            <div className="relative">
              <div className="h-8 w-14 rounded-[999px] border border-orange-100/30 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 shadow-[0_0_24px_rgba(251,146,60,0.4)]" />
              <div className="absolute left-[-8px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-y-transparent border-r-[13px] border-r-orange-300/90" />
              <div className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/85" />
              <div className="absolute right-[6px] top-[13px] h-1 w-1 rounded-full bg-white/90" />
              <div className="absolute left-[16px] -top-2 h-4 w-4 rounded-t-[999px] rounded-b-sm rotate-[-18deg] bg-orange-400/90" />
              <div className="absolute left-[18px] -bottom-2 h-4 w-4 rounded-b-[999px] rounded-t-sm rotate-[14deg] bg-orange-500/85" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- RESPONSIVE CARD COMPONENT ---
const Card = ({ card, onClick, onZoom, zone = 'hand', style = {}, hidden = false, official = false, draggable = false, onDragStart, onDragOver, onDrop, castable = false, targetable = false, stackTargeted = false, activatable = false, subtleHighlight = false, disableHoverLift = false }) => {
  const holdTimer = useRef(null);
  const [isPressing, setIsPressing] = useState(false);
  const printedLandType = card.type?.includes('Island') ? 'Island' : null;
  const changedLandType = zone === 'board' && card.isLand && card.landType && card.landType !== printedLandType ? card.landType : null;
  const holdDelayMs = 280;

  const startHold = (e) => {
     if (e.type === 'mousedown' && e.button === 2) {
        e.preventDefault();
        onZoom && onZoom(card);
        return;
     }
     if (zone === 'board' && card.isLand) setIsPressing(true);
     holdTimer.current = setTimeout(() => {
        onZoom && onZoom(card);
     }, holdDelayMs); 
  };

  const cancelHold = () => {
     setIsPressing(false);
     if (holdTimer.current) {
         clearTimeout(holdTimer.current);
         holdTimer.current = null;
     }
  };

  const getBaseTransform = () => {
    if (zone === 'board' || zone === 'deck') return `perspective(800px) ${card.tapped ? 'rotateZ(90deg)' : ''}`;
    if (zone === 'stack') return `perspective(800px) rotateZ(${Math.random() * 4 - 2}deg)`;
    return '';
  };

  let dims = "w-[64px] h-[90px] sm:w-[80px] sm:h-[112px]"; 
  if (zone === 'hand') dims = "w-[72px] h-[100px] sm:w-[90px] sm:h-[126px]";
  if (zone === 'explorer') dims = "w-full h-auto aspect-[5/7]";
  if (zone === 'stack') dims = "w-[86px] h-[120px] sm:w-[116px] sm:h-[162px]";

  let ringClass = '';
  let interactionClass = '';
  
  if (targetable) {
      ringClass = 'ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse cursor-crosshair';
  } else if (stackTargeted) {
      ringClass = 'ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950 shadow-[0_0_14px_rgba(239,68,68,0.55)]';
  } else if (castable && zone === 'hand') {
      ringClass = 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-950 shadow-[0_0_15px_rgba(96,165,250,0.6)]';
      interactionClass = disableHoverLift ? 'cursor-pointer' : 'cursor-pointer hover:-translate-y-4';
  } else if (activatable && zone === 'board') {
      ringClass = 'ring-2 ring-cyan-300/70 ring-offset-1 ring-offset-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.22)] cursor-pointer';
      interactionClass = 'cursor-pointer hover:scale-[1.01]';
  } else if (card.attacking) {
      ringClass = 'ring-2 ring-orange-500 ring-offset-1 shadow-[0_0_15px_rgba(249,115,22,0.8)]';
  } else if (card.blocking) {
      ringClass = 'ring-2 ring-green-500 ring-offset-1 shadow-[0_0_15px_rgba(34,197,94,0.8)]';
  } else if (subtleHighlight) {
      ringClass = 'ring-1 ring-amber-300/75 ring-offset-1 ring-offset-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.18)]';
  } else {
      if (zone === 'hand' || zone === 'explorer') interactionClass = disableHoverLift ? 'cursor-pointer' : 'cursor-pointer hover:-translate-y-4';
      if (zone === 'board' && card.name === 'DandÃ¢n' && !card.tapped && !card.summoningSickness) interactionClass = 'cursor-pointer hover:ring-2 hover:ring-slate-400';
  }
  if (zone === 'board' && card.isLand) {
    interactionClass = `${interactionClass} cursor-pointer hover:ring-1 hover:ring-cyan-200/45 hover:ring-offset-1 hover:ring-offset-slate-950 hover:shadow-[0_0_6px_rgba(125,211,252,0.12)]`.trim();
  }

  const CardBack = () => (
    <div className="absolute inset-0 bg-[#2b1b11] border-[3px] border-slate-900 flex items-center justify-center p-1 rounded-md">
      <div className="w-full h-full border border-[#8b5a2b] rounded-sm bg-[#5c3a21] flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-8 h-8 bg-amber-600 rounded-full blur-md opacity-20"></div>
        <div className="w-4 h-6 border border-[#2b1b11] rounded-full bg-[#8b5a2b] z-10"></div>
      </div>
    </div>
  );

  return (
    <div
      onClick={() => { AudioEngine.init(); onClick && onClick(card); }}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchMove={cancelHold}
      onTouchCancel={cancelHold}
      onContextMenu={(e) => { e.preventDefault(); onZoom && onZoom(card); }}
      draggable={draggable}
      onDragStart={(e) => { cancelHold(); onDragStart && onDragStart(e); }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative rounded-md transition-all duration-200 ease-out shadow-lg shrink-0 ${dims} ${ringClass} ${interactionClass}`}
      style={{ transform: getBaseTransform(), transformStyle: 'preserve-3d', ...style }}
    >
      {zone === 'board' && card.isLand && isPressing && (
        <div className="absolute inset-[-2px] rounded-[8px] border border-cyan-100/45 bg-cyan-200/5 shadow-[0_0_8px_rgba(34,211,238,0.14)] pointer-events-none z-50" />
      )}
      <div className="absolute inset-0 bg-slate-900" />
      {hidden ? <CardBack /> : official ? (
        <img src={card.fullImage} alt={card.name} loading="eager" decoding="sync" className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none" />
      ) : (
        <div className="absolute inset-0 border-[3px] border-slate-900 rounded-md flex flex-col bg-slate-500 p-[2px]">
          <div className={`absolute inset-0 opacity-90 ${card.isLand ? 'bg-sky-200' : 'bg-blue-600'}`}></div>
          <div className="relative z-10 flex flex-col h-full gap-0.5">
            <div className="bg-slate-100/95 border border-slate-400 rounded-sm flex justify-between items-center px-1 shadow-sm h-3">
              <span className="font-bold text-slate-900 text-[5px] truncate">{card.name}</span>
              <span className="font-bold text-slate-800 text-[5px]">{card.manaCost}</span>
            </div>
            <div className="flex-1 bg-slate-800/80 border border-slate-500 rounded-sm overflow-hidden flex items-center justify-center relative shadow-inner">
               <img src={card.image} alt="" loading="eager" decoding="sync" className="absolute inset-0 w-full h-full object-cover pointer-events-none" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="bg-slate-100/95 border border-slate-400 rounded-sm px-1 shadow-sm h-2.5 flex items-center">
              <span className="font-bold text-slate-900 text-[4px] truncate">{card.type}</span>
            </div>
          </div>
          {card.stats && (
            <div className="absolute bottom-[-1px] right-0 bg-slate-100 border border-slate-400 rounded-tl rounded-br-sm shadow-md px-1 z-20">
              <span className="font-bold text-slate-900 text-[6px] leading-none">{card.stats}</span>
            </div>
          )}
        </div>
      )}
      {card.tapped && zone === 'board' && (
        <div className={`absolute inset-0 rounded-md z-30 pointer-events-none flex items-center justify-center ${card.isLand ? 'bg-sky-950/20 border border-sky-300/15 shadow-[inset_0_0_10px_rgba(125,211,252,0.12)]' : 'bg-black/50'}`}>
          <div className={`w-4 h-4 rounded-full border-2 rotate-90 ${card.isLand ? 'border-sky-100 opacity-80' : 'border-slate-300 opacity-50'}`} style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}/>
        </div>
      )}
      {changedLandType && (
        <div className={`absolute inset-0 rounded-md z-20 pointer-events-none mix-blend-multiply flex items-center justify-center ${changedLandType === 'Island' ? 'bg-sky-700/45' : 'bg-purple-900/60'}`}>
          <span className={`font-bold rotate-45 opacity-65 text-xs ${changedLandType === 'Island' ? 'text-sky-100' : 'text-purple-300'}`}>{changedLandType.toUpperCase()}</span>
        </div>
      )}
      {card.summoningSickness && !card.isLand && zone === 'board' && (
         <div className="absolute top-1 right-1 bg-slate-900/85 rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow z-40 text-[8px] font-black tracking-tight text-slate-100" title="Summoning Sickness">
            Zz
         </div>
      )}
    </div>
  );
};

// --- STACKED LAND COMPONENT ---
const StackedLandGroup = ({ lands, official, state, zone, onZoom, onClick, activatablePlayer = null, selectedStackEntryId = null }) => {
  if (!lands || lands.length === 0) return null;
  const total = lands.length;
  const { mobile, desktop } = getLandStackStep(total);
  const orderedLands = [...lands].sort((a, b) => {
    if (a.tapped !== b.tapped) return a.tapped ? -1 : 1;
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return a.id.localeCompare(b.id);
  });
  const activatableLand = zone === 'board' && activatablePlayer
    ? orderedLands.find(land => isActivatable(land, state, activatablePlayer))
    : null;
  const isGroupActivatable = Boolean(activatableLand);
  const tapped = lands.filter(l => l.tapped).length;

  return (
    <div
      className={`land-stack-group ${isGroupActivatable ? 'drop-shadow-[0_0_12px_rgba(34,211,238,0.18)]' : ''}`}
      style={{
        '--land-count': `${total}`,
        '--land-step-mobile': `${mobile}px`,
        '--land-step-desktop': `${desktop}px`
      }}
    >
      {orderedLands.map((land, index) => (
        <div
          key={land.id}
          className="land-stack-card transition-all duration-200"
          style={{ '--land-index': `${index}`, zIndex: index + 1 }}
        >
          <Card
            card={land}
            zone={zone}
            official={official}
            onZoom={onZoom}
            onClick={onClick}
            targetable={isValidTarget(land, zone, state)}
            stackTargeted={isStackTargetHighlighted(land, zone, state, selectedStackEntryId)}
            activatable={Boolean(activatablePlayer) && isActivatable(land, state, activatablePlayer)}
          />
        </div>
      ))}
      {isGroupActivatable && zone === 'board' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-300/90 text-slate-950 border border-cyan-100 font-black px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.24)] text-[9px] tracking-widest z-20">
          ACTIVATE
        </div>
      )}
      {tapped > 0 && total >= 5 && (
        <div className="absolute -bottom-1 right-0 bg-slate-950/95 text-slate-300 border border-slate-700 font-bold px-1.5 py-0.5 rounded shadow text-[9px] z-20">
          {tapped}/{total} Tap
        </div>
      )}
    </div>
  );
};

const AttachedPermanentStack = ({ permanent, attachedAuras = [], official, state, onZoom, onClick, subtleHighlight = false, selectedStackEntryId = null }) => {
  const sortedAuras = [...attachedAuras].sort((a, b) => (a.attachmentOrder || 0) - (b.attachmentOrder || 0));
  const auraCount = sortedAuras.length;

  return (
    <div
      className="attached-permanent-stack relative shrink-0 h-[102px] sm:h-[126px]"
      style={{
        '--attached-count': `${auraCount}`
      }}
    >
      {sortedAuras.map((aura, index) => (
        <div
          key={aura.id}
          className="attached-aura absolute top-0"
          style={{
            '--attached-index': `${auraCount - index - 1}`,
            top: `${8 + index * 6}px`,
            zIndex: 4 + index
          }}
        >
          <Card
            card={aura}
            zone="board"
            official={official}
            onZoom={onZoom}
            onClick={onClick}
            targetable={isValidTarget(aura, 'board', state)}
            stackTargeted={isStackTargetHighlighted(aura, 'board', state, selectedStackEntryId)}
          />
        </div>
      ))}
      <div
        className="attached-permanent absolute top-0 z-20"
      >
        <Card
          card={permanent}
          zone="board"
          official={official}
          onZoom={onZoom}
          onClick={onClick}
          targetable={isValidTarget(permanent, 'board', state)}
          stackTargeted={isStackTargetHighlighted(permanent, 'board', state, selectedStackEntryId)}
          subtleHighlight={subtleHighlight}
        />
      </div>
    </div>
  );
};

const getCompactPermanentPairMetrics = (stackPair) => {
  const visibleRatio = 0.3;
  const stepMobile = Math.round(64 * visibleRatio);
  const stepDesktop = Math.round(80 * visibleRatio);
  const widths = stackPair.map(({ attachedAuras = [] }) => ({
    mobile: 64 + attachedAuras.length * 32,
    desktop: 80 + attachedAuras.length * 40
  }));
  const mobileWidth = widths.length > 1 ? Math.max(widths[0].mobile, stepMobile + widths[1].mobile) : widths[0]?.mobile || 64;
  const desktopWidth = widths.length > 1 ? Math.max(widths[0].desktop, stepDesktop + widths[1].desktop) : widths[0]?.desktop || 80;

  return { stepMobile, stepDesktop, mobileWidth, desktopWidth };
};

const CompactPermanentPair = ({ stackPair, official, state, onZoom, onClick, getSubtleHighlight = () => false, selectedStackEntryId = null }) => {
  const { stepMobile, stepDesktop, mobileWidth, desktopWidth } = getCompactPermanentPairMetrics(stackPair);

  return (
    <div
      className="compact-permanent-pair"
      style={{
        '--compact-step-mobile': `${stepMobile}px`,
        '--compact-step-desktop': `${stepDesktop}px`,
        '--compact-width-mobile': `${mobileWidth}px`,
        '--compact-width-desktop': `${desktopWidth}px`
      }}
    >
      {stackPair.map(({ key, permanent, attachedAuras }, index) => (
        <div key={key} className="compact-permanent-card" style={{ '--compact-index': `${index}`, zIndex: index + 1 }}>
          <AttachedPermanentStack
            permanent={permanent}
            attachedAuras={attachedAuras}
            official={official}
            state={state}
            onZoom={onZoom}
            onClick={onClick}
            subtleHighlight={getSubtleHighlight(permanent)}
            selectedStackEntryId={selectedStackEntryId}
          />
        </div>
      ))}
    </div>
  );
};

const BoardPermanentRow = ({ stacks, official, state, onZoom, onClick, getSubtleHighlight = () => false, className = '', selectedStackEntryId = null }) => {
  if (stacks.length === 0) {
    return <div className={`w-full ${className}`.trim()} />;
  }

  const shouldCompact = stacks.length >= 5;

  if (!shouldCompact) {
    return (
      <div className={`flex gap-2 justify-center items-center w-full ${className}`.trim()}>
        {stacks.map(({ key, permanent, attachedAuras }) => (
          <AttachedPermanentStack
            key={key}
            permanent={permanent}
            attachedAuras={attachedAuras}
            official={official}
            state={state}
            onZoom={onZoom}
            onClick={onClick}
            subtleHighlight={getSubtleHighlight(permanent)}
            selectedStackEntryId={selectedStackEntryId}
          />
        ))}
      </div>
    );
  }

  const stackPairs = [];
  for (let index = 0; index < stacks.length; index += 2) {
    stackPairs.push(stacks.slice(index, index + 2));
  }

  return (
    <div className={`w-full overflow-x-auto overflow-y-hidden custom-scrollbar ${className}`.trim()}>
      <div className="flex justify-center min-w-full">
        <div className="flex items-center gap-2 sm:gap-3 w-max py-1">
          {stackPairs.map((stackPair, index) => (
            <CompactPermanentPair
              key={stackPair.map(({ key }) => key).join('|') || `pair-${index}`}
              stackPair={stackPair}
              official={official}
              state={state}
              onZoom={onZoom}
              onClick={onClick}
              getSubtleHighlight={getSubtleHighlight}
              selectedStackEntryId={selectedStackEntryId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeActionButton = ({ label, onClick, className = '', labelClassName = '' }) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden transition-all duration-200 hover:-translate-y-[2px] active:translate-y-0 ${className}`.trim()}
  >
    <div className="pointer-events-none absolute inset-[1px] rounded-[inherit] bg-[linear-gradient(180deg,rgba(51,65,85,0.54),rgba(15,23,42,0.42))]" />
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_20px_rgba(56,189,248,0.08),0_0_28px_rgba(15,23,42,0.12)] transition-opacity duration-200 group-hover:opacity-100" />
    <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
    <div className="relative flex items-center justify-center">
      <div className={`min-w-0 w-full text-center font-arena-display ${labelClassName}`.trim()}>{label}</div>
    </div>
  </button>
);

const HomeMenuPanel = ({ variantId, onAdventure, onQuickGame, onOnline, onFriends, onContinue, canContinue, onSettings }) => {
  if (variantId === 'duel') {
    return (
      <div className="w-full max-w-4xl mx-auto grid gap-3">
        <HomeActionButton
          label="Adventure"
          onClick={onAdventure}
          className="min-h-[138px] rounded-[2rem] border border-slate-200/55 bg-white/86 px-6 py-6 text-left shadow-[0_24px_60px_rgba(15,23,42,0.22)] backdrop-blur-[2px]"
          labelClassName="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-slate-950"
          indicatorClassName="border-slate-300/80 bg-slate-950/6 text-slate-950"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-3">
            <HomeActionButton
              label="Quick Game"
              onClick={onQuickGame}
              className="min-h-[118px] rounded-[1.8rem] border border-slate-200/40 bg-white/72 px-5 py-5 text-left shadow-[0_20px_44px_rgba(15,23,42,0.18)] backdrop-blur-[2px]"
              labelClassName="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-slate-950"
              indicatorClassName="border-rose-300/50 bg-rose-50/80 text-rose-700"
            />
            <HomeActionButton
              label="Play With Friends"
              onClick={onFriends}
              className="min-h-[96px] rounded-[1.8rem] border border-sky-200/45 bg-sky-50/78 px-5 py-5 text-left shadow-[0_20px_44px_rgba(15,23,42,0.16)] backdrop-blur-[2px]"
              labelClassName="text-xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
            />
            <HomeActionButton
              label="Play Online"
              onClick={onOnline}
              className="min-h-[96px] rounded-[1.8rem] border border-cyan-200/45 bg-cyan-50/78 px-5 py-5 text-left shadow-[0_20px_44px_rgba(15,23,42,0.16)] backdrop-blur-[2px]"
              labelClassName="text-xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
            />
            {canContinue && (
              <HomeActionButton
                label="Continue"
                onClick={onContinue}
                className="min-h-[96px] rounded-[1.8rem] border border-emerald-200/45 bg-emerald-50/78 px-5 py-5 text-left shadow-[0_20px_44px_rgba(15,23,42,0.16)] backdrop-blur-[2px]"
                labelClassName="text-2xl sm:text-[2.45rem] font-semibold tracking-[-0.03em] text-slate-950"
              />
            )}
          </div>
          <HomeActionButton
            label="Settings"
            onClick={onSettings}
            className="min-h-[118px] rounded-[1.8rem] border border-slate-200/40 bg-white/72 px-5 py-5 text-left shadow-[0_20px_44px_rgba(15,23,42,0.18)] backdrop-blur-[2px]"
            labelClassName="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-slate-950"
            indicatorClassName="border-amber-300/50 bg-amber-50/80 text-amber-700"
          />
        </div>
      </div>
    );
  }

  if (variantId === 'frame') {
    return (
      <div className="w-full max-w-lg mx-auto grid gap-3">
        <HomeActionButton
          label="Adventure"
          onClick={onAdventure}
          className="rounded-[1.55rem] border border-slate-300/70 bg-slate-50/88 px-5 py-5 text-left shadow-[0_18px_38px_rgba(15,23,42,0.2)] backdrop-blur-[2px]"
          labelClassName="text-2xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
          indicatorClassName="border-cyan-300/60 bg-cyan-50 text-cyan-700"
        />
        <HomeActionButton
          label="Quick Game"
          onClick={onQuickGame}
          className="rounded-[1.55rem] border border-slate-300/70 bg-slate-50/88 px-5 py-5 text-left shadow-[0_18px_38px_rgba(15,23,42,0.2)] backdrop-blur-[2px]"
          labelClassName="text-2xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
          indicatorClassName="border-rose-300/60 bg-rose-50 text-rose-700"
        />
        <HomeActionButton
          label="Play With Friends"
          onClick={onFriends}
          className="rounded-[1.55rem] border border-sky-300/70 bg-sky-50/88 px-5 py-5 text-left shadow-[0_18px_38px_rgba(15,23,42,0.18)] backdrop-blur-[2px]"
          labelClassName="text-2xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
        />
        <HomeActionButton
          label="Play Online"
          onClick={onOnline}
          className="rounded-[1.55rem] border border-cyan-300/70 bg-cyan-50/88 px-5 py-5 text-left shadow-[0_18px_38px_rgba(15,23,42,0.18)] backdrop-blur-[2px]"
          labelClassName="text-2xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
        />
        {canContinue && (
          <HomeActionButton
            label="Continue"
            onClick={onContinue}
            className="rounded-[1.55rem] border border-emerald-300/70 bg-emerald-50/88 px-5 py-5 text-left shadow-[0_18px_38px_rgba(15,23,42,0.18)] backdrop-blur-[2px]"
            labelClassName="text-2xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
          />
        )}
        <HomeActionButton
          label="Settings"
          onClick={onSettings}
          className="rounded-[1.55rem] border border-slate-300/70 bg-slate-50/88 px-5 py-5 text-left shadow-[0_18px_38px_rgba(15,23,42,0.2)] backdrop-blur-[2px]"
          labelClassName="text-2xl sm:text-[2rem] font-semibold tracking-[-0.03em] text-slate-950"
          indicatorClassName="border-amber-300/60 bg-amber-50 text-amber-700"
        />
      </div>
    );
  }

  if (variantId === 'route') {
    return (
      <div className="w-full max-w-3xl mx-auto grid gap-4 lg:grid-cols-[84px_minmax(0,1fr)] items-stretch">
        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full min-h-[360px] w-px bg-gradient-to-b from-white/0 via-white/75 to-white/0" />
        </div>
        <div className="grid gap-3">
          <HomeActionButton
            label="Adventure"
            onClick={onAdventure}
            className="rounded-[1.9rem] border border-white/55 bg-white/84 px-6 py-6 text-left shadow-[0_18px_40px_rgba(15,23,42,0.2)] backdrop-blur-[2px]"
            labelClassName="text-3xl sm:text-[2.6rem] font-semibold tracking-[-0.04em] text-slate-950"
            indicatorClassName="border-slate-300/70 bg-slate-900/5 text-slate-950"
          />
          <HomeActionButton
            label="Quick Game"
            onClick={onQuickGame}
            className="rounded-[1.9rem] border border-white/45 bg-white/74 px-6 py-5 text-left shadow-[0_18px_36px_rgba(15,23,42,0.18)] backdrop-blur-[2px] sm:ml-8"
            labelClassName="text-2xl sm:text-[2.2rem] font-semibold tracking-[-0.03em] text-slate-950"
            indicatorClassName="border-rose-300/55 bg-rose-50/90 text-rose-700"
          />
          <HomeActionButton
            label="Play With Friends"
            onClick={onFriends}
            className="rounded-[1.9rem] border border-sky-200/50 bg-sky-50/76 px-6 py-5 text-left shadow-[0_18px_36px_rgba(15,23,42,0.16)] backdrop-blur-[2px] sm:ml-10"
            labelClassName="text-2xl sm:text-[2.2rem] font-semibold tracking-[-0.03em] text-slate-950"
          />
          <HomeActionButton
            label="Play Online"
            onClick={onOnline}
            className="rounded-[1.9rem] border border-cyan-200/50 bg-cyan-50/76 px-6 py-5 text-left shadow-[0_18px_36px_rgba(15,23,42,0.16)] backdrop-blur-[2px] sm:ml-11"
            labelClassName="text-2xl sm:text-[2.2rem] font-semibold tracking-[-0.03em] text-slate-950"
          />
          {canContinue && (
            <HomeActionButton
              label="Continue"
              onClick={onContinue}
              className="rounded-[1.9rem] border border-emerald-200/50 bg-emerald-50/76 px-6 py-5 text-left shadow-[0_18px_36px_rgba(15,23,42,0.16)] backdrop-blur-[2px] sm:ml-12"
              labelClassName="text-2xl sm:text-[2.2rem] font-semibold tracking-[-0.03em] text-slate-950"
            />
          )}
          <HomeActionButton
            label="Settings"
            onClick={onSettings}
            className="rounded-[1.9rem] border border-white/45 bg-white/74 px-6 py-5 text-left shadow-[0_18px_36px_rgba(15,23,42,0.18)] backdrop-blur-[2px] sm:ml-16"
            labelClassName="text-2xl sm:text-[2.2rem] font-semibold tracking-[-0.03em] text-slate-950"
            indicatorClassName="border-amber-300/55 bg-amber-50/90 text-amber-700"
          />
        </div>
      </div>
    );
  }

  if (variantId === 'poster') {
    return (
      <div className="w-full max-w-4xl mx-auto grid gap-3">
        <HomeActionButton
          label="Adventure"
          onClick={onAdventure}
          className="rounded-[2rem] border border-white/50 bg-white/84 px-6 py-6 text-left shadow-[0_20px_44px_rgba(15,23,42,0.2)] backdrop-blur-[2px]"
          labelClassName="text-3xl sm:text-[3rem] font-semibold tracking-[-0.04em] text-slate-950"
          indicatorClassName="border-cyan-300/60 bg-cyan-50/95 text-cyan-700"
        />
        <HomeActionButton
          label="Quick Game"
          onClick={onQuickGame}
          className="rounded-[2rem] border border-white/42 bg-white/74 px-6 py-6 text-left shadow-[0_20px_44px_rgba(15,23,42,0.18)] backdrop-blur-[2px]"
          labelClassName="text-3xl sm:text-[3rem] font-semibold tracking-[-0.04em] text-slate-950"
          indicatorClassName="border-rose-300/60 bg-rose-50/95 text-rose-700"
        />
        <HomeActionButton
          label="Play With Friends"
          onClick={onFriends}
          className="rounded-[2rem] border border-sky-200/48 bg-sky-50/78 px-6 py-6 text-left shadow-[0_20px_44px_rgba(15,23,42,0.16)] backdrop-blur-[2px]"
          labelClassName="text-3xl sm:text-[3rem] font-semibold tracking-[-0.04em] text-slate-950"
        />
        <HomeActionButton
          label="Play Online"
          onClick={onOnline}
          className="rounded-[2rem] border border-cyan-200/48 bg-cyan-50/78 px-6 py-6 text-left shadow-[0_20px_44px_rgba(15,23,42,0.16)] backdrop-blur-[2px]"
          labelClassName="text-3xl sm:text-[3rem] font-semibold tracking-[-0.04em] text-slate-950"
        />
        {canContinue && (
          <HomeActionButton
            label="Continue"
            onClick={onContinue}
            className="rounded-[2rem] border border-emerald-200/48 bg-emerald-50/78 px-6 py-6 text-left shadow-[0_20px_44px_rgba(15,23,42,0.16)] backdrop-blur-[2px]"
            labelClassName="text-3xl sm:text-[3rem] font-semibold tracking-[-0.04em] text-slate-950"
          />
        )}
        <HomeActionButton
          label="Settings"
          onClick={onSettings}
          className="rounded-[2rem] border border-white/42 bg-white/74 px-6 py-6 text-left shadow-[0_20px_44px_rgba(15,23,42,0.18)] backdrop-blur-[2px]"
          labelClassName="text-3xl sm:text-[3rem] font-semibold tracking-[-0.04em] text-slate-950"
          indicatorClassName="border-amber-300/60 bg-amber-50/95 text-amber-700"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto grid justify-items-center gap-2.5">
      <HomeActionButton
        label="Adventure"
        onClick={onAdventure}
        className="w-full max-w-[15.75rem] min-h-[56px] rounded-full bg-slate-800/44 p-0 shadow-[0_18px_36px_rgba(15,23,42,0.24)] hover:bg-slate-800/54"
        labelClassName="text-[1.2rem] sm:text-[1.32rem] tracking-[0.02em] text-white"
      />
      <HomeActionButton
        label="Quick Game"
        onClick={onQuickGame}
        className="w-full max-w-[15.75rem] min-h-[56px] rounded-full bg-slate-800/44 p-0 shadow-[0_18px_36px_rgba(15,23,42,0.24)] hover:bg-slate-800/54"
        labelClassName="text-[1.2rem] sm:text-[1.32rem] tracking-[0.02em] text-white"
      />
      <HomeActionButton
        label="Play With Friends"
        onClick={onFriends}
        className="w-full max-w-[15.75rem] min-h-[56px] rounded-full bg-sky-900/40 p-0 shadow-[0_18px_36px_rgba(15,23,42,0.24)] hover:bg-sky-900/52"
        labelClassName="text-[1.2rem] sm:text-[1.32rem] tracking-[0.02em] text-white"
      />
      <HomeActionButton
        label="Play Online"
        onClick={onOnline}
        className="w-full max-w-[15.75rem] min-h-[56px] rounded-full bg-cyan-900/40 p-0 shadow-[0_18px_36px_rgba(15,23,42,0.24)] hover:bg-cyan-900/52"
        labelClassName="text-[1.2rem] sm:text-[1.32rem] tracking-[0.02em] text-white"
      />
      {canContinue && (
        <HomeActionButton
          label="Continue"
          onClick={onContinue}
          className="w-full max-w-[15.75rem] min-h-[56px] rounded-full bg-emerald-900/42 p-0 shadow-[0_18px_36px_rgba(15,23,42,0.24)] hover:bg-emerald-900/52"
          labelClassName="text-[1.2rem] sm:text-[1.32rem] tracking-[0.02em] text-white"
        />
      )}
      <HomeActionButton
        label="Settings"
        onClick={onSettings}
        className="w-full max-w-[15.75rem] min-h-[56px] rounded-full bg-slate-800/44 p-0 shadow-[0_18px_36px_rgba(15,23,42,0.24)] hover:bg-slate-800/54"
        labelClassName="text-[1.2rem] sm:text-[1.32rem] tracking-[0.02em] text-white"
      />
    </div>
  );
};

const AdventureMenuPanel = ({
  adventurePathPoints,
  isAdventureComplete,
  nextAdventureCharacter,
  adventureWinsCount,
  adventureProgressRatio,
  adventureStageNumber,
  availableAdventureStages,
  onBack,
  onStartAdventure,
  onRestartAdventure
}) => (
  <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2.5 font-arena-display sm:gap-3 lg:grid-cols-[minmax(0,1.35fr)_300px] lg:grid-rows-1 lg:gap-4">
    <div className="flex min-h-0 flex-col rounded-[8px] bg-white/[0.08] p-2.5 shadow-[0_24px_54px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-4">
      <div className="mb-2.5 flex items-end justify-between gap-4 sm:mb-4">
        <div>
          <div className="mb-0 text-[10px] uppercase tracking-[0.18em] text-slate-400/82">Adventure</div>
          <div className="text-xl sm:text-2xl text-white">Rival Route</div>
        </div>
        <div className="text-right">
          <div className="mb-0 text-[10px] uppercase tracking-[0.18em] text-slate-400/82">Progress</div>
          <div className="rounded-full bg-slate-950/64 px-3 py-1 text-sm uppercase tracking-[0.16em] text-slate-100 shadow-[0_10px_22px_rgba(15,23,42,0.24)]">
            {Math.min(adventureWinsCount, ADVENTURE_ROUTE.length)}/{ADVENTURE_ROUTE.length}
          </div>
        </div>
      </div>

      <div className="relative min-h-0 h-full flex-1 rounded-[1.45rem] overflow-hidden bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.36))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl lg:aspect-[16/10]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_56%)]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={adventurePathPoints} fill="none" stroke="rgba(100,116,139,0.36)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={adventurePathPoints} fill="none" stroke="rgba(226,232,240,0.6)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
        </svg>
        <div className="absolute inset-[3.5%] sm:inset-[3%]">
          {ADVENTURE_ROUTE.map((characterId, index) => {
            const character = getAiCharacter(characterId) || AI_CHARACTERS[index];
            const layout = ADVENTURE_MAP_LAYOUT[index];
            const isCurrentStage = !isAdventureComplete && index === Math.min(adventureWinsCount, ADVENTURE_ROUTE.length - 1);
            const isCleared = isAdventureComplete || index < adventureWinsCount;
            const isLocked = !isAdventureComplete && index >= availableAdventureStages;
            const isBoss = characterId === ADVENTURE_BOSS_ID;

            return (
              <div
                key={characterId}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${layout.left}%`, top: `${layout.top}%` }}
              >
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className={`relative rounded-[8px] p-[3px] shadow-[0_12px_28px_rgba(15,23,42,0.24)] backdrop-blur-xl transition-all ${
                    isCurrentStage
                      ? 'bg-white/28'
                      : isCleared
                        ? 'bg-white/18'
                        : 'bg-slate-950/24'
                  }`}>
                    <img
                      src={getCharacterPortrait(characterId, ADVENTURE_FIXED_DIFFICULTY)}
                      alt={character.name}
                      className={`h-11 w-11 sm:h-14 sm:w-14 rounded-full object-cover shadow-[0_8px_18px_rgba(2,6,23,0.28)] ${isLocked ? 'opacity-45 grayscale' : ''}`}
                    />
                    {isCurrentStage && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/88 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.16em] text-amber-200 shadow-[0_10px_22px_rgba(251,191,36,0.34)] ring-1 ring-amber-300/45">
                        Next
                      </div>
                    )}
                    {isBoss && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/88 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.16em] text-amber-200 backdrop-blur-sm shadow-[0_10px_20px_rgba(15,23,42,0.28)]">
                        Boss
                      </div>
                    )}
                  </div>
                  <div className="max-w-[60px] sm:max-w-[78px] text-center">
                    <div className={`text-[8px] sm:text-[10px] uppercase tracking-[0.12em] leading-tight ${isLocked ? 'text-slate-400/70' : 'text-white'}`}>
                      {character.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <div className="rounded-[1.6rem] bg-white/[0.08] p-3 shadow-[0_24px_54px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-5">
      <div>
        <div className="flex items-center gap-3">
          <img
            src={getCharacterPortrait(nextAdventureCharacter.id, ADVENTURE_FIXED_DIFFICULTY)}
            alt={nextAdventureCharacter.name}
            className="h-14 w-14 rounded-full object-cover shadow-[0_12px_26px_rgba(2,6,23,0.3)] sm:h-16 sm:w-16"
          />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-300">
              {isAdventureComplete
                ? 'Adventure Complete'
                : `${adventureStageNumber}/${ADVENTURE_ROUTE.length}`}
            </div>
            <div className="text-base text-white truncate sm:text-lg">
              {isAdventureComplete ? 'Gauntlet Cleared' : nextAdventureCharacter.name}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300/80">
              {isAdventureComplete ? 'Every rival defeated' : nextAdventureCharacter.title}
            </div>
          </div>
        </div>

        <div className="mt-3.5 sm:mt-5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-300/80">
            <span>Progress</span>
            <span>{Math.min(adventureWinsCount, ADVENTURE_ROUTE.length)}/{ADVENTURE_ROUTE.length}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-200 transition-all duration-300"
              style={{ width: `${isAdventureComplete ? 100 : adventureProgressRatio * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 grid gap-2.5 sm:mt-6 sm:gap-3">
          <div className="grid grid-cols-[56px_minmax(0,1fr)] items-stretch gap-3 sm:grid-cols-[60px_minmax(0,1fr)]">
            <button
              onClick={onBack}
              aria-label="Back"
              className="flex min-h-[52px] h-full items-center justify-center rounded-2xl bg-slate-950/92 px-0 py-3 text-slate-100 shadow-[0_18px_34px_rgba(2,6,23,0.42)] transition-colors hover:bg-slate-900 sm:min-h-[54px]"
            >
              <ArrowLeft size={18} strokeWidth={2.4} />
            </button>
            <button
              onClick={onStartAdventure}
              className="flex min-h-[52px] h-full items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#fb923c_0%,#f97316_52%,#ea580c_100%)] px-3 py-3 font-arena-display text-[1rem] uppercase tracking-[0.08em] text-white shadow-[0_16px_30px_rgba(234,88,12,0.3)] transition-all hover:brightness-[1.04] sm:min-h-[54px] sm:px-4 sm:py-4 sm:text-base"
            >
              {isAdventureComplete ? 'Restart Adventure' : adventureWinsCount > 0 ? 'Continue Adventure' : 'Play'}
            </button>
          </div>
          {adventureWinsCount > 0 && !isAdventureComplete && (
            <button
              onClick={onRestartAdventure}
              className="w-full min-h-[50px] rounded-2xl bg-slate-900/72 px-4 py-3 font-arena-display text-[0.9rem] uppercase tracking-[0.08em] text-slate-100 shadow-[0_14px_28px_rgba(15,23,42,0.26)] transition-colors hover:bg-slate-800/78 sm:min-h-[52px] sm:py-3.5 sm:text-sm"
            >
              Restart From Stage 1
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const QuickGameDialog = ({ selectedDifficulty, onClose, onStart }) => (
  <div onClick={onClose} className="absolute inset-0 z-20 bg-black/82 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
    <div onClick={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-[1.9rem] border border-slate-800 bg-slate-950 p-5 sm:p-6 text-left my-auto shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
      <div className="mb-5 text-center">
        <h2 className="font-arena-display text-2xl tracking-[0.08em] text-white">Quick Game</h2>
      </div>
      <div className="flex items-start justify-center gap-3 sm:gap-5">
        {AI_DIFFICULTIES.map((difficulty) => {
          const isSelected = selectedDifficulty === difficulty;
          const accentClass = difficulty === 'easy'
            ? 'text-emerald-200'
            : difficulty === 'medium'
              ? 'text-rose-200'
              : 'text-sky-200';
          const ringClass = difficulty === 'easy'
            ? 'border-emerald-400/70'
            : difficulty === 'medium'
              ? 'border-rose-400/70'
              : 'border-sky-400/70';
          return (
            <button
              key={difficulty}
              onClick={() => onStart(difficulty)}
              className={`group flex w-[92px] shrink-0 flex-col items-center gap-2 px-1 py-2 text-center transition-all sm:w-[118px] ${
                isSelected
                  ? 'bg-slate-100/6 text-slate-50'
                  : 'text-slate-100 hover:-translate-y-[2px]'
              }`}
            >
              <div
                className={`relative h-20 w-20 overflow-hidden rounded-full border-4 shadow-[0_18px_36px_rgba(0,0,0,0.3)] sm:h-24 sm:w-24 ${
                  isSelected ? 'border-slate-100' : `${ringClass} group-hover:scale-[1.03]`
                }`}
              >
                <img
                  src={DIFFICULTY_ART[difficulty]}
                  alt={AI_DIFFICULTY_LABELS[difficulty]}
                  className={`h-full w-full object-cover transition-transform duration-300 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                />
                <div className={`absolute inset-0 rounded-full ${isSelected ? 'bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.16)_100%)]' : 'bg-[linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.38)_100%)]'}`} />
              </div>
              <div className={`font-arena-display text-base sm:text-lg tracking-[0.05em] ${accentClass}`}>
                {AI_DIFFICULTY_LABELS[difficulty]}
              </div>
              <div className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {difficulty === 'easy' ? 'Deathfish' : difficulty === 'medium' ? 'Redfish' : 'Shark'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const PEER_STATUS_LABELS = {
  idle: 'Ready',
  creating: 'Creating Invite',
  waiting: 'Waiting For Friend',
  connecting: 'Connecting',
  connected: 'Connected',
  reconnecting: 'Reconnecting',
  disconnected: 'Disconnected',
  error: 'Connection Error'
};

const PlayWithFriendsDialog = ({
  mode,
  role,
  status,
  roomId,
  token,
  inviteUrl,
  joinRoomId,
  joinToken,
  error,
  note,
  canShare,
  onClose,
  onSelectMode,
  onCreateInvite,
  onShareInvite,
  onCopyInvite,
  onJoinRoomIdChange,
  onJoinTokenChange,
  onConnect,
  onDisconnect,
  onRetry
}) => {
  const isBusy = ['creating', 'connecting', 'reconnecting'].includes(status);
  const isHost = mode === 'host';
  const hasInvite = Boolean(inviteUrl);
  const statusLabel = PEER_STATUS_LABELS[status] || 'Ready';

  return (
    <div onClick={onClose} className="absolute inset-0 z-30 bg-black/82 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-[1.9rem] border border-slate-800 bg-slate-950 p-5 sm:p-6 text-left my-auto shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-200">
              <Users size={18} />
              <h2 className="font-arena-display text-2xl tracking-[0.08em] text-white">Play With Friends</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">Create a secure invite link, then reconnect automatically if the signal drops.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-2">
          <button
            onClick={() => onSelectMode('host')}
            className={`rounded-[1rem] px-3 py-3 text-sm font-black uppercase tracking-[0.14em] transition-all ${isHost ? 'bg-cyan-300 text-slate-950' : 'bg-slate-950/72 text-slate-300 hover:bg-slate-900'}`}
          >
            Host
          </button>
          <button
            onClick={() => onSelectMode('join')}
            className={`rounded-[1rem] px-3 py-3 text-sm font-black uppercase tracking-[0.14em] transition-all ${!isHost ? 'bg-cyan-300 text-slate-950' : 'bg-slate-950/72 text-slate-300 hover:bg-slate-900'}`}
          >
            Join
          </button>
        </div>

        <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.045] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
            {status === 'connected' ? <Wifi size={15} /> : <WifiOff size={15} />}
            <span>{statusLabel}</span>
          </div>
          {note && <p className="mt-2 text-sm leading-5 text-slate-400">{note}</p>}
          {error && <p className="mt-2 text-sm leading-5 text-rose-300">{error}</p>}
        </div>

        {isHost ? (
          <div className="mt-4 grid gap-3">
            <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/78 px-4 py-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Invite Code</div>
              <div className="mt-2 break-all font-mono text-sm text-cyan-100">{roomId || 'Not created yet'}</div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/78 px-4 py-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</div>
              <div className="mt-2 break-all font-mono text-sm text-cyan-100">{token || 'Generated with the invite'}</div>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/78 px-4 py-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <LinkIcon size={13} />
                <span>Invite Link</span>
              </div>
              <div className="mt-2 break-all text-sm text-slate-300">{inviteUrl || 'Create an invite to get the share link.'}</div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={hasInvite ? onShareInvite : onCreateInvite}
                disabled={isBusy}
                className="w-full min-h-[52px] rounded-2xl bg-[#38bdf8] hover:bg-[#22c7ff] disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-bold tracking-[0.04em] uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                {hasInvite ? 'Share Invite' : 'Create Invite'}
              </button>
              <button
                onClick={onCopyInvite}
                disabled={!hasInvite}
                className="w-full min-h-[52px] rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-900 disabled:text-slate-600 text-slate-100 font-bold tracking-[0.04em] uppercase transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                Copy Link
              </button>
            </div>
            {role === 'host' && (
              <button
                onClick={onDisconnect}
                className="w-full min-h-[50px] rounded-2xl bg-slate-900/84 hover:bg-slate-800 text-slate-100 font-bold tracking-[0.04em] uppercase transition-colors border border-slate-700"
              >
                Cancel Session
              </button>
            )}
            {!canShare && hasInvite && (
              <p className="text-xs leading-5 text-slate-500">Native share is not available on this device, so the link can be copied manually.</p>
            )}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Invite Code</span>
              <input
                value={joinRoomId}
                onChange={(event) => onJoinRoomIdChange(event.target.value)}
                placeholder="Paste the host code"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/88 px-4 py-3 text-slate-100 outline-none focus:border-cyan-300"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</span>
              <input
                value={joinToken}
                onChange={(event) => onJoinTokenChange(event.target.value)}
                placeholder="Paste the shared key"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/88 px-4 py-3 text-slate-100 outline-none focus:border-cyan-300"
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={onConnect}
                disabled={isBusy || !joinRoomId.trim() || !joinToken.trim()}
                className="w-full min-h-[52px] rounded-2xl bg-[#38bdf8] hover:bg-[#22c7ff] disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-bold tracking-[0.04em] uppercase transition-colors flex items-center justify-center gap-2"
              >
                {status === 'reconnecting' ? <RefreshCw size={16} className="animate-spin" /> : <Users size={16} />}
                Connect
              </button>
              <button
                onClick={status === 'error' ? onRetry : onDisconnect}
                disabled={!role && status === 'idle'}
                className="w-full min-h-[52px] rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-900 disabled:text-slate-600 text-slate-100 font-bold tracking-[0.04em] uppercase transition-colors border border-slate-700"
              >
                {status === 'error' ? 'Retry' : 'Disconnect'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ONLINE_MATCH_STATUS_LABELS = {
  idle: 'Ready',
  starting: 'Opening Lobby',
  waiting: 'Matchmaking',
  matched: 'Match Found',
  launching: 'Opening Match Room',
  error: 'Matchmaking Error'
};

const PlayOnlineDialog = ({
  playerName,
  status,
  error,
  note,
  bucketLabel,
  rotationLabel,
  pendingMatch,
  onClose,
  onPlayerNameChange,
  onStart,
  onRetry,
  onCancel
}) => {
  const isBusy = ['starting', 'waiting', 'matched', 'launching'].includes(status);
  const hasPendingMatch = Boolean(pendingMatch?.roomId);
  const statusLabel = ONLINE_MATCH_STATUS_LABELS[status] || 'Ready';
  const primaryAction = status === 'error' ? onRetry : onStart;
  const primaryLabel = status === 'error'
    ? (hasPendingMatch ? 'Retry Match Room' : 'Retry Matchmaking')
    : 'Start Matchmaking';

  return (
    <div onClick={isBusy ? onCancel : onClose} className="absolute inset-0 z-30 bg-black/82 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-[1.9rem] border border-slate-800 bg-slate-950 p-5 sm:p-6 text-left my-auto shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-200">
              <Wifi size={18} />
              <h2 className="font-arena-display text-2xl tracking-[0.08em] text-white">Play Online</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">Join the shared six-hour lobby, announce you are ready, then hop into a deterministic PeerJS match room.</p>
          </div>
          <button onClick={isBusy ? onCancel : onClose} className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/78 px-4 py-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Shared Lobby Window</div>
            <div className="mt-2 text-sm text-cyan-100">{bucketLabel || 'Assigned when you start matchmaking'}</div>
          </div>
          <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/78 px-4 py-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next Rotation</div>
            <div className="mt-2 text-sm text-cyan-100">{rotationLabel || 'Every 6 hours'}</div>
          </div>
        </div>

        <label className="mt-4 grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nickname</span>
          <input
            value={playerName}
            onChange={(event) => onPlayerNameChange(event.target.value)}
            placeholder="Choose a nickname"
            disabled={isBusy}
            maxLength={ONLINE_NAME_MAX_LENGTH}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/88 px-4 py-3 text-slate-100 outline-none focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          />
          <div className="text-xs leading-5 text-slate-500">Stored only in this browser and used to derive the follow-up match room.</div>
        </label>

        <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.045] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
            {isBusy ? <RefreshCw size={15} className="animate-spin" /> : status === 'error' ? <WifiOff size={15} /> : <Users size={15} />}
            <span>{statusLabel}</span>
          </div>
          {note && <p className="mt-2 text-sm leading-5 text-slate-400">{note}</p>}
          {error && <p className="mt-2 text-sm leading-5 text-rose-300">{error}</p>}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {!isBusy && (
            <button
              onClick={primaryAction}
              disabled={!playerName.trim()}
              className="w-full min-h-[52px] rounded-2xl bg-[#38bdf8] hover:bg-[#22c7ff] disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-bold tracking-[0.04em] uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Play fill="currentColor" size={16} />
              {primaryLabel}
            </button>
          )}
          {isBusy && (
            <button
              onClick={onCancel}
              className="w-full min-h-[52px] rounded-2xl bg-[#38bdf8] hover:bg-[#22c7ff] text-slate-950 font-bold tracking-[0.04em] uppercase transition-colors flex items-center justify-center gap-2 sm:col-span-2"
            >
              <RefreshCw size={16} className="animate-spin" />
              Matchmaking...
            </button>
          )}
          <button
            onClick={isBusy ? onCancel : onClose}
            className={`w-full min-h-[52px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold tracking-[0.04em] uppercase transition-colors border border-slate-700 ${isBusy ? 'sm:col-span-2' : ''}`}
          >
            {isBusy ? 'Cancel Search' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PeerStartControls = ({
  playerName,
  opponentName,
  localReady,
  remoteReady,
  note,
  error,
  canStart,
  primaryLabel,
  onStart,
  onLeave,
  leaveLabel
}) => (
  <div className="space-y-4">
    <div className="grid gap-2 sm:grid-cols-2">
      <div className={`rounded-[1.25rem] border px-4 py-3 text-left ${localReady ? 'border-emerald-300/40 bg-emerald-500/10 text-emerald-50' : 'border-slate-700 bg-slate-900/72 text-slate-200'}`}>
        <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">You</div>
        <div className="mt-1 text-sm font-bold break-all">{playerName}</div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.16em]">{localReady ? 'Ready' : 'Waiting'}</div>
      </div>
      <div className={`rounded-[1.25rem] border px-4 py-3 text-left ${remoteReady ? 'border-cyan-300/40 bg-cyan-500/10 text-cyan-50' : 'border-slate-700 bg-slate-900/72 text-slate-200'}`}>
        <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">Opponent</div>
        <div className="mt-1 text-sm font-bold break-all">{opponentName}</div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.16em]">{remoteReady ? 'Ready' : 'Waiting'}</div>
      </div>
    </div>
    {note && (
      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-slate-300">
        {note}
      </div>
    )}
    {error && (
      <div className="rounded-[1.2rem] border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
        {error}
      </div>
    )}
    <button
      onClick={onStart}
      disabled={!canStart}
      className="w-full py-3 bg-[#38bdf8] hover:bg-[#22c7ff] disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 rounded-xl font-bold tracking-widest uppercase border border-sky-200/70 shadow-[0_0_24px_rgba(56,189,248,0.28)] transition-colors flex items-center justify-center gap-2"
    >
      {canStart ? <Play fill="currentColor" size={16} /> : <RefreshCw size={16} className="animate-spin" />}
      {primaryLabel}
    </button>
    <button onClick={onLeave} className="w-full py-3 bg-slate-900/92 hover:bg-slate-800 text-slate-100 rounded-xl font-bold tracking-widest uppercase border border-slate-600 transition-colors">
      {leaveLabel}
    </button>
  </div>
);

const PeerRoomLobbyScreen = ({
  playerName,
  opponentName,
  localReady,
  remoteReady,
  note,
  error,
  canStart,
  primaryLabel,
  onStart,
  onLeave,
  leaveLabel
}) => (
  <div className="h-dvh bg-slate-950 text-slate-100 flex items-center justify-center p-6">
    <div className="max-w-md w-full rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">
        <Wifi size={14} />
        Room Connected
      </div>
      <div className="space-y-2">
        <h1 className="font-arena-display text-4xl font-black tracking-[0.1em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400">
          Start Game
        </h1>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-400 break-all">{playerName} vs {opponentName}</p>
      </div>
      <PeerStartControls
        playerName={playerName}
        opponentName={opponentName}
        localReady={localReady}
        remoteReady={remoteReady}
        note={note}
        error={error}
        canStart={canStart}
        primaryLabel={primaryLabel}
        onStart={onStart}
        onLeave={onLeave}
        leaveLabel={leaveLabel}
      />
    </div>
  </div>
);

const HomeVariantBar = () => null;

const LandingScreen = ({
  landingBackground,
  menuScreen,
  homeVariant,
  onSelectHomeVariant,
  onBack,
  onOpenSettings,
  showMenuSettings,
  onCloseSettings,
  muted,
  onToggleMuted,
  useOfficialCards,
  onToggleOfficialCards,
  showLibrary,
  onOpenLibrary,
  onCloseLibrary,
  showQuickGameDialog,
  showFriendsDialog,
  showOnlineDialog,
  selectedDifficulty,
  menuAssetsReady,
  onQuickGameOpen,
  onQuickGameClose,
  onQuickGameStart,
  onFriendsOpen,
  onFriendsClose,
  onOnlineOpen,
  onOnlineClose,
  friendDialogMode,
  friendRole,
  friendStatus,
  friendRoomId,
  friendToken,
  friendInviteUrl,
  friendJoinRoomId,
  friendJoinToken,
  friendError,
  friendNote,
  canShareFriendInvite,
  onSelectFriendMode,
  onCreateFriendInvite,
  onShareFriendInvite,
  onCopyFriendInvite,
  onFriendJoinRoomIdChange,
  onFriendJoinTokenChange,
  onConnectFriendInvite,
  onDisconnectFriendInvite,
  onRetryFriendInvite,
  onlinePlayerName,
  onlineStatus,
  onlineError,
  onlineNote,
  onlineBucketLabel,
  onlineRotationLabel,
  onlinePendingMatch,
  onOnlinePlayerNameChange,
  onStartOnlineMatchmaking,
  onRetryOnlineMatchmaking,
  onCancelOnlineMatchmaking,
  canContinueGame,
  onContinueGame,
  onAdventureOpen,
  adventureStageNumber,
  adventureWinsCount,
  adventurePathPoints,
  isAdventureComplete,
  nextAdventureCharacter,
  adventureProgressRatio,
  availableAdventureStages,
  onStartAdventure,
  onRestartAdventure
}) => {
  const [homeRevealStep, setHomeRevealStep] = useState(menuScreen === 'home' ? 0 : 3);
  const [activePolicy, setActivePolicy] = useState(null);
  const landingRippleSurfaceRef = useRef(null);
  const landingRippleInstanceRef = useRef(null);
  const hasPlayedInitialRevealRef = useRef(menuScreen !== 'home');

  useEffect(() => {
    if (menuScreen !== 'home') {
      setHomeRevealStep(3);
      return;
    }
    if (hasPlayedInitialRevealRef.current) {
      setHomeRevealStep(3);
      return;
    }
    if (typeof window === 'undefined') {
      hasPlayedInitialRevealRef.current = true;
      setHomeRevealStep(3);
      return;
    }

    let active = true;
    let started = false;
    let titleTimer = null;
    let actionsTimer = null;
    const backgroundImage = new window.Image();

    const startReveal = () => {
      if (!active || started) return;
      started = true;
      hasPlayedInitialRevealRef.current = true;
      setHomeRevealStep(1);
      titleTimer = window.setTimeout(() => {
        if (active) setHomeRevealStep(2);
      }, 700);
      actionsTimer = window.setTimeout(() => {
        if (active) setHomeRevealStep(3);
      }, 1325);
    };

    setHomeRevealStep(0);
    backgroundImage.onload = startReveal;
    backgroundImage.onerror = startReveal;
    backgroundImage.src = landingBackground;
    if (backgroundImage.complete) startReveal();

    return () => {
      active = false;
      if (titleTimer) window.clearTimeout(titleTimer);
      if (actionsTimer) window.clearTimeout(actionsTimer);
    };
  }, [landingBackground, menuScreen]);

  const backgroundVisible = menuScreen !== 'home' || homeRevealStep >= 1;
  const titleVisible = menuScreen !== 'home' || homeRevealStep >= 2;
  const actionsVisible = menuScreen !== 'home' || (menuAssetsReady && homeRevealStep >= 3);

  useEffect(() => {
    const surface = landingRippleSurfaceRef.current;
    if (typeof window === 'undefined' || !surface || menuScreen !== 'home') return;

    const rippleSurface = $(surface);
    landingRippleInstanceRef.current = rippleSurface;

    try {
      rippleSurface.ripples({
        resolution: 256,
        perturbance: 0.015,
        dropRadius: 18,
        interactive: false,
        imageUrl: landingBackground
      });
      rippleSurface.ripples('updateSize');
    } catch (_error) {
      landingRippleInstanceRef.current = null;
      return;
    }

    return () => {
      try {
        rippleSurface.ripples('destroy');
      } catch (_error) {}
      if (landingRippleInstanceRef.current === rippleSurface) {
        landingRippleInstanceRef.current = null;
      }
    };
  }, [landingBackground, menuScreen]);

  const spawnLandingRipple = (event) => {
    if (typeof window === 'undefined') return;
    if (typeof event.button === 'number' && event.button !== 0) return;
    if (menuScreen !== 'home') return;
    if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, summary, [role="button"]')) return;

    const rippleSurface = landingRippleInstanceRef.current;
    const surface = landingRippleSurfaceRef.current;
    if (rippleSurface && surface) {
      const targetBounds = surface.getBoundingClientRect();
      const x = event.clientX - targetBounds.left;
      const y = event.clientY - targetBounds.top;
      const radius = Math.max(18, Math.min(Math.max(targetBounds.width, targetBounds.height) * 0.025, 34));
      try {
        rippleSurface.ripples('drop', x, y, radius, 0.07);
      } catch (_error) {}
    }

    AudioEngine.init();
    AudioEngine.playLandingRipple();
  };

  return (
    <div
      className={`h-dvh bg-slate-950 text-slate-100 relative overflow-x-hidden ${
        menuScreen === 'home' ? 'overflow-y-auto' : 'overflow-y-hidden'
      }`}
      onPointerDownCapture={spawnLandingRipple}
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={landingRippleSurfaceRef}
          className={`absolute inset-0 bg-center bg-cover bg-no-repeat transition-[opacity,transform,filter] duration-[1400ms] ease-out ${
            backgroundVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
          }`}
          style={{
            backgroundImage: `url(${landingBackground})`,
            filter: menuScreen === 'home'
              ? 'saturate(1.08) brightness(1.12) contrast(1.04)'
              : 'saturate(1.02) brightness(0.92)'
          }}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            backgroundVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: menuScreen === 'home'
              ? 'linear-gradient(180deg, rgba(2,6,23,0.22) 0%, rgba(2,6,23,0.42) 52%, rgba(2,6,23,0.58) 100%)'
              : 'linear-gradient(180deg, rgba(2,6,23,0.48) 0%, rgba(2,6,23,0.72) 100%)'
          }}
        />
      </div>
      <div className={`relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 ${
        menuScreen === 'home' ? 'py-6 sm:py-8' : 'flex h-full flex-col py-3 sm:py-4'
      }`}>
        {menuScreen === 'home' ? (
          <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-md flex-col sm:min-h-[calc(100dvh-6.5rem)]">
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="w-full">
                <div className={`mb-7 text-center transition-all duration-700 ease-out ${
                  titleVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-5 opacity-0 scale-[0.97]'
                }`}>
                <h1 className="font-arena-display text-4xl sm:text-5xl font-black whitespace-nowrap leading-none">
                  <span className="landing-title-shell">
                    <span aria-hidden="true" className="landing-title-glow">Forgetfull Fish</span>
                    <span aria-hidden="true" className="landing-title-core">Forgetfull Fish</span>
                    <span className="landing-title-fill">Forgetfull Fish</span>
                  </span>
                </h1>
                <p
                  className="mt-2 font-arena-display text-[0.86rem] sm:text-[0.95rem] tracking-[0.18em] text-white/90"
                  style={{
                    textShadow: '0 0 12px rgba(15,23,42,0.5), 0 0 24px rgba(15,23,42,0.28)'
                  }}
                >
                  Dandan as much as you want
                </p>
                </div>
                <div className={`transition-all duration-700 ease-out ${
                  actionsVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
                }`}>
                  <HomeMenuPanel
                    variantId={homeVariant}
                    onAdventure={onAdventureOpen}
                    onQuickGame={onQuickGameOpen}
                    onOnline={onOnlineOpen}
                    onFriends={onFriendsOpen}
                    onContinue={onContinueGame}
                    canContinue={canContinueGame}
                    onSettings={onOpenSettings}
                  />
                </div>
              </div>
            </div>
            <div className={`pb-1 pt-5 text-center text-[10px] uppercase tracking-[0.24em] text-slate-200/80 transition-all duration-700 ease-out ${
              actionsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              {APP_VERSION}
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <AdventureMenuPanel
              adventurePathPoints={adventurePathPoints}
              isAdventureComplete={isAdventureComplete}
              nextAdventureCharacter={nextAdventureCharacter}
              adventureProgressRatio={adventureProgressRatio}
              adventureWinsCount={adventureWinsCount}
              adventureStageNumber={adventureStageNumber}
              availableAdventureStages={availableAdventureStages}
              onBack={onBack}
              onStartAdventure={onStartAdventure}
              onRestartAdventure={onRestartAdventure}
            />
          </div>
        )}
      </div>

      {showLibrary && (
        <CardCollectionOverlay
          viewingZone="deck"
          official={useOfficialCards}
          onClose={onCloseLibrary}
        />
      )}

      {activePolicy && (
        <PolicyOverlay
          policyKey={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}

      {showMenuSettings && (
        <div className="absolute inset-0 z-20 flex items-start justify-center overflow-y-auto bg-[rgba(2,6,23,0.78)] p-4 backdrop-blur-sm sm:p-6">
          <div className="my-auto flex w-full max-w-md flex-col items-center text-center">
            <div className="mb-6">
              <h2
                className="font-arena-display text-3xl sm:text-[2.2rem] tracking-[0.08em] text-white"
                style={{
                  textShadow: '1px 0 0 rgba(15,23,42,0.9), -1px 0 0 rgba(15,23,42,0.9), 0 1px 0 rgba(15,23,42,0.9), 0 -1px 0 rgba(15,23,42,0.9), 0 0 18px rgba(30,41,59,0.42), 0 0 36px rgba(71,85,105,0.24)'
                }}
              >
                Settings
              </h2>
              <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-slate-200/78">
                Sound And Visuals
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2.5">
              <button
                onClick={onToggleMuted}
                className="w-full max-w-[15.75rem] min-h-[64px] rounded-full bg-slate-800/44 px-5 py-3 text-white shadow-[0_18px_36px_rgba(15,23,42,0.24)] transition-all hover:bg-slate-800/54"
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <div className="font-arena-display text-[1.18rem] tracking-[0.04em]">{muted ? 'Sound Off' : 'Sound On'}</div>
                  <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-200/72">
                    {muted ? 'Muted' : 'Enabled'}
                  </div>
                </div>
              </button>
              <button
                onClick={onToggleOfficialCards}
                className="w-full max-w-[15.75rem] min-h-[64px] rounded-full bg-slate-800/44 px-5 py-3 text-white shadow-[0_18px_36px_rgba(15,23,42,0.24)] transition-all hover:bg-slate-800/54"
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <div className="font-arena-display text-[1.18rem] tracking-[0.04em]">Card Art</div>
                  <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-200/72">
                    {useOfficialCards ? 'Sld Art' : 'Proxy'}
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  onCloseSettings();
                  onOpenLibrary();
                }}
                className="w-full max-w-[15.75rem] min-h-[64px] rounded-full bg-slate-800/44 px-5 py-3 text-white shadow-[0_18px_36px_rgba(15,23,42,0.24)] transition-all hover:bg-slate-800/54"
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <div className="font-arena-display text-[1.18rem] tracking-[0.04em]">Library</div>
                  <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-200/72">
                    Open Decklist
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  onCloseSettings();
                  setActivePolicy('privacy');
                }}
                className="w-full max-w-[15.75rem] min-h-[64px] rounded-full bg-slate-800/44 px-5 py-3 text-white shadow-[0_18px_36px_rgba(15,23,42,0.24)] transition-all hover:bg-slate-800/54"
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <div className="font-arena-display text-[1.18rem] tracking-[0.04em]">Privacy Policy</div>
                  <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-200/72">
                    Data Handling
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  onCloseSettings();
                  setActivePolicy('storage');
                }}
                className="w-full max-w-[15.75rem] min-h-[64px] rounded-full bg-slate-800/44 px-5 py-3 text-white shadow-[0_18px_36px_rgba(15,23,42,0.24)] transition-all hover:bg-slate-800/54"
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <div className="font-arena-display text-[1.18rem] tracking-[0.04em]">Cookie Policy</div>
                  <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-200/72">
                    Site Storage
                  </div>
                </div>
              </button>
              <button
                onClick={onCloseSettings}
                className="w-full max-w-[15.75rem] min-h-[56px] rounded-full bg-slate-800/44 px-5 py-3 text-white shadow-[0_18px_36px_rgba(15,23,42,0.24)] transition-all hover:bg-slate-800/54"
              >
                <div className="font-arena-display text-[1.12rem] tracking-[0.04em]">Back</div>
              </button>
            </div>
            <div className="mt-5 text-center text-[10px] uppercase tracking-[0.24em] text-slate-200/65">
              {APP_VERSION}
            </div>
          </div>
        </div>
      )}

      {showQuickGameDialog && <QuickGameDialog selectedDifficulty={selectedDifficulty} onClose={onQuickGameClose} onStart={onQuickGameStart} />}
      {showOnlineDialog && (
        <PlayOnlineDialog
          playerName={onlinePlayerName}
          status={onlineStatus}
          error={onlineError}
          note={onlineNote}
          bucketLabel={onlineBucketLabel}
          rotationLabel={onlineRotationLabel}
          pendingMatch={onlinePendingMatch}
          onClose={onOnlineClose}
          onPlayerNameChange={onOnlinePlayerNameChange}
          onStart={onStartOnlineMatchmaking}
          onRetry={onRetryOnlineMatchmaking}
          onCancel={onCancelOnlineMatchmaking}
        />
      )}
      {showFriendsDialog && (
        <PlayWithFriendsDialog
          mode={friendDialogMode}
          role={friendRole}
          status={friendStatus}
          roomId={friendRoomId}
          token={friendToken}
          inviteUrl={friendInviteUrl}
          joinRoomId={friendJoinRoomId}
          joinToken={friendJoinToken}
          error={friendError}
          note={friendNote}
          canShare={canShareFriendInvite}
          onClose={onFriendsClose}
          onSelectMode={onSelectFriendMode}
          onCreateInvite={onCreateFriendInvite}
          onShareInvite={onShareFriendInvite}
          onCopyInvite={onCopyFriendInvite}
          onJoinRoomIdChange={onFriendJoinRoomIdChange}
          onJoinTokenChange={onFriendJoinTokenChange}
          onConnect={onConnectFriendInvite}
          onDisconnect={onDisconnectFriendInvite}
          onRetry={onRetryFriendInvite}
        />
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const inviteParams = readPeerInviteParams();
  const peerSessionDraft = loadPeerSessionDraft();
  const restoredJoinRoomId = inviteParams.roomId || (peerSessionDraft?.role === 'guest' ? peerSessionDraft.roomId || '' : '');
  const restoredJoinToken = inviteParams.token || (peerSessionDraft?.role === 'guest' ? peerSessionDraft.token || '' : '');
  const [state, rawDispatch] = useReducer(gameReducer, initialState);
  const [menuMode, setMenuMode] = useState('adventure');
  const [menuScreen, setMenuScreen] = useState('home');
  const [landingBackground, setLandingBackground] = useState(() => loadLandingBackground());
  const [homeVariant, setHomeVariant] = useState('tide');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedOpponentCharacter, setSelectedOpponentCharacter] = useState(DEFAULT_AI_CHARACTER_ID);
  const [adventureWinsCount, setAdventureWinsCount] = useState(() => loadRivalProgress().adventureWinsCount);
  const [useOfficialCards, setUseOfficialCards] = useState(true);
  const [showMenuSettings, setShowMenuSettings] = useState(false);
  const [showRivalMenu, setShowRivalMenu] = useState(false);
  const [showQuickGameDialog, setShowQuickGameDialog] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [dandanCastConfirm, setDandanCastConfirm] = useState(null);
  const [dandanAttackBlockedDialog, setDandanAttackBlockedDialog] = useState(null);
  const [isBattlefieldPeekActive, setIsBattlefieldPeekActive] = useState(false);
  const [selectedStackEntryId, setSelectedStackEntryId] = useState(null);
  const [muted, setMuted] = useState(false);
  const [menuAssetsReady, setMenuAssetsReady] = useState(true);
  const [hasSavedGame, setHasSavedGame] = useState(() => Boolean(loadCurrentGameSnapshot()));
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [zoomedCard, setZoomedCard] = useState(null); 
  const [viewingZone, setViewingZone] = useState(null); 
  const [peerClock, setPeerClock] = useState(null);
  const [clockRenderNow, setClockRenderNow] = useState(() => Date.now());
  const [peerUi, setPeerUi] = useState(() => ({
    open: Boolean(inviteParams.roomId && inviteParams.token),
    mode: inviteParams.roomId && inviteParams.token ? 'join' : (peerSessionDraft?.lastMode === 'join' ? 'join' : 'host'),
    role: null,
    status: 'idle',
    playerDisplayName: '',
    opponentDisplayName: '',
    localReady: false,
    remoteReady: false,
    roomId: '',
    token: '',
    inviteUrl: '',
    joinRoomId: restoredJoinRoomId,
    joinToken: restoredJoinToken,
    error: '',
    note: inviteParams.roomId && inviteParams.token
      ? 'Invite link detected. Connect to begin.'
      : restoredJoinRoomId && restoredJoinToken
        ? 'Last friend invite restored. Reconnect when ready.'
        : ''
  }));
  const [onlineUi, setOnlineUi] = useState(() => {
    const profile = loadOnlineProfile();
    return {
      open: false,
      playerName: profile.playerName,
      status: 'idle',
      error: '',
      note: 'Enter a nickname to join the shared six-hour lobby.',
      bucketLabel: '',
      rotationLabel: '',
      pendingMatch: null
    };
  });
  const hadPersistableGameRef = useRef(false);
  const latestStateRef = useRef(state);
  const peerRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const peerReconnectTimerRef = useRef(null);
  const peerDisconnectTimerRef = useRef(null);
  const peerStartLaunchRef = useRef(false);
  const peerClockRef = useRef(null);
  const onlineLobbyPeerRef = useRef(null);
  const onlineLobbyConnectionRef = useRef(null);
  const onlineLaunchTimerRef = useRef(null);
  const onlineMatchRef = useRef({
    manualClose: false,
    role: null,
    playerName: '',
    clientId: '',
    lobbyRoomId: '',
    bucketStartMs: 0,
    bucketEndMs: 0,
    pendingMatch: null,
    launching: false
  });
  const autoJoinInviteRef = useRef(Boolean(inviteParams.roomId && inviteParams.token));
  const peerSessionRef = useRef({
    role: null,
    roomId: '',
    token: '',
    inviteUrl: '',
    clientId: '',
    guestClientId: '',
    lastConnectAttemptAt: 0,
    manualClose: false
  });
  const dispatch = (action) => {
    if (peerUi.role === 'guest' && PEER_GAME_ACTIONS.has(action?.type)) {
      const connection = peerConnectionRef.current;
      if (!connection?.open) {
        setPeerUi((current) => ({
          ...current,
          status: current.status === 'connected' ? 'reconnecting' : current.status,
          error: 'Connection lost. Waiting to reconnect before sending actions.'
        }));
        return;
      }
      if (canOptimisticallyApplyGuestAction(latestStateRef.current, action)) {
        rawDispatch(action);
      }
      connection.send({
        type: 'peer-action',
        protocol: PEER_PROTOCOL_VERSION,
        action: mapGuestActionToCanonical(action)
      });
      return;
    }
    rawDispatch(action);
  };
  const isPeerSessionActive = Boolean(peerUi.role);
  const isAiMirror = state.gameMode === 'ai_vs_ai';
  const isAdventureMatch = state.gameMode === 'adventure';
  const isPeerMatch = state.gameMode === 'peer';
  const difficultySpeed = AI_SPEED[state.difficulty] || AI_SPEED.medium;
  const adventurePreviewIndex = Math.min(adventureWinsCount, ADVENTURE_ROUTE.length - 1);
  const adventurePreviewCharacter = getAiCharacter(ADVENTURE_ROUTE[adventurePreviewIndex]) || AI_CHARACTERS[0];
  const selectedOpponent = getAiCharacter(selectedOpponentCharacter) || AI_CHARACTERS[0];
  const currentMulliganCount = isPeerMatch ? (state.peerMulligan?.counts?.player || state.mulliganCount || 0) : (state.mulliganCount || 0);
  const canShareFriendInvite = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const showPeerClock = isPeerMatch && Boolean(peerClock?.enabled);
  const displayedPlayerClockMs = showPeerClock ? getDisplayedPeerClockMs(peerClock, 'player', clockRenderNow) : null;
  const displayedOpponentClockMs = showPeerClock ? getDisplayedPeerClockMs(peerClock, 'ai', clockRenderNow) : null;
  const isPlayerClockRunning = peerClock?.runningFor === 'player';
  const isOpponentClockRunning = peerClock?.runningFor === 'ai';
  const peerOpponentName = peerUi.opponentDisplayName || 'Friend';
  const peerPlayerName = peerUi.playerDisplayName || 'You';
  const canPressPeerStartGame = peerUi.status === 'connected' && !peerUi.localReady;
  const peerStartButtonLabel = peerUi.status !== 'connected'
    ? 'Reconnecting...'
    : peerUi.localReady
      ? (peerUi.remoteReady ? 'Starting Game...' : 'Waiting For Opponent')
      : 'Start Game';
  const canPlayerAttemptAttackSelection = !isAiMirror &&
    state.turn === 'player' &&
    state.phase === 'declare_attackers' &&
    state.priority === 'player' &&
    state.player.board.some(card => card.name === DANDAN_NAME && !card.summoningSickness && !card.tapped);
  const localPendingAction = state.pendingAction && (state.pendingAction.player || 'player') === 'player'
    ? state.pendingAction
    : null;
  const localPendingTargetSelection = state.pendingTargetSelection && (state.pendingTargetSelection.player || 'player') === 'player'
    ? state.pendingTargetSelection
    : null;
  const peekablePendingActionTypes = ['DISCARD_CLEANUP', 'ACTIVATE_LAND', 'HAND_LAND_ACTION', 'MYSTIC_SANCTUARY', 'LAND_TYPE_CHOICE', 'BRAINSTORM', 'DISCARD', 'PREDICT', 'TELLING_TIME', 'HALIMAR_DEPTHS'];
  const isPeekableDialogVisible = Boolean(
    dandanCastConfirm ||
    dandanAttackBlockedDialog ||
    (localPendingAction && peekablePendingActionTypes.includes(localPendingAction.type))
  );
  const currentOpponentCharacter = isPeerMatch
    ? null
    : state.started
    ? getAiCharacter(state.aiCharacterId)
    : menuScreen === 'adventure'
      ? adventurePreviewCharacter
      : null;
  const currentPlayerAiCharacter = state.started ? getAiCharacter(state.playerAiCharacterId || null) : null;
  const opponentAvatarSrc = isPeerMatch
    ? CARDS.DANDAN.image
    : currentOpponentCharacter
    ? getCharacterPortrait(currentOpponentCharacter.id, state.difficulty || selectedDifficulty)
    : (DIFFICULTY_ART[state.difficulty || selectedDifficulty] || DIFFICULTY_ART.medium);
  const isAdventureComplete = adventureWinsCount >= ADVENTURE_ROUTE.length;
  const nextAdventureIndex = Math.min(adventureWinsCount, ADVENTURE_ROUTE.length - 1);
  const nextAdventureCharacter = getAiCharacter(ADVENTURE_ROUTE[nextAdventureIndex]) || AI_CHARACTERS[0];
  const adventureProgressRatio = Math.min(adventureWinsCount / ADVENTURE_ROUTE.length, 1);
  const adventureStageNumber = Math.min(adventureWinsCount + 1, ADVENTURE_ROUTE.length);
  const availableAdventureStages = isAdventureComplete ? ADVENTURE_ROUTE.length : Math.min(adventureWinsCount + 1, ADVENTURE_ROUTE.length);
  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);
  useEffect(() => {
    peerClockRef.current = peerClock;
  }, [peerClock]);
  useEffect(() => { AudioEngine.muted = muted; }, [muted]);
  useEffect(() => { saveRivalProgress(adventureWinsCount); }, [adventureWinsCount]);
  useEffect(() => { saveOnlineProfile({ playerName: onlineUi.playerName }); }, [onlineUi.playerName]);
  useEffect(() => {
    if (!isPeekableDialogVisible && isBattlefieldPeekActive) {
      setIsBattlefieldPeekActive(false);
    }
  }, [isPeekableDialogVisible, isBattlefieldPeekActive]);
  useEffect(() => {
    setSelectedStackEntryId(currentSelectedId => (
      currentSelectedId && state.stack.some(entry => entry.card?.id === currentSelectedId)
        ? currentSelectedId
        : null
    ));
  }, [state.stack]);
  useEffect(() => {
    const hasPersistableGame = state.started && !state.winner && state.gameMode !== 'peer';

    if (hasPersistableGame) {
      saveCurrentGameSnapshot(state);
      setHasSavedGame(true);
    } else if (hadPersistableGameRef.current) {
      clearCurrentGameSnapshot();
      setHasSavedGame(false);
    }

    hadPersistableGameRef.current = hasPersistableGame;
  }, [state]);
  useEffect(() => {
    preloadImageUrls(APP_PRELOAD_URLS);
  }, []);
  useEffect(() => {
    if (state.gameMode !== 'peer' || !state.started) {
      peerClockRef.current = null;
      setPeerClock(null);
      return;
    }
    if (peerUi.role === 'host') {
      const now = Date.now();
      const nextClock = syncPeerClockWithState(peerClockRef.current || createPeerClockState(now), state, now);
      peerClockRef.current = nextClock;
      setPeerClock(nextClock);
    }
  }, [state.started, state.gameMode, state.winner, state.turn, state.priority, state.phase, state.stackResolving, state.pendingAction, state.pendingTargetSelection, peerUi.role]);
  useEffect(() => {
    if (!showPeerClock || !state.started || state.winner) {
      setClockRenderNow(Date.now());
      return;
    }
    const timer = window.setInterval(() => {
      setClockRenderNow(Date.now());
    }, 200);
    return () => window.clearInterval(timer);
  }, [showPeerClock, state.started, state.winner]);
  useEffect(() => {
    if (peerUi.role !== 'host' || state.gameMode !== 'peer' || !state.started || state.winner) return;
    const timer = window.setInterval(() => {
      const currentClock = peerClockRef.current;
      const currentState = latestStateRef.current;
      if (!currentClock?.runningFor || currentState?.winner || currentState?.gameMode !== 'peer') return;
      const expiredSeat = currentClock.runningFor;
      const remainingMs = getDisplayedPeerClockMs(currentClock, expiredSeat, Date.now());
      if (remainingMs > 0) return;
      const now = Date.now();
      const settledClock = settlePeerClock(currentClock, now);
      const nextClock = {
        ...settledClock,
        remainingMs: {
          ...settledClock.remainingMs,
          [expiredSeat]: 0
        },
        runningFor: null,
        lastStartedAt: null,
        updatedAt: now
      };
      peerClockRef.current = nextClock;
      setPeerClock(nextClock);
      rawDispatch({ type: 'CLOCK_EXPIRE', player: expiredSeat });
    }, 200);
    return () => window.clearInterval(timer);
  }, [peerUi.role, state.gameMode, state.started, state.winner]);
  useEffect(() => {
    if (peerUi.role !== 'host' || state.gameMode !== 'peer') return;
    pushPeerStateSync(state);
  }, [state, peerUi.role]);
  useEffect(() => {
    const shouldStartPeerRoom = peerUi.role === 'host'
      && peerUi.status === 'connected'
      && peerUi.localReady
      && peerUi.remoteReady
      && (state.gameMode !== 'peer' || !state.started || Boolean(state.winner));
    if (!shouldStartPeerRoom) {
      peerStartLaunchRef.current = false;
      return;
    }
    if (peerStartLaunchRef.current) return;
    peerStartLaunchRef.current = true;
    startPeerGameFromRoom();
  }, [peerUi.role, peerUi.status, peerUi.localReady, peerUi.remoteReady, state.gameMode, state.started, state.winner]);
  useEffect(() => {
    if (state.gameMode !== 'peer' || !state.started || state.winner) return;
    updatePeerUi((current) => (
      current.localReady || current.remoteReady
        ? { ...current, localReady: false, remoteReady: false, error: '' }
        : current
    ));
  }, [state.gameMode, state.started, state.winner]);
  useEffect(() => {
    if (state.gameMode !== 'peer' || !state.winner) return;
    updatePeerUi((current) => ({
      ...current,
      localReady: false,
      remoteReady: false,
      error: '',
      note: 'Match finished. Both players need to press Start Game for a rematch.'
    }));
  }, [state.gameMode, state.winner]);
  useEffect(() => {
    if (state.gameMode !== 'peer' || peerUi.role) return;
    peerClockRef.current = null;
    setPeerClock(null);
  }, [state.gameMode, peerUi.role]);
  useEffect(() => {
    if (!autoJoinInviteRef.current) return;
    if (!peerUi.open || peerUi.mode !== 'join' || peerUi.role || peerUi.status !== 'idle') return;
    if (!peerUi.joinRoomId || !peerUi.joinToken) return;
    autoJoinInviteRef.current = false;
    const timer = window.setTimeout(() => {
      startGuestConnection();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [peerUi.open, peerUi.mode, peerUi.role, peerUi.status, peerUi.joinRoomId, peerUi.joinToken]);
  useEffect(() => {
    if (onlineUi.status !== 'launching') return;
    setOnlineUi((current) => {
      if (current.status !== 'launching') return current;
      if (peerUi.status === 'connected') {
        return {
          ...current,
          open: false,
          status: 'idle',
          error: '',
          note: current.pendingMatch?.opponentName
            ? `Connected with ${current.pendingMatch.opponentName}.`
            : 'Peer match connected.',
          bucketLabel: '',
          rotationLabel: '',
          pendingMatch: null
        };
      }
      if (peerUi.status === 'error') {
        const nextError = peerUi.error || 'Unable to open the matched room.';
        const nextNote = peerUi.note || current.note;
        if (current.error === nextError && current.note === nextNote && current.status === 'error') {
          return current;
        }
        return {
          ...current,
          status: 'error',
          error: nextError,
          note: nextNote
        };
      }
      if (peerUi.note && (current.note !== peerUi.note || current.error)) {
        return {
          ...current,
          error: '',
          note: peerUi.note
        };
      }
      return current;
    });
  }, [onlineUi.status, peerUi.status, peerUi.note, peerUi.error]);
  useEffect(() => () => {
    peerSessionRef.current.manualClose = true;
    if (peerReconnectTimerRef.current) window.clearTimeout(peerReconnectTimerRef.current);
    if (peerDisconnectTimerRef.current) window.clearTimeout(peerDisconnectTimerRef.current);
    try { peerConnectionRef.current?.close(); } catch (_error) {}
    try { peerRef.current?.destroy(); } catch (_error) {}
    clearOnlineLaunchTimer();
    onlineMatchRef.current.manualClose = true;
    try { onlineLobbyConnectionRef.current?.close(); } catch (_error) {}
    try { onlineLobbyPeerRef.current?.destroy(); } catch (_error) {}
  }, []);

  const refreshLandingBackground = () => {
    setLandingBackground((previousBackground) => {
      const nextBackground = getRandomLandingBackground(previousBackground);
      storeLandingBackground(nextBackground);
      return nextBackground;
    });
  };

  const updatePeerUi = (updates) => {
    setPeerUi((current) => ({
      ...current,
      ...(typeof updates === 'function' ? updates(current) : updates)
    }));
  };

  const buildPeerStartNote = (current) => {
    if (current.status === 'reconnecting') {
      return 'Connection dropped. Waiting for the room to recover before you can start.';
    }
    if (current.localReady && current.remoteReady) {
      return 'Both players are ready. Starting the game...';
    }
    if (current.localReady) {
      return `Waiting for ${current.opponentDisplayName || 'your opponent'} to press Start Game.`;
    }
    if (current.remoteReady) {
      return `${current.opponentDisplayName || 'Your opponent'} is ready. Press Start Game when you are.`;
    }
    return 'Both players need to press Start Game.';
  };

  function startPeerGameFromRoom() {
    const currentState = latestStateRef.current;
    const nextDifficulty = currentState?.difficulty || selectedDifficulty;
    updatePeerUi((current) => ({
      ...current,
      localReady: false,
      remoteReady: false,
      error: '',
      note: 'Both players are ready. Starting the game...'
    }));
    rawDispatch({
      type: 'START_GAME',
      mode: 'peer',
      difficulty: nextDifficulty
    });
    if (peerUi.role === 'host') {
      window.setTimeout(() => {
        const connection = peerConnectionRef.current;
        if (connection?.open) {
          try {
            connection.send({
              type: 'peer-start-game',
              protocol: PEER_PROTOCOL_VERSION,
              difficulty: nextDifficulty
            });
          } catch (_error) {}
        }
        pushPeerStateSync(latestStateRef.current);
      }, 60);
      window.setTimeout(() => {
        pushPeerStateSync(latestStateRef.current);
      }, 220);
    }
  }

  const handlePeerStartGame = () => {
    AudioEngine.init();
    const connection = peerConnectionRef.current;
    if (!connection?.open || peerUi.status !== 'connected' || peerUi.localReady) return;

    updatePeerUi((current) => {
      return {
        ...current,
        localReady: true,
        error: '',
        note: buildPeerStartNote({
          ...current,
          localReady: true
        })
      };
    });

    try {
      connection.send({
        type: 'peer-ready',
        protocol: PEER_PROTOCOL_VERSION,
        ready: true
      });
    } catch (_error) {}

  };

  const clearPeerTimers = () => {
    if (peerReconnectTimerRef.current) {
      window.clearTimeout(peerReconnectTimerRef.current);
      peerReconnectTimerRef.current = null;
    }
    if (peerDisconnectTimerRef.current) {
      window.clearTimeout(peerDisconnectTimerRef.current);
      peerDisconnectTimerRef.current = null;
    }
  };

  const pushPeerStateSync = (sourceState = latestStateRef.current) => {
    const connection = peerConnectionRef.current;
    if (!connection?.open || sourceState.gameMode !== 'peer') return;
    connection.send({
      type: 'state-sync',
      protocol: PEER_PROTOCOL_VERSION,
      state: buildPeerGuestViewState(sourceState),
      clock: buildPeerGuestClockState(peerClockRef.current),
      sentAt: Date.now()
    });
  };

  const disconnectPeerSession = ({ notifyRemote = false, resetGame = false, keepDialog = false, note = '', preserveJoinFields = true } = {}) => {
    peerSessionRef.current.manualClose = true;
    clearPeerTimers();

    const connection = peerConnectionRef.current;
    if (notifyRemote && connection?.open) {
      try {
        connection.send({ type: 'session-ended', protocol: PEER_PROTOCOL_VERSION, reason: note || 'Host closed the room.' });
      } catch (_error) {}
    }
    if (connection) {
      try { connection.close(); } catch (_error) {}
    }

    const peer = peerRef.current;
    if (peer) {
      try { peer.destroy(); } catch (_error) {}
    }

    peerConnectionRef.current = null;
    peerRef.current = null;
    peerClockRef.current = null;
    setPeerClock(null);
    savePeerSessionDraft(null);

    if (resetGame) {
      rawDispatch({ type: 'RETURN_TO_MENU' });
    }

    updatePeerUi((current) => ({
      open: keepDialog,
      mode: current.mode,
      role: null,
      status: 'idle',
      playerDisplayName: '',
      opponentDisplayName: '',
      localReady: false,
      remoteReady: false,
      roomId: '',
      token: '',
      inviteUrl: '',
      joinRoomId: preserveJoinFields ? current.joinRoomId : '',
      joinToken: preserveJoinFields ? current.joinToken : '',
      error: '',
      note
    }));
    peerSessionRef.current = {
      role: null,
      roomId: '',
      token: '',
      inviteUrl: '',
      clientId: '',
      guestClientId: '',
      lastConnectAttemptAt: 0,
      manualClose: true
    };
  };

  const updateOnlineUi = (updates) => {
    setOnlineUi((current) => ({
      ...current,
      ...(typeof updates === 'function' ? updates(current) : updates)
    }));
  };

  const clearOnlineLaunchTimer = () => {
    if (onlineLaunchTimerRef.current) {
      window.clearTimeout(onlineLaunchTimerRef.current);
      onlineLaunchTimerRef.current = null;
    }
  };

  const clearOnlineMatchmakingResources = ({ preservePendingMatch = true } = {}) => {
    onlineMatchRef.current.manualClose = true;
    clearOnlineLaunchTimer();

    const connection = onlineLobbyConnectionRef.current;
    if (connection) {
      try { connection.close(); } catch (_error) {}
    }

    const peer = onlineLobbyPeerRef.current;
    if (peer) {
      try { peer.destroy(); } catch (_error) {}
    }

    const pendingMatch = preservePendingMatch ? onlineMatchRef.current.pendingMatch : null;
    onlineLobbyConnectionRef.current = null;
    onlineLobbyPeerRef.current = null;
    onlineMatchRef.current = {
      manualClose: true,
      role: null,
      playerName: '',
      clientId: '',
      lobbyRoomId: '',
      bucketStartMs: 0,
      bucketEndMs: 0,
      pendingMatch,
      launching: false
    };
  };

  const disconnectOnlineMatchmaking = ({ keepDialog = false, note = 'Enter a nickname to join the shared six-hour lobby.', preservePendingMatch = false } = {}) => {
    clearOnlineMatchmakingResources({ preservePendingMatch });
    updateOnlineUi((current) => ({
      ...current,
      open: keepDialog,
      status: 'idle',
      error: '',
      note,
      bucketLabel: preservePendingMatch ? current.bucketLabel : '',
      rotationLabel: preservePendingMatch ? current.rotationLabel : '',
      pendingMatch: preservePendingMatch ? current.pendingMatch : null
    }));
  };

  const sendOnlineLobbyMessageAndClose = (connection, message) => {
    const sendAndClose = () => {
      try { connection.send(message); } catch (_error) {}
      try { connection.close(); } catch (_error) {}
    };

    if (connection?.open) {
      sendAndClose();
      return;
    }

    connection?.on('open', sendAndClose);
  };

  const launchOnlineMatchRoom = (matchSession) => {
    if (!matchSession?.roomId || !matchSession?.token) return;
    clearOnlineMatchmakingResources({ preservePendingMatch: true });
    updateOnlineUi((current) => ({
      ...current,
      open: true,
      status: 'launching',
      error: '',
      note: `Matched with ${matchSession.opponentName}. Opening the match room...`,
      pendingMatch: matchSession
    }));

    if (matchSession.role === 'host') {
      startHostInvite({
        autoShare: false,
        roomId: matchSession.roomId,
        token: matchSession.token,
        openDialog: false,
        playerDisplayName: matchSession.playerName || '',
        opponentDisplayName: matchSession.opponentName || '',
        noteOverrides: {
          creating: `Matched with ${matchSession.opponentName}. Opening the match room...`,
          waiting: `Match room ready. Waiting for ${matchSession.opponentName}...`,
          reconnecting: 'Lost contact with the signaling server. Retrying...',
          error: 'Unable to open the matched room.'
        }
      });
      return;
    }

    startGuestConnection({
      roomId: matchSession.roomId,
      token: matchSession.token,
      openDialog: false,
      playerDisplayName: matchSession.playerName || '',
      opponentDisplayName: matchSession.opponentName || '',
      noteOverrides: {
        connecting: `Matched with ${matchSession.opponentName}. Joining the match room...`,
        reconnecting: 'Signal lost. Retrying the matched room...',
        error: 'Unable to join the matched room.'
      }
    });
  };

  const startOnlineLobbyAsGuest = ({ safeName, bucketInfo }) => {
    const clientId = generatePeerToken('online');
    const peer = new Peer(clientId, getPeerClientOptions());
    onlineLobbyPeerRef.current = peer;

    peer.on('open', () => {
      if (onlineMatchRef.current.manualClose) return;
      onlineMatchRef.current = {
        ...onlineMatchRef.current,
        role: 'guest',
        playerName: safeName,
        clientId
      };
      updateOnlineUi({
        status: 'starting',
        error: '',
        note: 'Joining the shared lobby...'
      });

      const connection = peer.connect(bucketInfo.lobbyRoomId, {
        reliable: true,
        metadata: {
          protocol: ONLINE_PROTOCOL_VERSION,
          clientId,
          playerName: safeName,
          type: 'online-lobby'
        }
      });

      onlineLobbyConnectionRef.current = connection;

      connection.on('open', () => {
        if (onlineMatchRef.current.manualClose) return;
        updateOnlineUi({
          status: 'waiting',
          error: '',
          note: `Ready in the shared lobby. Window started ${bucketInfo.bucketLabel}.`
        });
        connection.send({
          type: 'online-ready',
          protocol: ONLINE_PROTOCOL_VERSION,
          clientId,
          playerName: safeName,
          bucketStartMs: bucketInfo.bucketStartMs
        });
      });

      connection.on('data', (message) => {
        if (!message || typeof message !== 'object' || message.protocol !== ONLINE_PROTOCOL_VERSION) return;
        if (message.type === 'online-lobby-busy') {
          updateOnlineUi({
            status: 'error',
            error: message.reason || 'This shared lobby is pairing another match right now.',
            note: 'Wait a moment, then try matchmaking again.'
          });
          return;
        }
        if (message.type === 'online-match-found' && message.roomId && message.token) {
          AudioEngine.init();
          AudioEngine.playMatchFound();
          const matchSession = {
            roomId: message.roomId,
            token: message.token,
            role: getOnlineMatchRole(message, clientId),
            playerName: safeName,
            opponentName: getOnlineMatchOpponent(message, clientId),
            bucketLabel: bucketInfo.bucketLabel
          };
          onlineMatchRef.current = {
            ...onlineMatchRef.current,
            pendingMatch: matchSession,
            launching: true
          };
          updateOnlineUi({
            status: 'matched',
            error: '',
            note: `Matched with ${matchSession.opponentName}. Opening the match room...`,
            pendingMatch: matchSession
          });
          launchOnlineMatchRoom(matchSession);
        }
      });

      connection.on('close', () => {
        if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
        onlineLobbyConnectionRef.current = null;
        updateOnlineUi({
          status: 'error',
          error: 'The shared lobby closed before a match was assigned.',
          note: 'Start matchmaking again to rejoin this six-hour window.'
        });
      });

      connection.on('error', () => {
        if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
        onlineLobbyConnectionRef.current = null;
        updateOnlineUi({
          status: 'error',
          error: 'Unable to stay connected to the shared lobby.',
          note: 'Start matchmaking again to retry.'
        });
      });
    });

    peer.on('disconnected', () => {
      if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
      updateOnlineUi({
        status: 'error',
        error: 'Signal lost while joining the shared lobby.',
        note: 'Start matchmaking again to retry.'
      });
    });

    peer.on('error', (error) => {
      if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
      updateOnlineUi({
        status: 'error',
        error: error?.message || 'Unable to join the shared lobby.',
        note: 'Check the PeerJS configuration and try again.'
      });
    });
  };

  const beginOnlineMatchmaking = async () => {
    AudioEngine.init();
    const safeName = sanitizeOnlinePlayerName(onlineUi.playerName);
    if (!safeName) {
      updateOnlineUi({
        open: true,
        status: 'error',
        error: 'Enter a nickname before starting matchmaking.',
        note: 'Your nickname is used to derive the follow-up match room.'
      });
      return;
    }

    saveOnlineProfile({ playerName: safeName });
    clearOnlineMatchmakingResources({ preservePendingMatch: false });

    const bucketInfo = getOnlineBucketInfo();
    onlineMatchRef.current = {
      manualClose: false,
      role: null,
      playerName: safeName,
      clientId: '',
      lobbyRoomId: bucketInfo.lobbyRoomId,
      bucketStartMs: bucketInfo.bucketStartMs,
      bucketEndMs: bucketInfo.bucketEndMs,
      pendingMatch: null,
      launching: false
    };

    updateOnlineUi({
      open: true,
      playerName: safeName,
      status: 'starting',
      error: '',
      note: 'Opening the shared lobby...',
      bucketLabel: bucketInfo.bucketLabel,
      rotationLabel: bucketInfo.rotationLabel,
      pendingMatch: null
    });

    const peer = new Peer(bucketInfo.lobbyRoomId, getPeerClientOptions());
    onlineLobbyPeerRef.current = peer;

    peer.on('open', () => {
      if (onlineMatchRef.current.manualClose) return;
      onlineMatchRef.current = {
        ...onlineMatchRef.current,
        role: 'host',
        clientId: bucketInfo.lobbyRoomId
      };
      updateOnlineUi({
        status: 'waiting',
        error: '',
        note: `Lobby open. Waiting for another ready player in the window that started ${bucketInfo.bucketLabel}.`
      });
    });

    peer.on('connection', (connection) => {
      if (onlineMatchRef.current.manualClose) {
        sendOnlineLobbyMessageAndClose(connection, {
          type: 'online-lobby-busy',
          protocol: ONLINE_PROTOCOL_VERSION,
          reason: 'This shared lobby is shutting down.'
        });
        return;
      }

      if (onlineMatchRef.current.launching || (onlineLobbyConnectionRef.current && onlineLobbyConnectionRef.current !== connection)) {
        sendOnlineLobbyMessageAndClose(connection, {
          type: 'online-lobby-busy',
          protocol: ONLINE_PROTOCOL_VERSION,
          reason: 'This shared lobby is already pairing another player.'
        });
        return;
      }

      onlineLobbyConnectionRef.current = connection;

      connection.on('data', async (message) => {
        if (!message || typeof message !== 'object' || message.protocol !== ONLINE_PROTOCOL_VERSION || message.type !== 'online-ready') return;
        const guestName = sanitizeOnlinePlayerName(message.playerName || connection.metadata?.playerName || '');
        const guestClientId = message.clientId || connection.metadata?.clientId || connection.peer;

        if (!guestName || !guestClientId) {
          sendOnlineLobbyMessageAndClose(connection, {
            type: 'online-lobby-busy',
            protocol: ONLINE_PROTOCOL_VERSION,
            reason: 'The incoming matchmaking payload was incomplete.'
          });
          onlineLobbyConnectionRef.current = null;
          return;
        }

        const descriptor = await buildOnlineMatchDescriptor({
          bucketStartMs: bucketInfo.bucketStartMs,
          players: [
            {
              clientId: bucketInfo.lobbyRoomId,
              name: safeName
            },
            {
              clientId: guestClientId,
              name: guestName
            }
          ]
        });

        if (onlineMatchRef.current.manualClose) return;

        const matchSession = {
          roomId: descriptor.roomId,
          token: descriptor.token,
          role: getOnlineMatchRole(descriptor, bucketInfo.lobbyRoomId),
          playerName: safeName,
          opponentName: getOnlineMatchOpponent(descriptor, bucketInfo.lobbyRoomId),
          bucketLabel: bucketInfo.bucketLabel
        };

        AudioEngine.init();
        AudioEngine.playMatchFound();
        onlineMatchRef.current = {
          ...onlineMatchRef.current,
          pendingMatch: matchSession,
          launching: true
        };

        updateOnlineUi({
          status: 'matched',
          error: '',
          note: `Matched with ${matchSession.opponentName}. Opening the match room...`,
          pendingMatch: matchSession
        });

        try {
          connection.send(descriptor);
        } catch (_error) {}

        clearOnlineLaunchTimer();
        onlineLaunchTimerRef.current = window.setTimeout(() => {
          launchOnlineMatchRoom(matchSession);
        }, 280);
      });

      connection.on('close', () => {
        if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
        onlineLobbyConnectionRef.current = null;
        updateOnlineUi((current) => (
          current.status === 'waiting'
            ? { ...current, note: 'A player left the shared lobby. Waiting for another ready player...' }
            : current
        ));
      });

      connection.on('error', () => {
        if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
        onlineLobbyConnectionRef.current = null;
        updateOnlineUi({
          status: 'error',
          error: 'The shared lobby connection broke before the match room was assigned.',
          note: 'Start matchmaking again to retry.'
        });
      });
    });

    peer.on('disconnected', () => {
      if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
      updateOnlineUi({
        status: 'error',
        error: 'The shared lobby lost its signal.',
        note: 'Start matchmaking again to reopen the current six-hour room.'
      });
    });

    peer.on('error', (error) => {
      if (onlineMatchRef.current.manualClose || onlineMatchRef.current.launching) return;
      if (isUnavailablePeerIdError(error)) {
        try { peer.destroy(); } catch (_error) {}
        if (onlineLobbyPeerRef.current === peer) {
          onlineLobbyPeerRef.current = null;
        }
        startOnlineLobbyAsGuest({ safeName, bucketInfo });
        return;
      }

      updateOnlineUi({
        status: 'error',
        error: error?.message || 'Unable to open the shared lobby.',
        note: 'Check the PeerJS configuration and try again.'
      });
    });
  };

  const connectGuestDataChannel = ({ openDialog = true, noteOverrides = {} } = {}) => {
    const peer = peerRef.current;
    const { roomId, token, clientId } = peerSessionRef.current;
    if (!peer || !roomId || !token) return;
    if (peerConnectionRef.current?.open) return;

    const connection = peer.connect(roomId, {
      reliable: true,
      metadata: {
        protocol: PEER_PROTOCOL_VERSION,
        token,
        clientId
      }
    });

    peerConnectionRef.current = connection;

    connection.on('open', () => {
      updatePeerUi({
        role: 'guest',
        status: 'connecting',
        error: '',
        note: noteOverrides.connectedToRoom || 'Connected to the room. Waiting for the host to sync the match...'
      });
      connection.send({
        type: 'hello',
        protocol: PEER_PROTOCOL_VERSION,
        token,
        clientId
      });
    });

    connection.on('data', (message) => {
      if (!message || typeof message !== 'object') return;
      if (message.protocol && message.protocol !== PEER_PROTOCOL_VERSION) {
        updatePeerUi({
          open: openDialog,
          mode: 'join',
          role: 'guest',
          status: 'error',
          error: 'Invite version mismatch. Ask your friend to refresh and create a new invite.',
          note: 'This link was created by an incompatible build.'
        });
        return;
      }
      if (message.type === 'session-accepted') {
        updatePeerUi((current) => ({
          ...current,
          open: false,
          role: 'guest',
          status: 'connected',
          localReady: false,
          remoteReady: false,
          error: '',
          note: noteOverrides.connected || 'Friend connected. Both players need to press Start Game.'
        }));
        savePeerSessionDraft({
          lastMode: 'join',
          role: 'guest',
          roomId: peerSessionRef.current.roomId,
          token: peerSessionRef.current.token,
          clientId: peerSessionRef.current.clientId
        });
        return;
      }
      if (message.type === 'state-sync' && message.state) {
        rawDispatch({ type: 'HYDRATE_PEER_STATE', state: inflatePeerGuestViewState(message.state) });
        peerClockRef.current = message.clock || null;
        setPeerClock(message.clock || null);
        updatePeerUi({
          open: false,
          role: 'guest',
          status: 'connected',
          localReady: false,
          remoteReady: false,
          error: '',
          note: noteOverrides.connected || 'Friend match connected.'
        });
        savePeerSessionDraft({
          lastMode: 'join',
          role: 'guest',
          roomId: peerSessionRef.current.roomId,
          token: peerSessionRef.current.token,
          clientId: peerSessionRef.current.clientId
        });
        return;
      }
      if (message.type === 'peer-start-game') {
        updatePeerUi((current) => ({
          ...current,
          open: false,
          role: 'guest',
          status: 'connected',
          localReady: false,
          remoteReady: false,
          error: '',
          note: 'Both players are ready. Starting the game...'
        }));
        const currentState = latestStateRef.current;
        if (currentState?.gameMode !== 'peer' || !currentState?.started || currentState?.winner) {
          rawDispatch({
            type: 'START_GAME',
            mode: 'peer',
            difficulty: message.difficulty || currentState?.difficulty || selectedDifficulty
          });
        }
        return;
      }
      if (message.type === 'session-ended') {
        disconnectPeerSession({
          notifyRemote: false,
          resetGame: true,
          keepDialog: true,
          note: message.reason || 'The host closed the room.'
        });
        return;
      }
      if (message.type === 'session-rejected') {
        disconnectPeerSession({
          notifyRemote: false,
          resetGame: false,
          keepDialog: true,
          note: '',
          preserveJoinFields: true
        });
        updatePeerUi({
          open: true,
          mode: 'join',
          status: 'error',
          error: message.reason || 'The host rejected this invite.',
          note: 'Check the link or ask your friend to create a new invite.'
        });
        return;
      }
      if (message.type === 'peer-error') {
        updatePeerUi({
          status: 'error',
          error: message.reason || 'The host rejected the last action.',
          note: 'The match is still open.'
        });
        return;
      }
      if (message.type === 'peer-ready') {
        updatePeerUi((current) => ({
          ...current,
          remoteReady: Boolean(message.ready),
          note: buildPeerStartNote({
            ...current,
            remoteReady: Boolean(message.ready)
          })
        }));
      }
    });

    connection.on('close', () => {
      if (peerSessionRef.current.manualClose) return;
      clearPeerTimers();
      peerConnectionRef.current = null;
      updatePeerUi({
        role: 'guest',
        status: 'reconnecting',
        localReady: false,
        remoteReady: false,
        error: '',
        note: noteOverrides.reconnecting || 'Connection dropped. Trying to rejoin the room...'
      });
      peerReconnectTimerRef.current = window.setTimeout(() => {
        if (peerRef.current?.disconnected) {
          try { peerRef.current.reconnect(); } catch (_error) {}
        }
        connectGuestDataChannel({ openDialog, noteOverrides });
      }, PEER_RECONNECT_DELAY_MS);
    });

    connection.on('error', () => {
      if (peerSessionRef.current.manualClose) return;
      clearPeerTimers();
      peerConnectionRef.current = null;
      updatePeerUi({
        role: 'guest',
        status: 'reconnecting',
        localReady: false,
        remoteReady: false,
        error: '',
        note: noteOverrides.reconnecting || 'Signal error. Trying to reconnect...'
      });
      peerReconnectTimerRef.current = window.setTimeout(() => {
        if (peerRef.current?.disconnected) {
          try { peerRef.current.reconnect(); } catch (_error) {}
        }
        connectGuestDataChannel({ openDialog, noteOverrides });
      }, PEER_RECONNECT_DELAY_MS);
    });
  };

  const startHostInvite = async ({
    autoShare = true,
    roomId: roomIdOverride = '',
    token: tokenOverride = '',
    openDialog = true,
    playerDisplayName = '',
    opponentDisplayName = '',
    noteOverrides = {}
  } = {}) => {
    disconnectPeerSession({ notifyRemote: false, resetGame: false, keepDialog: false, preserveJoinFields: true });

    const roomId = roomIdOverride || generatePeerToken('room');
    const token = tokenOverride || generatePeerToken('key');
    const inviteUrl = buildPeerInviteUrl(roomId, token);

    peerSessionRef.current = {
      role: 'host',
      roomId,
      token,
      inviteUrl,
      clientId: roomId,
      guestClientId: '',
      lastConnectAttemptAt: Date.now(),
      manualClose: false
    };

    updatePeerUi({
      open: openDialog,
      mode: 'host',
      role: 'host',
      status: 'creating',
      playerDisplayName,
      opponentDisplayName,
      localReady: false,
      remoteReady: false,
      roomId,
      token,
      inviteUrl,
      error: '',
      note: noteOverrides.creating || 'Opening your room and preparing the share link...'
    });

    const peer = new Peer(roomId, getPeerClientOptions());
    peerRef.current = peer;

    peer.on('open', async () => {
      updatePeerUi({
        role: 'host',
        status: 'waiting',
        roomId,
        token,
        inviteUrl,
        error: '',
        note: noteOverrides.waiting || 'Invite ready. Share the link and keep this page open.'
      });
      savePeerSessionDraft({ lastMode: 'host', roomId, token, inviteUrl });
      if (autoShare && canShareFriendInvite) {
        try {
          await navigator.share(buildPeerSharePayload(roomId, token, inviteUrl));
          updatePeerUi((current) => (
            current.role === 'host' && current.roomId === roomId
              ? { ...current, note: noteOverrides.shared || 'Invite shared. Waiting for your friend to connect.' }
              : current
          ));
        } catch (_error) {}
      }
    });

    peer.on('connection', (connection) => {
      const metadataToken = connection.metadata?.token;
      const guestClientId = connection.metadata?.clientId || '';
      if (metadataToken !== peerSessionRef.current.token) {
        connection.on('open', () => {
          try {
            connection.send({ type: 'session-rejected', protocol: PEER_PROTOCOL_VERSION, reason: 'Invalid invite key.' });
          } catch (_error) {}
          connection.close();
        });
        return;
      }
      if (peerSessionRef.current.guestClientId && guestClientId && peerSessionRef.current.guestClientId !== guestClientId && peerConnectionRef.current?.open) {
        connection.on('open', () => {
          try {
            connection.send({ type: 'session-rejected', protocol: PEER_PROTOCOL_VERSION, reason: 'This room is already occupied.' });
          } catch (_error) {}
          connection.close();
        });
        return;
      }

      clearPeerTimers();
      peerSessionRef.current.guestClientId = guestClientId;

      if (peerConnectionRef.current && peerConnectionRef.current !== connection) {
        try { peerConnectionRef.current.close(); } catch (_error) {}
      }
      peerConnectionRef.current = connection;

      connection.on('open', () => {
        updatePeerUi({
          open: false,
          role: 'host',
          status: 'connected',
          localReady: false,
          remoteReady: false,
          error: '',
          note: noteOverrides.connected || 'Friend connected. Both players need to press Start Game.'
        });
        try {
          connection.send({ type: 'session-accepted', protocol: PEER_PROTOCOL_VERSION });
        } catch (_error) {}
        const currentState = latestStateRef.current;
        if (currentState.started && currentState.gameMode === 'peer' && !currentState.winner) {
          pushPeerStateSync(currentState);
        }
      });

      connection.on('data', (message) => {
        if (!message || typeof message !== 'object') return;
        if (message.protocol !== PEER_PROTOCOL_VERSION) {
          try {
            connection.send({ type: 'session-rejected', protocol: PEER_PROTOCOL_VERSION, reason: 'Invite version mismatch.' });
          } catch (_error) {}
          connection.close();
          return;
        }
        if (message.type === 'hello') {
          pushPeerStateSync(latestStateRef.current);
          return;
        }
        if (message.type === 'peer-ready') {
          updatePeerUi((current) => {
            return {
              ...current,
              remoteReady: Boolean(message.ready),
              note: buildPeerStartNote({
                ...current,
                remoteReady: Boolean(message.ready)
              })
            };
          });
          return;
        }
        if (message.type === 'peer-action' && message.action) {
          if (canApplyGuestPeerAction(latestStateRef.current, message.action)) {
            rawDispatch(message.action);
          } else {
            try {
              connection.send({ type: 'peer-error', protocol: PEER_PROTOCOL_VERSION, reason: 'Rejected an invalid action.' });
            } catch (_error) {}
          }
        }
      });

      connection.on('close', () => {
        if (peerSessionRef.current.manualClose) return;
        clearPeerTimers();
        peerConnectionRef.current = null;
        updatePeerUi({
          role: 'host',
          status: 'reconnecting',
          localReady: false,
          remoteReady: false,
          error: '',
          note: noteOverrides.guestDisconnected || 'Friend disconnected. Keeping the room alive for a reconnect...'
        });
        peerDisconnectTimerRef.current = window.setTimeout(() => {
          peerSessionRef.current.guestClientId = '';
          updatePeerUi((current) => ({
            ...current,
            role: 'host',
            status: 'waiting',
            error: '',
            note: noteOverrides.waiting || 'Invite is still active. Waiting for your friend to reconnect.'
          }));
        }, PEER_DISCONNECT_GRACE_MS);
      });

      connection.on('error', () => {
        if (peerSessionRef.current.manualClose) return;
        clearPeerTimers();
        updatePeerUi({
          role: 'host',
          status: 'reconnecting',
          localReady: false,
          remoteReady: false,
          error: '',
          note: noteOverrides.reconnecting || 'Room signal hiccup. Waiting for the guest to reconnect...'
        });
      });
    });

    peer.on('disconnected', () => {
      if (peerSessionRef.current.manualClose) return;
      updatePeerUi({
        role: 'host',
        status: 'reconnecting',
        localReady: false,
        remoteReady: false,
        error: '',
        note: noteOverrides.reconnecting || 'Lost contact with the signaling server. Retrying...'
      });
      try { peer.reconnect(); } catch (_error) {}
    });

    peer.on('error', (error) => {
      if (peerSessionRef.current.manualClose) return;
      updatePeerUi({
        open: openDialog,
        mode: 'host',
        role: 'host',
        status: 'error',
        localReady: false,
        remoteReady: false,
        error: error?.message || noteOverrides.error || 'Unable to open the friend room.',
        note: noteOverrides.errorNote || 'Try again or check the PeerServer configuration.'
      });
    });
  };

  const startGuestConnection = ({
    roomId: roomIdOverride = null,
    token: tokenOverride = null,
    openDialog = true,
    playerDisplayName = '',
    opponentDisplayName = '',
    noteOverrides = {}
  } = {}) => {
    const roomId = (roomIdOverride ?? peerUi.joinRoomId).trim();
    const token = (tokenOverride ?? peerUi.joinToken).trim();
    if (!roomId || !token) {
      updatePeerUi({
        status: 'error',
        error: 'Both the invite code and security key are required.',
        note: 'Ask your friend to share the full invite again.'
      });
      return;
    }

    disconnectPeerSession({ notifyRemote: false, resetGame: false, keepDialog: false, preserveJoinFields: true });

    const previousDraft = loadPeerSessionDraft();
    const clientId = previousDraft?.role === 'guest' && previousDraft.roomId === roomId && previousDraft.token === token && previousDraft.clientId
      ? previousDraft.clientId
      : generatePeerToken('guest');

    peerSessionRef.current = {
      role: 'guest',
      roomId,
      token,
      inviteUrl: buildPeerInviteUrl(roomId, token),
      clientId,
      guestClientId: '',
      lastConnectAttemptAt: Date.now(),
      manualClose: false
    };

    updatePeerUi({
      open: openDialog,
      mode: 'join',
      role: 'guest',
      status: 'connecting',
      playerDisplayName,
      opponentDisplayName,
      localReady: false,
      remoteReady: false,
      roomId: '',
      token: '',
      inviteUrl: '',
      error: '',
      note: noteOverrides.connecting || 'Contacting the host...'
    });

    const peer = new Peer(clientId, getPeerClientOptions());
    peerRef.current = peer;

    peer.on('open', () => {
      savePeerSessionDraft({ lastMode: 'join', role: 'guest', roomId, token, clientId });
      connectGuestDataChannel({ openDialog, noteOverrides });
    });

    peer.on('disconnected', () => {
      if (peerSessionRef.current.manualClose) return;
      updatePeerUi({
        role: 'guest',
        status: 'reconnecting',
        error: '',
        note: noteOverrides.reconnecting || 'Signal lost. Retrying the room...'
      });
      try { peer.reconnect(); } catch (_error) {}
      peerReconnectTimerRef.current = window.setTimeout(() => {
        connectGuestDataChannel({ openDialog, noteOverrides });
      }, PEER_RECONNECT_DELAY_MS);
    });

    peer.on('error', (error) => {
      if (peerSessionRef.current.manualClose) return;
      updatePeerUi({
        open: openDialog,
        mode: 'join',
        role: 'guest',
        status: 'error',
        localReady: false,
        remoteReady: false,
        error: error?.type === 'peer-unavailable'
          ? (noteOverrides.unavailable || 'Host not found. Make sure the host opened the room first.')
          : (error?.message || noteOverrides.error || 'Unable to join the friend room.'),
        note: noteOverrides.errorNote || 'You can retry with the same invite.'
      });
    });
  };

  const shareCurrentInvite = async () => {
    if (!peerUi.inviteUrl) return;
    if (canShareFriendInvite) {
      try {
        await navigator.share(buildPeerSharePayload(peerUi.roomId, peerUi.token, peerUi.inviteUrl));
        updatePeerUi({ note: 'Invite shared. Waiting for your friend to connect.' });
        return;
      } catch (_error) {}
    }
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(peerUi.inviteUrl);
        updatePeerUi({ note: 'Invite link copied. Paste it into your messaging app.' });
      } catch (_error) {}
    }
  };

  const copyCurrentInvite = async () => {
    if (!peerUi.inviteUrl || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(peerUi.inviteUrl);
      updatePeerUi({ note: 'Invite link copied to the clipboard.' });
    } catch (_error) {}
  };

  useEffect(() => {
    if (peerUi.role === 'guest') return;
    if (state.stackResolving && !state.pendingAction) {
      const timer = setTimeout(() => { dispatch({ type: 'RESOLVE_TOP_STACK' }); }, isAiMirror ? 20 : difficultySpeed.resolve);
      return () => clearTimeout(timer);
    }
  }, [state.stackResolving, state.pendingAction, isAiMirror, difficultySpeed.resolve, peerUi.role]);

  useEffect(() => {
    if (isAiMirror) return;
    if (state.winner || state.stackResolving || state.pendingTargetSelection || state.pendingAction || state.priority !== 'player' || dandanCastConfirm || dandanAttackBlockedDialog) return;
    if (!checkHasActions(state, 'player') && !canPlayerAttemptAttackSelection) {
      const delay = state.stack.length > 0 ? 800 : 150; 
      const timer = setTimeout(() => { dispatch({ type: 'PASS_PRIORITY', player: 'player' }); }, delay); 
      return () => clearTimeout(timer);
    }
  }, [state.priority, state.actionCount, state.stackResolving, state.winner, state.pendingTargetSelection, state.pendingAction, state.turn, state.phase, state.stack.length, isAiMirror, dandanCastConfirm, dandanAttackBlockedDialog, canPlayerAttemptAttackSelection]);

  useEffect(() => {
    if (isPeerMatch) return;
    if (state.winner || state.stackResolving) return;

    if (state.pendingAction && isAiMirror) {
      const timer = setTimeout(() => { resolveAiPendingAction(); }, 30);
      return () => clearTimeout(timer);
    }

    const automatedPlayer = isAiMirror ? state.priority : state.priority === 'ai' ? 'ai' : null;
    if (!automatedPlayer) return;

    const hasAiActions = checkHasActions(state, automatedPlayer);
    const delay = isAiMirror ? (hasAiActions ? 20 : 8) : (hasAiActions ? difficultySpeed.think : difficultySpeed.pass);
    
    const timer = setTimeout(() => { takeAiAction(automatedPlayer); }, delay); 
    return () => clearTimeout(timer);
  }, [state.priority, state.actionCount, state.stackResolving, state.winner, state.turn, state.phase, state.pendingAction, isAiMirror, difficultySpeed.think, difficultySpeed.pass, isPeerMatch]);

  const startMatch = (mode, aiCharacterId, playerAiCharacterId = null, difficultyOverride = selectedDifficulty) => {
    if (mode !== 'peer' && isPeerSessionActive) {
      disconnectPeerSession({ notifyRemote: peerUi.role === 'host', resetGame: false, keepDialog: false, note: 'Friend match closed.' });
    }
    if (mode !== 'peer') {
      disconnectOnlineMatchmaking({ keepDialog: false, preservePendingMatch: false });
    }
    setDandanCastConfirm(null);
    setDandanAttackBlockedDialog(null);
    dispatch({
      type: 'START_GAME',
      mode,
      difficulty: difficultyOverride,
      aiCharacterId,
      playerAiCharacterId
    });
  };

  const startFreeMatch = (characterId = selectedOpponentCharacter) => {
    startMatch('free', characterId);
  };

  const startAdventureBattle = (stageIndex = null) => {
    const resolvedIndex = stageIndex ?? (isAdventureComplete ? 0 : adventureWinsCount);
    setAdventureWinsCount(resolvedIndex);
    startMatch('adventure', ADVENTURE_ROUTE[resolvedIndex], null, ADVENTURE_FIXED_DIFFICULTY);
  };

  const handleAdvanceAdventure = () => {
    const nextIndex = Math.min(adventureWinsCount + 1, ADVENTURE_ROUTE.length - 1);
    setAdventureWinsCount(nextIndex);
    startMatch('adventure', ADVENTURE_ROUTE[nextIndex], null, ADVENTURE_FIXED_DIFFICULTY);
  };

  const handleRestartAdventure = () => {
    setAdventureWinsCount(0);
    startMatch('adventure', ADVENTURE_ROUTE[0], null, ADVENTURE_FIXED_DIFFICULTY);
  };

  const handleAdventureReturnToMenu = () => {
    if (state.winner === 'player') {
      setAdventureWinsCount((count) => Math.min(count + 1, ADVENTURE_ROUTE.length));
    }
    if (isPeerSessionActive) {
      disconnectPeerSession({ notifyRemote: peerUi.role === 'host', resetGame: false, keepDialog: false, note: 'Friend match closed.' });
    }
    resetMenuUiState();
    dispatch({ type: 'RETURN_TO_MENU' });
  };

  const returnToMenu = () => {
    if (isPeerSessionActive) {
      disconnectPeerSession({ notifyRemote: peerUi.role === 'host', resetGame: false, keepDialog: false, note: 'Friend match closed.' });
    }
    resetMenuUiState();
    dispatch({ type: 'RETURN_TO_MENU' });
  };

  const handleStartQuickGame = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowQuickGameDialog(false);
    setMenuScreen('home');
    startMatch('quick', null, null, difficulty);
  };

  const handleContinueSavedGame = () => {
    const savedGame = loadCurrentGameSnapshot();
    if (!savedGame) {
      clearCurrentGameSnapshot();
      setHasSavedGame(false);
      return;
    }

    AudioEngine.init();
    if (isPeerSessionActive) {
      disconnectPeerSession({ notifyRemote: peerUi.role === 'host', resetGame: false, keepDialog: false, note: 'Friend match closed.' });
    }
    disconnectOnlineMatchmaking({ keepDialog: false, preservePendingMatch: false });
    setShowQuickGameDialog(false);
    setShowMenuSettings(false);
    setShowRivalMenu(false);
    setShowExitConfirm(false);
    setDandanCastConfirm(null);
    setDandanAttackBlockedDialog(null);
    setShowLog(false);
    setZoomedCard(null);
    setViewingZone(null);
    dispatch({ type: 'LOAD_SAVED_GAME', snapshot: savedGame });
  };

  const handleOpenOnlineDialog = () => {
    updatePeerUi((current) => ({ ...current, open: false, error: '', note: current.note }));
    updateOnlineUi((current) => ({
      ...current,
      open: true,
      note: current.note || 'Enter a nickname to join the shared six-hour lobby.'
    }));
  };

  const handleCloseOnlineDialog = () => {
    updateOnlineUi((current) => ({
      ...current,
      open: false
    }));
  };

  const handleCancelOnlineMatchmaking = () => {
    if (onlineUi.status === 'launching' && peerUi.role && !state.started) {
      disconnectPeerSession({
        notifyRemote: peerUi.role === 'host',
        resetGame: false,
        keepDialog: false,
        note: 'Matched room cancelled.'
      });
    }
    disconnectOnlineMatchmaking({ keepDialog: false, preservePendingMatch: false });
  };

  const handleRetryOnlineMatchmaking = () => {
    if (onlineUi.pendingMatch?.roomId && onlineUi.pendingMatch?.token) {
      launchOnlineMatchRoom(onlineUi.pendingMatch);
      return;
    }
    beginOnlineMatchmaking();
  };

  const resolveAiPendingAction = () => {
    if (!state.pendingAction) return;
    const pendingActor = state.pendingAction.player || 'player';
    const policy = getAiPolicyForActor(state, pendingActor);
    const actions = getAiPendingActions(state, policy, pendingActor);
    if (actions.length === 0) return;
    actions.forEach(action => dispatch(action));
  };

  const takeAiAction = (actor) => {
    const difficulty = state.difficulty || 'medium';
    const policy = getAiPolicyForActor(state, actor, difficulty);
    dispatch(chooseAiAction(state, actor, difficulty, policy));
  };

  const resetMenuUiState = () => {
    setMenuMode('adventure');
    setShowRivalMenu(false);
    setMenuScreen('home');
    refreshLandingBackground();
    setShowQuickGameDialog(false);
    setShowMenuSettings(false);
    updatePeerUi((current) => ({ ...current, open: false, error: '', note: current.note }));
    disconnectOnlineMatchmaking({ keepDialog: false, preservePendingMatch: false });
    setShowExitConfirm(false);
    setDandanCastConfirm(null);
    setDandanAttackBlockedDialog(null);
    setShowLog(false);
    setZoomedCard(null);
    setViewingZone(null);
  };

  const handleBattlefieldPeekStart = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.cancelable) event.preventDefault();
    if (typeof event.currentTarget.setPointerCapture === 'function') {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (_error) {}
    }
    setIsBattlefieldPeekActive(true);
  };

  const handleBattlefieldPeekEnd = (event) => {
    if (event?.currentTarget && typeof event.currentTarget.hasPointerCapture === 'function' && event.currentTarget.hasPointerCapture(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (_error) {}
    }
    setIsBattlefieldPeekActive(false);
  };

  const handleCardClick = (card, zone) => {
    if (isAiMirror) return;

    if (zone === 'stack') {
      const clickedEntry = state.stack.find(entry => entry.card?.id === card.id) || null;
      if (state.priority === 'player' && localPendingTargetSelection && isValidTarget(card, zone, state)) {
        setSelectedStackEntryId(null);
        dispatch({ type: 'CAST_WITH_TARGET', targetId: card.id, targetZone: zone });
        return;
      }
      setSelectedStackEntryId(clickedEntry?.card?.id || null);
      if (state.priority !== 'player') return;
      return;
    }

    setSelectedStackEntryId(null);
    if (state.priority !== 'player') return;

    if (localPendingTargetSelection && isValidTarget(card, zone, state)) {
       dispatch({ type: 'CAST_WITH_TARGET', targetId: card.id, targetZone: zone }); return;
    }
    
    if (zone === 'hand') {
      const canPlay = isCastable(card, state);
      const canCycle = isCyclable(card, state);
      if (card.isLand && canPlay && canCycle) {
        dispatch({ type: 'PROMPT_HAND_LAND_ACTION', player: 'player', cardId: card.id });
        return;
      }
      if (card.isLand && canCycle) {
        dispatch({ type: 'PROMPT_HAND_LAND_ACTION', player: 'player', cardId: card.id });
        return;
      }
      if (canPlay) {
        if (card.isLand) {
          dispatch({ type: 'PLAY_LAND', player: 'player', cardId: card.id });
        } else if (card.name === DANDAN_NAME && !controlsIsland(state.player.board)) {
          setDandanCastConfirm({ cardId: card.id, cardName: card.name });
        } else {
          dispatch({ type: 'CAST_SPELL', player: 'player', cardId: card.id });
        }
      }
    } else if (zone === 'board') {
      if (card.name === 'DandÃ¢n') {
         if (state.phase === 'declare_attackers' && state.turn === 'player' && !card.summoningSickness && !card.tapped) {
            if (!canDandanAttackDefender(card, state.ai.board)) {
              setDandanAttackBlockedDialog({ requiredLandType: card.dandanLandType || 'Island' });
              return;
            }
            dispatch({ type: 'TOGGLE_ATTACK', cardId: card.id, player: 'player' });
         } else if (state.phase === 'declare_blockers' && state.turn === 'ai' && !card.tapped) {
            dispatch({ type: 'TOGGLE_BLOCK', cardId: card.id, player: 'player' });
         }
      } else if (card.isLand && isActivatable(card, state)) {
         dispatch({ type: 'PROMPT_ACTIVATE_LAND', player: 'player', cardId: card.id, cardName: card.name });
      }
    }
  };

  const groupLands = (board) => {
     const lands = board.filter(c => c.isLand);
     if (lands.length >= 6) return [lands];
     const groups = {};
     lands.forEach(l => { groups[l.name] = groups[l.name] || []; groups[l.name].push(l); });
     return Object.values(groups);
  };

  const getBoardPermanentStacks = (board) => {
    const auraMap = {};
    const looseAuras = [];
    board
      .filter(card => !card.isLand && card.name === 'Control Magic')
      .forEach(card => {
        if (card.enchantedId) {
          auraMap[card.enchantedId] = auraMap[card.enchantedId] || [];
          auraMap[card.enchantedId].push(card);
        } else {
          looseAuras.push(card);
        }
      });

    const creatureStacks = board
      .filter(card => !card.isLand && card.name !== 'Control Magic')
      .map(card => ({
        key: card.id,
        permanent: card,
        attachedAuras: auraMap[card.id] || []
      }));

    const looseAuraStacks = looseAuras.map(card => ({
      key: card.id,
      permanent: card,
      attachedAuras: []
    }));

    return [...creatureStacks, ...looseAuraStacks];
  };

  const canPlayerDeclareAttack = (card) =>
    !isAiMirror &&
    state.turn === 'player' &&
    state.phase === 'declare_attackers' &&
    state.priority === 'player' &&
    card.name === DANDAN_NAME &&
    !card.summoningSickness &&
    !card.tapped;

  const adventurePathPoints = ADVENTURE_MAP_LAYOUT.map(({ left, top }) => `${left},${top}`).join(' ');

  if (!menuAssetsReady) {
    return <Preloader onComplete={() => setMenuAssetsReady(true)} />;
  }

  if (!state.started && isPeerSessionActive && ['connected', 'reconnecting'].includes(peerUi.status)) {
    return (
      <PeerRoomLobbyScreen
        playerName={peerPlayerName}
        opponentName={peerOpponentName}
        localReady={peerUi.localReady}
        remoteReady={peerUi.remoteReady}
        note={peerUi.note}
        error={peerUi.error}
        canStart={canPressPeerStartGame}
        primaryLabel={peerStartButtonLabel}
        onStart={handlePeerStartGame}
        onLeave={returnToMenu}
        leaveLabel={peerUi.role === 'host' ? 'Close Room' : 'Leave Room'}
      />
    );
  }

  if (!state.started) {
    return (
      <LandingScreen
        landingBackground={landingBackground}
        menuScreen={menuScreen}
        homeVariant={homeVariant}
        onSelectHomeVariant={setHomeVariant}
        onBack={() => {
          setMenuScreen('home');
          refreshLandingBackground();
        }}
        onOpenSettings={() => setShowMenuSettings(true)}
        showMenuSettings={showMenuSettings}
        onCloseSettings={() => setShowMenuSettings(false)}
        muted={muted}
        onToggleMuted={() => setMuted(!muted)}
        useOfficialCards={useOfficialCards}
        onToggleOfficialCards={() => setUseOfficialCards(!useOfficialCards)}
        showLibrary={viewingZone === 'deck'}
        onOpenLibrary={() => setViewingZone('deck')}
        onCloseLibrary={() => setViewingZone(null)}
        showQuickGameDialog={showQuickGameDialog}
        showFriendsDialog={peerUi.open}
        showOnlineDialog={onlineUi.open}
        selectedDifficulty={selectedDifficulty}
        menuAssetsReady={menuAssetsReady}
        onQuickGameOpen={() => setShowQuickGameDialog(true)}
        onQuickGameClose={() => setShowQuickGameDialog(false)}
        onQuickGameStart={handleStartQuickGame}
        onFriendsOpen={() => {
          updateOnlineUi((current) => ({ ...current, open: false }));
          updatePeerUi({ open: true, mode: peerUi.joinRoomId && peerUi.joinToken ? 'join' : 'host', error: '', note: peerUi.note });
        }}
        onFriendsClose={() => {
          if (peerUi.role && !state.started) {
            disconnectPeerSession({ notifyRemote: peerUi.role === 'host', resetGame: false, keepDialog: false, note: 'Friend match closed.' });
            return;
          }
          updatePeerUi({ open: false, error: '', note: peerUi.note });
        }}
        onOnlineOpen={handleOpenOnlineDialog}
        onOnlineClose={handleCloseOnlineDialog}
        friendDialogMode={peerUi.mode}
        friendRole={peerUi.role}
        friendStatus={peerUi.status}
        friendRoomId={peerUi.roomId}
        friendToken={peerUi.token}
        friendInviteUrl={peerUi.inviteUrl}
        friendJoinRoomId={peerUi.joinRoomId}
        friendJoinToken={peerUi.joinToken}
        friendError={peerUi.error}
        friendNote={peerUi.note}
        canShareFriendInvite={canShareFriendInvite}
        onSelectFriendMode={(mode) => updatePeerUi({ mode, error: '', note: mode === 'host' ? 'Create an invite and share it with your friend.' : peerUi.note || 'Paste the invite details to join.' })}
        onCreateFriendInvite={() => startHostInvite({ autoShare: true })}
        onShareFriendInvite={shareCurrentInvite}
        onCopyFriendInvite={copyCurrentInvite}
        onFriendJoinRoomIdChange={(value) => updatePeerUi({ joinRoomId: value, error: '' })}
        onFriendJoinTokenChange={(value) => updatePeerUi({ joinToken: value, error: '' })}
        onConnectFriendInvite={startGuestConnection}
        onDisconnectFriendInvite={() => disconnectPeerSession({ notifyRemote: peerUi.role === 'host', resetGame: state.started && state.gameMode === 'peer', keepDialog: true, note: peerUi.role === 'host' ? 'Room closed.' : 'Disconnected from the room.' })}
        onRetryFriendInvite={() => {
          if (peerUi.mode === 'host') {
            startHostInvite({ autoShare: false });
            return;
          }
          startGuestConnection();
        }}
        onlinePlayerName={onlineUi.playerName}
        onlineStatus={onlineUi.status}
        onlineError={onlineUi.error}
        onlineNote={onlineUi.note}
        onlineBucketLabel={onlineUi.bucketLabel}
        onlineRotationLabel={onlineUi.rotationLabel}
        onlinePendingMatch={onlineUi.pendingMatch}
        onOnlinePlayerNameChange={(value) => updateOnlineUi({ playerName: sanitizeOnlinePlayerName(value), error: '' })}
        onStartOnlineMatchmaking={beginOnlineMatchmaking}
        onRetryOnlineMatchmaking={handleRetryOnlineMatchmaking}
        onCancelOnlineMatchmaking={handleCancelOnlineMatchmaking}
        canContinueGame={hasSavedGame}
        onContinueGame={handleContinueSavedGame}
        onAdventureOpen={() => setMenuScreen('adventure')}
        adventureStageNumber={adventureStageNumber}
        adventureWinsCount={adventureWinsCount}
        adventurePathPoints={adventurePathPoints}
        isAdventureComplete={isAdventureComplete}
        nextAdventureCharacter={nextAdventureCharacter}
        adventureProgressRatio={adventureProgressRatio}
        availableAdventureStages={availableAdventureStages}
        onStartAdventure={() => startAdventureBattle()}
        onRestartAdventure={handleRestartAdventure}
      />
    );
  }

  if (!state.started) {
    return (
      <div
        className="h-dvh bg-[#05101b] text-slate-100 flex items-center justify-center px-4 sm:px-6 overflow-hidden relative"
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(125,211,252,0.12),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(167,139,250,0.12),transparent_32%),linear-gradient(180deg,#03101c_0%,#072035_52%,#04111b_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '58px 58px' }} />
        <div className="absolute -left-10 top-8 w-40 h-40 rounded-full bg-cyan-300/18 blur-3xl animate-pulse" />
        <div className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-sky-300/12 blur-3xl animate-pulse" />
        <div className="absolute left-1/2 bottom-[-4rem] -translate-x-1/2 w-72 h-32 rounded-[999px] bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md mx-auto h-full flex items-center justify-center">
          <div className="relative w-full max-h-full overflow-y-visible rounded-[2.1rem] bg-slate-950/66 backdrop-blur-3xl shadow-[0_28px_80px_rgba(2,6,23,0.68)]">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_40%,rgba(255,255,255,0)_100%)] pointer-events-none" />
            <div className="absolute -top-20 right-[-1.5rem] w-40 h-40 rounded-full bg-cyan-300/12 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 left-[-1.5rem] w-44 h-44 rounded-full bg-fuchsia-300/10 blur-3xl pointer-events-none" />

            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-arena-display text-[2.65rem] sm:text-5xl leading-[0.94] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300">
                  Forgetful
                  <br />
                  Fish
                </h1>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => setShowMenuSettings(true)}
                    aria-label="Open settings"
                    className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 hover:bg-slate-800 active:scale-[0.97] transition-all flex items-center justify-center shadow-[0_12px_28px_rgba(2,6,23,0.35)]"
                  >
                    <Settings size={17} />
                  </button>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-slate-500">{APP_VERSION}</div>
                </div>
              </div>

              <div className="relative mb-6 rounded-[1.7rem] border border-white/10 bg-white/[0.04] px-3 py-4 sm:px-4 sm:py-5">
                <div className="absolute inset-x-4 top-3 h-10 rounded-full bg-cyan-200/6 blur-2xl pointer-events-none" />
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {AI_DIFFICULTIES.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`group rounded-[1.35rem] px-2 py-2.5 sm:px-3 sm:py-3 transition-all duration-200 active:scale-[0.98] ${
                        selectedDifficulty === difficulty
                          ? 'bg-white/10 shadow-[0_14px_32px_rgba(34,211,238,0.12)]'
                          : 'bg-transparent hover:bg-white/6'
                      }`}
                    >
                      <div className={`mx-auto w-[84px] h-[84px] sm:w-24 sm:h-24 rounded-full p-[3px] transition-all duration-200 ${
                        selectedDifficulty === difficulty
                          ? 'bg-gradient-to-br from-cyan-200 via-sky-300 to-blue-400 shadow-[0_0_28px_rgba(56,189,248,0.38)]'
                          : 'bg-white/12 group-hover:bg-white/18'
                      }`}>
                        <img
                          src={DIFFICULTY_ART[difficulty]}
                          alt={AI_DIFFICULTY_LABELS[difficulty]}
                          className="w-full h-full object-cover rounded-full border-2 border-slate-950/80"
                        />
                      </div>
                      <div className={`mt-2 text-[11px] sm:text-xs font-extrabold tracking-[0.2em] uppercase ${
                        selectedDifficulty === difficulty ? 'text-cyan-100' : 'text-slate-300'
                      }`}>
                        {AI_DIFFICULTY_LABELS[difficulty]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3 rounded-[1.45rem] border border-white/10 bg-white/[0.045] p-2 shadow-[0_16px_30px_rgba(2,6,23,0.22)]">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'adventure', label: 'Adventure Mode' },
                    { id: 'free', label: 'Free Mode' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setMenuMode(mode.id)}
                      className={`rounded-[1.15rem] px-3 py-3 text-sm font-black uppercase tracking-[0.14em] transition-all ${
                        menuMode === mode.id
                          ? 'bg-cyan-300 text-slate-950 shadow-[0_12px_24px_rgba(103,232,249,0.24)]'
                          : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {menuMode === 'adventure' ? (
                  <>
                    <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.05] px-4 py-4 shadow-[0_16px_32px_rgba(2,6,23,0.28)]">
                      <div className="flex items-center gap-3">
                        <img
                          src={getCharacterPortrait(nextAdventureCharacter.id, selectedDifficulty)}
                          alt={nextAdventureCharacter.name}
                          className="w-16 h-16 rounded-[1.2rem] object-cover border border-white/15 shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/80 font-black">
                            {isAdventureComplete
                              ? 'Adventure Complete'
                              : nextAdventureCharacter.id === ADVENTURE_BOSS_ID
                                ? `${ADVENTURE_ROUTE.length}/${ADVENTURE_ROUTE.length}`
                                : `${adventureStageNumber}/${ADVENTURE_ROUTE.length}`}
                          </div>
                          <div className="text-lg font-black text-white truncate">
                            {isAdventureComplete ? 'Gauntlet Cleared' : nextAdventureCharacter.name}
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            {isAdventureComplete ? 'Start again anytime' : nextAdventureCharacter.title}
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-5 text-slate-300">
                        {isAdventureComplete
                          ? 'You already reached the end of the gauntlet. Restart to run every personality again and face the final boss one more time.'
                          : `Fight every rival in sequence, then survive the final boss duel against ${getAiCharacter(ADVENTURE_BOSS_ID)?.name}. ${nextAdventureCharacter.summary}`}
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                          <span>Progress</span>
                          <span>{Math.min(adventureWinsCount, ADVENTURE_ROUTE.length)}/{ADVENTURE_ROUTE.length}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 transition-all duration-300"
                            style={{ width: `${isAdventureComplete ? 100 : adventureProgressRatio * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => startAdventureBattle()}
                      className="w-full min-h-[60px] py-4 px-4 bg-[#38bdf8] hover:bg-[#22c7ff] active:scale-[0.99] text-slate-950 font-bold tracking-[0.04em] uppercase rounded-[1.55rem] text-base border border-sky-200/70 shadow-[0_16px_28px_rgba(56,189,248,0.28)] transition-all flex items-center justify-center gap-2"
                    >
                      <Play fill="currentColor" size={18} /> {isAdventureComplete ? 'Restart Adventure' : adventureWinsCount > 0 ? 'Continue Adventure' : 'Begin Adventure'}
                    </button>
                    {adventureWinsCount > 0 && !isAdventureComplete && (
                      <button
                        onClick={handleRestartAdventure}
                        className="w-full min-h-[56px] py-3.5 px-4 bg-slate-900/92 hover:bg-slate-800 active:scale-[0.99] text-slate-100 font-bold tracking-[0.04em] uppercase rounded-[1.55rem] text-sm border border-slate-600 shadow-[0_16px_28px_rgba(15,23,42,0.4)] transition-all flex items-center justify-center gap-2"
                      >
                        Restart From Stage 1
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.05] px-4 py-4 shadow-[0_16px_32px_rgba(2,6,23,0.28)]">
                      <div className="flex items-center gap-3">
                        <img
                          src={getCharacterPortrait(selectedOpponent.id, selectedDifficulty)}
                          alt={selectedOpponent.name}
                          className="w-16 h-16 rounded-[1.2rem] object-cover border border-white/15 shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/80 font-black">Selected Rival</div>
                          <div className="text-lg font-black text-white truncate">{selectedOpponent.name}</div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{selectedOpponent.title}</div>
                        </div>
                        <button
                          onClick={() => setShowRivalMenu(true)}
                          className="shrink-0 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-600 text-slate-100 text-xs font-black uppercase tracking-[0.16em] hover:bg-slate-800 transition-colors"
                        >
                          Rivals
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-5 text-slate-300">{selectedOpponent.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedOpponent.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => startFreeMatch(selectedOpponentCharacter)}
                      className="w-full min-h-[60px] py-4 px-4 bg-[#38bdf8] hover:bg-[#22c7ff] active:scale-[0.99] text-slate-950 font-bold tracking-[0.04em] uppercase rounded-[1.55rem] text-base border border-sky-200/70 shadow-[0_16px_28px_rgba(56,189,248,0.28)] transition-all flex items-center justify-center gap-2"
                    >
                      <Play fill="currentColor" size={18} /> Fight {selectedOpponent.name}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {showMenuSettings && (
          <div className="absolute inset-0 z-20 bg-black/72 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-sm bg-slate-900/96 border border-white/12 rounded-[1.9rem] shadow-[0_26px_80px_rgba(2,6,23,0.72)] p-5 sm:p-6 text-left">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-cyan-100 tracking-[0.22em] uppercase">Settings</h2>
                <button onClick={() => setShowMenuSettings(false)} className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <button onClick={() => setMuted(!muted)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${muted ? 'bg-slate-950 border-slate-700 text-slate-300' : 'bg-sky-400 border-sky-200 text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.2)]'}`}>
                  <span className="font-bold uppercase tracking-wider text-sm">Sound</span>
                  <span className="flex items-center gap-2 text-sm">{muted ? <VolumeX size={16}/> : <Volume2 size={16}/>} {muted ? 'Muted' : 'On'}</span>
                </button>
                <button onClick={() => setUseOfficialCards(!useOfficialCards)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${useOfficialCards ? 'bg-sky-400 border-sky-200 text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.2)]' : 'bg-slate-950 border-slate-700 text-slate-300'}`}>
                  <span className="font-bold uppercase tracking-wider text-sm">Card Art</span>
                  <span className="flex items-center gap-2 text-sm"><ImageIcon size={16}/> {useOfficialCards ? 'SLD Art' : 'Proxy'}</span>
                </button>
              </div>
              <button onClick={() => setShowMenuSettings(false)} className="w-full mt-5 py-3.5 bg-[#38bdf8] hover:bg-[#22c7ff] text-slate-950 font-bold tracking-[0.04em] uppercase rounded-2xl border border-sky-200/70 transition-colors shadow-[0_14px_28px_rgba(56,189,248,0.22)]">
                Close
              </button>
            </div>
          </div>
        )}
        {showRivalMenu && (
          <div className="absolute inset-0 z-20 bg-black/72 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-3xl max-h-[88vh] overflow-hidden bg-slate-900/96 border border-white/12 rounded-[1.9rem] shadow-[0_26px_80px_rgba(2,6,23,0.72)] p-5 sm:p-6 text-left flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black text-cyan-100 tracking-[0.22em] uppercase">Rivals</h2>
                  <p className="text-sm text-slate-400 mt-1">Choose the opponent you want to fight.</p>
                </div>
                <button onClick={() => setShowRivalMenu(false)} className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-1">
                {AI_CHARACTERS.map(character => {
                  const isSelected = selectedOpponentCharacter === character.id;
                  return (
                    <button
                      key={character.id}
                      onClick={() => {
                        setSelectedOpponentCharacter(character.id);
                        setShowRivalMenu(false);
                      }}
                      className={`text-left rounded-[1.5rem] border p-3.5 transition-all ${
                        isSelected
                          ? 'bg-cyan-400/10 border-cyan-300/40 shadow-[0_16px_30px_rgba(34,211,238,0.12)]'
                          : 'bg-slate-950/70 border-slate-700 hover:bg-slate-900 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getCharacterPortrait(character.id, selectedDifficulty)}
                          alt={character.name}
                          className="w-16 h-16 rounded-[1.15rem] object-cover border border-white/15"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-black tracking-[0.08em] uppercase text-white">{character.name}</div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{character.title}</div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-5 text-slate-300">{character.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {character.tags.map(tag => (
                          <span key={tag} className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.14em] ${
                            isSelected
                              ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-50'
                              : 'border-slate-700 bg-slate-800 text-slate-300'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const winnerCharacter = state.winner === 'player'
    ? currentPlayerAiCharacter
    : state.winner === 'ai'
      ? currentOpponentCharacter
      : null;
  const isAdventureBossBattle = isAdventureMatch && state.aiCharacterId === ADVENTURE_BOSS_ID;
  const adventureNextCharacter = getAiCharacter(ADVENTURE_ROUTE[Math.min(adventureWinsCount + 1, ADVENTURE_ROUTE.length - 1)]) || AI_CHARACTERS[0];
  const winnerHeading = isAiMirror
    ? winnerCharacter?.name || (state.winner === 'player' ? 'Left AI Wins' : 'Right AI Wins')
    : isAdventureMatch && state.winner === 'player' && isAdventureBossBattle
      ? 'Adventure Cleared'
      : state.winner === 'player'
        ? 'VICTORY'
        : 'DEFEAT';
  const winnerSubheading = isAiMirror
    ? winnerCharacter?.title || 'Exhibition complete'
    : isAdventureMatch && state.winner === 'player' && isAdventureBossBattle
      ? `${currentOpponentCharacter?.name || 'The boss'} finally fell.`
      : isAdventureMatch && state.winner === 'player'
        ? `Next rival: ${adventureNextCharacter.name}`
        : isAdventureMatch && state.winner === 'ai'
          ? `${currentOpponentCharacter?.name || 'Your rival'} held stage ${Math.min(adventureWinsCount + 1, ADVENTURE_ROUTE.length)}.`
          : null;

  if (state.winner) {
    return (
      <div className="h-dvh bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm w-full bg-slate-900/80 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <h1 className="font-arena-display text-4xl font-black tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400">
             {winnerHeading}
          </h1>
          {winnerSubheading && (
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{winnerSubheading}</p>
          )}
          {isAdventureMatch ? (
            <>
              {state.winner === 'player' && !isAdventureBossBattle ? (
                <button onClick={handleAdvanceAdventure} className="w-full py-3 bg-[#38bdf8] hover:bg-[#22c7ff] text-slate-950 rounded-xl font-bold tracking-widest uppercase border border-sky-200/70 shadow-[0_0_24px_rgba(56,189,248,0.28)] transition-colors">Next Rival</button>
              ) : (
                <button onClick={state.winner === 'player' ? handleRestartAdventure : () => startAdventureBattle(adventureWinsCount)} className="w-full py-3 bg-[#38bdf8] hover:bg-[#22c7ff] text-slate-950 rounded-xl font-bold tracking-widest uppercase border border-sky-200/70 shadow-[0_0_24px_rgba(56,189,248,0.28)] transition-colors">
                  {state.winner === 'player' ? 'Restart Adventure' : 'Retry Battle'}
                </button>
              )}
              <button onClick={handleAdventureReturnToMenu} className="w-full py-3 bg-slate-900/92 hover:bg-slate-800 text-slate-100 rounded-xl font-bold tracking-widest uppercase border border-slate-600 transition-colors">Back To Menu</button>
            </>
          ) : isPeerMatch ? (
            <>
              <PeerStartControls
                playerName={peerPlayerName}
                opponentName={peerOpponentName}
                localReady={peerUi.localReady}
                remoteReady={peerUi.remoteReady}
                note={peerUi.note}
                error={peerUi.error}
                canStart={canPressPeerStartGame}
                primaryLabel={peerStartButtonLabel}
                onStart={handlePeerStartGame}
                onLeave={returnToMenu}
                leaveLabel={peerUi.role === 'host' ? 'Close Room' : 'Leave Room'}
              />
            </>
          ) : (
            <>
              <button onClick={() => dispatch({ type: 'START_GAME', mode: state.gameMode, difficulty: state.difficulty, aiCharacterId: state.aiCharacterId, playerAiCharacterId: state.playerAiCharacterId })} className="w-full py-3 bg-[#38bdf8] hover:bg-[#22c7ff] text-slate-950 rounded-xl font-bold tracking-widest uppercase border border-sky-200/70 shadow-[0_0_24px_rgba(56,189,248,0.28)] transition-colors">Play Again</button>
              <button onClick={returnToMenu} className="w-full py-3 bg-slate-900/92 hover:bg-slate-800 text-slate-100 rounded-xl font-bold tracking-widest uppercase border border-slate-600 transition-colors">Back To Menu</button>
            </>
          )}
        </div>
      </div>
    );
  }

  const isAutoPassing = state.priority === 'player' && !state.stackResolving && !state.pendingTargetSelection && !state.pendingAction && !dandanCastConfirm && !dandanAttackBlockedDialog && !canPlayerAttemptAttackSelection && !checkHasActions(state, 'player');
  const hidePassButton = Boolean(
    zoomedCard ||
    viewingZone ||
    showLog ||
    showExitConfirm ||
    dandanCastConfirm ||
    dandanAttackBlockedDialog ||
    showMenuSettings ||
    showRivalMenu ||
    state.pendingTargetSelection ||
    state.pendingAction ||
    state.phase === 'mulligan'
  );

  let passIcon = <SkipForward size={14} className={state.priority === 'player' && !state.stackResolving ? 'text-current' : 'text-slate-600'}/>;
  let passLabel = 'PASS';
  let btnColorClass = 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.6)] text-slate-900';

  if (isAutoPassing) {
     passLabel = 'AUTO';
  } else if (state.stack.length > 0) {
     passLabel = 'RESOLVE';
     btnColorClass = 'bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 border-fuchsia-200 shadow-[0_0_20px_rgba(232,121,249,0.6)] text-slate-900';
  } else if (state.phase === 'upkeep') {
     passLabel = 'DRAW';
     passIcon = <Layers size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'} />;
     btnColorClass = 'bg-gradient-to-b from-cyan-400 to-cyan-600 border-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.6)] text-slate-900';
  } else if (state.phase === 'main1') {
     const canAttack = state.player.board.some(c => c.name === 'DandÃ¢n' && !c.summoningSickness && !c.tapped);
     passLabel = canAttack ? 'TO COMBAT' : 'END TURN';
     passIcon = canAttack ? <Swords size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'}/> : <Moon size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'}/>;
     btnColorClass = canAttack ? 'bg-gradient-to-b from-orange-400 to-orange-600 border-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.6)] text-slate-900' : 'bg-gradient-to-b from-indigo-400 to-indigo-600 border-indigo-200 shadow-[0_0_20px_rgba(129,140,248,0.6)] text-white';
  } else if (state.phase === 'declare_attackers' && state.turn === 'player') {
     const isAttacking = state.player.board.some(c=>c.attacking);
     passLabel = isAttacking ? 'ATTACK' : 'NO ATKS';
     passIcon = <Swords size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'} />;
     btnColorClass = isAttacking ? 'bg-gradient-to-b from-red-500 to-red-700 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.6)] text-white' : 'bg-gradient-to-b from-slate-400 to-slate-600 border-slate-200 shadow-[0_0_20px_rgba(148,163,184,0.6)] text-slate-900';
  } else if (state.phase === 'declare_blockers' && state.turn === 'ai') {
     const isBlocking = state.player.board.some(c=>c.blocking);
     passLabel = isBlocking ? 'BLOCK' : 'NO BLKS';
     passIcon = <Shield size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'} />;
     btnColorClass = isBlocking ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.6)] text-slate-900' : 'bg-gradient-to-b from-slate-400 to-slate-600 border-slate-200 shadow-[0_0_20px_rgba(148,163,184,0.6)] text-slate-900';
  } else if (state.phase === 'main2') {
     passLabel = 'END TURN';
     passIcon = <Moon size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'} />;
     btnColorClass = 'bg-gradient-to-b from-indigo-400 to-indigo-600 border-indigo-200 shadow-[0_0_20px_rgba(129,140,248,0.6)] text-white';
  } else if (state.phase === 'cleanup') {
     passLabel = 'CLEANUP';
     btnColorClass = 'bg-gradient-to-b from-violet-400 to-violet-600 border-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.6)] text-white';
  }

  return (
    <div className="h-dvh bg-[#0f121a] text-slate-200 flex flex-col font-sans select-none relative pb-safe overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
      {isPeerSessionActive && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] shadow-[0_12px_28px_rgba(2,6,23,0.45)] backdrop-blur-sm ${
          peerUi.status === 'connected'
            ? 'border-emerald-300/40 bg-emerald-400/14 text-emerald-100'
            : 'border-amber-300/35 bg-slate-950/82 text-slate-200'
        }`}>
          {peerUi.status === 'connected' ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{peerUi.role === 'host' ? 'Host' : 'Guest'} {PEER_STATUS_LABELS[peerUi.status] || peerUi.status}</span>
        </div>
      )}
      
      {/* ZOOMED CARD OVERLAY */}
      {zoomedCard && (
         <div 
           className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
           onClick={() => setZoomedCard(null)}
         >
            <img 
              src={zoomedCard.fullImage} 
              alt={zoomedCard.name} 
              className="max-w-full max-h-[80vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200"
            />
            <p className="text-slate-400 mt-6 font-bold tracking-widest uppercase text-sm animate-pulse">Tap anywhere to close</p>
         </div>
      )}

      {/* HEADER TRAY */}
      <div className="relative flex justify-between items-center p-2 bg-slate-950/90 border-b border-slate-800 z-50 shrink-0 shadow-md backdrop-blur-sm">
        <div className="flex gap-2">
           <button onClick={() => setUseOfficialCards(!useOfficialCards)} className={`px-2 py-1.5 rounded flex items-center gap-1.5 text-[10px] font-bold transition-colors ${useOfficialCards ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
             <ImageIcon size={12}/> <span className="hidden sm:inline">{useOfficialCards ? 'SLD Art' : 'Proxy'}</span>
           </button>
           <button onClick={() => setShowLog(true)} className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 text-[10px] font-bold transition-colors">
             <Activity size={12}/> <span className="hidden sm:inline">Log</span>
           </button>
           <button onClick={() => setMuted(!muted)} className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 transition-colors">
             {muted ? <VolumeX size={12}/> : <Volume2 size={12}/>}
           </button>
           <button onClick={() => dispatch({ type: 'SORT_HAND' })} className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 text-[10px] font-bold transition-colors">
              <ArrowLeftRight size={12}/> <span className="hidden sm:inline">Sort</span>
           </button>
        </div>

        <div className="flex gap-2">
           <button onClick={() => setViewingZone('deck')} className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-blue-300 rounded flex items-center gap-1.5 text-[10px] font-mono font-bold transition-colors shadow-inner">
             <Layers size={14} className="text-slate-400"/> {state.deck.length}/{SHARED_DECK_SIZE}
           </button>
           <button onClick={() => setViewingZone('graveyard')} className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded flex items-center gap-1.5 text-[10px] font-mono font-bold transition-colors shadow-inner">
             <Skull size={14} className="text-slate-400"/> {state.graveyard.length}
           </button>
           <button
             onClick={() => setShowExitConfirm(true)}
             aria-label={isAiMirror ? 'Exit match' : 'Concede game'}
             className="w-9 h-8 bg-red-950/85 border border-red-700 hover:bg-red-900 text-red-200 rounded flex items-center justify-center transition-colors shadow-inner"
           >
             <LogOut size={14} className="text-red-300" />
           </button>
        </div>
      </div>
      
      {/* STARTING MULLIGAN MODAL */}
      {state.phase === 'mulligan' && !localPendingAction && (
         <div className="absolute inset-0 bg-black/90 z-[110] flex flex-col items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
             <h2 className="font-arena-display text-4xl font-black tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2 text-center w-full">Starting Hand</h2>
             <p className="text-slate-400 mb-8 font-mono">Mulligans taken: {currentMulliganCount}</p>
             
             <div className="flex gap-2 sm:gap-4 justify-center mb-12 flex-wrap max-w-4xl">
                {state.player.hand.map(c => <div key={c.id} className="animate-in slide-in-from-bottom-8"><Card card={c} official={useOfficialCards} onZoom={setZoomedCard} /></div>)}
             </div>
  
              {state.priority === 'player' ? (
                <div className="flex gap-6">
                   <button onClick={() => dispatch({ type: 'KEEP_HAND', player: 'player' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105">Keep Hand</button>
                  <button disabled={currentMulliganCount >= 7} onClick={() => dispatch({ type: 'MULLIGAN', player: 'player' })} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-200 font-black tracking-widest uppercase rounded-xl shadow-lg border border-slate-700 transition-all hover:scale-105 disabled:hover:scale-100">Mulligan</button>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/82 px-6 py-4 text-center text-slate-300">
                  Waiting for your friend to finish their mulligan choice...
                </div>
              )}
         </div>
      )}

      {dandanCastConfirm && (
        <PeekableDialogOverlay
          peekActive={isBattlefieldPeekActive}
          onPeekStart={handleBattlefieldPeekStart}
          onPeekEnd={handleBattlefieldPeekEnd}
          overlayClassName="z-[115] flex flex-col items-center justify-center p-4 pb-24"
        >
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
            <h3 className="font-arena-display text-xl font-bold text-blue-300 mb-2 tracking-[0.12em] uppercase">{dandanCastConfirm.cardName}</h3>
            <p className="text-slate-300 text-sm mb-6">
              You control no <strong>Islands</strong>. <strong>{dandanCastConfirm.cardName}</strong> will be sacrificed as soon as it resolves. Cast it anyway?
            </p>
            <div className="flex gap-4 w-full">
              <button onClick={() => setDandanCastConfirm(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => {
                const pendingCard = dandanCastConfirm;
                setDandanCastConfirm(null);
                if (pendingCard) dispatch({ type: 'CAST_SPELL', player: 'player', cardId: pendingCard.cardId });
              }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                Cast Anyway
              </button>
            </div>
          </div>
        </PeekableDialogOverlay>
      )}

      {dandanAttackBlockedDialog && (
        <PeekableDialogOverlay
          peekActive={isBattlefieldPeekActive}
          onPeekStart={handleBattlefieldPeekStart}
          onPeekEnd={handleBattlefieldPeekEnd}
          overlayClassName="z-[115] flex flex-col items-center justify-center p-4 pb-24"
        >
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
            <h3 className="font-arena-display text-xl font-bold text-amber-300 mb-2 tracking-[0.12em] uppercase">Attack Not Possible</h3>
            <p className="text-slate-300 text-sm mb-6">
              The opponent controls no <strong>{dandanAttackBlockedDialog.requiredLandType}s</strong>, so <strong>{DANDAN_NAME}</strong> can't attack.
            </p>
            <button onClick={() => setDandanAttackBlockedDialog(null)} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors">
              Okay
            </button>
          </div>
        </PeekableDialogOverlay>
      )}

      {/* MULTI-CARD SELECT PENDING MODAL */}
      {localPendingAction && ['MULLIGAN_BOTTOM', 'DISCARD_CLEANUP'].includes(localPendingAction.type) && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
           backdropClassName="bg-black/90"
         >
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl flex flex-col items-center text-center">
               <h3 className="font-arena-display text-2xl font-black text-blue-400 mb-2 tracking-[0.16em] uppercase">{localPendingAction.type === 'MULLIGAN_BOTTOM' ? 'Mulligan' : 'Cleanup Step'}</h3>
               <p className="text-slate-300 text-sm mb-8">Select <span className="text-white font-bold text-lg">{localPendingAction.count}</span> card(s) to discard or put on bottom.</p>
               <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {state.player.hand.map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'TOGGLE_PENDING_SELECT', cardId: c.id })} className={`cursor-pointer transition-all duration-200 ${localPendingAction.selected.includes(c.id) ? 'ring-4 ring-blue-500 rounded-md shadow-[0_10px_20px_rgba(37,99,235,0.5)]' : 'opacity-80 hover:opacity-100'}`}>
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button disabled={localPendingAction.selected.length !== localPendingAction.count} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-10 py-4 bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black tracking-widest uppercase rounded-xl shadow-lg transition-all disabled:shadow-none hover:bg-blue-500">Confirm</button>
            </div>
         </PeekableDialogOverlay>
      )}

      {/* LAND ACTIVATION PROMPT */}
      {localPendingAction && localPendingAction.type === 'ACTIVATE_LAND' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Activate Ability</h3>
               <p className="text-slate-300 text-sm mb-6">
                 {localPendingAction.cardName === 'Svyelunite Temple'
                   ? <>Are you sure you want to sacrifice <strong>{localPendingAction.cardName}</strong> to add <strong>2 blue mana</strong>?</>
                   : <>Do you want to sacrifice <strong>{localPendingAction.cardName}</strong> and pay {localPendingAction.activation?.total ?? 0} mana to activate its ability?</>}
               </p>
               <div className="flex gap-4 w-full">
                  <button onClick={() => dispatch({ type: 'CANCEL_PENDING_ACTION' })} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
                  <button onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors">Activate</button>
               </div>
            </div>
         </PeekableDialogOverlay>
      )}

      {localPendingAction && localPendingAction.type === 'HAND_LAND_ACTION' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">{localPendingAction.cardName}</h3>
               <p className="text-slate-300 text-sm mb-6">
                 {localPendingAction.canPlay && localPendingAction.canCycle
                   ? 'Choose whether to play this land or cycle it.'
                   : `Cycle this land for ${localPendingAction.cyclingCost}?`}
               </p>
               <div className="grid grid-cols-1 gap-3 w-full">
                  {localPendingAction.canPlay && (
                    <button onClick={() => dispatch({ type: 'PLAY_LAND', player: 'player', cardId: localPendingAction.cardId })} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">Play Land</button>
                  )}
                  {localPendingAction.canCycle && (
                    <button onClick={() => dispatch({ type: 'CYCLE_CARD', player: 'player', cardId: localPendingAction.cardId })} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors">Cycle {localPendingAction.cyclingCost}</button>
                  )}
                  <button onClick={() => dispatch({ type: 'CANCEL_PENDING_ACTION' })} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
               </div>
            </div>
         </PeekableDialogOverlay>
      )}

      {/* MYSTIC SANCTUARY SELECTION MODAL */}
      {localPendingAction && localPendingAction.type === 'MYSTIC_SANCTUARY' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-4xl flex flex-col items-center text-center max-h-[90vh]">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Mystic Sanctuary</h3>
               <p className="text-slate-300 text-sm mb-6">Select an Instant or Sorcery from your graveyard to put on top of your library. Or skip.</p>
               <div className="flex flex-wrap gap-2 justify-center mb-6 overflow-y-auto custom-scrollbar p-2 w-full">
                  {state.graveyard.filter(c => localPendingAction.validTargets.includes(c.id)).map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION', selectedCardId: c.id })} className="cursor-pointer transition-all hover:opacity-100 opacity-90">
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION', selectedCardId: null })} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl w-full max-w-sm transition-colors">Skip</button>
            </div>
         </PeekableDialogOverlay>
      )}

      {/* DECK & GRAVEYARD EXPLORER OVERLAYS */}
      <CardCollectionOverlay
        viewingZone={viewingZone}
        cards={viewingZone ? state[viewingZone] : []}
        official={useOfficialCards}
        onClose={() => setViewingZone(null)}
        onZoom={setZoomedCard}
      />

      {/* TARGETING BANNER */}
      {localPendingTargetSelection && (
         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto bg-red-900/92 border border-red-500 text-white px-6 py-3 rounded-full shadow-[0_0_24px_rgba(239,68,68,0.45)] flex items-center gap-4 animate-in zoom-in-95 duration-200">
               <Target size={16} className="animate-pulse" />
               <span className="text-xs font-bold tracking-widest uppercase">Select Target for {localPendingTargetSelection.spellName}</span>
               <button onClick={() => dispatch({ type: 'CANCEL_TARGETING' })} className="text-red-300 hover:text-white"><X size={16} /></button>
            </div>
         </div>
      )}

      {localPendingAction && localPendingAction.type === 'LAND_TYPE_CHOICE' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
            onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">{localPendingAction.spellName}</h3>
               <p className="text-slate-300 text-sm mb-2">Choose which <strong>basic land type</strong> <strong>{localPendingAction.targetName}</strong> becomes.</p>
               <p className="text-slate-500 text-[11px] mb-6">For Dandan, choose a land type its controller does not control if you want it to lose support.</p>
               <div className="grid grid-cols-2 gap-3 w-full">
                  {LAND_TYPE_CHOICES.map((landType) => (
                    <button key={landType} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION', landTypeChoice: landType })} className={`w-full py-3 font-bold rounded-xl transition-colors ${LAND_TYPE_BUTTON_STYLES[landType] || 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
                      {landType}
                    </button>
                  ))}
                  <button onClick={() => dispatch({ type: 'CANCEL_PENDING_ACTION' })} className="col-span-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
               </div>
            </div>
         </PeekableDialogOverlay>
      )}

      {/* PENDING RESOLUTION ACTIONS */}
      {localPendingAction && localPendingAction.type === 'BRAINSTORM' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Brainstorm</h3>
               <p className="text-slate-300 text-sm mb-6">Select 2 cards to put back on top of your library.</p>
               <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {state.player.hand.map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'TOGGLE_PENDING_SELECT', cardId: c.id })} className={`cursor-pointer transition-transform ${localPendingAction.selected.includes(c.id) ? 'ring-4 ring-blue-500 rounded-md shadow-[0_10px_20px_rgba(37,99,235,0.45)]' : 'opacity-80'}`}>
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button disabled={localPendingAction.selected.length !== 2} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-8 py-3 bg-blue-600 disabled:bg-slate-700 text-white font-bold rounded-xl w-full">Confirm</button>
            </div>
         </PeekableDialogOverlay>
      )}

      {localPendingAction && localPendingAction.type === 'DISCARD' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Chart a Course</h3>
               <p className="text-slate-300 text-sm mb-6">You haven't attacked. Select 1 card to discard.</p>
               <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {state.player.hand.map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'TOGGLE_PENDING_SELECT', cardId: c.id })} className={`cursor-pointer transition-transform ${localPendingAction.selected.includes(c.id) ? 'ring-4 ring-red-500 rounded-md shadow-[0_10px_20px_rgba(239,68,68,0.4)]' : 'opacity-80'}`}>
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button disabled={localPendingAction.selected.length !== 1} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-8 py-3 bg-red-600 disabled:bg-slate-700 text-white font-bold rounded-xl w-full">Discard</button>
            </div>
         </PeekableDialogOverlay>
      )}

      {localPendingAction && localPendingAction.type === 'PREDICT' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center h-[80vh]">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Predict</h3>
               <p className="text-slate-300 text-sm mb-4">Name a card to predict the top of the deck.</p>
               <div className="flex flex-col gap-2 w-full overflow-y-auto custom-scrollbar pr-2 flex-1 border-t border-slate-800 pt-4">
                  {PREDICT_OPTIONS.map(name => (
                     <button key={name} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION', guess: name })} className="px-4 py-2 bg-slate-800 hover:bg-blue-900/50 rounded-lg font-bold text-slate-200 border border-slate-600 transition-colors text-sm text-left">
                        {name}
                     </button>
                  ))}
               </div>
            </div>
         </PeekableDialogOverlay>
      )}

      {localPendingAction && localPendingAction.type === 'TELLING_TIME' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Telling Time</h3>
               <p className="text-slate-300 text-sm mb-6">Assign 1 to Hand and 1 to Top. The remainder goes to the Bottom.</p>
               <div className="flex gap-4 justify-center mb-6">
                  {localPendingAction.cards.map(c => (
                     <div key={c.id} className="flex flex-col items-center gap-2">
                       <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                        <button onClick={() => dispatch({ type: 'UPDATE_TELLING_TIME', cardId: c.id, dest: 'hand' })} className={`w-full text-[10px] font-bold py-1 rounded transition-colors ${localPendingAction.hand === c.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>HAND</button>
                        <button onClick={() => dispatch({ type: 'UPDATE_TELLING_TIME', cardId: c.id, dest: 'top' })} className={`w-full text-[10px] font-bold py-1 rounded transition-colors ${localPendingAction.top === c.id ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}`}>TOP</button>
                     </div>
                  ))}
               </div>
               <button disabled={!localPendingAction.hand || !localPendingAction.top || localPendingAction.hand === localPendingAction.top} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-8 py-3 bg-blue-600 disabled:bg-slate-700 text-white font-bold rounded-xl w-full">Confirm</button>
            </div>
         </PeekableDialogOverlay>
      )}

      {localPendingAction && localPendingAction.type === 'HALIMAR_DEPTHS' && (
         <PeekableDialogOverlay
           peekActive={isBattlefieldPeekActive}
           onPeekStart={handleBattlefieldPeekStart}
           onPeekEnd={handleBattlefieldPeekEnd}
           overlayClassName="z-[100] flex flex-col items-center justify-center p-4 pb-24"
         >
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Halimar Depths</h3>
               <p className="text-slate-300 text-sm mb-5">Reorder the top 3 cards of your library.</p>
               <div className="w-full overflow-x-auto overflow-y-visible custom-scrollbar pb-3">
                  <div className="flex gap-4 justify-center items-start min-w-max mx-auto px-1">
                     {localPendingAction.cards.map((c, i) => (
                        <div 
                           key={c.id} 
                           className="flex flex-col items-center gap-2 pb-1"
                           draggable={true} 
                           onDragStart={() => setDraggedIdx(i)} 
                           onDragOver={(e) => { e.preventDefault(); }}
                           onDrop={() => {
                              if (draggedIdx !== null && draggedIdx !== i) dispatch({ type: 'REORDER_HALIMAR', from: draggedIdx, to: i });
                              setDraggedIdx(null);
                           }}
                        >
                           <div className="flex gap-2">
                              <button disabled={i === 0} onClick={() => dispatch({ type: 'REORDER_HALIMAR', from: i, to: i - 1 })} className="px-2 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30">←</button>
                              <button disabled={i === localPendingAction.cards.length - 1} onClick={() => dispatch({ type: 'REORDER_HALIMAR', from: i, to: i + 1 })} className="px-2 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30">→</button>
                           </div>
                           <Card card={c} official={useOfficialCards} onZoom={null} disableHoverLift />
                           <div className="h-4 w-full text-center text-[10px] font-bold text-slate-400">
                              {i === 0 ? 'TOP' : i === localPendingAction.cards.length - 1 ? 'BOTTOM' : ''}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <button onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl w-full transition-colors">Confirm Order</button>
            </div>
         </PeekableDialogOverlay>
      )}

      {/* GAME LOG MODAL */}
      {showLog && (
        <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col p-4 backdrop-blur-md">
           <div className="flex justify-between items-center mb-4 bg-slate-900 p-3 rounded-xl border border-slate-700 shadow-lg">
              <h2 className="font-arena-display font-bold tracking-[0.12em] uppercase text-blue-400 flex items-center gap-2"><Activity size={18}/> Battle Log</h2>
              <button onClick={() => setShowLog(false)} className="text-slate-400 hover:text-white p-1"><X size={20}/></button>
           </div>
           <div className="space-y-2 flex-1 overflow-y-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs custom-scrollbar">
             {state.log.map((entry, i) => (
               <div key={i} className={`p-2 rounded border border-transparent ${i === 0 ? 'bg-slate-800 border-slate-600 text-blue-300 font-bold' : 'text-slate-400'}`}>{entry}</div>
             ))}
           </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="absolute inset-0 bg-black/80 z-[120] flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
            <h3 className="font-arena-display text-xl font-bold text-red-300 mb-2 tracking-[0.12em] uppercase">
              {isAiMirror ? 'Exit Match' : 'Concede'}
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              {isAiMirror
                ? 'Do you want to leave this match and go back to the menu?'
                : 'Do you want to concede and go back to the menu?'}
            </p>
            <div className="flex gap-4 w-full">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={returnToMenu} className="flex-1 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARENA STYLE PASS BUTTON - MOVED TO BOTTOM RIGHT */}
      {!isAiMirror && !hidePassButton && <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-[150] flex flex-col items-center pointer-events-auto">
         <button
           disabled={hidePassButton || state.priority !== 'player' || state.stackResolving || isAutoPassing}
           onClick={() => { AudioEngine.init(); dispatch({ type: 'PASS_PRIORITY', player: 'player' }); }}
           onTouchEnd={(e) => e.currentTarget.blur()}
           className={`arena-pass-button relative group overflow-hidden w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_25px_rgba(0,0,0,0.8)] border-2 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ${
              isAutoPassing ? 'bg-amber-900 border-amber-500 animate-pulse text-amber-400' :
              state.priority === 'player' && !state.stackResolving ? `${btnColorClass} hover:scale-[1.05]` : 'bg-slate-800 border-slate-700 text-slate-500'
           }`}
           style={{ WebkitTapHighlightColor: 'transparent' }}
         >
           {state.priority === 'player' && !state.stackResolving && !isAutoPassing && <div className="arena-pass-button-glow" aria-hidden="true"></div>}
           {passIcon}
           <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-center leading-tight px-1">{passLabel}</span>
         </button>
      </div>}

      {/* --- STRICT VERTICAL BATTLEFIELD --- */}
      <div className="flex flex-col flex-1 relative w-full h-full pb-2">
        
        {/* OPPONENT ZONE */}
        <div className="flex flex-col h-[30%] shrink-0 justify-end relative z-10 px-2 bg-red-950/10">
           {/* Opponent Avatar Badge */}
           <div className="absolute top-2 left-2 flex items-center gap-3 z-30 bg-slate-900/90 pr-4 pl-1 py-1 rounded-full border border-slate-700 shadow-xl">
              <div className="relative">
                 <img src={opponentAvatarSrc} className="w-10 h-10 rounded-full object-cover border-2 border-red-900" alt="AI Avatar" />
                 <div className="absolute -bottom-1 -right-1 bg-red-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-red-500 shadow-lg">{state.ai.life}</div>
              </div>
              <div className="flex flex-col">
                 <span className={`text-xs text-slate-100 font-black tracking-[0.08em] ${isPeerMatch ? '' : 'uppercase'}`}>{isPeerMatch ? peerOpponentName : (currentOpponentCharacter?.name || AI_DIFFICULTY_LABELS[state.difficulty] || 'Opponent')}</span>
                 <span className="text-[10px] text-slate-200 font-mono flex items-center gap-1">Hand: {state.ai.hand.length}</span>
                 {showPeerClock && displayedOpponentClockMs !== null && (
                   <div className="mt-1">
                     <MatchClockPill valueMs={displayedOpponentClockMs} running={isOpponentClockRunning} />
                   </div>
                 )}
              </div>
           </div>

            {isAiMirror && (
              <div className="h-[28%] flex items-start justify-center px-8 pt-2 overflow-x-visible">
                <div className="relative h-[110px] sm:h-[138px] w-full max-w-3xl">
                  {state.ai.hand.map((c, i) => (
                    <div
                      key={c.id}
                      className="absolute left-1/2 top-0 -translate-x-1/2 origin-top transition-all duration-200"
                      style={getHandFanStyle(i, state.ai.hand.length, 'top')}
                    >
                      <Card card={c} zone="hand" official={useOfficialCards} onZoom={setZoomedCard} />
                    </div>
                  ))}
                </div>
              </div>
            )}

           <div className={`${isAiMirror ? 'h-[32%]' : 'h-[45%]'} min-h-[108px] sm:min-h-[132px] flex items-center px-3 sm:px-4 overflow-visible`}>
              <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar py-3">
                <div className="flex justify-center min-w-full">
                  <div className="flex items-start gap-2 sm:gap-3 w-max">
                  {groupLands(state.ai.board).map((group, i) => (
                     <StackedLandGroup key={i} lands={group} official={useOfficialCards} state={state} zone="board" onZoom={setZoomedCard} onClick={(card) => handleCardClick(card, 'board')} selectedStackEntryId={selectedStackEntryId} />
                  ))}
                  </div>
                </div>
              </div>
           </div>
           <div className="h-[50%] flex items-center px-4 mt-1">
              <BoardPermanentRow
                stacks={getBoardPermanentStacks(state.ai.board)}
                official={useOfficialCards}
                state={state}
                onZoom={setZoomedCard}
                onClick={(card) => handleCardClick(card, 'board')}
                className="custom-scrollbar"
                selectedStackEntryId={selectedStackEntryId}
              />
           </div>
        </div>

        {/* TRENCH / MIDDLE ZONE */}
        <div className="h-[20%] shrink-0 relative px-2 sm:px-4 z-30 bg-black/40 border-y border-blue-900/30 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-sm overflow-visible">
          
          {/* Glowing central divider */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] -translate-y-1/2 pointer-events-none" />
          
          {/* Centered Phase Tracker Pill */}
          <div className={`absolute top-1/2 -translate-y-1/2 z-50 flex items-center transition-all duration-300 left-1/2 -translate-x-1/2 ${state.stack.length > 0 ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
              <PhaseTracker currentPhase={state.phase} turn={state.turn} />
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-2 z-40 pointer-events-none">
             {state.stack.map((s, i) => (
                <div key={s.card.id} className="relative group shrink-0 animate-in zoom-in-50 duration-200 pointer-events-auto" style={{ zIndex: i, marginLeft: i === 0 ? 0 : -18 }}>
                  <Card card={s.card} zone="stack" official={useOfficialCards} onZoom={setZoomedCard} targetable={isValidTarget(s.card, 'stack', state)} stackTargeted={isStackTargetHighlighted(s.card, 'stack', state, selectedStackEntryId)} onClick={() => handleCardClick(s.card, 'stack')} />
                </div>
              ))}
            </div>
        </div>

        {/* PLAYER ZONE */}
        <div className="flex flex-col h-[50%] shrink-0 pt-1 relative z-20 px-2 bg-blue-950/10">
           {/* Player Avatar Badge */}
           <div className="absolute top-2 left-2 flex items-center gap-3 z-30 bg-slate-900/90 pr-4 pl-1 py-1 rounded-full border border-slate-700 shadow-xl">
              <div className="relative">
                 <img src={CARDS.DANDAN.image} className="w-10 h-10 rounded-full object-cover border-2 border-blue-600" alt="Player Avatar" />
                 <div className="absolute -bottom-1 -right-1 bg-blue-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-blue-400 shadow-lg">{state.player.life}</div>
              </div>
              <div className="flex flex-col">
                 <span className={`text-[10px] text-blue-300 font-bold tracking-wider ${isPeerMatch && !isAiMirror ? '' : 'uppercase'}`}>{isAiMirror ? 'AI South' : isPeerMatch ? peerPlayerName : 'You'}</span>
                 {isAiMirror && currentPlayerAiCharacter && (
                   <span className="text-xs text-blue-100 font-black tracking-[0.08em] uppercase">{currentPlayerAiCharacter.name}</span>
                 )}
                 <div className="flex gap-2">
                    <span className="text-xs text-sky-400 font-mono flex items-center gap-1"><Droplet size={10} fill="currentColor"/> {getAvailableMana(state.player.board, state, 'player')}</span>
                    {getManaPool(state, 'player').total > 0 && (
                      <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/40">
                        Pool {getManaPool(state, 'player').blue}U
                      </span>
                    )}
                 </div>
                 {showPeerClock && displayedPlayerClockMs !== null && (
                   <div className="mt-1">
                     <MatchClockPill valueMs={displayedPlayerClockMs} running={isPlayerClockRunning} />
                   </div>
                 )}
              </div>
           </div>

           <div className="h-[30%] flex items-center px-4 mt-6 sm:mt-8">
              <BoardPermanentRow
                stacks={getBoardPermanentStacks(state.player.board)}
                official={useOfficialCards}
                state={state}
                onZoom={setZoomedCard}
                onClick={(card) => handleCardClick(card, 'board')}
                getSubtleHighlight={canPlayerDeclareAttack}
                selectedStackEntryId={selectedStackEntryId}
              />
           </div>
           <div className="h-[25%] min-h-[108px] sm:min-h-[132px] flex items-center px-3 sm:px-4 mt-1 overflow-visible">
              <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar py-3">
                <div className="flex justify-center min-w-full">
                  <div className="flex items-start gap-2 sm:gap-3 w-max">
                  {groupLands(state.player.board).map((group, i) => (
                     <StackedLandGroup key={i} lands={group} official={useOfficialCards} state={state} zone="board" onZoom={setZoomedCard} onClick={(card) => handleCardClick(card, 'board')} activatablePlayer="player" selectedStackEntryId={selectedStackEntryId} />
                  ))}
                  </div>
                </div>
              </div>
           </div>
            <div className="flex-1 flex items-end justify-center px-2 pb-2 mt-auto z-40 w-full overflow-x-visible">
               <div className="flex justify-center relative h-[100px] sm:h-[130px] w-full max-w-lg pr-12">
                  {state.player.hand.map((c, i) => {
                    return (
                      <div 
                         key={c.id} 
                         className={`absolute bottom-0 transition-all duration-200 group origin-bottom ${state.priority === 'player' && !isAiMirror ? 'hover:-translate-y-8 cursor-pointer' : ''}`}
                         style={{ ...getHandFanStyle(i, state.player.hand.length, 'bottom'), zIndex: draggedIdx === i ? 80 : 20 + i }}
                      >
                         <Card 
                            card={c} zone="hand" official={useOfficialCards} onClick={(card) => handleCardClick(card, 'hand')} onZoom={setZoomedCard}
                            castable={!isAiMirror && (isCastable(c, state) || isCyclable(c, state))}
                            draggable={true} onDragStart={() => setDraggedIdx(i)} onDragOver={(e) => { e.preventDefault(); }}
                            onDrop={() => {
                               if (draggedIdx !== null && draggedIdx !== i) dispatch({ type: 'REORDER_HAND', from: draggedIdx, to: i });
                               setDraggedIdx(null);
                            }}
                         />
                      </div>
                    );
                  })}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
