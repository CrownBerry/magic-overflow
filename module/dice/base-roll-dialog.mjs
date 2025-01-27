import { RollEvaluator } from "./roll-evaluator.mjs";

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

    async _onRoll(event) {
        event.preventDefault();

        let roll = await new Roll("1d8").evaluate({ async: true });
        let results = RollEvaluator.evaluateRoll(roll);

        const chatData = {
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: this.getDialogTitle(),
            content: `
                <div class="dice-roll">
                    <div class="dice-result">
                        <div class="dice-formula">${roll.formula}</div>
                        <div class="dice-tooltip">
                            <div class="result">${roll.result}</div>
                        </div>
                        <div class="roll-results">
                            <div>Minor Successes: ${results.minorSuccess}</div>
                            <div>Major Successes: ${results.majorSuccess}</div>
                            <div>Overflow: ${results.overflow}</div>
                        </div>
                    </div>
                </div>`
        };

        await ChatMessage.create(chatData);
        this.close();
    }
}