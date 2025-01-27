import { BaseRollDialog } from "./base-roll-dialog.mjs";

export class RiskRollDialog extends BaseRollDialog {
    constructor(actor, skillName, skillKey, options = {}) {
        super(actor, options);
        this.skillName = skillName;
        this.skillKey = skillKey;
    }

    getDialogTitle() {
        return `Risk Roll: ${this.skillName}`;
    }

    // Получаем количество кубов для броска
    getDiceCount() {
        let diceCount = 1; // Базовый куб всегда есть

        // Проверяем владение навыком
        if (this.actor.system.skills[this.skillKey]?.prof) {
            diceCount += 1;
        }

        return diceCount;
    }

    // Переопределяем метод броска
    getRollFormula() {
        const diceCount = this.getDiceCount();
        return `${diceCount}d8`;
    }
}