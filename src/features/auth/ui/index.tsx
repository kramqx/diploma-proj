"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

const MagicLinkSchema = z.object({
  email: z.email({ message: "Введите корректный email" }),
});

export function AuthCard() {
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof MagicLinkSchema>>({
    resolver: zodResolver(MagicLinkSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof MagicLinkSchema>) => {
    setErrorMessage(null);
    const res = await signIn("email", {
      email: values.email,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if ((res?.ok ?? false) && res?.error == null) {
      setIsSent(true);
    } else {
      setErrorMessage("Ошибка отправки письма. Попробуйте ещё раз.");
    }
  };

  if (isSent) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold">Проверьте почту!</h2>
        <p className="text-muted-foreground">
          Мы отправили ссылку на <b>{form.getValues("email")}</b>.
        </p>
        <Button variant="outline" onClick={() => setIsSent(false)}>
          Ввести другой Email
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage != null && <Alert variant="destructive">{errorMessage}</Alert>}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Войти по Email
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Или через соцсети</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button onClick={() => signIn("github")}>GitHub</Button>
        <Button onClick={() => signIn("google")}>Google</Button>
        {/* <Button onClick={() => signIn("gitlab")}>GitLab</Button> */}
        <Button onClick={() => signIn("yandex")}>Yandex</Button>
      </div>
    </div>
  );
}
