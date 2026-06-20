import { Suspense } from "react";
import { ProjectsScreen } from "@/components/app-shell/AppScreens";

export default function ProjectsPage() {
  return <Suspense fallback={null}><ProjectsScreen /></Suspense>;
}
