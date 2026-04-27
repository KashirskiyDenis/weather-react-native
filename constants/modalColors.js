import { PlatformColor } from "react-native";

export const COLOR_BACKGROUND =
  PlatformColor?.("?attr/colorBackground") ?? "#ffffff";
export const COLOR_TEXT = "#212121";
export const COLOR_PLACEHOLDER = "#757575";
export const COLOR_ACCENT = PlatformColor?.("?attr/colorAccent") ?? "#92c2f2";
export const COLOR_BUTTON_PRESSED = "#e0e0e0";
export const COLOR_SCRIM = "rgba(0, 0, 0, 0.6)";