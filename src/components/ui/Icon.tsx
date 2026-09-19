import {
  Wrench,
  Ruler,
  Box,
  Calculator,
  Users,
  Clapperboard,
  FolderKanban,
  Building2,
  Hammer,
  HardHat,
  Layers,
  PencilRuler,
  type LucideProps,
} from "lucide-react";

// Map of icon names usable for services. Extend as needed.
const MAP = {
  Wrench,
  Ruler,
  Box,
  Calculator,
  Users,
  Clapperboard,
  FolderKanban,
  Building2,
  Hammer,
  HardHat,
  Layers,
  PencilRuler,
} as const;

export type IconName = keyof typeof MAP;

export const ICON_NAMES = Object.keys(MAP) as IconName[];

export default function Icon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Cmp = MAP[(name as IconName)] ?? Wrench;
  return <Cmp {...props} />;
}
