'use client'

import { StarIcon, PlusIcon } from '@heroicons/react/24/solid';

interface TripHighlight {
  id: string;
  title: string;
  description: string;
  date: Date;
}

interface TripHighlightsProps {
  highlights: TripHighlight[];
  onAddHighlight: () => void;
}

export function TripHighlights({ highlights, onAddHighlight }: TripHighlightsProps) {
  return (
    <div className="relative rounded-lg bg-blue-50 p-6 shadow flex flex-col gap-4">
      <StarIcon className="absolute top-4 right-4 h-8 w-8 text-yellow-400 opacity-80" />
      <div className="flex flex-col gap-2">
        {highlights.length === 0 ? (
          <p className="text-gray-500">No highlights added yet</p>
        ) : (
          highlights.map((highlight) => (
            <div key={highlight.id} className="bg-white/60 rounded p-2 mb-2">
              <div className="font-semibold text-blue-900">{highlight.title}</div>
              <div className="text-gray-700 text-sm">{highlight.description}</div>
              <div className="text-xs text-gray-400 mt-1">{highlight.date.toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
      <button
        className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-start"
        onClick={onAddHighlight}
        type="button"
      >
        <PlusIcon className="h-5 w-5" />
        Add Highlight
      </button>
    </div>
  );
}
