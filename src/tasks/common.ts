import { Task } from "grimoire-kolmafia";
import { useSkill } from "kolmafia";
import { $effect, $item, $location, $skill, get, have } from "libram";
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
    };
}
