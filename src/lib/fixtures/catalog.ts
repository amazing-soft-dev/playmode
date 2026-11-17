import type { CatalogGame, PlatformFamily, StoreLink } from "../domain/types.ts";

/**
 * Development catalog standing in for RAWG. Every entry is a real, released game with its ESRB
 * rating, price model and platforms, so the recommendation flow never shows an invented game.
 * Production replaces this with RAWG results (Business plan) cached for 24 hours.
 */

const steam = (appId: number): StoreLink => ({
  store: "Steam",
  url: `https://store.steampowered.com/app/${appId}/`,
  affiliate: false,
});

const site = (store: string, url: string): StoreLink => ({ store, url, affiliate: false });

const game = (
  id: number,
  slug: string,
  name: string,
  released: string,
  genres: string[],
  platforms: PlatformFamily[],
  esrb: CatalogGame["esrb"],
  price: CatalogGame["price"],
  stores: StoreLink[],
): CatalogGame => ({
  id,
  slug,
  name,
  released,
  genres,
  platforms,
  esrb,
  price,
  stores,
  sourceUrl: `https://rawg.io/games/${slug}`,
});

export const CATALOG: CatalogGame[] = [
  game(1, "celeste", "Celeste", "2018", ["platformer", "indie", "action"], ["pc", "console"], "E10+", "paid", [steam(504230)]),
  game(2, "stardew-valley", "Stardew Valley", "2016", ["simulation", "rpg", "indie", "casual"], ["pc", "console", "mobile"], "E10+", "paid", [steam(413150)]),
  game(3, "minecraft", "Minecraft", "2011", ["sandbox", "adventure", "casual"], ["pc", "console", "mobile"], "E10+", "paid", [site("Minecraft.net", "https://www.minecraft.net/")]),
  game(4, "fortnite", "Fortnite", "2017", ["shooter", "action"], ["pc", "console", "mobile"], "T", "free", [site("Epic Games", "https://www.fortnite.com/")]),
  game(5, "rocket-league", "Rocket League", "2015", ["sports", "racing", "action"], ["pc", "console"], "E", "free", [site("Epic Games", "https://www.rocketleague.com/")]),
  game(6, "hollow-knight", "Hollow Knight", "2017", ["platformer", "action", "adventure", "indie"], ["pc", "console"], "E10+", "paid", [steam(367520)]),
  game(7, "portal-2", "Portal 2", "2011", ["puzzle", "platformer"], ["pc", "console"], "E10+", "paid", [steam(620)]),
  game(8, "terraria", "Terraria", "2011", ["sandbox", "action", "adventure", "indie"], ["pc", "console", "mobile"], "T", "paid", [steam(105600)]),
  game(9, "genshin-impact", "Genshin Impact", "2020", ["rpg", "action", "adventure"], ["pc", "console", "mobile"], "T", "free", [site("HoYoverse", "https://genshin.hoyoverse.com/")]),
  game(10, "mini-metro", "Mini Metro", "2015", ["puzzle", "strategy", "casual", "indie"], ["pc", "console", "mobile"], "E", "paid", [steam(287980)]),
  game(11, "slime-rancher", "Slime Rancher", "2017", ["simulation", "adventure", "casual", "indie"], ["pc", "console"], "E", "paid", [steam(433340)]),
  game(12, "untitled-goose-game", "Untitled Goose Game", "2019", ["puzzle", "casual", "indie"], ["pc", "console"], "E", "paid", [steam(837470)]),
  game(13, "overcooked-2", "Overcooked! 2", "2018", ["party", "casual", "simulation"], ["pc", "console"], "E", "paid", [steam(728880)]),
  game(14, "doom-eternal", "DOOM Eternal", "2020", ["shooter", "action"], ["pc", "console"], "M", "paid", [steam(782330)]),
  game(15, "hades", "Hades", "2020", ["action", "rpg", "indie"], ["pc", "console"], "T", "paid", [steam(1145360)]),
  game(16, "dead-cells", "Dead Cells", "2018", ["action", "platformer", "indie"], ["pc", "console", "mobile"], "T", "paid", [steam(588650)]),
  game(17, "valorant", "VALORANT", "2020", ["shooter", "action", "strategy"], ["pc"], "T", "free", [site("Riot Games", "https://playvalorant.com/")]),
  game(18, "super-mario-odyssey", "Super Mario Odyssey", "2017", ["platformer", "adventure"], ["console"], "E10+", "paid", [site("Nintendo", "https://www.nintendo.com/")]),
  game(19, "tetris-effect-connected", "Tetris Effect: Connected", "2020", ["puzzle", "casual"], ["pc", "console"], "E", "paid", [steam(1003590)]),
];

/** Short staff-picked list served when the catalog is unavailable (plan section 16). */
export const STAFF_PICK_IDS = [1, 2, 10, 13, 5];

export const CATALOG_GENRES = [...new Set(CATALOG.flatMap((g) => g.genres))].sort();
