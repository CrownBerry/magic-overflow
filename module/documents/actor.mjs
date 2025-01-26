export class MagicOverflowActor extends Actor {
    prepareData() {
        super.prepareData();
        const actorData = this.system;

        if (this.type === 'character') {
            this._prepareCharacterData(actorData);
        }
    }

    _prepareCharacterData(actorData) {
        // Инициализация стартовых значений
        // Вычисление производных значений
        this._prepareResilience(actorData.resilience);
    }

    _prepareResilience(resilience) {
        for (let [key, track] of Object.entries(resilience)) {
            // Убеждаемся что value всегда число
            track.value = Number(track.value) || 0;
            // Проверяем не превышает ли значение максимум
            track.value = Math.min(track.value, track.max);
        }
    }
}