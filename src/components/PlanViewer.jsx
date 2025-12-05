import React, { useState, useRef } from 'react';
import ExerciseCard from './ExerciseCard';
import MealCard from './MealCard';
import ImageModal from './ImageModal';
import TTSControls from './TTSControls';
import ExportPDFButton from './ExportPDFButton';
import { api } from '../lib/api';

export default function PlanViewer({ plan }) {
  const [image, setImage] = useState(null);
  const containerRef = useRef();

  const openImage = async (item) => {
    // create a helpful prompt and call API.generateImage
    const prompt = item.name ? `${item.name} exercise photo, full-body, realistic` : item.name;
    const res = await api.generateImage(prompt);
    setImage({ url: res.url, title: item.name });
  };

  return (
    <section className="mt-8 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="flex-1 card" ref={containerRef}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm small-muted">Workout Plan</div>
              <h3 className="text-2xl font-bold">{plan.workoutPlan.weekSummary}</h3>
              <div className="text-sm small-muted mt-1">{plan.meta?.name} • Generated: {new Date(plan.meta?.generatedAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <TTSControls text={JSON.stringify(plan.workoutPlan, null, 2)} />
              <ExportPDFButton targetRef={containerRef} />
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {plan.workouts.map(w => <ExerciseCard key={w.id} item={w} onClick={openImage} />)}
          </div>
        </div>

        <aside className="w-96 card">
          <div>
            <div className="text-sm small-muted">Diet Summary</div>
            <h4 className="text-lg font-semibold mt-1">{plan.dietPlan.summary}</h4>
            <div className="mt-3">
              {Object.entries(plan.dietPlan.meals).map(([k, arr]) => (
                <div key={k} className="mt-3">
                  <div className="font-semibold">{k.toUpperCase()}</div>
                  <ul className="list-disc ml-5 mt-1">
                    {arr.map((m,i) => <li key={i} className="text-sm">{m}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="font-semibold">Tips</div>
            <ul className="list-disc ml-5 mt-2 small-muted">
              {plan.tips.map((t,i) => <li key={i}>{t}</li>)}
            </ul>
            <div className="mt-4 italic">{plan.motivation}</div>
          </div>
        </aside>
      </div>

      <div className="mt-6">
        <div className="text-sm small-muted">Meals</div>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          {plan.meals.map(m => <MealCard key={m.id} item={m} onClick={openImage} />)}
        </div>
      </div>

      <ImageModal open={!!image} src={image?.url} title={image?.title} onClose={() => setImage(null)} />
    </section>
  );
}
