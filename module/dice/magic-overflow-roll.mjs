export class MagicOverflowRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        this.results = {
            minorSuccess: 0,
            majorSuccess: 0,
            overflow: 0
        };
        this.actor = options.actor;
    }

    evaluate() {
        super.evaluateSync();  // Используем evaluateSync вместо evaluate

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

        // Обрабатываем переполнение
        if (this.results.overflow > 0 && this.actor) {
            const currentOverflow = this.actor.system.overflow.value;
            const maxOverflow = this.actor.system.overflow.max;
            const newOverflowCount = Math.min(currentOverflow + this.results.overflow, maxOverflow);

            if (currentOverflow < maxOverflow) {
                this.actor.update({ 'system.overflow.value': newOverflowCount });
            }

            if (currentOverflow >= maxOverflow) {
                ChatMessage.create({
                    content: `<div class="overflow-warning">Overflow occurred but ${this.actor.name}'s overflow track is already full!</div>`,
                    speaker: ChatMessage.getSpeaker({ actor: this.actor })
                });
            } else if (newOverflowCount === maxOverflow && this.results.overflow > (maxOverflow - currentOverflow)) {
                ChatMessage.create({
                    content: `<div class="overflow-warning">${this.actor.name}'s overflow track is now full! ${this.results.overflow - (maxOverflow - currentOverflow)} overflow(s) were discarded.</div>`,
                    speaker: ChatMessage.getSpeaker({ actor: this.actor })
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
        const html = await renderTemplate("systems/magic-overflow/templates/dice/roll-result.hbs", {
            formula: this.formula,
            total: this.total,
            results: this.terms[0].results,
            successes: this.results
        });
        return html;
    }
}