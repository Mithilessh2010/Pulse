import { Suspense } from "react";
import { ApprovalsScreen } from "@/components/app-shell/AppScreens";

export default function ApprovalsPage() {
  return <Suspense fallback={null}><ApprovalsScreen /></Suspense>;
}
