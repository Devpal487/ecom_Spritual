import { pdfjs } from 'react-pdf';

export const initPdfWorker = () => {
  const workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
};