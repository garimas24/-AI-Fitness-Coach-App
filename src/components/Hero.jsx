import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onStart }) {
  return (
    <header className="mb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 px-6">
        <div className="flex-1">
          <motion.h1 initial={{y:-10, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.05}} className="text-4xl md:text-5xl font-extrabold leading-tight">
            AI Fitness Coach — <span className="text-indigo-400">Personalized</span> plans in seconds
          </motion.h1>
          <motion.p initial={{y:6, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.15}} className="mt-4 text-slate-300 max-w-xl">
            Generate workout and diet plans tailored to your goals. Listen to the plan, view images, and export a PDF.
          </motion.p>

          <div className="mt-6 flex gap-3">
            <button onClick={onStart} className="btn btn-primary">Start — Create Plan</button>
            <a href="#how" className="btn btn-ghost">How it works</a>
          </div>
        </div>

        <motion.div initial={{scale:0.98, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay:0.2}} className="w-full md:w-1/2">
          <div className="card p-6">
            <div className="text-sm small-muted">Demo preview</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white">
                <div className="font-semibold">Workout</div>
                <div className="text-xs">3 days / week</div>
              </div>
              <div className="rounded-lg p-3 bg-gradient-to-br from-slate-700 to-slate-600">
                <div className="font-semibold">Diet</div>
                <div className="text-xs">~2000 kcal</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
