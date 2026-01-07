
import React, { useState } from 'react';

interface WordSearchProps {
  onComplete: () => void;
}

const WORDS = ['خبز', 'لحم', 'خس', 'جبن', 'بصل'];
const GRID_SIZE = 6;
const GRID_LETTERS = [
  'خ', 'ب', 'ز', 'س', 'ل', 'ح',
  'م', 'ر', 'ط', 'ب', 'ص', 'ل',
  'ج', 'ب', 'ن', 'ا', 'ف', 'غ',
  'خ', 'س', 'ق', 'ي', 'و', 'ر',
  'ك', 'م', 'ن', 'ت', 'أ', 'ب',
  'ه', 'و', 'ي', 'ر', 'ز', 'ك'
];

const WordSearch: React.FC<WordSearchProps> = ({ onComplete }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = useState('');

  const handleCellClick = (index: number) => {
    if (selectedIndices.includes(index)) return;

    const newIndices = [...selectedIndices, index];
    const newChar = GRID_LETTERS[index];
    const newWord = currentSelection + newChar;

    setSelectedIndices(newIndices);
    setCurrentSelection(newWord);

    if (WORDS.includes(newWord)) {
      setFoundWords(prev => [...prev, newWord]);
      setCurrentSelection('');
      setSelectedIndices([]); // Keep visually found, but reset active search
      if (foundWords.length + 1 === WORDS.length) {
        setTimeout(onComplete, 1500);
      }
    } else if (newWord.length >= 4) {
      setCurrentSelection('');
      setSelectedIndices([]);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-yellow-50 p-8 items-center justify-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-orange-600 italic">كلمة السر 🔍</h2>
        <p className="text-slate-500 font-bold mt-2">ابحث عن 5 مكونات في الشبكة!</p>
      </div>

      <div className="grid grid-cols-6 gap-2 bg-white p-4 rounded-[30px] shadow-xl border-4 border-orange-100 mb-8">
        {GRID_LETTERS.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            className={`
              w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-xl md:text-2xl font-black rounded-xl transition-all
              ${selectedIndices.includes(i) ? 'bg-orange-500 text-white scale-110' : 'bg-slate-50 text-slate-800 hover:bg-orange-100'}
            `}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {WORDS.map(word => (
          <div 
            key={word}
            className={`px-4 py-2 rounded-full font-black border-2 transition-all ${foundWords.includes(word) ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-300'}`}
          >
            {word} {foundWords.includes(word) ? '✓' : ''}
          </div>
        ))}
      </div>

      {currentSelection && (
        <div className="mt-8 text-2xl font-black text-orange-600 tracking-widest animate-pulse">
          {currentSelection}
        </div>
      )}
    </div>
  );
};

export default WordSearch;
