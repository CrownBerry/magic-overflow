import { BaseRollDialog } from "./base-roll-dialog.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class OppositionRollDialog extends BaseRollDialog {
    constructor(actor, resilienceName, resilienceKey, options = {}) {
        super(actor, 'opposition', resilienceName, options);
        this.resilienceKey = resilienceKey;
    }

    getDiceCount(formData = null) {
        let diceCount = 1;
        const resilience = this.actor.system.resilience[this.resilienceKey];
        diceCount += resilience.value;

        if (formData && formData.get('useBackground')) {
            diceCount -= 1;
        }

        if (this.actor.system.state.fortune) {
            diceCount -= 1;
        }
        if (this.actor.system.state.misfortune) {
            diceCount += 1;
        }

        return Math.max(0, diceCount);
    }

    getRollFormula(formData = null) {
        const diceCount = this.getDiceCount(formData);
        return `${diceCount}d8`;
    }

    async _onRoll(event) {
        event.preventDefault();
        const formData = new FormData(event.target.closest('form'));

        let roll = await new MagicOverflowRoll(
            this.getRollFormula(formData),
            { actor: this.actor }
        ).evaluate();

        const filledBoxes = roll.getFilledBoxes();
        const resilience = this.actor.system.resilience[this.resilienceKey];
        const currentValue = resilience.value;
        const maxValue = resilience.max;
        let message = '';

        // Рассчитываем новое значение и проверяем различные условия
        const newValue = Math.min(currentValue + filledBoxes, maxValue);
        const excessBoxes = currentValue + filledBoxes - maxValue;

        if (currentValue === maxValue) {
            message = game.i18n.format("MO.ui.opposition.alreadyFull", {
                track: game.i18n.localize(resilience.label)
            });
        } else if (newValue === maxValue) {
            message = game.i18n.format("MO.ui.opposition.nowFull", {
                track: game.i18n.localize(resilience.label)
            });
        } else if (excessBoxes > 0) {
            message = game.i18n.format("MO.ui.opposition.excess", {
                track: game.i18n.localize(resilience.label),
                boxes: excessBoxes
            });
        }

        // Обновляем значение шкалы
        await this.actor.update({ [`system.resilience.${this.resilienceKey}.value`]: newValue });

        const chatData = {
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: this.getDialogTitle(),
            content: await roll.render(),
            // Если есть сообщение, добавляем его в content
            ...(message && { content: (await roll.render()) + `<div class="opposition-message">${message}</div>` })
        };

        await ChatMessage.create(chatData);
        this.close();
    }
}