"use client";

import dynamic from "next/dynamic";
import { DeferredSectionPlaceholder, useNearViewport } from "./DeferredSectionSupport";

const SocialProof = dynamic(() => import("@/components/sections/SocialProofSection"), {
  ssr: false,
  loading: () => <DeferredSectionPlaceholder kind="social" />,
});

export default function LazySocialProofSection() {
  const { placeholderRef, isNearViewport } = useNearViewport("700px 0px");
  return isNearViewport ? <SocialProof /> : <DeferredSectionPlaceholder kind="social" placeholderRef={placeholderRef} />;
}
