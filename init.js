import { MagicOverflowActorSheet } from "./sheets/actor-sheet.js";

Hooks.once("init", async function() {
  console.log("Magic Overflow | Initializing custom system");

  CONFIG.magicOverflow = {
    skillList: {
      brawl: "@LANG.skills.brawl",
      stealth: "@LANG.skills.stealth",
      communication: "@LANG.skills.communication",
      coordination: "@LANG.skills.coordination",
      craft: "@LANG.skills.craft",
      observation: "@LANG.skills.observation",
      survival: "@LANG.skills.survival"
    }
  };

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("magic-overflow", MagicOverflowActorSheet, {
    types: ["character"],
    makeDefault: true
  });
});
