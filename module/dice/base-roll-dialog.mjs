export class BaseRollDialog extends Application {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/dice/base-roll-dialog.hbs",
            classes: ["magic-overflow", "dialog", "base-roll"],
            width: 400,
            height: 200,
            buttons: {
                roll: {
                    label: "Roll",
                    callback: (html) => this._onRoll(html)
                }
            }
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

    async _onRoll() {
        let roll = await new Roll("1d8").evaluate({ async: true });

        // В будущем здесь будет общая логика подсчета успехов

        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: this.getDialogTitle()
        });
        this.close();
    }
}