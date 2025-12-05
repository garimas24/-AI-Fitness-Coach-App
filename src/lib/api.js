export const api = {
  generatePlan: async (user) => {
    // Placeholder: call your serverless endpoint /api/generate-plan
    // Example: return fetch('/api/generate-plan', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(user) })
    // For now return a mocked plan:
    return new Promise((resolve) => {
      setTimeout(()=> resolve(mockPlan(user)), 700);
    });
  },
  tts: async (text) => {
    // POST /api/tts { text } -> returns audio blob url
    return null;
  },
  generateImage: async (prompt) => {
    // POST /api/generate-image { prompt } -> returns { url }
    return { url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(prompt)}` };
  }
};

function mockPlan(user) {
  const workouts = [
    { id: 'w1', name: 'Bodyweight Squat', sets: 4, reps: '12-15', rest: '60s', notes: 'Keep chest up' },
    { id: 'w2', name: 'Push Ups', sets: 3, reps: '10-12', rest: '60s', notes: 'Full range' },
    { id: 'w3', name: 'Plank', sets: 3, reps: '45s', rest: '45s', notes: 'Keep hips level' }
  ];
  const meals = [
    { id: 'm1', name: 'Oats with Fruit', calories: 350, description: 'Oats, milk, banana, almonds' },
    { id: 'm2', name: 'Grilled Chicken Salad', calories: 500, description: 'Greens, grilled chicken, olive oil' },
    { id: 'm3', name: 'Greek Yogurt', calories: 150, description: 'Snack with berries' }
  ];
  return {
    meta: { name: user.name || 'User', generatedAt: new Date().toISOString() },
    workoutPlan: { weekSummary: '3x full-body workouts + 2 cardio sessions', days: [{ day:'Mon', focus:'Full Body', durationMinutes:40, exercises: workouts }] },
    dietPlan: { summary: '~2000 kcal/day', meals: { breakfast:[meals[0].name + ' - 350 kcal'], lunch:[meals[1].name + ' - 500 kcal'], snacks:[meals[2].name + ' - 150 kcal'], dinner:['Salmon + Veg - 600 kcal'] } },
    workouts, meals,
    tips: ['Drink water frequently', 'Aim for 7-8 hours sleep'],
    motivation: 'Consistency compounds — small wins daily.'
  };
}
