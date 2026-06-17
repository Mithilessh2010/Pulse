import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  children: React.ReactNode;
  loading: boolean;
  loadingText: string;
};

export default function SubmitButton({ children, loading, loadingText }: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6D5DFB] px-5 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(109,93,251,0.22)] transition disabled:cursor-not-allowed disabled:opacity-70"
      whileHover={loading ? undefined : { backgroundColor: "#7C6EFC", scale: 1.01 }}
      whileTap={loading ? undefined : { scale: 0.98 }}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {loading ? loadingText : children}
    </motion.button>
  );
}
