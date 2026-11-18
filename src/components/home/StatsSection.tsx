import { CountUp, Reveal } from "@/components/motion";
import { BracketLabel, Section, SectionHeading } from "@/components/ui";
import { home } from "@/content/site";

/**
 * Stats strip (docs/audit/components/stat-counter.md): a glass strip of four counters that
 * count up over 1s every time they enter the viewport. The figures are product facts from the
 * policy module, never invented traction numbers.
 */
export function StatsSection() {
  const { heading, items } = home.stats;
  return (
    <Section ruled>
      <div className="container-site flex flex-col gap-[60px]">
        <Reveal>
          <SectionHeading label={heading.label}>{heading.title}</SectionHeading>
        </Reveal>
        <div className="relative border border-line bg-ink/40 bg-[linear-gradient(180deg,rgba(9,9,21,0.2)_0%,#000_100%)]">
          <ul className="flex flex-wrap justify-center gap-x-[60px] gap-y-10 px-5 py-[30px] md:justify-between md:gap-[30px] md:px-[30px] lg:flex-nowrap lg:gap-10 lg:px-[50px]">
            {items.map((stat, i) => (
              <Reveal
                as="li"
                key={stat.label}
                index={i}
                duration={0.7}
                className="flex w-[250px] flex-col gap-[15px] lg:w-auto lg:flex-1"
              >
                <div className="flex items-start gap-2">
                  <CountUp
                    to={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    className="type-stat font-semibold tabular-nums"
                  />
                  <BracketLabel accent className="mt-1.5">
                    {stat.label}
                  </BracketLabel>
                </div>
                <p className="type-body tracking-[-0.05em] text-fog uppercase">{stat.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
