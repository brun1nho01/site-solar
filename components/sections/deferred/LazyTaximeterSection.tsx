"use client";

import dynamic from "next/dynamic";
import { DeferredSectionPlaceholder, useNearViewport } from "./DeferredSectionSupport";

const Taximeter = dynamic(() => import("@/components/sections/TaximetroDor"), {
  ssr: false,
  loading: () => <DeferredSectionPlaceholder kind="taximeter" />,
});

export default function LazyTaximeterSection() {
  const { placeholderRef, isNearViewport } = useNearViewport("0px", 0.01);
  return isNearViewport ? <Taximeter /> : <DeferredSectionPlaceholder kind="taximeter" placeholderRef={placeholderRef} />;
}
