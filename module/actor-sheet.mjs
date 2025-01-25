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
            magic: this._prepareMagic(systemData.magic)
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
                base[valueKey] = foundry.utils.getProperty(systemData, `${key}.${valueKey}`) || data[valueKey] || 0;
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
}