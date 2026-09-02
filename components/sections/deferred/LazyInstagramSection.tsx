"use client";

import dynamic from "next/dynamic";
import { DeferredSectionPlaceholder, useNearViewport } from "./DeferredSectionSupport";

const Instagram = dynamic(() => import("@/components/sections/InstagramSection"), {
  ssr: false,
  loading: () => <DeferredSectionPlaceholder kind="instagram" />,
});

export default function LazyInstagramSection() {
  const { placeholderRef, isNearViewport } = useNearViewport("700px 0px");
  return isNearViewport ? <Instagram /> : <DeferredSectionPlaceholder kind="instagram" placeholderRef={placeholderRef} />;
}
