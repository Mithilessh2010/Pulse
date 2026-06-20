import { Suspense } from "react";
import { TeamsScreen } from "@/components/app-shell/EnterpriseScreens";

export default function TeamsPage() {
  return <Suspense fallback={null}><TeamsScreen /></Suspense>;
}
