export interface AccidentProcessResult {
  message?: string;
  code?: string;
  success?: boolean;
  status_code?: number;
  details?: {
    class?: 'severe' | 'moderate' | 'not_accident';
    confidence?: number;
    probabilities?: {
      severe?: number;
      moderate?: number;
      not_accident?: number;
    };
  };
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface AccidentHistoryUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AccidentHistoryItem {
  id: number;
  image: string;
  result: 'severe' | 'moderate' | 'not_accident';
  confidence: number;
  created_at: string;
  user: AccidentHistoryUser;
}

export interface AccidentHistoryOptions {
  page: number;
  pages: number;
  results: number;
  size: number;
}

export interface AccidentHistoryResponse {
  data: AccidentHistoryItem[];
  options: AccidentHistoryOptions;
}
