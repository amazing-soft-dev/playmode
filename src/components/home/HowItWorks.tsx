import { Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/ui";
import { home } from "@/content/site";

/**
 * The five steps from the product plan on a ruled grid: each step is a numbered cell with a lime
 * index, revealed with the template's 100ms stagger. 5 columns on desktop, 2 on tablet, 1 on phone.
 */
export function HowItWorks() {
  const { heading, steps } = home.howItWorks;
  return (
    <Section ruled>
      <div className="container-site flex flex-col gap-[60px]">
        <Reveal>
          <SectionHeading label={heading.label}>{heading.title}</SectionHeading>
        </Reveal>
        <ol className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              index={i}
              className="group/step flex flex-col gap-6 border-r border-b border-line p-6 transition-colors duration-[400ms] ease-snap hover:bg-smoke lg:min-h-[260px] lg:p-8"
            >
              <span className="font-mono text-[40px] leading-none font-thin text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="type-h4 transition-colors duration-[400ms] ease-snap group-hover/step:text-accent">{step.title}</span>
              <span className="type-small text-fog">{step.text}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
