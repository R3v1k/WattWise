// hooks/useUserId.js
import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';   // ← curly braces!

export function useUserId() {
  const token = localStorage.getItem('accessToken');

  return useMemo(() => {
    if (!token) return null;

    try {
      const { userId, exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) return null;
      return userId ?? null;
    } catch {
      return null;
    }
  }, [token]);
}
