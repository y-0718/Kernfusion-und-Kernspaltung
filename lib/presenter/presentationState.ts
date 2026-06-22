"use client";

export type PresentationState = {
  activeIndex: number;
  timerStartedAt: number | null;
  timerElapsedMs: number;
  isTimerRunning: boolean;
  hasStarted: boolean;
  updatedAt: number;
};

export const PRESENTATION_STATE_KEY = "fusion-presentation-state";
export const PRESENTATION_STATE_EVENT = "fusion-presentation-state-change";

export const initialPresentationState: PresentationState = {
  activeIndex: 0,
  timerStartedAt: null,
  timerElapsedMs: 0,
  isTimerRunning: false,
  hasStarted: false,
  updatedAt: 0
};

export function readPresentationState(): PresentationState {
  if (typeof window === "undefined") return initialPresentationState;

  try {
    const raw = window.localStorage.getItem(PRESENTATION_STATE_KEY);
    if (!raw) return initialPresentationState;
    return { ...initialPresentationState, ...JSON.parse(raw) };
  } catch {
    return initialPresentationState;
  }
}

export function writePresentationState(partial: Partial<PresentationState>) {
  if (typeof window === "undefined") return initialPresentationState;

  const nextState: PresentationState = {
    ...readPresentationState(),
    ...partial,
    updatedAt: Date.now()
  };

  window.localStorage.setItem(PRESENTATION_STATE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new CustomEvent(PRESENTATION_STATE_EVENT, { detail: nextState }));
  return nextState;
}

export function subscribePresentationState(callback: (state: PresentationState) => void) {
  if (typeof window === "undefined") return () => undefined;

  function onStorage(event: StorageEvent) {
    if (event.key === PRESENTATION_STATE_KEY) callback(readPresentationState());
  }

  function onCustom(event: Event) {
    callback((event as CustomEvent<PresentationState>).detail || readPresentationState());
  }

  window.addEventListener("storage", onStorage);
  window.addEventListener(PRESENTATION_STATE_EVENT, onCustom);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PRESENTATION_STATE_EVENT, onCustom);
  };
}

export function getTimerElapsedMs(state: PresentationState, now = Date.now()) {
  if (!state.isTimerRunning || !state.timerStartedAt) return state.timerElapsedMs;
  return state.timerElapsedMs + Math.max(0, now - state.timerStartedAt);
}

export function formatTimer(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}
