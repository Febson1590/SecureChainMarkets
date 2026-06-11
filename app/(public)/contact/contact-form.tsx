"use client";

import { SupportCard } from "@/components/support-card";

/* The contact form was intentionally removed — all support contact goes
   through a single mailto card addressed to the support inbox. The
   component name is kept so the contact page import stays unchanged. */
export function ContactForm() {
  return <SupportCard />;
}
