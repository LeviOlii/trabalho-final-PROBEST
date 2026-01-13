import { api } from '../api';
import { AccidentHistoryResponse, AccidentProcessResult, LoginResponse } from './types';

/**
 * POST /v1/accident-processings/process
 * Envia imagem para análise de acidente
 */
export async function postProcessAccidentImage(image: File): Promise<AccidentProcessResult> {
  const formData = new FormData();
  formData.append('image', image);

  const response = await api.post<AccidentProcessResult>(
    '/v1/accident-processings/process',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

/**
 * POST /v1/auth/login
 * Realiza login do usuário
 */
export async function postLogin(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/v1/auth/login', {
    email,
    password,
  });
  return response.data;
}

/**
 * GET /v1/accident-processings
 * Busca histórico de análises
 */
export async function getAccidentHistory(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  order?: string;
  result?: string;
  user_id?: number;
}): Promise<AccidentHistoryResponse> {
  const response = await api.get<AccidentHistoryResponse>('/v1/accident-processings', {
    params,
  });
  return response.data;
}
