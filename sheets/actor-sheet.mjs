export class MagicOverflowActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/actor-sheet.hbs",
            classes: ["magic-overflow", "sheet", "actor"],
            width: 600,
            height: 700,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
        });
    }

    async getData() {
        const context = await super.getData();
        context.system = this.actor.system;
        context.skills = CONFIG.magicOverflow.skills.map(skill => ({
            name: skill,
            hasSkill: this.actor.system.skills?.[skill]?.hasSkill || false
        }));
        context.backgrounds = CONFIG.magicOverflow.backgrounds.map(bg => ({
            name: bg,
            hasBackground: this.actor.system.backgrounds?.[bg]?.hasBackground || false
        }));
        context.knowledge = CONFIG.magicOverflow.knowledge.map(know => ({
            name: know,
            hasKnowledge: this.actor.system.knowledge?.[know]?.hasKnowledge || false
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
