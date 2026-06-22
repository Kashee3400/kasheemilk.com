import { FeatureFlagKey, HeroData } from "@/types/db";

export function f<T extends Partial<Record<string, boolean>>>(
  flags: T,
  key: keyof T & FeatureFlagKey
): boolean {
  return (flags?.[key as string] as boolean | undefined) ?? true;
}