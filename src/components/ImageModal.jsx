import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageModal({ open, src, title, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div initial={{y:10, scale:0.98}} animate={{y:0, scale:1}} exit={{y:8, scale:0.98}} className="bg-slate-900 rounded-xl p-4 max-w-3xl w-full mx-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{title}</h3>
              <button onClick={onClose} className="btn btn-ghost">Close</button>
            </div>
            <div className="mt-4">
              {src ? <img src={src} alt={title} className="w-full rounded-md object-cover" /> : <div className="p-8 text-center small-muted">Generating…</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
