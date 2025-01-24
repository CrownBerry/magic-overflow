import { MagicOverflowActorSheet } from "./sheets/actor-sheet.mjs";

Hooks.once("init", async function () {
    console.log("Magic Overflow | Initializing custom system");

    CONFIG.magicOverflow = {
        skills: {
            brawl: "@LANG.skills.brawl",
            stealth: "@LANG.skills.stealth",
            communication: "@LANG.skills.communication",
            coordination: "@LANG.skills.coordination",
            craft: "@LANG.skills.craft",
            observation: "@LANG.skills.observation",
            survival: "@LANG.skills.survival"
        },
        backgrounds: {
            highSociety: "@LANG.backgrounds.highSociety",
            militaryOrganization: "@LANG.backgrounds.militaryOrganization",
            religiousCommunity: "@LANG.backgrounds.religiousCommunity",
            tradeGroup: "@LANG.backgrounds.tradeGroup",
            craftGuild: "@LANG.backgrounds.craftGuild",
            criminalCommunity: "@LANG.backgrounds.criminalCommunity",
            freeWorker: "@LANG.backgrounds.freeWorker"
        },
        knowledge: {
            exactSciences: "@LANG.knowledge.exactSciences",
            art: "@LANG.knowledge.art",
            psychology: "@LANG.knowledge.psychology",
            medicine: "@LANG.knowledge.medicine",
            economy: "@LANG.knowledge.economy",
            religion: "@LANG.knowledge.religion",
            secretKnowledge: "@LANG.knowledge.secretKnowledge"
        }
    };

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("magic-overflow", MagicOverflowActorSheet, {
        types: ["character"],
        makeDefault: true
    });
});
