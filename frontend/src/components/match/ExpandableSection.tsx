import type { ReactNode } from "react";

interface ExpandableSectionProps {
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

export default function ExpandableSection({
  expanded,
  onToggle,
  children,
  className = "",
}: ExpandableSectionProps) {
  return (
    <div className={className} onClick={onToggle}>
      {children}

      {/* Expand Arrow */}
      <div
        className={`
          transform transition-transform duration-200 ml-4
          ${expanded ? "rotate-180" : "rotate-0"}
        `}
      >
        <span className="text-gray-400 text-lg">▼</span>
      </div>
    </div>
  );
}
