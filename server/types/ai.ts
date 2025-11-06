export interface AskRequest {
  prompt: string;
}

export interface AnalyzeRequest {
  text: string;
}

export interface GenerateRequest {
  prompt: string;
  type?: string;
}

export interface AIResponse {
  message: string;
  reply: string;
}

export interface AIErrorResponse {
  error: string;
  details?: string;
}
