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
      return context;
    }
  
    activateListeners(html) {
      super.activateListeners(html);
      
      html.find(".skill-name").on("click", ev => {
        const skillKey = ev.currentTarget.dataset.skill;
        this.rollSkillCheck(skillKey);
      });
    }
  
    rollSkillCheck(skillKey) {
      const skill = this.actor.system.skills[skillKey];
      const dicePool = 1 + (skill?.value || 0);
  
      const roll = new Roll(`${dicePool}d8`).roll();
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `Rolling ${skill?.name || skillKey}`
      });
    }
  }
  