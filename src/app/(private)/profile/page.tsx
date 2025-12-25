import type { Metadata } from "next";

import { getServerAuthSession } from "@/shared/api/auth/authOptions";

export const metadata: Metadata = {
  title: "Профиль",
};

export default async function Profile() {
  const session = await getServerAuthSession();
  return (
    <div>
      Даров тут аккаунт, {session?.user.name}, {session?.user.email}
    </div>
  );
}
