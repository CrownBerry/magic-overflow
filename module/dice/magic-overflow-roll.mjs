export class MagicOverflowRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
    }

    // Переопределяем метод оценки результатов
    evaluate({ async = false } = {}) {
        // Сначала выполняем стандартную оценку
        const evaluated = super.evaluate({ async });

        // Добавляем наши специфичные результаты
        this.results = {
            minorSuccess: 0,
            majorSuccess: 0,
            overflow: 0
        };

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

        return evaluated;
    }

    // Метод для получения общего количества успехов
    get totalSuccess() {
        return this.results.minorSuccess + this.results.majorSuccess;
    }
}