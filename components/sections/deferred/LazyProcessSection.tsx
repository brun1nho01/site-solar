"use client";

import dynamic from "next/dynamic";
import { DeferredSectionPlaceholder, useNearViewport } from "./DeferredSectionSupport";

const Process = dynamic(() => import("@/components/sections/ProcessSection"), {
  ssr: false,
  loading: () => <DeferredSectionPlaceholder kind="process" />,
});

export default function LazyProcessSection() {
  const { placeholderRef, isNearViewport } = useNearViewport("700px 0px");
  return isNearViewport ? <Process /> : <DeferredSectionPlaceholder kind="process" placeholderRef={placeholderRef} />;
}
