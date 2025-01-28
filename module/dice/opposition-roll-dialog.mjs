import { BaseRollDialog } from "./base-roll-dialog.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class OppositionRollDialog extends BaseRollDialog {
    constructor(actor, resilienceKey, options = {}) {
        super(actor, options);
        this.resilienceKey = resilienceKey;
    }

    getData() {
        const data = super.getData();
        const resilience = this.actor.system.resilience[this.resilienceKey];
        data.title = `${game.i18n.localize('MO.ui.oppositionRoll')}: ${game.i18n.localize(resilience.label)}`;
        return data;
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
            flavor: this.title,
            content: await roll.render()
        };

        await ChatMessage.create(chatData);
        this.close();
    }

    getDiceCount(formData = null) {
        let diceCount = 1; // Базовый куб

        // Добавляем значение шкалы стойкости
        const resilience = this.actor.system.resilience[this.resilienceKey];
        diceCount += resilience.value;

        // Если передана форма, проверяем модификаторы
        if (formData) {
            // Вычитаем куб за предысторию если она выбрана
            if (formData.get('useBackground')) {
                diceCount -= 1;
            }
        }

        // Добавляем неудачу и вычитаем удачу (обратная логика для броска противостояния)
        if (this.actor.system.state.fortune) {
            diceCount -= 1;
        }
        if (this.actor.system.state.misfortune) {
            diceCount += 1;
        }

        return Math.max(0, diceCount); // Не меньше 0 кубов
    }

    getRollFormula(formData = null) {
        const diceCount = this.getDiceCount(formData);
        return `${diceCount}d8`;
    }
}