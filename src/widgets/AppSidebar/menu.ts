import { FolderGit2, LayoutGrid, Settings } from "lucide-react";

import { MenuItems } from "@/widgets/AppSidebar/types";

export const menu: MenuItems = [
  { icon: LayoutGrid, title: "Обзор", href: "/dashboard" },
  { icon: FolderGit2, title: "Репозитории", href: "/repo" },
  { icon: Settings, title: "Настройки", href: "/settings" },
];
