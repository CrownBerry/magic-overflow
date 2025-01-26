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
    }
}