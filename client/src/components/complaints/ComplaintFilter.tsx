import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Feeling } from '../../types';
import { slideUp } from '../../lib/theme-store';

interface ComplaintFilterProps {
  selectedFeelings: Feeling[];
  onFilterChange: (feelings: Feeling[]) => void;
}

// Emoji and display name mappings for each feeling
const feelingEmojis: Record<Feeling, string> = {
  kesel: '😠',
  sedih: '😢',
  capek: '😫',
  bingung: '😕',
  bete: '😒',
};

const feelingNames: Record<Feeling, string> = {
  kesel: 'Kesel',
  sedih: 'Sedih',
  capek: 'Capek',
  bingung: 'Bingung',
  bete: 'Bete',
};

export function ComplaintFilter({ selectedFeelings, onFilterChange }: ComplaintFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle toggling a feeling filter
  const toggleFeeling = (feeling: Feeling) => {
    if (selectedFeelings.includes(feeling)) {
      onFilterChange(selectedFeelings.filter(f => f !== feeling));
    } else {
      onFilterChange([...selectedFeelings, feeling]);
    }
  };
  
  // Handle selecting all feelings
  const selectAll = () => {
    onFilterChange(Object.keys(feelingEmojis) as Feeling[]);
  };
  
  // Handle clearing all filters
  const clearAll = () => {
    onFilterChange([]);
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-4 w-4" />
          <span>Filter berdasarkan emosi</span>
          {selectedFeelings.length > 0 && (
            <span className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
              {selectedFeelings.length}
            </span>
          )}
        </button>
        
        {selectedFeelings.length > 0 && (
          <button 
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>
      
      {isExpanded && (
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="bg-muted/50 p-3 rounded-md"
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={selectAll}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5
                ${selectedFeelings.length === Object.keys(feelingEmojis).length
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-background/80'
                }`}
            >
              <span>Semua</span>
            </button>
            
            {Object.entries(feelingEmojis).map(([feeling, emoji]) => (
              <button
                key={feeling}
                onClick={() => toggleFeeling(feeling as Feeling)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5
                  ${selectedFeelings.includes(feeling as Feeling)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-background/80'
                  }`}
              >
                <span>{emoji}</span>
                <span>{feelingNames[feeling as Feeling]}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}