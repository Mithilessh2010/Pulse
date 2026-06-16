import Navbar from "@/components/Navbar";
import HeroPulse from "@/components/HeroPulse";
import ToolReplacementSection from "@/components/ToolReplacementSection";
import FeatureSection from "@/components/FeatureSection";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#07090F" }}>
      <Navbar />
      <HeroPulse />
      <ToolReplacementSection />
      <FeatureSection />
      <CTASection />

      {/* Footer */}
      <footer
        className="relative py-8 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-sm" style={{ color: "#2D3A52" }}>
          © 2025 Pulse. Built for fast-moving teams.
        </p>
      </footer>
    </main>
  );
}
