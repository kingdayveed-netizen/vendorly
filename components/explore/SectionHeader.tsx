"use client";

import Button from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconBg?: string;
  onViewAll?: () => void;
}

export const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = "bg-[#10b981]/10",
  onViewAll,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}
          style={{
            backgroundColor:
              iconBg === "bg-[#10b981]/10" ? "rgba(16, 185, 129, 0.1)" : iconBg,
          }}
        >
          <Icon className="h-5 w-5 text-[#10b981]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
            {title}
          </h2>
          <p className="text-sm text-[#6b7280]">{subtitle}</p>
        </div>
      </div>
      {onViewAll && (
        <Button
          variant="ghost"
          size="sm"
          className="text-[#10b981] gap-1 hover:bg-[#f3f4f6] hover:text-[#059669]"
          onClick={onViewAll}
        >
          View All <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
