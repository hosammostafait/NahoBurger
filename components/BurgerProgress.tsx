
import React from 'react';

interface BurgerProgressProps {
  completedCount: number;
  totalCount: number;
}

const BurgerProgress: React.FC<BurgerProgressProps> = ({ completedCount, totalCount }) => {
  const layers = ['🍞', '🍟', '🥫', '🥒', '🥩', '🧀', '🧅', '🍅', '🥗', '🥯'].reverse();
  const visibleLayers = layers.slice(0, completedCount);

  return (
    <div className="flex flex-col-reverse items-center justify-center h-12 w-10 relative group">
      {visibleLayers.length === 0 ? (
        <span className="text-xl grayscale opacity-30">🍽️</span>
      ) : (
        visibleLayers.map((emoji, i) => (
          <span 
            key={i} 
            className="text-xl leading-[0.1] animate-in slide-in-from-top-4 duration-500" 
            style={{ zIndex: i, marginTop: '-4px' }}
          >
            {emoji}
          </span>
        ))
      )}
      <div className="absolute -bottom-8 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        البرجر اكتمل بنسبة {Math.round((completedCount/totalCount)*100)}%
      </div>
    </div>
  );
};

export default BurgerProgress;
