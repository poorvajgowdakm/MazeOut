import { Card } from './ui/Card';
import { Users, Star, Monitor } from 'lucide-react';
export function RoomCard({ room, matchScore, reason }) {
  return (
    <Card hover className="p-5 flex flex-col gap-4 overflow-hidden relative h-full">
      {matchScore && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-rose-500 text-white px-3 py-1 rounded-bl-xl text-xs font-bold shadow-sm">
          Best Match {matchScore}%
        </div>
      )}
      <div className="flex justify-between items-start mt-2">
        <div>
          <h3 className="text-lg font-bold">{room.name}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Floor {room.floor}</p>
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-semibold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
          <Star size={14} fill="currentColor" /> {room.baseScore / 10}
        </div>
      </div>
      {reason && <p className="text-sm text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">{reason}</p>}
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        <span className="flex items-center gap-1 text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300"><Users size={12}/> {room.capacity}</span>
        {room.equipment?.includes(1) && <span className="flex items-center gap-1 text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300"><Monitor size={12}/></span>}
      </div>
    </Card>
  );
}
