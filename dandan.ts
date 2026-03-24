import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Play, SkipForward, Activity, Layers, Skull, Image as ImageIcon, Settings, X, Sun, Moon, Swords, Volume2, VolumeX, ArrowLeftRight, Target, Droplet, Shield, CloudRain, LogOut } from 'lucide-react';
import { AI_DIFFICULTIES, AI_DIFFICULTY_LABELS, AI_SPEED, CARDS, DANDAN_NAME, PREDICT_OPTIONS, SHARED_DECK_SIZE, canDandanAttackDefender, checkHasActions, chooseAiAction, controlsIsland, createGameReducer, getAiPendingActions, getAvailableMana, getLivePolicyWeights, getManaPool, initialState, isActivatable, isCastable, isCyclable, isValidTarget } from './src/game/engine';

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
  playResolve() { 
    this.playSplash(780, 220, 0.28, 0.05);
    this.playTone(620, 'triangle', 0.22, 0.04, 980); 
    setTimeout(() => this.playBubble(1120, 0.13, 0.03), 120);
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
                   <div className={`h-[2px] w-1.5 sm:w-2 mx-0.5 rounded-full transition-colors ${isActive || currentPhase === phases[index+1].id ? 'bg-slate-500' : 'bg-slate-800'}`} />
                )}
             </React.Fragment>
           )
         })}
       </div>
    </div>
  );
};

const getGroupedList = (zoneList) => {
  const groups = {};
  zoneList.forEach(c => {
     const key = `${c.name}|${c.fullImage || c.image || ''}`;
     if(!groups[key]) groups[key] = { ...c, count: 0, groupKey: key };
     groups[key].count++;
  });
  return Object.values(groups).sort((a,b) => b.count - a.count);
};

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
  if (total <= 4) return 0.5;
  if (total === 5) return 0.4;
  if (total === 6) return 0.3;
  if (total === 7) return 0.2;
  return 0.1;
};

const getLandStackStep = (total) => {
  const revealRatio = getLandStackRevealRatio(total);
  return {
    mobile: Math.max(6, Math.round(64 * revealRatio)),
    desktop: Math.max(8, Math.round(80 * revealRatio))
  };
};

const ASSET_BASE_URL = import.meta.env.BASE_URL;

const DIFFICULTY_ART = {
  easy: `${ASSET_BASE_URL}difficulty/deathfish.png`,
  medium: `${ASSET_BASE_URL}difficulty/redfish.png`,
  hard: `${ASSET_BASE_URL}difficulty/shark.png`
};

// --- PRELOADER COMPONENT ---
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const urls = new Set();
    Object.values(CARDS).forEach(c => { urls.add(c.image); urls.add(c.fullImage); });
    Object.values(DIFFICULTY_ART).forEach(url => urls.add(url));
    const urlArray = Array.from(urls);
    let loaded = 0;
    
    if (urlArray.length === 0) return onComplete();
    
    urlArray.forEach(url => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setProgress(Math.floor((loaded / urlArray.length) * 100));
        if (loaded === urlArray.length) setTimeout(onComplete, 300);
      };
      img.src = url;
    });
  }, [onComplete]);

  return (
    <div className="h-dvh bg-[#05101b] flex items-center justify-center overflow-hidden relative p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(56,189,248,0.1),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(103,232,249,0.08),transparent_30%),linear-gradient(180deg,#03101c_0%,#082035_52%,#04111b_100%)]" />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-screen" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
      <div className="absolute left-[-3rem] top-10 w-44 h-44 rounded-full bg-cyan-300/16 blur-3xl" />
      <div className="absolute right-[-2rem] bottom-10 w-48 h-48 rounded-full bg-sky-300/12 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative mx-auto h-32 sm:h-36 w-full rounded-[999px] border border-cyan-100/10 bg-slate-950/60 backdrop-blur-2xl shadow-[0_24px_70px_rgba(2,6,23,0.65)] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_100%)]" />
          <div
            className="absolute inset-y-0 left-0 rounded-[999px] bg-gradient-to-r from-cyan-500/75 via-sky-400/55 to-cyan-200/10 transition-all duration-300"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-100/15" />

          <div className="absolute left-[12%] top-[28%] w-2.5 h-2.5 rounded-full border border-cyan-100/40 bg-cyan-200/10 bubble-rise-1" />
          <div className="absolute left-[48%] top-[58%] w-1.5 h-1.5 rounded-full border border-cyan-100/35 bg-cyan-200/10 bubble-rise-2" />
          <div className="absolute right-[16%] top-[36%] w-2 h-2 rounded-full border border-cyan-100/40 bg-cyan-200/10 bubble-rise-3" />

          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `calc(${Math.min(progress, 96)}% - 2.75rem)` }}
          >
            <div className="relative fish-bob">
              <div className="w-16 h-10 rounded-[999px] bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 shadow-[0_0_24px_rgba(251,146,60,0.4)] border border-orange-100/30" />
              <div className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-r-[14px] border-r-orange-300/90" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-950/85 border border-white/20" />
              <div className="absolute right-[6px] top-[17px] w-1 h-1 rounded-full bg-white/90" />
              <div className="absolute left-[18px] -top-2 w-4 h-4 rounded-t-[999px] rounded-b-sm bg-orange-400/90 rotate-[-18deg]" />
              <div className="absolute left-[20px] -bottom-2 w-4 h-4 rounded-b-[999px] rounded-t-sm bg-orange-500/85 rotate-[14deg]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- RESPONSIVE CARD COMPONENT ---
const Card = ({ card, onClick, onZoom, zone = 'hand', style = {}, hidden = false, official = false, draggable = false, onDragStart, onDragOver, onDrop, castable = false, targetable = false, activatable = false, subtleHighlight = false, disableHoverLift = false }) => {
  const holdTimer = useRef(null);
  const [isPressing, setIsPressing] = useState(false);

  const startHold = (e) => {
     if (e.type === 'mousedown' && e.button === 2) {
        e.preventDefault();
        onZoom && onZoom(card);
        return;
     }
     if (zone === 'board' && card.isLand) setIsPressing(true);
     holdTimer.current = setTimeout(() => {
        onZoom && onZoom(card);
     }, 600); 
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
  if (zone === 'stack') dims = "w-[86px] h-[120px] sm:w-[116px] sm:h-[162px]";

  let ringClass = '';
  let interactionClass = '';
  
  if (targetable) {
      ringClass = 'ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse cursor-crosshair';
  } else if (castable && zone === 'hand') {
      ringClass = 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-950 shadow-[0_0_15px_rgba(96,165,250,0.6)]';
      interactionClass = disableHoverLift ? 'cursor-pointer' : 'cursor-pointer hover:-translate-y-4';
  } else if (activatable && zone === 'board') {
      ringClass = 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse cursor-pointer';
      interactionClass = 'cursor-pointer hover:scale-[1.02]';
  } else if (card.attacking) {
      ringClass = 'ring-2 ring-orange-500 ring-offset-1 shadow-[0_0_15px_rgba(249,115,22,0.8)]';
  } else if (card.blocking) {
      ringClass = 'ring-2 ring-green-500 ring-offset-1 shadow-[0_0_15px_rgba(34,197,94,0.8)]';
  } else if (subtleHighlight) {
      ringClass = 'ring-1 ring-amber-300/75 ring-offset-1 ring-offset-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.18)]';
  } else {
      if (zone === 'hand') interactionClass = disableHoverLift ? 'cursor-pointer' : 'cursor-pointer hover:-translate-y-4';
      if (zone === 'board' && card.name === 'DandÃ¢n' && !card.tapped && !card.summoningSickness) interactionClass = 'cursor-pointer hover:ring-2 hover:ring-slate-400';
  }
  if (zone === 'board' && card.isLand) {
    interactionClass = `${interactionClass} cursor-pointer hover:ring-1 hover:ring-cyan-200/70 hover:ring-offset-1 hover:ring-offset-slate-950 hover:shadow-[0_0_10px_rgba(125,211,252,0.2)]`.trim();
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
        <div className="absolute inset-[-2px] rounded-[8px] border border-cyan-100/70 bg-cyan-200/8 shadow-[0_0_12px_rgba(34,211,238,0.22)] pointer-events-none z-50" />
      )}
      <div className="absolute inset-0 bg-slate-900" />
      {hidden ? <CardBack /> : official ? (
        <img src={card.fullImage} alt={card.name} className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none" />
      ) : (
        <div className="absolute inset-0 border-[3px] border-slate-900 rounded-md flex flex-col bg-slate-500 p-[2px]">
          <div className={`absolute inset-0 opacity-90 ${card.isLand ? 'bg-sky-200' : 'bg-blue-600'}`}></div>
          <div className="relative z-10 flex flex-col h-full gap-0.5">
            <div className="bg-slate-100/95 border border-slate-400 rounded-sm flex justify-between items-center px-1 shadow-sm h-3">
              <span className="font-bold text-slate-900 text-[5px] truncate">{card.name}</span>
              <span className="font-bold text-slate-800 text-[5px]">{card.manaCost}</span>
            </div>
            <div className="flex-1 bg-slate-800/80 border border-slate-500 rounded-sm overflow-hidden flex items-center justify-center relative shadow-inner">
               <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" onError={(e) => { e.target.style.display = 'none'; }} />
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
        <div className={`absolute inset-0 rounded-md z-30 pointer-events-none flex items-center justify-center ${card.isLand ? 'bg-sky-950/30 border border-sky-300/30 shadow-[inset_0_0_18px_rgba(125,211,252,0.2)]' : 'bg-black/50'}`}>
          <div className={`w-4 h-4 rounded-full border-2 rotate-90 ${card.isLand ? 'border-sky-100 opacity-80' : 'border-slate-300 opacity-50'}`} style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}/>
        </div>
      )}
      {card.isSwamp && zone === 'board' && <div className="absolute inset-0 bg-purple-900/60 rounded-md z-20 pointer-events-none mix-blend-multiply flex items-center justify-center"><span className="text-purple-300 font-bold rotate-45 opacity-60 text-xs">SWAMP</span></div>}
      {card.summoningSickness && !card.isLand && zone === 'board' && (
         <div className="absolute top-1 right-1 bg-slate-900/85 rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow z-40 text-[8px] font-black tracking-tight text-slate-100" title="Summoning Sickness">
            Zz
         </div>
      )}
    </div>
  );
};

// --- STACKED LAND COMPONENT ---
const StackedLandGroup = ({ lands, official, state, zone, onZoom, onClick, activatablePlayer = null }) => {
  if (!lands || lands.length === 0) return null;
  const total = lands.length;
  const { mobile, desktop } = getLandStackStep(total);
  const orderedLands = [...lands].sort((a, b) => {
    const aActivatable = zone === 'board' && activatablePlayer ? isActivatable(a, state, activatablePlayer) : false;
    const bActivatable = zone === 'board' && activatablePlayer ? isActivatable(b, state, activatablePlayer) : false;
    if (aActivatable !== bActivatable) return aActivatable ? 1 : -1;
    if (a.tapped !== b.tapped) return a.tapped ? -1 : 1;
    return 0;
  });
  const activatableLand = zone === 'board' && activatablePlayer
    ? orderedLands.find(land => isActivatable(land, state, activatablePlayer))
    : null;
  const isGroupActivatable = Boolean(activatableLand);
  const tapped = lands.filter(l => l.tapped).length;

  return (
    <div
      className={`land-stack-group ${isGroupActivatable ? 'drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]' : ''}`}
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
            activatable={Boolean(activatablePlayer) && isActivatable(land, state, activatablePlayer)}
          />
        </div>
      ))}
      {isGroupActivatable && zone === 'board' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 border border-cyan-200 font-black px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)] text-[9px] tracking-widest z-20">
          ACTIVATE
        </div>
      )}
      {tapped > 0 && total >= 5 && (
        <div className="absolute -bottom-1 right-0 bg-slate-950/95 text-slate-300 border border-slate-700 font-bold px-1.5 py-0.5 rounded shadow text-[9px] z-20">
          {tapped} tap
        </div>
      )}
    </div>
  );
};

const AttachedPermanentStack = ({ permanent, attachedAuras = [], official, state, onZoom, onClick, subtleHighlight = false }) => {
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
          subtleHighlight={subtleHighlight}
        />
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [preloaded, setPreloaded] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [useOfficialCards, setUseOfficialCards] = useState(true);
  const [showMenuSettings, setShowMenuSettings] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [muted, setMuted] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [zoomedCard, setZoomedCard] = useState(null); 
  const [viewingZone, setViewingZone] = useState(null); 
  const isAiMirror = state.gameMode === 'ai_vs_ai';
  const difficultySpeed = AI_SPEED[state.difficulty] || AI_SPEED.medium;
  const opponentAvatarSrc = DIFFICULTY_ART[state.difficulty || selectedDifficulty] || DIFFICULTY_ART.medium;

  useEffect(() => { AudioEngine.muted = muted; }, [muted]);

  useEffect(() => {
    if (state.stackResolving && !state.pendingAction) {
      const timer = setTimeout(() => { dispatch({ type: 'RESOLVE_TOP_STACK' }); }, isAiMirror ? 20 : difficultySpeed.resolve);
      return () => clearTimeout(timer);
    }
  }, [state.stackResolving, state.pendingAction, isAiMirror, difficultySpeed.resolve]);

  useEffect(() => {
    if (isAiMirror) return;
    if (state.winner || state.stackResolving || state.pendingTargetSelection || state.pendingAction || state.priority !== 'player') return;
    if (!checkHasActions(state, 'player')) {
      const delay = state.stack.length > 0 ? 800 : 150; 
      const timer = setTimeout(() => { dispatch({ type: 'PASS_PRIORITY', player: 'player' }); }, delay); 
      return () => clearTimeout(timer);
    }
  }, [state.priority, state.actionCount, state.stackResolving, state.winner, state.pendingTargetSelection, state.pendingAction, state.turn, state.phase, state.stack.length, isAiMirror]);

  useEffect(() => {
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
  }, [state.priority, state.actionCount, state.stackResolving, state.winner, state.turn, state.phase, state.pendingAction, isAiMirror, difficultySpeed.think, difficultySpeed.pass]);

  const resolveAiPendingAction = () => {
    if (!state.pendingAction) return;
    const policy = getLivePolicyWeights(state.difficulty || 'medium');
    const actions = getAiPendingActions(state, policy, 'player');
    if (actions.length === 0) return;
    actions.forEach(action => dispatch(action));
  };

  const takeAiAction = (actor) => {
    const difficulty = state.difficulty || 'medium';
    const policy = getLivePolicyWeights(difficulty);
    dispatch(chooseAiAction(state, actor, difficulty, policy));
  };

  const handleCardClick = (card, zone) => {
    if (isAiMirror) return;
    if (state.priority !== 'player') return;
    
    if (state.pendingTargetSelection && isValidTarget(card, zone, state)) {
       dispatch({ type: 'CAST_WITH_TARGET', targetId: card.id, targetZone: zone }); return;
    }
    
    if (zone === 'hand') {
      const canPlay = isCastable(card, state);
      const canCycle = isCyclable(card, state);
      if (card.isLand && canPlay && canCycle) {
        dispatch({ type: 'PROMPT_HAND_LAND_ACTION', cardId: card.id });
        return;
      }
      if (card.isLand && canCycle) {
        dispatch({ type: 'PROMPT_HAND_LAND_ACTION', cardId: card.id });
        return;
      }
      if (canPlay) {
        card.isLand ? dispatch({ type: 'PLAY_LAND', player: 'player', cardId: card.id }) : dispatch({ type: 'CAST_SPELL', player: 'player', cardId: card.id });
      }
    } else if (zone === 'board') {
      if (card.name === 'DandÃ¢n') {
         if (state.phase === 'declare_attackers' && state.turn === 'player' && !card.summoningSickness && !card.tapped) {
            dispatch({ type: 'TOGGLE_ATTACK', cardId: card.id, player: 'player' });
         } else if (state.phase === 'declare_blockers' && state.turn === 'ai' && !card.tapped) {
            dispatch({ type: 'TOGGLE_BLOCK', cardId: card.id, player: 'player' });
         }
      } else if (card.isLand && isActivatable(card, state)) {
         dispatch({ type: 'PROMPT_ACTIVATE_LAND', cardId: card.id, cardName: card.name });
      }
    }
  };

  const groupLands = (board) => {
     const lands = board.filter(c => c.isLand);
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
    !card.tapped &&
    canDandanAttackDefender(card, state.ai.board);

  if (!preloaded) return <Preloader onComplete={() => setPreloaded(true)} />;

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
          <div className="relative w-full max-h-full overflow-hidden rounded-[2.1rem] bg-slate-950/66 backdrop-blur-3xl shadow-[0_28px_80px_rgba(2,6,23,0.68)]">
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
                <button
                  onClick={() => setShowMenuSettings(true)}
                  aria-label="Open settings"
                  className="shrink-0 w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 hover:bg-slate-800 active:scale-[0.97] transition-all flex items-center justify-center shadow-[0_12px_28px_rgba(2,6,23,0.35)]"
                >
                  <Settings size={17} />
                </button>
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

              <div className="grid gap-3">
                <button
                  onClick={() => dispatch({ type: 'START_GAME', mode: 'player', difficulty: selectedDifficulty })}
                  className="w-full min-h-[60px] py-4 px-4 bg-[#38bdf8] hover:bg-[#22c7ff] active:scale-[0.99] text-slate-950 font-bold tracking-[0.04em] uppercase rounded-[1.55rem] text-base border border-sky-200/70 shadow-[0_16px_28px_rgba(56,189,248,0.28)] transition-all flex items-center justify-center gap-2"
                >
                  <Play fill="currentColor" size={18} /> Start New Game
                </button>
                <button
                  onClick={() => dispatch({ type: 'START_GAME', mode: 'ai_vs_ai', difficulty: selectedDifficulty })}
                  className="w-full min-h-[60px] py-4 px-4 bg-slate-900/92 hover:bg-slate-800 active:scale-[0.99] text-slate-100 font-bold tracking-[0.04em] uppercase rounded-[1.55rem] text-base border border-slate-600 shadow-[0_16px_28px_rgba(15,23,42,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={18} /> AI Mode
                </button>
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
      </div>
    );
  }

  if (state.winner) {
    return (
      <div className="h-dvh bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm w-full bg-slate-900/80 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <h1 className="font-arena-display text-4xl font-black tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400">
             {state.winner === 'player' ? 'VICTORY' : 'DEFEAT'}
          </h1>
          <button onClick={() => dispatch({ type: 'START_GAME', mode: state.gameMode, difficulty: state.difficulty })} className="w-full py-3 bg-[#38bdf8] hover:bg-[#22c7ff] text-slate-950 rounded-xl font-bold tracking-widest uppercase border border-sky-200/70 shadow-[0_0_24px_rgba(56,189,248,0.28)] transition-colors">Play Again</button>
          <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="w-full py-3 bg-slate-900/92 hover:bg-slate-800 text-slate-100 rounded-xl font-bold tracking-widest uppercase border border-slate-600 transition-colors">Back To Menu</button>
        </div>
      </div>
    );
  }

  const isAutoPassing = state.priority === 'player' && !state.stackResolving && !state.pendingTargetSelection && !state.pendingAction && !checkHasActions(state, 'player');

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
     const oppHasIsland = controlsIsland(state.ai.board);
     const canAttack = state.player.board.some(c => c.name === 'DandÃ¢n' && !c.summoningSickness && !c.tapped);
     passLabel = (oppHasIsland && canAttack) ? 'TO COMBAT' : 'END TURN';
     passIcon = (oppHasIsland && canAttack) ? <Swords size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'}/> : <Moon size={14} className={state.priority === 'player' ? 'text-current' : 'text-slate-600'}/>;
     btnColorClass = (oppHasIsland && canAttack) ? 'bg-gradient-to-b from-orange-400 to-orange-600 border-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.6)] text-slate-900' : 'bg-gradient-to-b from-indigo-400 to-indigo-600 border-indigo-200 shadow-[0_0_20px_rgba(129,140,248,0.6)] text-white';
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
      <div className="flex justify-between items-center p-2 bg-slate-950/90 border-b border-slate-800 z-50 shrink-0 shadow-md backdrop-blur-sm">
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
      {state.phase === 'mulligan' && !state.pendingAction && (
         <div className="absolute inset-0 bg-black/90 z-[110] flex flex-col items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
             <h2 className="font-arena-display text-4xl font-black tracking-[0.12em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2 text-center w-full">Starting Hand</h2>
             <p className="text-slate-400 mb-8 font-mono">Mulligans taken: {state.mulliganCount || 0}</p>
             
             <div className="flex gap-2 sm:gap-4 justify-center mb-12 flex-wrap max-w-4xl">
                {state.player.hand.map(c => <div key={c.id} className="animate-in slide-in-from-bottom-8"><Card card={c} official={useOfficialCards} onZoom={setZoomedCard} /></div>)}
             </div>
  
              <div className="flex gap-6">
                 <button onClick={() => dispatch({ type: 'KEEP_HAND' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105">Keep Hand</button>
                <button disabled={(state.mulliganCount || 0) >= 7} onClick={() => dispatch({ type: 'MULLIGAN' })} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-200 font-black tracking-widest uppercase rounded-xl shadow-lg border border-slate-700 transition-all hover:scale-105 disabled:hover:scale-100">Mulligan</button>
              </div>
          </div>
      )}

      {/* MULTI-CARD SELECT PENDING MODAL */}
      {state.pendingAction && ['MULLIGAN_BOTTOM', 'DISCARD_CLEANUP'].includes(state.pendingAction.type) && (
         <div className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl flex flex-col items-center text-center">
               <h3 className="font-arena-display text-2xl font-black text-blue-400 mb-2 tracking-[0.16em] uppercase">{state.pendingAction.type === 'MULLIGAN_BOTTOM' ? 'Mulligan' : 'Cleanup Step'}</h3>
               <p className="text-slate-300 text-sm mb-8">Select <span className="text-white font-bold text-lg">{state.pendingAction.count}</span> card(s) to discard or put on bottom.</p>
               <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {state.player.hand.map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'TOGGLE_PENDING_SELECT', cardId: c.id })} className={`cursor-pointer transition-all duration-200 ${state.pendingAction.selected.includes(c.id) ? 'ring-4 ring-blue-500 rounded-md shadow-[0_10px_20px_rgba(37,99,235,0.5)]' : 'opacity-80 hover:opacity-100'}`}>
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button disabled={state.pendingAction.selected.length !== state.pendingAction.count} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-10 py-4 bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black tracking-widest uppercase rounded-xl shadow-lg transition-all disabled:shadow-none hover:bg-blue-500">Confirm</button>
            </div>
         </div>
      )}

      {/* LAND ACTIVATION PROMPT */}
      {state.pendingAction && state.pendingAction.type === 'ACTIVATE_LAND' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Activate Ability</h3>
               <p className="text-slate-300 text-sm mb-6">
                 {state.pendingAction.cardName === 'Svyelunite Temple'
                   ? <>Are you sure you want to sacrifice <strong>{state.pendingAction.cardName}</strong> to add <strong>2 blue mana</strong>?</>
                   : <>Do you want to sacrifice <strong>{state.pendingAction.cardName}</strong> and pay {state.pendingAction.activation?.total ?? 0} mana to activate its ability?</>}
               </p>
               <div className="flex gap-4 w-full">
                  <button onClick={() => dispatch({ type: 'CANCEL_PENDING_ACTION' })} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
                  <button onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors">Activate</button>
               </div>
            </div>
         </div>
      )}

      {state.pendingAction && state.pendingAction.type === 'HAND_LAND_ACTION' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">{state.pendingAction.cardName}</h3>
               <p className="text-slate-300 text-sm mb-6">
                 {state.pendingAction.canPlay && state.pendingAction.canCycle
                   ? 'Choose whether to play this land or cycle it.'
                   : `Cycle this land for ${state.pendingAction.cyclingCost}?`}
               </p>
               <div className="grid grid-cols-1 gap-3 w-full">
                  {state.pendingAction.canPlay && (
                    <button onClick={() => dispatch({ type: 'PLAY_LAND', player: 'player', cardId: state.pendingAction.cardId })} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">Play Land</button>
                  )}
                  {state.pendingAction.canCycle && (
                    <button onClick={() => dispatch({ type: 'CYCLE_CARD', player: 'player', cardId: state.pendingAction.cardId })} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors">Cycle {state.pendingAction.cyclingCost}</button>
                  )}
                  <button onClick={() => dispatch({ type: 'CANCEL_PENDING_ACTION' })} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
               </div>
            </div>
         </div>
      )}

      {/* MYSTIC SANCTUARY SELECTION MODAL */}
      {state.pendingAction && state.pendingAction.type === 'MYSTIC_SANCTUARY' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-4xl flex flex-col items-center text-center max-h-[90vh]">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Mystic Sanctuary</h3>
               <p className="text-slate-300 text-sm mb-6">Select an Instant or Sorcery from your graveyard to put on top of your library. Or skip.</p>
               <div className="flex flex-wrap gap-2 justify-center mb-6 overflow-y-auto custom-scrollbar p-2 w-full">
                  {state.graveyard.filter(c => state.pendingAction.validTargets.includes(c.id)).map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION', selectedCardId: c.id })} className="cursor-pointer transition-all hover:opacity-100 opacity-90">
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION', selectedCardId: null })} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl w-full max-w-sm transition-colors">Skip</button>
            </div>
         </div>
      )}

      {/* DECK & GRAVEYARD EXPLORER OVERLAYS */}
      {viewingZone && (
         <div className="absolute inset-0 bg-black/95 z-[160] flex flex-col p-4 sm:p-8 backdrop-blur-lg animate-in fade-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h2 className="font-arena-display text-2xl font-bold tracking-[0.12em] uppercase text-white flex items-center gap-3">
                   {viewingZone === 'deck' ? <Layers size={28} className="text-blue-400"/> : <Skull size={28} className="text-slate-400"/>} 
                   {viewingZone === 'deck' ? `Library ${state.deck.length}/${SHARED_DECK_SIZE}` : 'Graveyard'}
                </h2>
                <button onClick={() => setViewingZone(null)} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full transition-colors"><X size={24}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-wrap content-start justify-center gap-6 pb-20">
                {getGroupedList(state[viewingZone]).map(group => (
                   <div key={group.groupKey || `${group.name}-${group.count}`} className="relative group flex flex-col items-center animate-in zoom-in-95 duration-300">
                      <Card card={group} official={useOfficialCards} onZoom={setZoomedCard} />
                      <div className="absolute -top-3 -right-3 bg-blue-600 text-white font-black px-3 py-1 rounded-full border-2 border-slate-900 shadow-xl z-10 text-sm">
                         x{group.count}
                      </div>
                   </div>
                ))}
                {state[viewingZone].length === 0 && (
                   <div className="text-slate-500 text-2xl font-bold mt-32 flex flex-col items-center gap-4">
                      {viewingZone === 'deck' ? <Layers size={48}/> : <Skull size={48}/>}
                      Empty
                   </div>
                )}
             </div>
         </div>
      )}

      {/* TARGETING BANNER */}
      {state.pendingTargetSelection && (
         <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-500 text-white px-6 py-2 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] z-50 flex items-center gap-4 animate-in slide-in-from-top-4">
            <Target size={16} className="animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">Select Target for {state.pendingTargetSelection.spellName}</span>
            <button onClick={() => dispatch({ type: 'CANCEL_TARGETING' })} className="text-red-300 hover:text-white"><X size={16} /></button>
         </div>
      )}

      {/* PENDING RESOLUTION ACTIONS */}
      {state.pendingAction && state.pendingAction.type === 'BRAINSTORM' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Brainstorm</h3>
               <p className="text-slate-300 text-sm mb-6">Select 2 cards to put back on top of your library.</p>
               <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {state.player.hand.map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'TOGGLE_PENDING_SELECT', cardId: c.id })} className={`cursor-pointer transition-transform ${state.pendingAction.selected.includes(c.id) ? 'ring-4 ring-blue-500 rounded-md shadow-[0_10px_20px_rgba(37,99,235,0.45)]' : 'opacity-80'}`}>
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button disabled={state.pendingAction.selected.length !== 2} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-8 py-3 bg-blue-600 disabled:bg-slate-700 text-white font-bold rounded-xl w-full">Confirm</button>
            </div>
         </div>
      )}

      {state.pendingAction && state.pendingAction.type === 'DISCARD' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Chart a Course</h3>
               <p className="text-slate-300 text-sm mb-6">You haven't attacked. Select 1 card to discard.</p>
               <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {state.player.hand.map(c => (
                     <div key={c.id} onClick={() => dispatch({ type: 'TOGGLE_PENDING_SELECT', cardId: c.id })} className={`cursor-pointer transition-transform ${state.pendingAction.selected.includes(c.id) ? 'ring-4 ring-red-500 rounded-md shadow-[0_10px_20px_rgba(239,68,68,0.4)]' : 'opacity-80'}`}>
                        <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                     </div>
                  ))}
               </div>
               <button disabled={state.pendingAction.selected.length !== 1} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-8 py-3 bg-red-600 disabled:bg-slate-700 text-white font-bold rounded-xl w-full">Discard</button>
            </div>
         </div>
      )}

      {state.pendingAction && state.pendingAction.type === 'PREDICT' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
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
         </div>
      )}

      {state.pendingAction && state.pendingAction.type === 'TELLING_TIME' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Telling Time</h3>
               <p className="text-slate-300 text-sm mb-6">Assign 1 to Hand and 1 to Top. The remainder goes to the Bottom.</p>
               <div className="flex gap-4 justify-center mb-6">
                  {state.pendingAction.cards.map(c => (
                     <div key={c.id} className="flex flex-col items-center gap-2">
                       <Card card={c} official={useOfficialCards} onZoom={setZoomedCard} disableHoverLift />
                        <button onClick={() => dispatch({ type: 'UPDATE_TELLING_TIME', cardId: c.id, dest: 'hand' })} className={`w-full text-[10px] font-bold py-1 rounded transition-colors ${state.pendingAction.hand === c.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>HAND</button>
                        <button onClick={() => dispatch({ type: 'UPDATE_TELLING_TIME', cardId: c.id, dest: 'top' })} className={`w-full text-[10px] font-bold py-1 rounded transition-colors ${state.pendingAction.top === c.id ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}`}>TOP</button>
                     </div>
                  ))}
               </div>
               <button disabled={!state.pendingAction.hand || !state.pendingAction.top || state.pendingAction.hand === state.pendingAction.top} onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-8 py-3 bg-blue-600 disabled:bg-slate-700 text-white font-bold rounded-xl w-full">Confirm</button>
            </div>
         </div>
      )}

      {state.pendingAction && state.pendingAction.type === 'HALIMAR_DEPTHS' && (
         <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col items-center text-center">
               <h3 className="font-arena-display text-xl font-bold text-blue-400 mb-2 tracking-[0.12em] uppercase">Halimar Depths</h3>
               <p className="text-slate-300 text-sm mb-2">Reorder the top 3 cards of your library.</p>
               <p className="text-slate-500 text-[10px] mb-6 uppercase tracking-widest">(Use arrows or drag. Left is top.)</p>
               <div className="flex gap-4 justify-center mb-8 h-[130px]">
                  {state.pendingAction.cards.map((c, i) => (
                     <div 
                        key={c.id} 
                        className="relative flex flex-col items-center gap-2"
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
                           <button disabled={i === state.pendingAction.cards.length - 1} onClick={() => dispatch({ type: 'REORDER_HALIMAR', from: i, to: i + 1 })} className="px-2 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30">→</button>
                        </div>
                        <Card card={c} official={useOfficialCards} onZoom={null} disableHoverLift />
                        <div className="absolute -bottom-6 w-full text-center text-[10px] font-bold text-slate-400">
                           {i === 0 ? 'TOP' : i === state.pendingAction.cards.length - 1 ? 'BOTTOM' : ''}
                        </div>
                     </div>
                  ))}
               </div>
               <button onClick={() => dispatch({ type: 'SUBMIT_PENDING_ACTION' })} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl w-full transition-colors">Confirm Order</button>
            </div>
         </div>
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
              <button onClick={() => { setShowExitConfirm(false); dispatch({ type: 'RETURN_TO_MENU' }); }} className="flex-1 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARENA STYLE PASS BUTTON - MOVED TO BOTTOM RIGHT */}
      {!isAiMirror && <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-[150] flex flex-col items-center pointer-events-auto">
         <button
           disabled={state.priority !== 'player' || state.stackResolving || isAutoPassing}
           onClick={() => { AudioEngine.init(); dispatch({ type: 'PASS_PRIORITY', player: 'player' }); }}
           onTouchEnd={(e) => e.currentTarget.blur()}
           className={`arena-pass-button relative group overflow-hidden w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_25px_rgba(0,0,0,0.8)] border-2 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ${
              isAutoPassing ? 'bg-amber-900 border-amber-500 animate-pulse text-amber-400' :
              state.priority === 'player' && !state.stackResolving ? `${btnColorClass} hover:scale-[1.05]` : 'bg-slate-800 border-slate-700 text-slate-500'
           }`}
           style={{ WebkitTapHighlightColor: 'transparent' }}
         >
           {state.priority === 'player' && !state.stackResolving && !isAutoPassing && <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay pointer-events-none"></div>}
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
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isAiMirror ? 'AI North' : 'Opponent'}</span>
                 <span className="text-xs text-slate-200 font-mono flex items-center gap-1">Hand: {state.ai.hand.length}</span>
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
                     <StackedLandGroup key={i} lands={group} official={useOfficialCards} state={state} zone="board" onZoom={setZoomedCard} onClick={(card) => handleCardClick(card, 'board')} />
                  ))}
                  </div>
                </div>
              </div>
           </div>
           <div className="h-[50%] flex gap-2 justify-center items-center px-4 custom-scrollbar mt-1">
              {getBoardPermanentStacks(state.ai.board).map(({ key, permanent, attachedAuras }) => (
                <AttachedPermanentStack
                  key={key}
                  permanent={permanent}
                  attachedAuras={attachedAuras}
                  official={useOfficialCards}
                  state={state}
                  onZoom={setZoomedCard}
                  onClick={(card) => handleCardClick(card, 'board')}
                />
              ))}
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
                  <Card card={s.card} zone="stack" official={useOfficialCards} onZoom={setZoomedCard} targetable={isValidTarget(s.card, 'stack', state)} onClick={() => handleCardClick(s.card, 'stack')} />
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
                 <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{isAiMirror ? 'AI South' : 'You'}</span>
                 <div className="flex gap-2">
                    <span className="text-xs text-sky-400 font-mono flex items-center gap-1"><Droplet size={10} fill="currentColor"/> {getAvailableMana(state.player.board, state, 'player')}</span>
                    {getManaPool(state, 'player').total > 0 && (
                      <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-950/40">
                        Pool {getManaPool(state, 'player').blue}U
                      </span>
                    )}
                 </div>
              </div>
           </div>

           <div className="h-[30%] flex gap-2 justify-center items-center px-4 mt-6 sm:mt-8">
              {getBoardPermanentStacks(state.player.board).map(({ key, permanent, attachedAuras }) => (
                 <AttachedPermanentStack
                   key={key}
                   permanent={permanent}
                   attachedAuras={attachedAuras}
                   official={useOfficialCards}
                   state={state}
                   onZoom={setZoomedCard}
                   onClick={(card) => handleCardClick(card, 'board')}
                   subtleHighlight={canPlayerDeclareAttack(permanent)}
                 />
              ))}
           </div>
           <div className="h-[25%] min-h-[108px] sm:min-h-[132px] flex items-center px-3 sm:px-4 mt-1 overflow-visible">
              <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar py-3">
                <div className="flex justify-center min-w-full">
                  <div className="flex items-start gap-2 sm:gap-3 w-max">
                  {groupLands(state.player.board).map((group, i) => (
                     <StackedLandGroup key={i} lands={group} official={useOfficialCards} state={state} zone="board" onZoom={setZoomedCard} onClick={(card) => handleCardClick(card, 'board')} activatablePlayer="player" />
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
                            style={{ filter: state.priority === 'player' || isAiMirror ? 'none' : 'brightness(0.6)' }}
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
