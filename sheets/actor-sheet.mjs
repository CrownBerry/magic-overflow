export class MagicOverflowActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/magic-overflow/templates/actor-sheet.html",
            classes: ["magic-overflow", "sheet", "actor"],
            width: 600,
            height: 700,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    async getData() {
        const data = await super.getData();
        data.config = CONFIG.magicOverflow;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".skill-name").on("click", ev => {
            const skill = ev.currentTarget.dataset.skill;
            this.rollSkillCheck(skill);
        });
    }

    rollSkillCheck(skill) {
        const actor = this.actor;
        const skillData = actor.system.skills[skill];
        const dicePool = 1 + (skillData?.value || 0);

        const roll = new Roll(`${dicePool}d8`).roll();
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor }),
            flavor: `Rolling ${skill}`
        });
    }
}
