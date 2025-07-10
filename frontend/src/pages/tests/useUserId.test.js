// src/pages/__tests__/useUserId.test.js
import { renderHook } from '@testing-library/react';
import { useUserId }   from '../../hooks/useUserId';

describe('useUserId', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when no token', () => {
    const { result } = renderHook(() => useUserId());
    expect(result.current).toBeNull();
  });

  it('returns null for broken token', () => {
    localStorage.setItem('accessToken', 'not.a.jwt');
    const { result } = renderHook(() => useUserId());
    expect(result.current).toBeNull();
  });
});
