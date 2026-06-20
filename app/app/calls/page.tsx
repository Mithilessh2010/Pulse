import { Suspense } from "react";
import { CallsHub } from "@/components/communication/CallsHub";

export default function CallsPage() {
  return <Suspense fallback={null}><CallsHub /></Suspense>;
}
