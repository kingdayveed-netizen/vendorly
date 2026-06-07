"use client";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const HeroBanner = () => {
  const router = useRouter();

  const handleStartShopping = () => {
    router.push("/explore");
  };

  const handleBecomeVendor = () => {
    router.push("/signup?role=vendor");
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-14" style={{
      background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)"
    }}>
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtMyIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-24 translate-y-24" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Sparkles className="h-3 w-3 mr-1" /> Over 200+ vendors
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Discover Amazing Products
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-6 max-w-lg">
            Shop from trusted WhatsApp vendors. Verified products, secure
            payments, fast delivery.
          </p>
          <div className="flex gap-3">
            <Button
              size="lg"
              className="bg-white text-[#10b981] hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleStartShopping}
            >
              Start Shopping <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
              onClick={handleBecomeVendor}
            >
              Become a Vendor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};