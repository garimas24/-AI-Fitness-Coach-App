import React, { useState } from 'react';

export default function TTSControls({ text }) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  async function play() {
    setLoading(true);
    try {
      // TODO: Call your server endpoint which proxies ElevenLabs / TTS provider
      // const resp = await fetch('/api/tts', { method:'POST', body: JSON.stringify({ text }), headers:{'Content-Type':'application/json'} });
      // const blob = await resp.blob();
      // const url = URL.createObjectURL(blob);
      // setAudioUrl(url);
      // new Audio(url).play();

      // Placeholder: use SpeechSynthesis in browser for demo
      const utter = new SpeechSynthesisUtterance(text.substring(0, 1000));
      utter.rate = 1;
      speechSynthesis.speak(utter);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  return (
    <div>
      <button onClick={play} className="btn btn-ghost">{loading ? 'Loading…' : 'Listen'}</button>
    </div>
  );
}
