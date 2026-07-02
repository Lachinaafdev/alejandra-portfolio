/**
 * El contenido de los casos vive en src/assets/i18n/es.json y en.json
 * (llave "caseList"). Esta interfaz define su forma.
 */
export interface CaseStudy {
  slug: string;
  ticketNo: string;
  title: string;
  role: string;
  period: string;
  tools: string[];
  metric: { value: string; label: string };
  tldr: string;
  context: string;
  problem: string;
  process: string[];
  keyDecision: string;
  results: string[];
  learning: string;
  cover?: { src: string; alt: string };
  gallery?: { src: string; caption: string }[];
}

export interface CaseImage {
  src: string;
  alt?: string;
  caption?: string;
}
