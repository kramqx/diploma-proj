import { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type Props = {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
  open?: boolean;
};

export function AppTooltip({ children, content, delay = 300, open }: Props) {
  return (
    <Tooltip delayDuration={delay} open={open}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
