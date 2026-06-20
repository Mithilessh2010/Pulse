import { Suspense } from "react";
import { PlaybooksScreen } from "@/components/app-shell/EnterpriseScreens";

export default function PlaybooksPage() {
  return <Suspense fallback={null}><PlaybooksScreen /></Suspense>;
}
