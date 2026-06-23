"use client";

import { createContext, useContext } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

const SlideDepthContext = createContext<MotionValue<number> | null>(null);

export function SlideDepthProvider({ value, children }: { value: MotionValue<number>; children: React.ReactNode }) {
  return <SlideDepthContext.Provider value={value}>{children}</SlideDepthContext.Provider>;
}

export function useSlideDepthProgress() {
  const fallback = useMotionValue(0.5);
  return useContext(SlideDepthContext) || fallback;
}
