import { adv1, eat } from "kolmafia";
import {
    $item,
    $items,
    $location,
    $skill,
    CommunityService,
    get,
    getKramcoWandererChance,
    have,
} from "libram";
import Macro from "../combat";
import { CombatStrategy, Quest, Task } from "grimoire-kolmafia";
import { burnLibrams, juneCleave } from "./common";

export const coilWireQuest: Quest<Task> = {
    name: "Coil Wire",
    completed: () => CommunityService.CoilWire.isDone(),
    tasks: [
        {
            name: "Kramco",
            ready: () => getKramcoWandererChance() >= 1.0,
            completed: () => get("_sausageFights") > 0,
            do: $location`Noob Cave`,
            outfit: { equip: $items`protonic accelerator pack, Daylight Shavings Helmet` },
            combat: new CombatStrategy().macro(
                Macro.skill($skill`Micrometeorite`)
                    .attack()
                    .repeat()
            ),
        },
        juneCleave(),
        {
            name: "Magical Sausage",
            completed: () => !have($item`magical sausage casing`) && !have($item`magical sausage`),
            do: () => eat(1, $item`magical sausage`),
            acquire: [{ item: $item`magical sausage` }],
        },
        {
            name: "Proton Ghost",
            completed: () => get("ghostLocation", $location`none`) !== $location`none`,
            do: () => adv1(get("ghostLocation", $location`none`), 0, ""),
            outfit: { equip: $items`latte lovers member's mug, protonic accelerator pack` },
            combat: new CombatStrategy().macro(
                Macro.delevel()
                    .easyFight()
                    .trySkill($skill`Shoot Ghost`)
                    .trySkill($skill`Shoot Ghost`)
                    .trySkill($skill`Shoot Ghost`)
                    .trySkill($skill`Trap Ghost`)
            ),
        },
        burnLibrams(),
        {
            name: "Test",
            completed: () => CommunityService.CoilWire.isDone(),
            do: () => CommunityService.CoilWire.run(() => undefined),
            outfit: {
                hat: $item`Iunion Crown`,
                shirt: $item`fresh coat of paint`,
                pants: $item`Cargo Cultist Shorts`,
                weapon: $item`Fourth of May Cosplay Saber`,
                offhand: $item`familiar scrapbook`,
                acc1: $item`Eight Days a Week Pill Keeper`,
                acc2: $item`Powerful Glove`,
                acc3: $item`Guzzlr tablet`,
            },
        },
    ],
};
