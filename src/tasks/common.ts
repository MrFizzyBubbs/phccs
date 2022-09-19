import { Task } from "grimoire-kolmafia";
import { Effect, useSkill } from "kolmafia";
import { $effect, $item, $location, $skill, ensureEffect, get, have } from "libram";
import { canCastLibrams } from "../lib";

export function juneCleave(): Task {
    return {
        name: "June Cleave",
        completed: () => get("_juneCleaverFightsLeft") > 0,
        do: $location`Noob Cave`,
        post: () => {
            if (have($effect`Beaten Up`)) useSkill($skill`Tongue of the Walrus`);
        },
        outfit: { weapon: $item`June cleaver` },
        limit: { tries: 1 },
    };
}

export function burnLibrams(): Task {
    return {
        name: "Burn Librams",
        completed: () => !canCastLibrams(),
        do: () => burnLibrams(),
        limit: { tries: 1 },
    };
}

export function ensureEffects(effects: Effect[]): Task {
    return {
        name: "Buffs",
        completed: () => effects.every((ef) => have(ef)),
        do: () => effects.forEach((ef) => ensureEffect(ef)),
        limit: { tries: 1 },
    };
}
