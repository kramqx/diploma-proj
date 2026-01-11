import { FolderGit2, LayoutGrid, Settings } from "lucide-react";

import { MenuItems } from "@/shared/types/menuItem";

export const sidebarMenu: MenuItems = [
  { icon: LayoutGrid, title: "Обзор", href: "/dashboard" },
  { icon: FolderGit2, title: "Репозитории", href: "/dashboard/repo", exact: true },
  { icon: Settings, title: "Настройки", href: "/dashboard/settings/profile" },
];
