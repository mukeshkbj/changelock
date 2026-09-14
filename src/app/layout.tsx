import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChangeLock — vendor payment-change verification",
  description:
    "Accounts-payable fraud command center. Independently verifies vendor payment-detail change requests by phone without ever approving or executing a financial change.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const live = process.env.CHANGELOCK_MODE === "live";
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">
                CL
              </span>
              <span className="brand-text">
                <span className="brand-name">ChangeLock</span>
                <span className="brand-desc">Vendor change control</span>
              </span>
            </div>
            <div className={live ? "env-badge live" : "env-badge"}>
              {live ? "Live mode · local operator" : "Replay mode · no live calls"}
            </div>
          </div>
        </header>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
