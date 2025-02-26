// helpers/magic-calculator.mjs

export class MagicCalculator {
    // Константы для базовых значений
    static SCHOOL_CIRCLES = { minor: 1, major: 0 };

    static WORD_CIRCLES = {
        sense: { minor: 0, major: 0 },
        strengthen: { minor: 1, major: 0 },
        restore: { minor: 0, major: 1 },
        control: { minor: 1, major: 1 },
        destroy: { minor: 0, major: 2 },
        create: { minor: 1, major: 2 },
        transform: { minor: 0, major: 3 }
    };

    static LABEL_CIRCLES = {
        distant: { minor: 1, major: 0 },
        ignoresVision: { minor: 0, major: 1 },
        veil: [
            { minor: 1, major: 0 },
            { minor: 0, major: 1 }
        ],
        piercing: { minor: 0, major: 1 },
        dangerous: [
            { minor: 1, major: 0 },
            { minor: 0, major: 1 }
        ],
        unnoticed: [
            { minor: 1, major: 0 },
            { minor: 0, major: 1 }
        ]
    };

    /**
     * Вычисляет круги для заклинания
     * @param {string} school - Школа магии
     * @param {string} word - Слово силы
     * @param {Object} labels - Объект с выбранными ярлыками и их уровнями
     * @returns {Object} Объект с количеством малых и больших кругов
     */
    static calculateCircles(school, word, labels = {}) {
        let result = {
            minor: this.SCHOOL_CIRCLES.minor,
            major: this.SCHOOL_CIRCLES.major
        };

        // Добавляем круги от слова силы
        if (word && this.WORD_CIRCLES[word]) {
            result.minor += this.WORD_CIRCLES[word].minor;
            result.major += this.WORD_CIRCLES[word].major;
        }

        // Добавляем круги от ярлыков
        for (const [label, level] of Object.entries(labels)) {
            if (this.LABEL_CIRCLES[label]) {
                // Если ярлык имеет варианты (массив)
                if (Array.isArray(this.LABEL_CIRCLES[label])) {
                    const selectedLevel = this.LABEL_CIRCLES[label][level];
                    if (selectedLevel) {
                        result.minor += selectedLevel.minor;
                        result.major += selectedLevel.major;
                    }
                } else {
                    // Если ярлык имеет фиксированное значение
                    result.minor += this.LABEL_CIRCLES[label].minor;
                    result.major += this.LABEL_CIRCLES[label].major;
                }
            }
        }

        return result;
    }

    /**
     * Форматирует результат для отображения
     * @param {Object} circles - Объект с количеством кругов
     * @returns {string} Отформатированная строка с результатом
     */
    static formatResult(circles) {
        return `${circles.minor}/${circles.major}`;
    }
}