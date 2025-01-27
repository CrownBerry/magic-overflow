import { RollEvaluator } from "./roll-evaluator.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class BaseRollDialog extends Application {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/dice/base-roll-dialog.hbs",
            classes: ["magic-overflow", "dialog", "base-roll"],
            width: 400,
            height: 200
        });
    }

    constructor(actor, options = {}) {
        super(options);
        this.actor = actor;
    }

    getData() {
        return {
            title: this.getDialogTitle()
        };
    }

    getDialogTitle() {
        return "Base Roll";
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Добавляем обработчик клика на кнопку
        html.find('button[name="roll"]').click(this._onRoll.bind(this));
    }

    getRollFormula() {
        return "1d8";
    }

    async _onRoll(event) {
        event.preventDefault();

        let roll = await new MagicOverflowRoll(this.getRollFormula()).evaluate({ async: true });

        const chatData = {
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: this.getDialogTitle(),
            content: await roll.render()
        };

        await ChatMessage.create(chatData);
        this.close();
    }
}