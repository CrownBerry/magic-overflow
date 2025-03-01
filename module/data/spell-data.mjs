const DataModel = foundry.abstract.DataModel;
const fields = foundry.data.fields;

function spellCostField() {
  return new fields.SchemaField({
    minor: new fields.NumberField({ initial: 0 }),
    major: new fields.NumberField({ initial: 0 })
  });
}

function labelField() {
  return new fields.SchemaField({
    label: new fields.StringField(),
    value: new fields.spellCostField()
  });
}

export class MagicOverflowSpellData extends DataModel {
  static defineSchema() {
    return {
      description: new fields.StringField(),
      school: new fields.StringField(),
      word: new fields.StringField(),
      labels: new fields.ArrayField(labelField()),
      cost: spellCostField()
    };
  }

  static fromSource(source) {
    return new MagicOverflowSpellData(source);
  }
} 