
import React, { useState, useEffect } from 'react';

interface MemoryGameProps {
  onComplete: () => void;
}

const ICONS = ['🥯', '🥗', '🍅', '🧅', '🧀', '🥩'];

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const shuffled = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }));
    setCards(shuffled);
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        if (matches + 1 === ICONS.length) {
          setTimeout(onComplete, 1500);
        }
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-orange-50 p-8 items-center justify-center text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-orange-600">لعبة الذاكرة 🧠</h2>
        <p className="text-slate-500 font-bold mt-2">طابق المكونات المتشابهة لفتح الطريق!</p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              aspect-square rounded-3xl text-4xl flex items-center justify-center transition-all duration-300 transform
              ${card.isFlipped || card.isMatched 
                ? 'bg-white rotate-0' 
                : 'bg-orange-400 rotate-y-180 shadow-lg hover:scale-105'}
              ${card.isMatched ? 'opacity-50 ring-4 ring-green-300' : ''}
            `}
          >
            {(card.isFlipped || card.isMatched) ? card.icon : '❓'}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <div className="bg-white px-6 py-3 rounded-full shadow-md font-black text-orange-600">
          المطابقات: {matches} / {ICONS.length}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
