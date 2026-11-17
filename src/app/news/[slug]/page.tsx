import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Media } from "@/components/media/Media";
import { BracketLabel, Button, Section } from "@/components/ui";
import { photos } from "@/content/media";
import { postBySlug, posts } from "@/content/news";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

/** Devlog article: title, date, cover photo and body, with links to the next post and the list. */
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();
  const index = posts.indexOf(post);
  const next = posts[(index + 1) % posts.length]!;
  return (
    <Section className="pt-[120px] md:pt-[150px]">
      <article className="container-site flex flex-col gap-10">
        <header className="flex max-w-[900px] flex-col gap-6">
          <BracketLabel accent>{post.category}</BracketLabel>
          <h1 className="type-page">{post.title}</h1>
          <time dateTime={post.date} className="type-label text-ash">
            {new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
          </time>
        </header>
        <div className="relative aspect-[21/9] overflow-hidden border border-line">
          <Media id={photos[post.photo]} sizes="100vw" priority alt="" />
        </div>
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
          <p className="type-h4 text-[22px] normal-case">{post.excerpt}</p>
          {post.body.map((p) => (
            <p key={p.slice(0, 30)} className="type-body text-fog">
              {p}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap gap-4 border-t border-line pt-8">
            <Button href={`/news/${next.slug}`}>Next: {next.title}</Button>
            <Button href="/news" variant="link">
              All posts
            </Button>
          </div>
        </div>
      </article>
    </Section>
  );
}
