import { Suspense } from "react";
import { AskScreen } from "@/components/app-shell/AppScreens";

export default function AskPage() {
  return <Suspense fallback={null}><AskScreen /></Suspense>;
}
