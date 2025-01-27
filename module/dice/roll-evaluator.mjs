export class RollEvaluator {
    static evaluateRoll(roll) {
        const results = {
            minorSuccess: 0,
            majorSuccess: 0,
            overflow: 0
        };

        roll.terms[0].results.forEach(die => {
            if (die.result === 8) {
                results.overflow++;
                results.minorSuccess++;
            } else if (die.result === 7) {
                results.majorSuccess++;
            } else if (die.result === 3) {
                results.minorSuccess++;
            }
        });

        return results;
    }
}