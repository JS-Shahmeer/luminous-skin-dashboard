"use client";

import { useActionState } from "react";
import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateProfileAction } from "./actions";

function Field({
  label,
  icon: Icon,
  name,
  defaultValue,
  disabled,
}: {
  label: string;
  icon: typeof User;
  name: string;
  defaultValue: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
        {label}
      </span>
      <div className="flex items-center gap-2.5 rounded-sm border border-line bg-ink/40 px-3.5 py-3 focus-within:border-gold/60">
        <Icon size={16} className="text-beige" strokeWidth={1.75} />
        <input
          name={name}
          defaultValue={defaultValue}
          disabled={disabled}
          className="w-full bg-transparent text-sm text-cream focus:outline-none disabled:text-beige"
        />
      </div>
    </label>
  );
}

export function ProfileInfoForm({ name, email, title }: { name: string; email: string; title: string }) {
  const [result, formAction, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" icon={User} name="name" defaultValue={name} />
        <Field label="Email" icon={Mail} name="email" defaultValue={email} disabled />
        <Field label="Title / Role" icon={User} name="title" defaultValue={title} />
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        {result && (
          <p className={`text-sm ${result.ok ? "text-sage" : "text-rust"}`}>{result.message}</p>
        )}
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
