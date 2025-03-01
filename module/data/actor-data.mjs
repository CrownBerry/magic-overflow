import { MagicOverflowSpellData } from "./spell-data.mjs";
import { MagicOverflowTalentData } from "./talent-data.mjs";

const TypeDataModel = foundry.abstract.TypeDataModel;
const fields = foundry.data.fields;

function skillField() {
  return new fields.SchemaField({
    prof: new fields.BooleanField(),
    specializations: new fields.ArrayField( new fields.StringField())
  });
}

function backgroundField() {
  return new fields.SchemaField({
    prof: new fields.BooleanField(),
  });
}

function resilienceField() {
  return new fields.SchemaField({
    value: new fields.NumberField(0),
    max: new fields.NumberField(3),
    prof: new fields.BooleanField()
  });
}

function knowledgeField() {
  return new fields.SchemaField({
    prof: new fields.BooleanField()
  });
}

function magicField() {
  return new fields.SchemaField({
    prof: new fields.BooleanField()
  });
}

function wordsField() {
  return new fields.SchemaField({
    prof: new fields.BooleanField()
  });
}

export class MagicOverflowActorData extends TypeDataModel {
  static defineSchema() {
    return {
      biography: new fields.StringField(),
      skills: new fields.SchemaField({
        brawl: skillField(),
        stealth: skillField(),
        communication: skillField(),
        coordination: skillField(),
        tech: skillField(),
        analyze: skillField(),
        instinct: skillField(),
      }),
      resilience: new fields.SchemaField({
        flesh: resilienceField(),
        mind: resilienceField(),
        spirit: resilienceField()
      }),
      backgrounds: new fields.SchemaField({
        highSociety: backgroundField(),
        militaryOrganization: backgroundField(),       
        lawEnforcers: backgroundField(),
        corporateElites: backgroundField(),
        mediaAndTech: backgroundField(),
        criminalSyndicate: backgroundField(),
        outsiders: backgroundField(),   
      }),
      knowledge: new fields.SchemaField({
        academics: knowledgeField(),
        art: knowledgeField(),
        psychology: knowledgeField(),
        medicine: knowledgeField(),
        law: knowledgeField(),
        occult: knowledgeField(),
        streetwise: knowledgeField()
      }),
      magic: new fields.SchemaField({
        schools: new fields.SchemaField({
          matter: magicField(),
          energy: magicField(),
          space: magicField(),
          time: magicField(),
          mind: magicField(),
          magic: magicField(),
          afterlife: magicField()
        }),
        words: new fields.SchemaField({
          sense: wordsField(),
          strengthen: wordsField(),
          restore: wordsField(),
          control: wordsField(),
          destroy: wordsField(),
          create: wordsField(),
          transform: wordsField()
        }),
        spells: new fields.ArrayField(new fields.DataField({ model: MagicOverflowSpellData }))
      }),
      talents: new fields.ArrayField(new fields.DataField({ model: MagicOverflowTalentData })),
      money: new fields.SchemaField({
        value: new fields.NumberField({ initial: 3 }),
        max: new fields.NumberField({ initial: 7 })
      }),
      overflow: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
        max: new fields.NumberField({ initial: 7 })
      }),
      state: new fields.SchemaField({
        fortune: new fields.BooleanField(),
        misfortune: new fields.BooleanField()
      }),
      consequences: new fields.SchemaField({
        list: new fields.ArrayField(new fields.StringField())
      })
    };
  }

  prepareDerivedData() {
    // Обрабатываем каждую шкалу стойкости отдельно
    ['flesh', 'mind', 'spirit'].forEach(key => {
      let track = this.resilience[key];
      track.value = Number(track.value) || 0;
      track.value = Math.min(track.value, track.max);
      track.max = track.prof ? 4 : 3;
    });
    // Дополнительные вычисляемые данные для других секций можно добавить здесь
  }

  static fromSource(source) {
    return new MagicOverflowActorData(source);
  }
}
