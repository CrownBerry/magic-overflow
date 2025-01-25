export class MagicOverflowActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/actor-sheet.hbs",
            classes: ["magic-overflow", "sheet", "actor"],
            width: 1200,
            height: 700,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "proficiencies"
            }]
        });
    }

    async getData() {
        const context = await super.getData();
        const systemData = context.actor.system;

        // Преобразуем данные для шаблона
        return {
            ...context,
            system: systemData,
            skills: this._prepareSkills(systemData.skills),
            backgrounds: this._prepareBackgrounds(systemData.backgrounds),
            knowledge: this._prepareKnowledge(systemData.knowledge),
            resilience: this._prepareResilience(systemData.resilience),
            magic: this._prepareMagic(systemData.magic),
            talents: this.actor.items.filter(item => item.type === 'talent')
        };
    }

    _prepareList(configPath, systemData, options = {}) {
        const { valueKey = 'value', flagKey = null } = options;
        const config = foundry.utils.getProperty(CONFIG.MO, configPath);

        return Object.entries(config).map(([key, data]) => {
            const base = {
                name: key,
                label: game.i18n.localize(data.label)
            };

            if (flagKey) {
                base[flagKey] = foundry.utils.getProperty(systemData, `${key}.${flagKey}`) || false;
            }

            if (valueKey === 'specializations') {
                base[valueKey] = foundry.utils.getProperty(systemData, `${key}.${valueKey}`) || [];
            } else if (valueKey) {
                // Используем getProperty для получения значения из systemData
                const path = configPath === 'resilience' ? `resilience.${key}.${valueKey}` : key;
                base[valueKey] = foundry.utils.getProperty(systemData, path) ?? (data[valueKey] || 0);
            }

            return base;
        });
    }

    _prepareSkills(skills) {
        return this._prepareList('skills', skills, { flagKey: 'hasSkill', valueKey: 'specializations' });
    }

    _prepareBackgrounds(backgrounds) {
        return this._prepareList('backgrounds', backgrounds, { flagKey: 'hasBackground' });
    }

    _prepareKnowledge(knowledge) {
        return this._prepareList('knowledge', knowledge, { flagKey: 'hasKnowledge' });
    }

    _prepareResilience(resilience) {
        return this._prepareList('resilience', resilience, { valueKey: 'value' });
    }

    _prepareMagic(magic) {
        return {
            schools: this._prepareList('magic.schools', magic.schools, { flagKey: 'hasSchool' }),
            words: this._prepareList('magic.words', magic.words, { flagKey: 'hasWord' })
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Delegated event handlers
        html.on('change', '.skill-checkbox', this._onSkillChange.bind(this));
        html.on('change', '.skill-specialization', this._onSpecializationChange.bind(this));
        html.on('change', '.background-checkbox', this._onBackgroundChange.bind(this));
        html.on('change', '.knowledge-checkbox', this._onKnowledgeChange.bind(this));
        html.on('change', '.resilience-tracks input', this._onResilienceChange.bind(this));
        html.on('change', '.school-checkbox', this._onSchoolChange.bind(this));
        html.on('change', '.word-checkbox', this._onWordChange.bind(this));
        html.on('change', '.track-boxes input', this._onResilienceBoxChange.bind(this));

        // Таланты
        html.find('.item-create').click(this._onItemCreate.bind(this));
        html.find('.item-edit').click(this._onItemEdit.bind(this));
        html.find('.item-delete').click(this._onItemDelete.bind(this));
        html.find('.item-name').click(this._onItemToggleDescription.bind(this));
    }

    async _onResilienceBoxChange(event) {
        event.preventDefault();
        const box = event.currentTarget;
        const track = box.dataset.track;
        const trackType = track || box.dataset.resilience;

        // Находим все checkbox для данной дорожки
        const boxes = this.element.find(`input[data-track="${track}"], input[data-resilience="${trackType}"]`);

        let newValue = 0;
        boxes.each(function () {
            if (this.checked) newValue++;
        });

        // Определяем путь для обновления в зависимости от типа дорожки
        const updatePath = track === 'overflow'
            ? 'system.overflowTrack'
            : `system.resilience.${trackType}.value`;

        await this.actor.update({ [updatePath]: newValue });
    }

    _onSkillChange(event) {
        const skillKey = event.currentTarget.dataset.skill;
        const isChecked = event.currentTarget.checked;
        this.actor.update({ [`system.skills.${skillKey}.hasSkill`]: isChecked });
    }

    _onSpecializationChange(event) {
        const skillKey = event.currentTarget.dataset.skill;
        const specializations = event.currentTarget.value.split(',').map(s => s.trim()).filter(Boolean);
        this.actor.update({ [`system.skills.${skillKey}.specializations`]: specializations });
    }

    _onBackgroundChange(event) {
        const bgKey = event.currentTarget.dataset.background;
        const isChecked = event.currentTarget.checked;
        this.actor.update({ [`system.backgrounds.${bgKey}.hasBackground`]: isChecked });
    }

    _onKnowledgeChange(event) {
        const knowKey = event.currentTarget.dataset.knowledge;
        const isChecked = event.currentTarget.checked;
        this.actor.update({ [`system.knowledge.${knowKey}.hasKnowledge`]: isChecked });
    }

    _onResilienceChange(event) {
        const resKey = event.currentTarget.dataset.resilience;
        const value = Math.max(0, Math.min(parseInt(event.currentTarget.value) || 0, 3));
        this.actor.update({ [`system.resilience.${resKey}.value`]: value });
    }

    _onSchoolChange(event) {
        const schoolKey = event.currentTarget.dataset.school;
        const isChecked = event.currentTarget.checked;
        this.actor.update({ [`system.magic.schools.${schoolKey}.hasSchool`]: isChecked });
    }

    _onWordChange(event) {
        const wordKey = event.currentTarget.dataset.word;
        const isChecked = event.currentTarget.checked;
        this.actor.update({ [`system.magic.words.${wordKey}.hasWord`]: isChecked });
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