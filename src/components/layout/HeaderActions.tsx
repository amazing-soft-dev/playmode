import { MobileMenu } from "./MobileMenu";
import { SiteSearch } from "./SiteSearch";

/** Controls on the right of the header: search (all widths) and the menu button below 992px. */
export function HeaderActions() {
  return (
    <>
      <SiteSearch />
      <MobileMenu />
    </>
  );
}
