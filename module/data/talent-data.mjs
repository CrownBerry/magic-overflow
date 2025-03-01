const DataModel = foundry.abstract.DataModel;
const fields = foundry.data.fields;

export class MagicOverflowTalentData extends DataModel {
  static defineSchema() {
    return {
      description: new fields.StringField()
    };
  }

  static fromSource(source) {
    return new MagicOverflowTalentData(source);
  }
} 