export type ClassValue = string | number | false | null | undefined | ClassValue[];

/** Join class names, skipping falsy values and flattening nested arrays. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue): void => {
    if (value === false || value === null || value === undefined || value === "") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };
  values.forEach(walk);
  return out.join(" ");
}
