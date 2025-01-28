import { BaseRollDialog } from "./base-roll-dialog.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class OppositionRollDialog extends BaseRollDialog {
    constructor(actor, resilienceKey, options = {}) {
        const resilience = actor.system.resilience[resilienceKey];
        const resilienceName = game.i18n.localize(resilience.label);
        super(actor, 'opposition', resilienceName, options);
        this.resilienceKey = resilienceKey;
    }

    getDiceCount(formData = null) {
        let diceCount = 1; // Базовый куб

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
}