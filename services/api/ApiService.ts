const API_BASE_URL = __DEV__
  ? 'http://192.168.0.105:3001' //'http://localhost:3001'
  : 'https://api.grocerai.com';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
    public data?: any,
  ) {
    super(message || statusText);
    this.name = 'ApiError';
  }
}

class ApiService {
  private static instance: ApiService;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      // test throtling
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          response.statusText,
          errorData.message || response.statusText,
          errorData,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        0,
        'Network Error',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      ...(data && { body: JSON.stringify(data) }),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      ...(data && { body: JSON.stringify(data) }),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      ...(data && { body: JSON.stringify(data) }),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export { ApiService };
export default ApiService;
