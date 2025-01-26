export class SpellSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["magic-overflow", "sheet", "item", "spell"],
            template: "systems/magic-overflow/templates/items/spell-sheet.hbs",
            width: 520,
            height: 480,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "description"
            }]
        });
    }

    getData() {
        const context = super.getData();
        context.system = this.item.system;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (!this.isEditable) return;

        // Редактирование изображения
        html.find('img[data-edit="img"]').click(ev => this._onEditImage(ev));
    }

    async _updateObject(event, formData) {
        return super._updateObject(event, formData);
    }
}