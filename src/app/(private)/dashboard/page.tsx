import type { Metadata } from "next";

import { getServerAuthSession } from "@/shared/api/auth/authOptions";

export const metadata: Metadata = {
  title: "Панель",
};

export default async function Dashboard() {
  const session = await getServerAuthSession();
  return <div>Даров тут дашборд, а тебя зовут: {session?.user.name}</div>;
}
