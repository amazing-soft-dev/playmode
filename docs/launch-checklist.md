# Launch checklist

Work through this before the public launch (plan section 18). Items marked **(you)** need an
account owner and can't be done from the repository.

## Accounts and hosting

- [ ] **(you)** Choose the name and domain (plan section 03) and re-check availability right before buying
- [ ] **(you)** Vercel **Pro** (the Hobby plan is non-commercial only); import the repository with Production tracking `main`
- [ ] **(you)** Set environment variables in Vercel: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`
- [ ] **(you)** Verify the sending domain in Resend and set `CONTACT_FROM` to an address on it
- [ ] **(you)** Set a Vercel spend cap
- [ ] Confirm the `GH_TOKEN` repository secret (repo and workflow scopes) is still valid; rulesets are applied (`.github/scripts/apply-rulesets.sh`)

## Legal and safety

- [ ] **(you)** Lawyer review of the terms, privacy policy, COPPA approach and DMCA page; remove the draft notices
- [ ] **(you)** Register a DMCA designated agent with the US Copyright Office and list it on `/legal/dmca`
- [ ] **(you)** Publish a postal address and data protection contact in the privacy policy
- [ ] Confirm retention periods (24 months for inactive accounts, 12 for anonymous ids) and schedule the deletion jobs
- [ ] Serve generated games from a separate origin with the game CSP (see `docs/architecture.md`)
- [ ] Static hosting only: configure security headers on the host (the export cannot send them)

## Product readiness

- [ ] Backend milestone done (`docs/architecture.md`, "Backend milestone")
- [ ] At least 14 approved daily challenges in the backlog
- [ ] Closed beta with 50 to 100 invited users; measure the real cost per build and set the free limit and Plus price (plan section 09)
- [ ] Monitoring and the build off switch tested

## Open questions from the plan (section 20)

1. Site and studio name, and the domain
2. LLM provider and model, after a quality and cost test on 20 sample prompts
3. Free daily build limit and paid plan price, after measuring cost per build in beta
4. Under-13 accounts: stay play-only, or add parent-consent accounts in V2?
5. RAWG Business at $149 a month at launch, or start with a hand-picked list (the current catalog fixture)?
6. Launch languages (the US, India, Brazil and Vietnam are the biggest free-game markets)
7. Classroom mode for schools in V2?
8. Ad network: AdSense only, or a kids-focused network as well?

## Before each release

- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:images`
- [ ] `npm run build` and `npm run images && NEXT_OUTPUT=export npm run build && npm run verify:export`
- [ ] Spot-check 390, 768, 992 and 1440 px widths, keyboard navigation and reduced motion
