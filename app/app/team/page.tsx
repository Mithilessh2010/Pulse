import { Suspense } from "react";
import { TeamScreen } from "@/components/app-shell/AppScreens";

export default function TeamPage() {
  return <Suspense fallback={null}><TeamScreen /></Suspense>;
}
