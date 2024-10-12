export const setAccessToken = (token: string): void => {
    localStorage.setItem('spotify_access_token', token);
  };
  
  export const getAccessToken = (): string | null => {
    return localStorage.getItem('spotify_access_token');
  };
  
  export const removeAccessToken = (): void => {
    localStorage.removeItem('spotify_access_token');
  };
  