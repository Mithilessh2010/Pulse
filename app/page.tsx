import Navbar from "@/components/Navbar";
import HeroPulse from "@/components/HeroPulse";
import ToolReplacementSection from "@/components/ToolReplacementSection";
import FeatureSection from "@/components/FeatureSection";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#0B0D0C" }}>
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
        <p className="text-sm" style={{ color: "#69706A" }}>
          © 2026 Pulse. Built for teams that want less tool sprawl.
        </p>
      </footer>
    </main>
  );
}
