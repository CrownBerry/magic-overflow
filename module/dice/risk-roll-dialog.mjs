import { BaseRollDialog } from "./base-roll-dialog.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class RiskRollDialog extends BaseRollDialog {
    constructor(actor, skillName, skillKey, options = {}) {
        super(actor, 'risk', skillName, options);
        this.skillKey = skillKey;
    }

    getData() {
        const data = super.getData();
        const skill = this.actor.system.skills[this.skillKey];
        data.specializations = skill?.specializations?.join(", ");
        data.hasSpecialization = skill?.specializations?.length > 0;
        return data;
    }

    getDiceCount(formData = null) {
        let diceCount = 1; // Базовый куб

        // Проверяем владение навыком
        if (this.actor.system.skills[this.skillKey]?.prof) {
            diceCount += 1;
        }

        if (formData) {
            if (formData.get('useSpecialization') && this.actor.system.skills[this.skillKey]?.specializations?.length > 0) {
                diceCount += 1;
            }
            if (formData.get('useBackground')) {
                diceCount += 1;
            }
        }

        if (this.actor.system.state.fortune) {
            diceCount += 1;
        }
        if (this.actor.system.state.misfortune) {
            diceCount -= 1;
        }

        return Math.max(0, diceCount);
    }

    getRollFormula(formData = null) {
        const diceCount = this.getDiceCount(formData);
        return `${diceCount}d8`;
    }
}