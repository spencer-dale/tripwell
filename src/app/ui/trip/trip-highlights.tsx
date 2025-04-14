'use client'

import { Button } from '../button';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';

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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trip Highlights</h2>
        <Button
          onClick={onAddHighlight}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Highlight
        </Button>
      </div>
      
      {highlights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No highlights added yet</p>
          <Button
            onClick={onAddHighlight}
            className="flex items-center gap-2 mx-auto"
          >
            <PlusIcon className="h-5 w-5" />
            Add Your First Highlight
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">{highlight.title}</h3>
              <p className="text-gray-600 mt-1">{highlight.description}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(highlight.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
