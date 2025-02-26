import { MagicOverflowActorData } from "./data/actor-data.mjs";

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
    
        // Преобразуем legacy system data в новый DataModel
        actorData.system = MagicOverflowActorData.fromSource(actorData.system);
        actorData.system.prepareDerivedData();

        // Здесь можно добавить дополнительные преобразования, если необходимо
        // Раньше вызывался метод _prepareResilience, теперь логика внутри DataModel.prepareDerivedData
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