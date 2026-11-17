import { ArrowIcon } from "@/components/ui";
import { home } from "@/content/site";
import { POLICY } from "@/lib/domain/policy";

/**
 * The home page's make-a-game box. A plain GET form to /create?prompt=…, so it works before
 * JavaScript loads; the maker reads the prompt and fills its text box.
 */
export function PromptBox() {
  return (
    <form action="/create" method="get" className="group/prompt flex w-full flex-col gap-3">
      <label htmlFor="hero-prompt" className="type-label text-fog">
        {home.hero.promptLabel}
      </label>
      <div className="flex border border-paper/30 bg-ink/50 transition-colors duration-300 ease-snap focus-within:border-accent hover:border-paper/60">
        <input
          id="hero-prompt"
          name="prompt"
          required
          maxLength={POLICY.promptMaxChars}
          placeholder={home.hero.promptPlaceholder}
          autoComplete="off"
          className="type-body h-12 min-w-0 flex-1 bg-transparent px-4 text-paper placeholder:text-ash focus:outline-none"
        />
        <button
          type="submit"
          className="type-caps flex shrink-0 items-center gap-2 bg-accent px-4 text-accent-ink transition-colors duration-300 hover:bg-paper"
        >
          {home.hero.promptCta}
          <ArrowIcon className="size-4" />
        </button>
      </div>
    </form>
  );
}
