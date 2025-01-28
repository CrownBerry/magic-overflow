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

    constructor(actor, rollType, entityName, options = {}) {
        super(options);
        this.actor = actor;
        this.rollType = rollType;
        this.entityName = entityName;
    }

    getData() {
        return {
            title: this.getDialogTitle()
        };
    }

    getDialogTitle() {
        const rollTypeText = game.i18n.localize(`MO.rolls.${this.rollType}`);
        return `${rollTypeText}: ${this.entityName}`;
    }

    getRollFormula() {
        return "1d8";
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Добавляем обработчик сабмита формы
        html.find('form').on('submit', (event) => {
            event.preventDefault();
            this._onRoll(event);
        });

        // Добавляем обработчик клика на кнопку
        html.find('button[name="roll"]').on('click', (event) => {
            event.preventDefault();
            this._onRoll(event);
        });
    }

    async _onRoll(event) {
        event.preventDefault();
        const formData = new FormData(event.target.closest('form'));

        let roll = await new MagicOverflowRoll(
            this.getRollFormula(formData),
            { actor: this.actor }
        ).evaluate();

        const chatData = {
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: this.getDialogTitle(),
            content: await roll.render()
        };

        await ChatMessage.create(chatData);
        this.close();
    }
}