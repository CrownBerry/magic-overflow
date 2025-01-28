import { MagicCalculator } from "../helpers/magic-calculator.mjs";

export class MagicCalculatorDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "magic-calculator",
            title: game.i18n.localize("MO.magicCalculator.title"),
            template: "systems/magic-overflow/templates/magic-calculator-dialog.hbs",
            width: 540,
            height: "auto",
            classes: ["magic-overflow", "dialog", "magic-calculator"]
        });
    }

    getData() {
        return {
            config: CONFIG.MO,
            labels: {
                distant: {
                    label: game.i18n.localize("MO.magicCalculator.labelNames.distant"),
                    hasLevels: false
                },
                ignoresVision: {
                    label: game.i18n.localize("MO.magicCalculator.labelNames.ignoresVision"),
                    hasLevels: false
                },
                veil: {
                    label: game.i18n.localize("MO.magicCalculator.labelNames.veil"),
                    hasLevels: true
                },
                piercing: {
                    label: game.i18n.localize("MO.magicCalculator.labelNames.piercing"),
                    hasLevels: false
                },
                dangerous: {
                    label: game.i18n.localize("MO.magicCalculator.labelNames.dangerous"),
                    hasLevels: true
                },
                unnoticed: {
                    label: game.i18n.localize("MO.magicCalculator.labelNames.unnoticed"),
                    hasLevels: true
                }
            }
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Обработчики изменений для всех элементов формы
        html.find('input[type="radio"]').on('change', () => this._updateCalculation());
        html.find('input[type="checkbox"]').on('change', (event) => {
            const checkbox = event.currentTarget;
            const select = $(checkbox).closest('.label-item').find('select');
            if (select.length) {
                select.prop('disabled', !checkbox.checked);
            }
            this._updateCalculation();
        });
        html.find('select').on('change', () => this._updateCalculation());

        // Начальный подсчет
        this._updateCalculation();
    }

    _updateCalculation() {
        const form = this.element.find('form')[0];
        if (!form) return;

        const formData = new FormData(form);
        const school = formData.get('school');
        const word = formData.get('word');
        const labels = {};

        // Собираем данные о ярлыках
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('labels.') && value === 'on') {
                const labelKey = key.replace('labels.', '');
                const levelKey = `labelLevel.${labelKey}`;
                const level = formData.get(levelKey);
                labels[labelKey] = level ? parseInt(level) : 0;
            }
        }

        // Вычисляем круги
        const result = MagicCalculator.calculateCircles(school, word, labels);

        // Обновляем отображение
        this.element.find('.minor-circles').text(result.minor);
        this.element.find('.major-circles').text(result.major);
    }
}