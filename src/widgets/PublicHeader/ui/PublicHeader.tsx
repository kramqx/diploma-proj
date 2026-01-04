import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/Logo";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { menu } from "@/widgets/PublicHeader/model/menu";

export function PublicHeader() {
  return (
    <header className="flex h-full flex-wrap items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Logo className="w-20" />
      </div>
      <nav className="flex gap-4">
        {menu.map((item) => (
          <Button key={item.href} variant="ghost" asChild>
            <Link href={item.href} className="flex items-center gap-2">
              {item.icon && <item.icon />}
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/auth">Начать</Link>
        </Button>
        <ThemeToggle className="text-muted-foreground" />
      </div>
    </header>
  );
}
