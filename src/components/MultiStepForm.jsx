import React, { useState } from 'react';
import { motion } from 'framer-motion';

const initial = {
  name: '', age: '', gender: 'female',
  heightCm: '', weightKg: '',
  goal: 'weight_loss', level: 'beginner', location: 'home',
  dietPref: 'veg', medical: '', stress: 'medium'
};

export default function MultiStepForm({ onSubmit }) {
  const [data, setData] = useState(initial);
  const [step, setStep] = useState(1);

  const update = (k, v) => setData(prev => ({ ...prev, [k]: v }));

  const next = () => setStep(s => Math.min(6, s+1));
  const prev = () => setStep(s => Math.max(1, s-1));

  function finish(e) {
    e.preventDefault();
    onSubmit(data);
  }

  return (
    <form onSubmit={finish} className="card max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Tell us about yourself</div>
        <div className="text-sm small-muted">Step {step} / 6</div>
      </div>

      {step === 1 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
          <label className="block mb-2 text-sm">Name</label>
          <input required value={data.name} onChange={(e)=>update('name', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <label className="block"><div className="text-sm small-muted">Age</div><input value={data.age} onChange={(e)=>update('age', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700" /></label>
            <label className="block">
              <div className="text-sm small-muted">Gender</div>
              <select value={data.gender} onChange={(e)=>update('gender', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700">
                <option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
              </select>
            </label>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <label><div className="text-sm small-muted">Height (cm)</div><input value={data.heightCm} onChange={(e)=>update('heightCm', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700" /></label>
            <label><div className="text-sm small-muted">Weight (kg)</div><input value={data.weightKg} onChange={(e)=>update('weightKg', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700" /></label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block"><div className="text-sm small-muted">Fitness Goal</div>
            <select value={data.goal} onChange={(e)=>update('goal', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700">
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintain">Maintain</option>
            </select>
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="grid grid-cols-2 gap-3">
          <label><div className="text-sm small-muted">Level</div>
            <select value={data.level} onChange={(e)=>update('level', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700">
              <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
            </select>
          </label>
          <label><div className="text-sm small-muted">Location</div>
            <select value={data.location} onChange={(e)=>update('location', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700">
              <option value="home">Home</option><option value="gym">Gym</option><option value="outdoor">Outdoor</option>
            </select>
          </label>
        </div>
      )}

      {step === 5 && (
        <div>
          <label><div className="text-sm small-muted">Diet preference</div>
            <select value={data.dietPref} onChange={(e)=>update('dietPref', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700">
              <option value="veg">Vegetarian</option><option value="non-veg">Non-Veg</option><option value="vegan">Vegan</option><option value="keto">Keto</option>
            </select>
          </label>
        </div>
      )}

      {step === 6 && (
        <div>
          <label><div className="text-sm small-muted">Medical history / Notes (optional)</div>
            <input value={data.medical} onChange={(e)=>update('medical', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
          </label>
          <label className="mt-3 block"><div className="text-sm small-muted">Stress level</div>
            <select value={data.stress} onChange={(e)=>update('stress', e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </label>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <div>
          {step > 1 && <button type="button" onClick={prev} className="btn btn-ghost mr-2">Back</button>}
        </div>
        <div>
          {step < 6 && <button type="button" onClick={next} className="btn btn-primary mr-2">Next</button>}
          {step === 6 && <button type="submit" className="btn btn-primary">Generate Plan</button>}
        </div>
      </div>
    </form>
  );
}
