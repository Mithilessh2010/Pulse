import { Suspense } from "react";
import { MeetingsHub } from "@/components/communication/MeetingsHub";

export default function MeetingsPage() {
  return <Suspense fallback={null}><MeetingsHub /></Suspense>;
}
