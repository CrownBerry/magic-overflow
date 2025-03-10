import { RiskRollDialog } from "../dice/risk-roll-dialog.mjs";
import { OppositionRollDialog } from "../dice/opposition-roll-dialog.mjs";
import { MagicCalculatorDialog } from "../documents/magic-calculator-dialog.mjs";
import { MagicRollDialog } from "../dice/magic-roll-dialog.mjs";

export class MagicOverflowActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/actor-sheet.hbs",
            classes: ["magic-overflow", "sheet", "actor"],
            width: 800,
            height: 750,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "proficiencies"
            }]
        });
    }

    async getData() {
        const context = await super.getData();

        // Use a safe clone of the actor data for further operations.
        const actorData = this.document.toObject(false);
        context.system = actorData.system;
        context.config = CONFIG.MO;

        console.log('Full context is:', context);

        this._prepareProficiencies(context);
        this._prepareMagic(context);

        context.talents = this.actor.items.filter(item => item.type === 'talent');
        context.spells = this.actor.items.filter(item => item.type === 'spell');

        // Преобразуем данные для шаблона
        return context;
    }

    _prepareProficiencies(context) {
        for (let [key, data] of Object.entries(context.system.skills)) {
            context.system.skills[key].label = game.i18n.localize(context.config.skills[key]);
        }
        for (let [key, data] of Object.entries(context.system.backgrounds)) {
            context.system.backgrounds[key].label = game.i18n.localize(context.config.backgrounds[key]);
        }
        for (let [key, data] of Object.entries(context.system.knowledge)) {
            context.system.knowledge[key].label = game.i18n.localize(context.config.knowledge[key]);
        }
        for (let [key, data] of Object.entries(context.system.resilience)) {
            context.system.resilience[key].label = game.i18n.localize(context.config.resilience[key]);
        }
    }

    _prepareMagic(context) {
        for (let [key, data] of Object.entries(context.system.magic.schools)) {
            context.system.magic.schools[key].label = game.i18n.localize(context.config.magic.schools[key]);
        }
        for (let [key, data] of Object.entries(context.system.magic.words)) {
            context.system.magic.words[key].label = game.i18n.localize(context.config.magic.words[key]);
        }
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Delegated event handlers
        html.on('change', '.prof-checkbox', this._onProfChange.bind(this));
        html.on('change', '.skill-specialization', this._onSpecializationChange.bind(this));
        html.on('change', '.magic-checkbox', this._onMagicChange.bind(this));
        html.on('change', '.overflow-box', this._onOverflowChange.bind(this));
        html.on('change', '.money-box', this._onMoneyChange.bind(this));
        html.on('change', '.resilience-box', this._onResilienceBoxChange.bind(this));

        // Таланты
        html.find('.item-create').click(this._onItemCreate.bind(this));
        html.find('.item-edit').click(this._onItemEdit.bind(this));
        html.find('.item-delete').click(this._onItemDelete.bind(this));
        html.find('.item-name').click(this._onItemToggleDescription.bind(this));

        // Броски
        html.find('.rollable').click(this._onRollableClick.bind(this));

        // Калькулятор магии
        html.find('.calculator-button').click(ev => {
            ev.preventDefault();
            new MagicCalculatorDialog().render(true);
        });

        // Последствия
        html.on('change', '.consequence-checkbox', this._onConsequenceToggle.bind(this));
        html.on('change', '.consequence-text', this._onConsequenceTextChange.bind(this));
    }

    _onRollableClick(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const rollType = element.dataset.roll;

        switch (rollType) {
            case 'risk':
                const skillKey = element.dataset.skill;
                const skillName = element.textContent.trim();
                new RiskRollDialog(this.actor, skillName, skillKey).render(true);
                break;
            case 'opposition':
                const resilienceKey = element.dataset.resilience;
                const resilienceName = element.textContent.trim();
                new OppositionRollDialog(this.actor, resilienceName, resilienceKey).render(true);
                break;
            case 'magic':
                const schoolKey = element.dataset.school;
                new MagicRollDialog(this.actor, schoolKey).render(true);
                break;
        }
    }

    _onProfChange(event) {
        const box = event.currentTarget;
        const prof = box.dataset.prof;
        const profKey = box.dataset.profkey;
        const isChecked = event.currentTarget.checked;
        console.log('Proficiency change:', prof, profKey, isChecked);
        this.actor.update({ [`system.${prof}.${profKey}.prof`]: isChecked });
    }

    async _onOverflowChange(event) {
        event.preventDefault();
        const box = event.currentTarget;
        const boxIndex = Number(box.dataset.box || 0);
        const newValue = box.checked ? boxIndex + 1 : boxIndex;
        await this.actor.update({ 'system.overflow.value': newValue });
    }

    async _onMoneyChange(event) {
        event.preventDefault();
        const box = event.currentTarget;
        const boxIndex = Number(box.dataset.box || 0);
        const newValue = box.checked ? boxIndex + 1 : boxIndex;
        await this.actor.update({ 'system.money.value': newValue });
    }

    async _onResilienceBoxChange(event) {
        event.preventDefault();
        const box = event.currentTarget;
        const trackType = box.dataset.resilience;
        const boxIndex = Number(box.dataset.box || 0);
        const newValue = box.checked ? boxIndex + 1 : boxIndex;
        await this.actor.update({ [`system.resilience.${trackType}.value`]: newValue });
    }

    _onSpecializationChange(event) {
        const skillKey = event.currentTarget.dataset.skill;
        const specializations = event.currentTarget.value.split(',').map(s => s.trim()).filter(Boolean);
        this.actor.update({ [`system.skills.${skillKey}.specializations`]: specializations });
    }

    _onMagicChange(event) {
        const box = event.currentTarget;
        const magicType = box.dataset.magic;
        const magicKey = box.dataset.magickey;
        const isChecked = event.currentTarget.checked;
        console.log('Proficiency change:', magicType, magicKey, isChecked);
        this.actor.update({ [`system.magic.${magicType}.${magicKey}.prof`]: isChecked });
    }

    async _onConsequenceToggle(event) {
        const index = event.currentTarget.dataset.index;
        const isChecked = event.currentTarget.checked;
        const consequences = this.actor.system.consequences.list;

        if (isChecked && !consequences[index]) {
            consequences[index] = { active: true, text: '' };
        } else if (!isChecked && consequences[index]) {
            consequences[index] = null;
        }

        await this.actor.update({ 'system.consequences.list': consequences });
        this.render(false);
    }

    async _onConsequenceTextChange(event) {
        const index = event.currentTarget.dataset.index;
        const text = event.currentTarget.value;
        const consequences = this.actor.system.consequences.list;

        if (consequences[index]) {
            consequences[index].text = text;
            await this.actor.update({ 'system.consequences.list': consequences });
        }
    }

    async _updateObject(event, formData) {
        return super._updateObject(event, formData);
    }

    _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const itemData = {
            name: game.i18n.format("MO.ui.newTalent"),
            type: type,
            img: 'icons/svg/item-bag.svg'  // Дефолтная иконка
        };
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    _onItemEdit(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        item.sheet.render(true);
    }

    async _onItemDelete(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        if (item) {
            const dialog = new Dialog({
                title: game.i18n.localize("MO.ui.deleteTalentTitle"),
                content: game.i18n.format("MO.ui.deleteTalentContent", { name: item.name }),
                buttons: {
                    delete: {
                        icon: '<i class="fas fa-trash"></i>',
                        label: game.i18n.localize("MO.ui.delete"),
                        callback: () => item.delete()
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize("MO.ui.cancel")
                    }
                },
                default: "cancel"
            });
            dialog.render(true);
        }
    }

    _onItemToggleDescription(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const description = li.querySelector(".item-description");
        const currentDisplay = description.style.display;

        // Сначала закрываем все описания
        this.element.find(".item-description").each((i, el) => {
            el.style.display = "none";
        });

        // Затем открываем текущее, если оно было закрыто
        if (currentDisplay === "none" || !currentDisplay) {
            description.style.display = "block";
        }
    }
}