import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Flame, Zap, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SHOP_ITEMS } from '../../data/shopItems';

interface CharacterEvolutionProps {
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const CharacterEvolution: React.FC<CharacterEvolutionProps> = ({
  size = 'md',
  showDetails = true,
}) => {
  const { state } = useGame();
  const { level, rank, equipped, evolutionStage } = state;
  const stage = evolutionStage;

  // Allows toggling between Anime Portrait mode (the uploaded Jin-Woo artwork) and Full Body RPG Armory mode
  const [viewMode, setViewMode] = useState<'anime' | 'armory'>('anime');

  // Resolve equipped items visual attributes
  const shirtItem = SHOP_ITEMS.find((i) => i.id === equipped.shirt);
  const pantsItem = SHOP_ITEMS.find((i) => i.id === equipped.pants);
  const hairItem = SHOP_ITEMS.find((i) => i.id === equipped.hairstyle);
  const shoesItem = SHOP_ITEMS.find((i) => i.id === equipped.shoes);
  const accessoryItem = SHOP_ITEMS.find((i) => i.id === equipped.accessory);
  const armorItem = SHOP_ITEMS.find((i) => i.id === equipped.armor);
  const fxItem = SHOP_ITEMS.find((i) => i.id === equipped.specialEffect);

  const auraColor =
    fxItem?.visualData.glowColor ||
    (stage >= 100
      ? '#00f0ff'
      : stage >= 75
      ? '#38bdf8'
      : stage >= 50
      ? '#8b5cf6'
      : stage >= 25
      ? '#0284c7'
      : '#0ea5e9');

  const coatColor =
    armorItem?.visualData.color ||
    shirtItem?.visualData.color ||
    (stage >= 75 ? '#090d16' : stage >= 50 ? '#0f172a' : stage >= 25 ? '#1e293b' : '#334155');

  const containerSizes = {
    sm: 'w-48 h-64',
    md: 'w-72 h-96',
    lg: 'w-88 h-[440px]',
  };

  // Image cropping/positioning based on evolution stage
  // Level 1-9: Trainee Jin-Woo with bandages (Left portion: object-position: 8% center)
  // Level 10+: Awakened Jin-Woo with blue glowing eyes (Center portion: object-position: 50% center)
  const isBeginner = level < 10;
  const imageObjectPosition = isBeginner ? '12% 40%' : '50% 35%';

  return (
    <div className="flex flex-col items-center">
      {/* Anime Character Hologram Canvas */}
      <div
        className={`relative ${containerSizes[size]} flex items-center justify-center rounded-3xl bg-gradient-to-b from-[#091533]/90 via-[#040816]/95 to-[#02040a] border-2 border-cyan-400/50 p-3 shadow-[0_0_40px_rgba(0,210,255,0.35)] overflow-hidden group`}
      >
        {/* Background Ambient Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            background:
              stage >= 50
                ? `radial-gradient(circle at 50% 50%, ${auraColor}40 0%, transparent 70%)`
                : `radial-gradient(circle at 50% 55%, rgba(0,210,255,0.2) 0%, transparent 65%)`,
          }}
        />

        {/* ================= MODE 1: OFFICIAL ANIME SUNG JIN-WOO PORTRAIT ================= */}
        {viewMode === 'anime' ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
            {/* The Authentic Anime Artwork */}
            <motion.img
              src="/sung.avif"
              alt="Sung Jin-Woo Anime Character"
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                objectPosition: imageObjectPosition,
                filter:
                  stage >= 50
                    ? 'contrast(1.1) saturate(1.15) drop-shadow(0 0 20px rgba(0,240,255,0.4))'
                    : 'contrast(1.05)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Glowing Blue Eye Overlays for Awakened Levels (Level 10+) */}
            {!isBeginner && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Pulsing Cyan Eye Flare Animation */}
                <motion.div
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-radial-gradient pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 48% 46%, rgba(0,240,255,0.3) 0%, transparent 35%)',
                  }}
                />
              </div>
            )}

            {/* Shadow Monarch Wings/Mist for Stage 50+ */}
            {stage >= 50 && (
              <motion.div
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,_rgba(139,92,246,0.35)_0%,_transparent_70%)]"
              />
            )}

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,240,255,0.06)_50%)] bg-[length:100%_4px] opacity-40" />

            {/* Stage Indicator Pill on artwork */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{isBeginner ? 'STAGE 1: TRAINEE' : `STAGE ${stage}: AWAKENED`}</span>
              </span>
              <span className="text-amber-300 font-bold font-orbitron">LVL {level}</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* SVG Character Model with Equipped Items */}
            <svg viewBox="0 0 320 420" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="daggerBlade2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="160" cy="390" rx="65" ry="14" fill="rgba(0,240,255,0.25)" filter="blur(4px)" />

              {/* Legs */}
              <g id="legs2">
                <path d="M135 250 L128 355 L145 358 L152 250 Z" fill={pantsItem?.visualData.color || '#1e293b'} stroke="#090d16" strokeWidth="1.5" />
                <path d="M168 250 L175 355 L192 358 L185 250 Z" fill={pantsItem?.visualData.color || '#1e293b'} stroke="#090d16" strokeWidth="1.5" />
                <path d="M124 353 L146 355 L144 370 L115 370 Z" fill={shoesItem?.visualData.color || '#334155'} stroke="#0f172a" strokeWidth="1.5" />
                <path d="M174 353 L196 355 L205 370 L176 370 Z" fill={shoesItem?.visualData.color || '#334155'} stroke="#0f172a" strokeWidth="1.5" />
              </g>

              {/* Torso */}
              <g id="torso2">
                <path d="M130 145 L190 145 L182 255 L138 255 Z" fill={coatColor} stroke="#090d16" strokeWidth="2" />
                <path d="M148 145 L160 175 L172 145" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                {stage >= 25 && (
                  <>
                    <path d="M125 145 Q110 240 100 320 Q125 310 135 255 L130 145 Z" fill="#0b1120" stroke={auraColor} strokeWidth="1.5" />
                    <path d="M195 145 Q210 240 220 320 Q195 310 185 255 L190 145 Z" fill="#0b1120" stroke={auraColor} strokeWidth="1.5" />
                  </>
                )}
              </g>

              {/* Arms */}
              <g id="arms2">
                <path d="M125 145 L108 210 L120 225 L135 155 Z" fill={coatColor} stroke="#090d16" strokeWidth="1.5" />
                <path d="M195 145 L212 210 L200 225 L185 155 Z" fill={coatColor} stroke="#090d16" strokeWidth="1.5" />
                <circle cx="112" cy="225" r="7" fill="#fbcfe8" />
                <circle cx="208" cy="225" r="7" fill="#fbcfe8" />

                {/* Dagger */}
                {(accessoryItem || stage >= 10) && (
                  <g transform="translate(208, 225) rotate(25)">
                    <rect x="-8" y="0" width="16" height="3" fill="#64748b" />
                    <path d="M-2 3 L0 38 L2 3 Z" fill="url(#daggerBlade2)" filter={`drop-shadow(0 0 5px ${auraColor})`} />
                    <rect x="-2" y="-12" width="4" height="12" fill="#0f172a" />
                  </g>
                )}
              </g>

              {/* Head & Glowing Eyes */}
              <g id="head2">
                <rect x="152" y="125" width="16" height="22" fill="#fbcfe8" />
                <path d="M142 95 Q140 125 160 135 Q180 125 178 95 Z" fill="#fed7aa" stroke="#9a3412" strokeWidth="0.5" />
                <ellipse cx="152" cy="106" rx="3.5" ry="2" fill="#00f0ff" filter="drop-shadow(0 0 4px #00f0ff)" />
                <ellipse cx="168" cy="106" rx="3.5" ry="2" fill="#00f0ff" filter="drop-shadow(0 0 4px #00f0ff)" />
                <path d="M136 95 Q142 65 160 65 Q178 65 184 95 Q188 115 182 120 Q176 100 172 90 Q160 88 152 95 Q144 88 138 120 Z" fill="#090d16" />
                <path d="M150 78 L155 102 L158 84 L165 100 L168 80 Z" fill="#090d16" />
              </g>
            </svg>
          </div>
        )}

        {/* Mode Toggle Icon in Corner */}
        <button
          onClick={() => setViewMode(viewMode === 'anime' ? 'armory' : 'anime')}
          className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-950/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 hover:text-white flex items-center gap-1 shadow-sm transition-colors z-20"
          title="Toggle between Anime Portrait and RPG Armory mode"
        >
          <span>{viewMode === 'anime' ? 'ANIME ART' : 'ARMORY'}</span>
        </button>

        {/* Ambient Corner Sci-Fi UI Marks */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/70 z-20">
          HUNTER ID: SJW-{stage.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Hunter Evolution Title Details */}
      {showDetails && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {isBeginner ? 'STAGE 1: E-RANK TRAINEE' : `STAGE ${stage}: AWAKENED SHADOW HUNTER`}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 max-w-xs font-medium">
            {isBeginner
              ? 'Trainee appearance with bandages. Mana vessels awakening through daily conditioning.'
              : 'Electric cyan eyes awakened with dark shadow aura. Power continuously expanding.'}
          </p>
        </div>
      )}
    </div>
  );
};
