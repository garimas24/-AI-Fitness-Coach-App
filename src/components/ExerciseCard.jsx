import React from 'react';

export default function ExerciseCard({ item, onClick }) {
  return (
    <article className="p-4 rounded-xl border border-slate-700/40 bg-slate-800">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <div className="small-muted text-sm mt-1">{item.sets} sets • {item.reps} • rest {item.rest}</div>
          {item.notes && <div className="mt-2 small-muted text-sm">{item.notes}</div>}
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => onClick(item)} className="btn btn-ghost">Image</button>
        </div>
      </div>
    </article>
  );
}
