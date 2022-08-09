import {
    autosell,
    buy,
    cliExecute,
    equip,
    familiarEquippedEquipment,
    getClanName,
    inHardcore,
    itemAmount,
    myLevel,
    mySpleenUse,
    numericModifier,
    pullsRemaining,
    runChoice,
    storageAmount,
    takeStorage,
    use,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $familiar,
    $item,
    $items,
    $skill,
    Clan,
    get,
    have,
    SongBoom,
    SourceTerminal,
} from "libram";
import { setClan } from "../lib";
import { Quest, Task } from "grimoire-kolmafia";

const pulls = [
    $items`repaid diaper, Great Wolf's beastly trousers`,
    $items`meteorite necklace, meteorite ring, meteorite fragment, meteorite earring`,
    $item`Stick-Knife of Loathing`,
    $items`moveable feast, Snow Suit`,
];

const itemsToAutosell = [
    $item`glow-in-the-dark necklace`,
    $item`"KICK ME" sign`,
    $item`LCD game: Burger Belt`,
    $item`LCD game: Food Eater`,
    $item`LCD game: Garbage River`,
    $item`black-and-blue light`,
    $item`blue plasma ball`,
    $item`cheap studded belt`,
    $item`flavored foot massage oil`,
    $item`foam dart`,
    $item`Loudmouth Larry Lamprey`,
    $item`personal massager`,
    $item`personalized coffee mug`,
    $item`stick-on eyebrow piercing`,
    $item`1952 Mickey Mantle card`,
];

export const runStartQuest: Quest<Task> = {
    name: "Run Start",
    tasks: [
        {
            name: "Pulls",
            completed: () => inHardcore() || pullsRemaining() <= 5 - pulls.length,
            do: (): void => {
                for (const pull of pulls) {
                    if (
                        (Array.isArray(pull) && pull.some((item) => itemAmount(item) > 0)) ||
                        (!Array.isArray(pull) && itemAmount(pull) > 0)
                    ) {
                        continue;
                    }
                    const pullItem = Array.isArray(pull)
                        ? pull.find((pull) => storageAmount(pull) > 0)
                        : pull;
                    if (pullItem) takeStorage(pullItem, 1);
                }
            },
            limit: { tries: 1 },
        },
        {
            name: "Educate",
            completed: () =>
                ["extract.edu, portscan.edu"].every((x) =>
                    new Set([get("sourceTerminalEducate1"), get("sourceTerminalEducate2")]).has(x)
                ),
            do: () => SourceTerminal.educate([$skill`Extract`, $skill`Portscan`]),
        },
        {
            name: "Main Clan",
            completed: () => getClanName() === get("phccs_mainClan", "Bonus Adventures from Hell"),
            do: () => setClan(get("phccs_mainClan", "Bonus Adventures from Hell")),
        },
        {
            name: "Toot",
            prepare: () => visitUrl("tutorial.php?action=toot"),
            completed: () =>
                get("questM05Toot") === "finished" && !have($item`letter from King Ralph XI`),
            do: () => use($item`letter from King Ralph XI`),
            limit: { tries: 1 },
        },
        {
            name: "Numberology",
            ready: () => myLevel() === 1 && !mySpleenUse(),
            completed: () => get("_universeCalculated") >= get("skillLevel144"),
            do: () => cliExecute("numberology 69"),
            limit: { tries: 4 },
        },
        {
            name: "Borrowed Time",
            completed: () => get("_borrowedTimeUsed"),
            do: () => use($item`borrowed time`),
            acquire: [{ item: $item`borrowed time` }],
            limit: { tries: 1 },
        },
        {
            name: "Deck",
            completed: () => get("_deckCardsDrawn") < 15,
            do: () => cliExecute("cheat ancestral; cheat island; cheat 1952"),
            limit: { tries: 1 },
        },
        {
            name: "Juice Bar",
            completed: () => get("_chateauDeskHarvested"),
            do: () => visitUrl("place.php?whichplace=chateau&action=chateau_desk2"),
            limit: { tries: 1 },
        },
        {
            name: "Vote",
            completed: () => get("_voteToday"),
            do: (): void => {
                visitUrl("place.php?whichplace=town_right&action=townright_vote");
                visitUrl("choice.php?option=1&whichchoice=1331&g=2&local%5B%5D=2&local%5B%5D=3");
                visitUrl("place.php?whichplace=town_right&action=townright_vote");
            },
            limit: { tries: 1 },
        },
        {
            name: "Confiscator Grimoire",
            ready: () => have($skill`Summon Confiscated Things`),
            completed: () => !get("_grimoireConfiscatorSummons"),
            do: () => useSkill(1, $skill`Summon Confiscated Things`),
            limit: { tries: 1 },
        },
        {
            name: "Tasteful Grimoire",
            ready: () => have($skill`Summon Tasteful Items`),
            completed: () => !get("grimoire2Summons"),
            do: () => useSkill(1, $skill`Summon Tasteful Items`),
            limit: { tries: 1 },
        },
        {
            name: "Alice Grimoire",
            ready: () => have($skill`Summon Alice's Army Cards`),
            completed: () => !get("grimoire3Summons"),
            do: () => useSkill(1, $skill`Summon Alice's Army Cards`),
            limit: { tries: 1 },
            // TODO buy($coinmaster`Game Shoppe Snacks`, 1, $item`tobiko marble soda`);
        },
        {
            name: "Drinking Helmet",
            completed: () => have($item`dromedary drinking helmet`),
            do: () => use(1, $item`box of Familiar Jacks`),
            acquire: [{ item: $item`box of Familiar Jacks` }],
            outfit: { familiar: $familiar`Melodramedary` },
            limit: { tries: 1 },
        },
        {
            name: "Mummery",
            completed: () => get("_mummeryMods").includes("Experience (Mysticality)"),
            do: () => cliExecute("mummery myst"),
            outfit: { familiar: $familiar`Melodramedary` },
            limit: { tries: 1 },
        },
        {
            name: "Stillsuit",
            completed: () =>
                familiarEquippedEquipment($familiar`Shorter-Order Cook`) === $item`tiny stillsuit`,
            do: () => equip($familiar`Shorter-Order Cook`, $item`tiny stillsuit`),
            limit: { tries: 1 },
        },
        {
            name: "Cowboy Boots",
            completed: () => have($item`your cowboy boots`),
            do: (): void => {
                visitUrl("place.php?whichplace=town_right&action=townright_ltt");
                runChoice(5);
            },
            limit: { tries: 1 },
        },
        {
            name: "Cosplay Saber",
            completed: () => get("_saberMod") > 0,
            do: () => cliExecute("saber familiar"),
            limit: { tries: 1 },
        },
        {
            name: "Detective Badge",
            completed: () => have($item`gold detective badge`),
            do: () => visitUrl("place.php?whichplace=town_wrong&action=townwrong_precinct"),
            limit: { tries: 1 },
        },
        {
            name: "Floundry",
            completed: () => get("_floundryItemCreated"),
            do: () => Clan.with("Bonus Adventures From Hell", () => cliExecute("acquire codpiece")),
            limit: { tries: 1 },
        },
        {
            name: "BoomBox",
            completed: () => SongBoom.song() === "Total Eclipse of Your Meat",
            do: () => SongBoom.setSong("Total Eclipse of Your Meat"),
            limit: { tries: 1 },
        },
        {
            name: "Briefcase",
            completed: () =>
                !inHardcore() ||
                numericModifier($item`Kremlin's Greatest Briefcase`, "Weapon Damage Percent") > 0,

            do: () => cliExecute("Briefcase.ash enchantment weapon"),
            limit: { tries: 1 },
        },

        {
            name: "Scavenge",
            completed: () => !get("_daycareGymScavenges"),
            do: (): void => {
                visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
                runChoice(3);
                runChoice(2);
                runChoice(5);
                runChoice(4);
            },
            limit: { tries: 1 },
        },
        {
            name: "Autosell",
            completed: () => itemsToAutosell.every((item) => !have(item)),
            do: () => itemsToAutosell.forEach((item) => autosell(item, itemAmount(item))),
            limit: { tries: 1 },
        },
        {
            name: "Accordion",
            completed: () => have($item`toy accordion`),
            do: () => buy(1, $item`toy accordion`),
            limit: { tries: 1 },
        },
    ],
};
