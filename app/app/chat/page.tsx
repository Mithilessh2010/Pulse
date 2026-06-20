import { Suspense } from "react";
import { ChatHub } from "@/components/communication/ChatHub";

export default function ChatPage() {
  return <Suspense fallback={null}><ChatHub /></Suspense>;
}
