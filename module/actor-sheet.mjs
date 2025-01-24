export class MagicOverflowActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/actor-sheet.hbs",
            classes: ["magic-overflow", "sheet", "actor"],
            width: 1200,
            height: 700,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
        });
    }

    async getData() {
        const context = await super.getData();
        context.system = this.actor.system;
        context.skills = Object.entries(CONFIG.MO.skills).map(([skill, skillData]) => ({
            name: skill,
            label: game.i18n.localize(skillData.label),
            hasSkill: this.actor.system.skills?.[skill]?.hasSkill || false,
            specializations: this.actor.system.skills?.[skill]?.specializations || []
        }));
        context.backgrounds = Object.entries(CONFIG.MO.backgrounds).map(([bg, bgData]) => ({
            name: bg,
            label: game.i18n.localize(bgData.label),
            hasBackground: this.actor.system.backgrounds?.[bg]?.hasBackground || false
        }));
        context.knowledge = Object.entries(CONFIG.MO.knowledge).map(([know, knowData]) => ({
            name: know,
            label: game.i18n.localize(knowData.label),
            hasKnowledge: this.actor.system.knowledge?.[know]?.hasKnowledge || false
        }));
        // Add resilience data
        context.resilience = Object.entries(this.actor.system.resilience).map(([key, data]) => ({
            name: key,
            label: game.i18n.localize(`MO.resilience.${key}`),
            value: data.value
        }));
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".skill-checkbox").on("change", ev => {
            const skillKey = ev.currentTarget.dataset.skill;
            const isChecked = ev.currentTarget.checked;
            this.actor.update({ [`system.skills.${skillKey}.hasSkill`]: isChecked });
        });

        html.find(".skill-specialization").on("change", ev => {
            const skillKey = ev.currentTarget.dataset.skill;
            const specializations = ev.currentTarget.value;
            this.actor.update({ [`system.skills.${skillKey}.specializations`]: specializations.split(',') });
        });

        html.find(".background-checkbox").on("change", ev => {
            const bgKey = ev.currentTarget.dataset.background;
            const isChecked = ev.currentTarget.checked;
            this.actor.update({ [`system.backgrounds.${bgKey}.hasBackground`]: isChecked });
        });

        html.find(".knowledge-checkbox").on("change", ev => {
            const knowKey = ev.currentTarget.dataset.knowledge;
            const isChecked = ev.currentTarget.checked;
            this.actor.update({ [`system.knowledge.${knowKey}.hasKnowledge`]: isChecked });
        });

        // Add listeners for resilience and overflow inputs
        html.find('.resilience-tracks input, .overflow-track input').on('change', this._onTrackChange.bind(this));
    }

    _onTrackChange(event) {
        const input = event.currentTarget;
        const value = Math.max(0, Math.min(parseInt(input.value) || 0, input.max || 3));
        const fieldName = input.name;

        this.actor.update({ [fieldName]: value });
    }

    rollSkillCheck(skillKey) {
        const skill = this.actor.system.skills[skillKey];
        const dicePool = skill?.hasSkill ? 1 : 0;

        const roll = new Roll(`${dicePool}d8`).roll();
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `Rolling ${skill?.name || skillKey}`
        });
    }
}
