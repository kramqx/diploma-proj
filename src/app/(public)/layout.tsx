import { AppFooter } from "@/widgets/AppFooter";
import { PublicHeader } from "@/widgets/PublicHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <div className="bg-background sticky top-0 z-50 w-full shrink-0 border-b">
        <PublicHeader />
      </div>
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <AppFooter />
    </div>
  );
}
