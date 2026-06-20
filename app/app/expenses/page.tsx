import { Suspense } from "react";
import { ExpensesScreen } from "@/components/app-shell/AppScreens";

export default function ExpensesPage() {
  return <Suspense fallback={null}><ExpensesScreen /></Suspense>;
}
