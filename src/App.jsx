import React, { useState } from 'react';
import Hero from './components/Hero';
import MultiStepForm from './components/MultiStepForm';
import PlanViewer from './components/PlanViewer';
import { api } from './lib/api';

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(user) {
    setLoading(true);
    try {
      const result = await api.generatePlan(user);
      setPlan(result);
      window.scrollTo({ top: 650, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      alert('Failed to generate plan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Hero onStart={() => setShowForm(true)} />
        {showForm ? <MultiStepForm onSubmit={handleSubmit} /> : (
          <div className="mt-6 text-center small-muted">Click <button className="underline" onClick={() => setShowForm(true)}>Start — Create Plan</button> to begin</div>
        )}

        {loading && <div className="mt-6 card">Generating plan…</div>}
        {plan && <PlanViewer plan={plan} />}
      </div>
    </div>
  );
}
