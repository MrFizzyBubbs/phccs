import { retrieveItem, userConfirm, useSkill } from "kolmafia";
import {
    $class,
    $familiar,
    $item,
    $monsters,
    $skill,
    ascend,
    AsdonMartin,
    CombatLoversLocket,
    DNALab,
    get,
    have,
    Lifestyle,
    Paths,
    prepareAscension,
} from "libram";

const safariTargets = [
    "Kenny Kamakazi",
    "Busta_Rhymes",
    "Manendra",
    "Gausie",
    "Beldur",
    "worthawholebean",
    "ReverKiller",
    "Asmodais",
    "The Dictator",
];
export function main(args = ""): void {
    while ($skill`Experience Safari`.timescast < get("skillLevel180") && safariTargets.length) {
        useSkill($skill`Experience Safari`, 1, safariTargets[0]);
        safariTargets.shift();
    }

    let workshed: "Asdon Martin keyfob" | "Little Geneticist DNA-Splicing Lab" =
        "Asdon Martin keyfob";
    if (!AsdonMartin.have() && have($item`Little Geneticist DNA-Splicing Lab`)) {
        workshed = "Little Geneticist DNA-Splicing Lab";
    }
    if (DNALab.installed() && get("_workshedItemUsed")) {
        workshed = "Little Geneticist DNA-Splicing Lab";
    }
    if (args.includes("DNA")) {
        workshed = "Little Geneticist DNA-Splicing Lab";
    }

    if (workshed === "Little Geneticist DNA-Splicing Lab") {
        const requiredLocketMonsters = $monsters`Black Crayon Crimbo Elf, cocktail shrimp`;
        const locketMonsters = CombatLoversLocket.unlockedLocketMonsters();
        if (
            !get("stenchAirportAlways") ||
            requiredLocketMonsters.some((monster) => !locketMonsters.includes(monster))
        ) {
            userConfirm(
                "Are you sure you want to ascend with DNA? You don't seem to meet all the requirements."
            );
        }
    }

    prepareAscension({
        workshed,
        garden: "Peppermint Pip Packet",
        eudora: "Our Daily Candles™ order form",
        chateau: {
            desk: "continental juice bar",
            nightstand: "foreign language tapes",
            ceiling: "ceiling fan",
        },
    });

    const pet = have($familiar`Baby Bugged Bugbear`)
        ? $item`astral statuette`
        : $item`astral pet sweater`;

    const lifestyle = args.includes("softcore") ? Lifestyle.softcore : Lifestyle.hardcore;

    if (lifestyle === Lifestyle.softcore) retrieveItem(1, $item`corrupted marrow`);

    ascend(
        Paths.CommunityService,
        $class`Pastamancer`,
        lifestyle,
        "knoll",
        $item`astral six-pack`,
        pet
    );
}
