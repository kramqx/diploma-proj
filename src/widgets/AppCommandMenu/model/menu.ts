import { CreditCard, FolderGit2, KeyRound, LayoutGrid, Settings, User } from "lucide-react";

export const navMenu = [
  { label: "Обзор", icon: LayoutGrid, path: "/dashboard", shortcut: "Alt+O" },
  { label: "Репозитории", icon: FolderGit2, path: "/dashboard/repo", shortcut: "Alt+R" },
  { label: "Настройки", icon: Settings, path: "/dashboard/settings/profile", shortcut: "Alt+S" },
];

export const settingsMenu = [
  { label: "Профиль", icon: User, path: "/dashboard/settings/profile", shortcut: "Alt+P" },
  {
    label: "Биллинг",
    icon: CreditCard,
    path: "/dashboard/settings/billing",
    shortcut: "Alt+B",
  },
  {
    label: "API ключи",
    icon: KeyRound,
    path: "/dashboard/settings/api-keys",
    shortcut: "Alt+A",
  },
];
