// @zey/vision — main entry point. Framework-agnostic: React + optional
// Tailwind only. Next.js-specific pieces (font loading, route transitions)
// live in the separate "@zey/vision/next" entry so a Vite/CRA/plain-React
// consumer never has to resolve a `next/...` import just from importing
// this package.

// Part 1 — color system
export {
  getCircadianColors,
  applyCircadianTheme,
  useCircadianTheme,
  getContrastRatio,
  meetsWcagAA,
  neutral,
} from "./color-system";
export type {
  CircadianColorSet,
  CircadianPhaseName,
  CircadianKeyframe,
  GeoCoordinates,
  UseCircadianThemeOptions,
} from "./color-system";

// Part 2 — typography
export { Prose, Heading, Text, Em, Code, TabularNum } from "./components/Typography";
export type {
  ProseProps,
  HeadingProps,
  TextProps,
  EmProps,
  CodeProps,
  TabularNumProps,
} from "./components/Typography";

// Part 3 — components
export { Button, Badge, Avatar, Card } from "./components/primitives";
export type { ButtonProps, BadgeProps, AvatarProps, CardProps } from "./components/primitives";
export { TextInput, Textarea, SearchInput } from "./components/Input";
export type { TextInputProps, TextareaProps, SearchInputProps } from "./components/Input";
export { Alert } from "./components/Alert";
export type { AlertProps } from "./components/Alert";
export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";
export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";
export { Tabs } from "./components/Tabs";
export type { TabItem, TabsProps } from "./components/Tabs";
export { Dropdown } from "./components/Dropdown";
export type { DropdownItem, DropdownProps } from "./components/Dropdown";
export { cx, useClickOutside, useEscapeKey, useFocusTrap, useScrollLock } from "./ui-utils";

// Part 4 — motion
export { usePresence } from "./motion";
export type { TransitionPhase, PresenceResult } from "./motion";
export { Transition } from "./components/Transition";
export type { TransitionProps } from "./components/Transition";
export { Skeleton, Spinner } from "./components/Loading";
export type { SkeletonProps, SpinnerProps } from "./components/Loading";

// Part 5 — ambient adaptation
export {
  useAmbientLight,
  useIdleDim,
  useEyeBreakReminder,
  getAmbientWarmth,
  useBatteryAwareness,
  recordManualAmbientAdjustment,
  useLearnedAmbientOffset,
} from "./ambient";
export type { AmbientLightState, IdleDimOptions, EyeBreakState, BatteryState } from "./ambient";
export { useFocusTimer } from "./focus-timer";
export type { FocusPhase, FocusTimerOptions, FocusTimerState } from "./focus-timer";
export { AmbientProvider } from "./components/AmbientProvider";
export type { AmbientProviderProps } from "./components/AmbientProvider";
export { BreakReminder } from "./components/BreakReminder";
export type { BreakReminderProps } from "./components/BreakReminder";
export { FocusTimerWidget } from "./components/FocusTimerWidget";
export type { FocusTimerWidgetProps } from "./components/FocusTimerWidget";

// Part 6 — focus mode
export { useLineFocus } from "./line-layout";
export type { LineRect, UseLineFocusResult } from "./line-layout";
export { useZenMode, useFocusPreferences, useFocusStats } from "./focus-mode";
export type { FocusPreferences, FocusStats } from "./focus-mode";
export { ReadingRuler } from "./components/ReadingRuler";
export type { ReadingRulerProps } from "./components/ReadingRuler";
export { LineFocus } from "./components/LineFocus";
export type { LineFocusProps } from "./components/LineFocus";
export { BionicText } from "./components/BionicText";
export type { BionicTextProps } from "./components/BionicText";
export { FocusModeSettings } from "./components/FocusModeSettings";
export type { FocusModeSettingsProps } from "./components/FocusModeSettings";
