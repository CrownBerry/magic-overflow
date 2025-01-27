import { BaseRollDialog } from "./base-roll-dialog.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class RiskRollDialog extends BaseRollDialog {
    constructor(actor, skillName, skillKey, options = {}) {
        super(actor, options);
        this.skillName = skillName;
        this.skillKey = skillKey;
    }

    getData() {
        const data = super.getData();

        // Получаем специализации для навыка
        const skill = this.actor.system.skills[this.skillKey];
        data.specializations = skill?.specializations?.join(", ");
        data.hasSpecialization = skill?.specializations?.length > 0;

        // Добавляем текущую формулу броска
        data.formula = this.getRollFormula();

        return data;
    }

    getDiceCount(formData) {
        let diceCount = 1; // Базовый куб

        // Проверяем владение навыком
        if (this.actor.system.skills[this.skillKey]?.prof) {
            diceCount += 1;
        }

        // Добавляем куб за специализацию
        if (formData.get('useSpecialization') && this.actor.system.skills[this.skillKey]?.specializations?.length > 0) {
            diceCount += 1;
        }

        // Добавляем куб за предысторию
        if (formData.get('useBackground')) {
            diceCount += 1;
        }

        return diceCount;
    }

    getRollFormula(formData) {
        const diceCount = this.getDiceCount(formData);
        return `${diceCount}d8`;
    }

    async _onRoll(event) {
        event.preventDefault();
        const formData = new FormData(event.target.closest('form'));

        let roll = await new MagicOverflowRoll(this.getRollFormula(formData)).evaluate({ async: true });

        const chatData = {
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: this.getDialogTitle(),
            content: await roll.render()
        };

        await ChatMessage.create(chatData);
        this.close();
    }
}