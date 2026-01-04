import { ReactNode } from "react";

import { AppFooter } from "@/widgets/AppFooter";
import { PublicHeader } from "@/widgets/PublicHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full shrink-0 border-b">
        <PublicHeader />
      </div>
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <AppFooter />
    </div>
  );
}
