import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s – KPO Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return children;
}
