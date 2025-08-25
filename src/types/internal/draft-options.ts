import { FixtureRecipeImpl } from "core/internal";
import { OverrideFunction } from "./override-function";

export type DraftOptions<TFixture> = { variants?: FixtureRecipeImpl<TFixture>[]; overrideDraft?: OverrideFunction<TFixture> }