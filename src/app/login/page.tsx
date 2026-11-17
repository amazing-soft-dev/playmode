import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { PageBanner } from "@/components/sections/PageBanner";
import { Section } from "@/components/ui";
import { login } from "@/content/auth";
import { photos } from "@/content/media";

export const metadata: Metadata = {
  title: "Sign in",
  description: login.lead,
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <>
      <PageBanner photo={photos.bannerLogin} label={login.label} title={login.title} lead={login.lead} compact />
      <Section>
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
