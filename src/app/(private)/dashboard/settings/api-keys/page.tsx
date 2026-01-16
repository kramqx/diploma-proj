import { Suspense } from "react";
import { Metadata } from "next";
import { SquareArrowOutUpRight } from "lucide-react";

import { ApiKeyCardSkeleton, ApiKeysListContainer, CreateApiKeyDialog } from "@/features/api-keys";

export const metadata: Metadata = {
  title: "API-ключи",
};

export default function ApiKeysPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight">API-ключи</h2>
          <p className="text-muted-foreground text-sm">Управляйте своими API-ключами</p>
        </div>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://doxynix.space/api/docs"
          className="flex items-center gap-4 underline hover:no-underline"
        >
          API-документация
          <SquareArrowOutUpRight className="h-4 w-4" />
        </a>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Активные ключи</h3>
        <CreateApiKeyDialog />
      </div>
      <Suspense fallback={<ApiKeyCardSkeleton />}>
        <ApiKeysListContainer />
      </Suspense>
    </div>
  );
}
