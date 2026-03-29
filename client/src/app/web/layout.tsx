import type { ReactNode } from "react";
import { WebRouteGate } from "../../components/web/WebRouteGate";

export default function WebLayout({ children }: { children: ReactNode }) {
  return <WebRouteGate>{children}</WebRouteGate>;
}
