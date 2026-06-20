import { Suspense } from "react";
import { TasksScreen } from "@/components/app-shell/AppScreens";

export default function TasksPage() {
  return <Suspense fallback={null}><TasksScreen /></Suspense>;
}
