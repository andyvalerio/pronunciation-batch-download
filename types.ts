export enum Language {
  Lithuanian = 'Lithuanian',
  Russian = 'Russian',
  Italian = 'Italian',
  Czech = 'Czech',
  Swedish = 'Swedish',
  English = 'English'
}

export enum Voice {
  Alloy = 'Alloy',
  Echo = 'Echo',
  Fable = 'Fable',
  Onyx = 'Onyx',
  Nova = 'Nova',
  Shimmer = 'Shimmer'
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