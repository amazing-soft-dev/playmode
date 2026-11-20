import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui";
import { login } from "@/content/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: login.lead,
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <>
      <PageHeader label={login.label} title={login.title} lead={login.lead} />
      <Section tightTop>
        <div className="container-site">
          <div className="mx-auto max-w-[560px]">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}
