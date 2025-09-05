import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useToast, TOAST_REMOVE_DELAY, __testing } from './use-toast';

describe('useToast', () => {
  beforeEach(() => {
    __testing.reset();
  });

  it('subscribes and unsubscribes listeners', () => {
    const { unmount } = renderHook(() => useToast());
    expect(__testing.getListeners().length).toBe(1);
    unmount();
    expect(__testing.getListeners().length).toBe(0);
  });

  it('removes toast after delay', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ description: 'Hello' });
    });
    expect(result.current.toasts.length).toBe(1);
    const id = result.current.toasts[0].id;
    act(() => {
      result.current.dismiss(id);
    });
    act(() => {
      vi.advanceTimersByTime(TOAST_REMOVE_DELAY);
    });
    expect(result.current.toasts.length).toBe(0);
    vi.useRealTimers();
  });
});
