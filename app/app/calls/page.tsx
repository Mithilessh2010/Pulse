import { Suspense } from "react";
import { CallsScreen } from "@/components/app-shell/EnterpriseScreens";

export default function CallsPage() {
  return <Suspense fallback={null}><CallsScreen /></Suspense>;
}
