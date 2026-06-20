import { Suspense } from "react";
import { ChatScreen } from "@/components/app-shell/EnterpriseScreens";

export default function ChatPage() {
  return <Suspense fallback={null}><ChatScreen /></Suspense>;
}
