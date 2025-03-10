// magic-roll-dialog.mjs
import { BaseRollDialog } from "./base-roll-dialog.mjs";
import { MagicOverflowRoll } from "./magic-overflow-roll.mjs";

export class MagicRollDialog extends BaseRollDialog {
    constructor(actor, schoolKey, options = {}) {
        const schoolName = game.i18n.localize(CONFIG.MO.magic.schools[schoolKey]);
        super(actor, 'magic', schoolName, options);
        this.schoolKey = schoolKey;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/dice/magic-roll-dialog.hbs",
            classes: ["magic-overflow", "dialog", "magic-roll"],
            width: 500,
            height: 'auto'
        });
    }

    activateListeners(html) {
        // Вызываем слушатели из базового класса, которые назначают обработчики для сабмита и клика на кнопку (_onRoll)
        super.activateListeners(html);

        // Дополнительный слушатель для обновления значения sacrifice
        html.find('input[name="sacrifice"]').on('input', (event) => {
            const value = event.currentTarget.value;
            html.find('.sacrifice-value').text(value);
        });
    }

    getData() {
        const data = super.getData();
        data.words = CONFIG.MO.magic.words;
        // Проверяем владение словами у актора
        data.wordsProf = Object.entries(this.actor.system.magic.words)
            .reduce((acc, [key, value]) => {
                acc[key] = value.prof;
                return acc;
            }, {});
        data.maxSacrifice = 3;
        return data;
    }

    getDiceCount(formData) {
        let diceCount = 1; // Базовый куб

        // Проверяем владение школой
        if (this.actor.system.magic.schools[this.schoolKey]?.prof) {
            diceCount += 1;
        }

        // Проверяем владение словом
        const selectedWord = formData.get('word');
        if (this.actor.system.magic.words[selectedWord]?.prof) {
            diceCount += 1;
        }

        // Добавляем кубы за связи
        if (formData.get('personalItem')) diceCount += 1;
        if (formData.get('trueName')) diceCount += 1;
        if (formData.get('flesh')) diceCount += 1;

        // Добавляем кубы за жертву
        const sacrifice = parseInt(formData.get('sacrifice') || 0);
        diceCount += sacrifice;

        // Добавляем куб за фирменное
        if (formData.get('signature')) diceCount += 1;

        // Состояния удачи/неудачи
        if (formData && formData.get('fortune')) {
            diceCount += 1;
        }
        if (formData && formData.get('misfortune')) {
            diceCount -= 1;
        }

        return Math.max(0, diceCount);
    }

    getRollFormula(formData) {
        const diceCount = this.getDiceCount(formData);
        return `${diceCount}d8`;
    }

    async _onRoll(event) {
        event.preventDefault();
        const formData = new FormData(event.target.closest('form'));
        
        // Получаем количество кругов и проверяем их
        const minorCircles = parseInt(formData.get('minorCircles'));
        const majorCircles = parseInt(formData.get('majorCircles'));
        if (isNaN(minorCircles) || isNaN(majorCircles)) {
            ui.notifications.error(game.i18n.localize("MO.ui.magicRoll.invalidCircles"));
            return;
        }

        let roll = await new MagicOverflowRoll(
            this.getRollFormula(formData),
            {  
                actor: this.actor,
                minorCircles,
                majorCircles
            }
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