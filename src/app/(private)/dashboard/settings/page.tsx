import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Настройки",
};

export default function Settings() {
  redirect("/dashboard/settings/profile");
}
