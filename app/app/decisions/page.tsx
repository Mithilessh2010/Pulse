import { Suspense } from "react";
import { DecisionsScreen } from "@/components/app-shell/EnterpriseScreens";

export default function DecisionsPage() {
  return <Suspense fallback={null}><DecisionsScreen /></Suspense>;
}
