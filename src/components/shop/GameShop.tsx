import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Coins,
  Shield,
  Check,
  Eye,
  Lock,
  Sparkles,
  Zap,
  Shirt,
  Footprints,
  Scissors,
  Crown,
  Flame,
  Swords
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SHOP_ITEMS } from '../../data/shopItems';
import { ShopItem } from '../../types/game';
import { CharacterEvolution } from '../character/CharacterEvolution';
import { soundEngine } from '../../services/sound';

export const GameShop: React.FC = () => {
  const { state, buyShopItem, equipShopItem } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewItemId, setPreviewItemId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'shirt', label: 'Shirts & Robes' },
    { id: 'pants', label: 'Pants & Greaves' },
    { id: 'shoes', label: 'Boots & Sneakers' },
    { id: 'hairstyle', label: 'Hairstyles' },
    { id: 'accessory', label: 'Daggers & Relics' },
    { id: 'armor', label: 'Armor Plating' },
    { id: 'skin', label: 'Full Outfits' },
    { id: 'specialEffect', label: 'Aura Effects' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((i) => i.category === selectedCategory);

  const handleCategoryClick = (cat: string) => {
    soundEngine.playClick();
    setSelectedCategory(cat);
  };

  const handleBuy = (item: ShopItem) => {
    if (state.gold < item.price) {
      soundEngine.playSystemAlert();
      return;
    }
    buyShopItem(item.id);
  };

  const handleEquip = (item: ShopItem) => {
    equipShopItem(item.id);
  };

  const getRarityBadge = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'Mythic':
        return 'text-rose-400 bg-rose-950/80 border-rose-500/50';
      case 'Legendary':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      case 'Epic':
        return 'text-purple-400 bg-purple-950/80 border-purple-500/50';
      case 'Rare':
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-500/50';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono tracking-widest uppercase">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>[ SYSTEM DIMENSIONAL ARMORY ]</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
            HUNTER GEAR & CUSTOMIZATION
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Spend earned gold coins to unlock tactical gear, shadow coats, glowing weapons, and monarch auras.
          </p>
        </div>

        {/* Gold Balance Pill */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-950/50 border border-amber-500/60 shadow-glow-gold">
          <Coins className="w-6 h-6 text-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-amber-300/80 uppercase block">
              YOUR GOLD BALANCE
            </span>
            <span className="text-2xl font-orbitron font-black text-amber-300">
              {state.gold.toLocaleString()} COINS
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: Character Live Preview + Shop Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Character Fitting Room */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full sticky top-24 p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg flex flex-col items-center text-center">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              FITTING ROOM // LIVE MIRROR
            </span>

            <CharacterEvolution size="md" showDetails={true} />

            <div className="mt-4 pt-4 border-t border-slate-800 w-full text-xs text-slate-400">
              Equipped items update your avatar in real-time. Unlocked gear stays saved permanently.
            </div>
          </div>
        </div>

        {/* Right Column: Catalog */}
        <div className="lg:col-span-8 space-y-6">
          {/* Categories Nav */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-black shadow-glow-gold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isOwned = state.inventory.includes(item.id);
              const isEquipped = state.equipped[item.category] === item.id;
              const isLevelLocked =
                item.unlockedLevel !== undefined && state.level < item.unlockedLevel;
              const canAfford = state.gold >= item.price;
              const rarityStyle = getRarityBadge(item.rarity);

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isEquipped
                      ? 'bg-[#091e38]/90 border-cyan-400 shadow-glow-blue'
                      : isOwned
                      ? 'bg-slate-900/80 border-slate-700'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Item Rarity & Level Lock */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${rarityStyle}`}
                      >
                        {item.rarity}
                      </span>
                      {isLevelLocked ? (
                        <span className="text-[10px] font-mono text-red-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>REQ. LVL {item.unlockedLevel}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Name & Description */}
                    <h3 className="font-orbitron font-bold text-base text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    {/* Price or Owned badge */}
                    {isOwned ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>OWNED</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-300 font-orbitron font-bold text-sm">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>{item.price.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    {isOwned ? (
                      <button
                        onClick={() => handleEquip(item)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-orbitron font-bold uppercase tracking-wider transition-all ${
                          isEquipped
                            ? 'bg-cyan-500 text-black shadow-glow-blue hover:bg-cyan-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={isLevelLocked || !canAfford}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-30 disabled:hover:from-amber-500 text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-gold transition-all"
                      >
                        {isLevelLocked ? 'LOCKED' : canAfford ? 'PURCHASE' : 'NEED GOLD'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
