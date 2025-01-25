import { MagicOverflowActorSheet } from "./actor-sheet.mjs";
import { TalentSheet } from "./talent-sheet.mjs";
import MO from "./config.mjs";

Hooks.once("init", async function () {
    console.log("Magic Overflow | Initializing custom system");

    CONFIG.MO = MO;

    // Регистрация хелпера join
    Handlebars.registerHelper('join', function (array, delimiter) {
        return Array.isArray(array) ? array.join(delimiter) : '';
    });

    Handlebars.registerHelper('times', function (n, options) {
        let result = '';
        for (let i = 0; i < n; i++) {
            result += options.fn({ index: i });
        }
        return result;
    });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("magic-overflow", MagicOverflowActorSheet, {
        types: ["character"],
        makeDefault: true
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("magic-overflow", TalentSheet, {
        types: ["talent"],
        makeDefault: true
    });
});