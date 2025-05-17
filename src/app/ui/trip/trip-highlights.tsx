'use client'

import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/solid';

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
    <div className="relative rounded-lg bg-blue-50 p-6 shadow flex flex-col gap-1">
      <Image
        src="/icon-binoculars.png"
        alt="Binoculars icon"
        width={80}
        height={80}
        className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 z-3"
        style={{ pointerEvents: 'none' }}
      />
      <h2 className="text-xl font-bold text-blue-900 mb-2">Trip Highlights</h2>
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
        className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-center"
        onClick={onAddHighlight}
        type="button"
      >
        <PlusIcon className="h-5 w-5" />
        Add Highlight
      </button>
    </div>
  );
}
