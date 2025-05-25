'use client'

import Image from 'next/image';
import { Activity } from '@/src/app/lib/types';


interface TripHighlightsProps {
  highlights: Activity[];
}

export function TripHighlights({ highlights }: TripHighlightsProps) {
  return (
    <div className="relative rounded-lg bg-blue-50 p-6 shadow flex flex-col gap-1">
      <Image
        src="/icon-binoculars.png"
        alt="Binoculars icon"
        width={80}
        height={80}
        className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 z-0"
        style={{ pointerEvents: 'none' }}
      />
      <h2 className="text-xl font-bold text-blue-900 mb-2">Trip Highlights</h2>
      <div className="flex flex-col gap-2">
        {highlights.length === 0 ? (
          <p className="text-gray-500">No highlights selected yet.</p>
        ) : (
          highlights.map((highlight) => (
            <div key={highlight.activity_id} className="bg-white/60 rounded p-2 mb-2">
              <div className="font-semibold text-blue-900">{highlight.description}</div>
              <div className="text-gray-700 text-sm">{highlight.category}</div>
              <div className="text-xs text-gray-400 mt-1">{highlight.activity_date.toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
