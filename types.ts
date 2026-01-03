export enum Language {
  Lithuanian = 'Lithuanian',
  Russian = 'Russian'
}

export enum Voice {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface ProcessingLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  total: number;
  currentWord: string;
}