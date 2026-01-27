import type { StrikesResponse } from '../types/strike';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

export const strikesApi = {
  /**
   * 모든 파업 정보 조회
   */
  async getAllStrikes(): Promise<StrikesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/strikes`);
    if (!response.ok) {
      throw new Error('Failed to fetch strikes');
    }
    return response.json();
  },

  /**
   * 진행 중/예정된 파업만 조회
   */
  async getActiveStrikes(): Promise<StrikesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/strikes/active`);
    if (!response.ok) {
      throw new Error('Failed to fetch active strikes');
    }
    return response.json();
  }
};
