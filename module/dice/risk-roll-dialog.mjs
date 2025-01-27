import { BaseRollDialog } from "./base-roll-dialog.mjs";

export class RiskRollDialog extends BaseRollDialog {
    constructor(actor, skillName, options = {}) {
        super(actor, options);
        this.skillName = skillName;
    }

    getDialogTitle() {
        return `Risk Roll: ${this.skillName}`;
    }
}