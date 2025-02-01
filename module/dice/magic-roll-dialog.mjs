export class MagicOverflowRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        this.results = {
            minorSuccess: 0,
            majorSuccess: 0,
            overflow: 0
        };
        this.actor = data.actor;

        // Параметры для магического броска
        if (data.minorCircles !== undefined) {
            this.minorCircles = data.minorCircles;
            this.majorCircles = data.majorCircles;
            this.filledCircles = {
                minor: 0,
                major: 0
            };
        }
    }

    async evaluate() {
        await this._evaluate();

        // Подсчитываем успехи
        this.terms[0].results.forEach(die => {
            if (die.result === 8) {
                this.results.overflow++;
                this.results.minorSuccess++;
            } else if (die.result === 7) {
                this.results.majorSuccess++;
            } else if (die.result === 3) {
                this.results.minorSuccess++;
            }
        });

        // Заполняем круги только для магического броска
        if (this.minorCircles !== undefined) {
            this._fillCircles();
        }

        // Обрабатываем переполнение для всех бросков
        if (this.results.overflow > 0 && this.actor) {
            const currentOverflow = this.actor.system.overflow.value;
            const maxOverflow = this.actor.system.overflow.max;
            const newOverflowCount = Math.min(currentOverflow + this.results.overflow, maxOverflow);

            if (currentOverflow < maxOverflow) {
                await this.actor.update({ 'system.overflow.value': newOverflowCount });
            }

            if (currentOverflow >= maxOverflow) {
                this.overflowMessage = game.i18n.format("MO.ui.overflowChat.trackFull", {
                    name: this.actor.name
                });
            } else if (newOverflowCount === maxOverflow && this.results.overflow > (maxOverflow - currentOverflow)) {
                this.overflowMessage = game.i18n.format("MO.ui.overflowChat.nowFull", {
                    name: this.actor.name,
                    count: this.results.overflow - (maxOverflow - currentOverflow)
                });
            }
        }

        return this;
    }

    _fillCircles() {
        // Сначала используем большие успехи
        let remainingMajor = this.results.majorSuccess;

        // Заполняем большие круги большими успехами
        const majorFilledByMajor = Math.min(remainingMajor, this.majorCircles);
        this.filledCircles.major = majorFilledByMajor;
        remainingMajor -= majorFilledByMajor;

        // Оставшиеся большие успехи используем для малых кругов
        const minorFilledByMajor = remainingMajor * 2;  // один большой успех может заполнить два малых круга

        // Используем малые успехи для оставшихся малых кругов
        const remainingMinorCircles = this.minorCircles - minorFilledByMajor;
        const minorFilledByMinor = Math.min(this.results.minorSuccess, remainingMinorCircles);

        this.filledCircles.minor = minorFilledByMajor + minorFilledByMinor;
    }

    getSpellResult() {
        const totalCircles = this.minorCircles + this.majorCircles;
        const filledCircles = this.filledCircles.minor + this.filledCircles.major;
        const halfCircles = Math.ceil(totalCircles / 2);

        if (filledCircles >= totalCircles) {
            return {
                success: true,
                message: game.i18n.localize("MO.ui.magicRoll.success")
            };
        } else if (filledCircles >= halfCircles) {
            return {
                partial: true,
                message: game.i18n.localize("MO.ui.magicRoll.partial")
            };
        } else {
            return {
                failure: true,
                message: game.i18n.localize("MO.ui.magicRoll.failure")
            };
        }
    }

    async render(options = {}) {
        const templateData = {
            formula: this.formula,
            results: this.terms[0].results,
            successes: this.results,
            overflowMessage: this.overflowMessage
        };

        // Добавляем данные только для магического броска
        if (this.minorCircles !== undefined) {
            const spellResult = this.getSpellResult();
            templateData.spellResult = spellResult;
            templateData.filledCircles = this.filledCircles;
            templateData.requiredCircles = {
                minor: this.minorCircles,
                major: this.majorCircles
            };
            templateData.filledMessage = game.i18n.format("MO.ui.magicRoll.filledCircles", {
                filled: this.filledCircles.minor + this.filledCircles.major,
                total: this.minorCircles + this.majorCircles
            });
        }

        return await renderTemplate("systems/magic-overflow/templates/dice/roll-result.hbs", templateData);
    }
}