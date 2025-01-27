export class MagicOverflowRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        this.results = {
            minorSuccess: 0,
            majorSuccess: 0,
            overflow: 0
        };
        this.actor = data.actor; // Берем актора из data
        console.log("Constructor. Actor:", this.actor);
    }

    async evaluate() {
        await this._evaluate();
        console.log("After evaluate. Results:", this.terms[0].results); // Проверим результаты броска

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
        console.log("After counting. Results:", this.results); // Проверим подсчет успехов

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

    // Вспомогательные методы
    get totalSuccess() {
        return this.results.minorSuccess + this.results.majorSuccess;
    }

    async render(options = {}) {
        return await renderTemplate("systems/magic-overflow/templates/dice/roll-result.hbs", {
            formula: this.formula,
            results: this.terms[0].results,
            successes: this.results,
            overflowMessage: this.overflowMessage
        });
    }
}