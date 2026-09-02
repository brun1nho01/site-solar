"use client";

import dynamic from "next/dynamic";
import { DeferredSectionPlaceholder, useNearViewport } from "./DeferredSectionSupport";

const Calculator = dynamic(() => import("@/components/calculator/EconomyCalculator"), {
  ssr: false,
  loading: () => <DeferredSectionPlaceholder kind="calculator" />,
});

export default function LazyCalculatorSection() {
  const { placeholderRef, isNearViewport } = useNearViewport("250px 0px");
  return isNearViewport ? <Calculator /> : <DeferredSectionPlaceholder kind="calculator" placeholderRef={placeholderRef} />;
}
