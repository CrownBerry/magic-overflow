export class MagicOverflowRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        // Инициализируем results в конструкторе
        this.results = {
            minorSuccess: 0,
            majorSuccess: 0,
            overflow: 0
        };
    }

    async evaluate({ async = true } = {}) {  // Всегда делаем async
        // Дожидаемся результата базового броска
        await super.evaluate({ async: true });

        // Теперь считаем наши результаты
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

        return this;
    }

    // Вспомогательные методы
    get totalSuccess() {
        return this.results.minorSuccess + this.results.majorSuccess;
    }
}