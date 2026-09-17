"use client";

import dynamic from "next/dynamic";
import { DeferredSectionPlaceholder, useNearViewport } from "./DeferredSectionSupport";

const SolarLeadForm = dynamic(() => import("@/components/contact/SolarLeadForm"), {
  ssr: false,
  loading: () => <DeferredSectionPlaceholder kind="contact" />,
});

export default function LazyContactSection() {
  const { placeholderRef, isNearViewport } = useNearViewport("250px 0px");

  return isNearViewport ? (
    <SolarLeadForm />
  ) : (
    <DeferredSectionPlaceholder kind="contact" placeholderRef={placeholderRef} />
  );
}
