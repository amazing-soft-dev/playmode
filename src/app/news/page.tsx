import type { Metadata } from "next";
import Link from "next/link";

import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { PageBanner } from "@/components/sections/PageBanner";
import { ArrowIcon, Card, Section, Tag } from "@/components/ui";
import { photos } from "@/content/media";
import { news, posts } from "@/content/news";

export const metadata: Metadata = {
  title: "News",
  description: news.lead,
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** Devlog list in the template's blog-row layout: text left, photo right, lime on hover. */
export default function NewsPage() {
  return (
    <>
      <PageBanner photo={photos.bannerNews} label={news.label} title={news.title} lead={news.lead} compact />
      <Section>
        <div className="container-site">
          <ul className="flex flex-col gap-5">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.slug} index={i % 2} duration={0.7}>
                <Card interactive crosses={false}>
                  <Link href={`/news/${post.slug}`} className="grid gap-6 p-5 md:grid-cols-2 md:gap-[30px]">
                    <span className="flex flex-col justify-between gap-6">
                      <span className="flex flex-col gap-4">
                        <span className="flex items-center gap-3">
                          <Tag>{post.category}</Tag>
                          <time dateTime={post.date} className="type-label text-ash">
                            {formatDate(post.date)}
                          </time>
                        </span>
                        <span className="font-sans text-[24px] leading-[1.4] tracking-[-0.5px] uppercase transition-colors duration-[400ms] ease-snap group-hover/card:text-accent">
                          {post.title}
                        </span>
                        <span className="type-small text-fog">{post.excerpt}</span>
                      </span>
                      <span className="type-caps inline-flex items-center gap-2 group-hover/card:text-accent">
                        Read more <ArrowIcon className="size-4" />
                      </span>
                    </span>
                    <span className="relative block aspect-[16/10] overflow-hidden border border-line">
                      <Media id={photos[post.photo]} sizes="(min-width: 768px) 50vw, 100vw" zoomOnHover />
                    </span>
                  </Link>
                </Card>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
