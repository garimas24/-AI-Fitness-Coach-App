import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ExportPDFButton({ targetRef }) {
  const [busy, setBusy] = useState(false);

  async function exportPDF() {
    setBusy(true);
    try {
      const node = targetRef.current || document.body;
      const canvas = await html2canvas(node, { scale: 2 });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, w, h);
      pdf.save('ai-fitness-plan.pdf');
    } catch (e) {
      console.error(e);
    } finally { setBusy(false); }
  }

  return <button onClick={exportPDF} className="btn btn-ghost">{busy ? 'Exporting…' : 'Export PDF'}</button>;
}
