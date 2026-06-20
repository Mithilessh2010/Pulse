import { Suspense } from "react";
import { MeetingsScreen } from "@/components/app-shell/EnterpriseScreens";

export default function MeetingsPage() {
  return <Suspense fallback={null}><MeetingsScreen /></Suspense>;
}
