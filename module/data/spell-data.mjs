import { DataModel, fields } from "foundry.js";

export class MagicOverflowSpellData extends DataModel {
  static defineSchema() {
    return {
      description: new fields.SchemaField({ type: String, default: "" }),
      school: new fields.SchemaField({ type: String, default: "" }),
      word: new fields.SchemaField({ type: String, default: "" }),
      labels: new fields.SchemaField({ type: Object, default: {} }),
      cost: new fields.SchemaField({ type: Object, default: { minor: 0, major: 0 } })
    };
  }

  static fromSource(source) {
    return new MagicOverflowSpellData(source);
  }
} 