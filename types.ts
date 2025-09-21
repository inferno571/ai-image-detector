export enum Classification {
  REAL = 'REAL',
  FAKE = 'AI_GENERATED',
  UNCERTAIN = 'UNCERTAIN',
}

export interface AnalysisResult {
  classification: Classification;
  reasoning: string;
}

export interface AnalysisRecord {
  id: string;
  imageSrc: string;
  result: AnalysisResult;
  imageFile: File;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AnalyzableImage {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'loading' | 'highlighting' | 'success' | 'error';
  result: AnalysisResult | null;
  error: string | null;
  highlightedImageUrl: string | null;
  chatMessages: ChatMessage[];
}
