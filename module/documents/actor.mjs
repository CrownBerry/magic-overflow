export class MagicOverflowActor extends Actor {
    prepareData() {
        super.prepareData();
        const actorData = this;
        const systemData = actorData.system;

        if (this.type === 'character') {
            this._prepareCharacterData(actorData);
        }
    }

    _prepareCharacterData(actorData) {
        if (actorData.type !== 'character') return;
    
        // Make modifications to data here. For example:
        const systemData = actorData.system;

        // Инициализация стартовых значений
        // Вычисление производных значений
        this._prepareResilience(systemData.resilience);
    }

    _prepareResilience(resilience) {
        for (let [key, track] of Object.entries(resilience)) {
            // Убеждаемся что value всегда число
            track.value = Number(track.value) || 0;
            // Проверяем не превышает ли значение максимум
            track.value = Math.min(track.value, track.max);
            track.max = track.prof ? 4 : 3;
        }
    }
}