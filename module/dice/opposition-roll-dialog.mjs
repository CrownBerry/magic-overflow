import { BaseRollDialog } from "./base-roll-dialog.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class OppositionRollDialog extends BaseRollDialog {
    constructor(actor, resilienceKey, options = {}) {
        super(actor, options);
        this.resilienceKey = resilienceKey;
    }

    getData() {
        const data = super.getData();

        // Получаем данные о стойкости
        const resilience = this.actor.system.resilience[this.resilienceKey];
        data.resilienceName = game.i18n.localize(resilience.label);

        // Получаем предыстории для выбора
        data.backgrounds = Object.entries(this.actor.system.backgrounds)
            .filter(([key, bg]) => bg.prof)
            .map(([key, bg]) => ({
                key,
                label: game.i18n.localize(CONFIG.MO.backgrounds[key])
            }));

        return data;
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

    getDialogTitle() {
        return `${game.i18n.localize('MO.ui.oppositionRoll')}: ${game.i18n.localize(this.actor.system.resilience[this.resilienceKey].label)}`;
    }
}