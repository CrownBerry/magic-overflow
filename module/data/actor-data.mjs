import { MagicOverflowSpellData } from "./spell-data.mjs";
import { MagicOverflowTalentData } from "./talent-data.mjs";

const TypeDataModel = foundry.abstract.TypeDataModel;
const fields = foundry.data.fields;

function skillField(name, defaultProf, defaultSpecializations) {
  return new fields.SchemaField({
    prof: new fields.BooleanField({ default: defaultProf }),
    specializations: new fields.ArrayField({ default: defaultSpecializations, of: new fields.StringField })
  });
}

function backgroundField(name, defaultProf) {
  return new fields.SchemaField({
    prof: new fields.BooleanField({ default: defaultProf }),
  });
}

function resilienceField(name, defaultProf) {
  return new fields.SchemaField({
    value: new fields.NumberField({ default: 0 }),
    max: new fields.NumberField({ default: 3 }),
    prof: new fields.BooleanField({ default: defaultProf })
  });
}

function knowledgeField(name, defaultProf) {
  return new fields.SchemaField({
    prof: new fields.BooleanField({ default: defaultProf }),
  });
}

function magicField(name, defaultProf) {
  return new fields.SchemaField({
    prof: new fields.BooleanField({ default: defaultProf }),
  });
}

function wordsField(name, defaultProf) {
  return new fields.SchemaField({
    prof: new fields.BooleanField({ default: defaultProf }),
  });
}

export class MagicOverflowActorData extends TypeDataModel {
  static defineSchema() {
    return {
      biography: new fields.StringField({ default: "" }),
      skills: new fields.SchemaField({
        brawl: skillField("brawl", false, []),
        stealth: skillField("stealth", false, []),
        communication: skillField("communication", false, []),
        coordination: skillField("coordination", false, []),
        tech: skillField("tech", false, []),
        analyze: skillField("analyze", false, []),
        instinct: skillField("instinct", false, []),
      }),
      resilience: new fields.SchemaField({
        flesh: resilienceField("flesh", false),
        mind: resilienceField("mind", false),
        spirit: resilienceField("spirit", false)
      }),
      backgrounds: new fields.SchemaField({
        highSociety: backgroundField("highSociety", false),
        militaryOrganization: backgroundField("militaryOrganization", false),       
        lawEnforcers: backgroundField("lawEnforcers", false),
        corporateElites: backgroundField("corporateElites", false),
        mediaAndTech: backgroundField("mediaAndTech", false),
        criminalSyndicate: backgroundField("criminalSyndicate", false),
        outsiders: backgroundField("outsiders", false),   
      }),
      knowledge: new fields.SchemaField({
        academics: knowledgeField("academics", false),
        art: knowledgeField("art", false),
        psychology: knowledgeField("psychology", false),
        medicine: knowledgeField("medicine", false),
        law: knowledgeField("law", false),
        occult: knowledgeField("occult", false),
        streetwise: knowledgeField("streetwise", false)
      }),
      magic: new fields.SchemaField({
        schools: new fields.SchemaField({
          matter: magicField("matter", false),
          energy: magicField("energy", false),
          space: magicField("space", false),
          time: magicField("time", false),
          mind: magicField("mind", false),
          magic: magicField("magic", false),
          afterlife: magicField("afterlife", false)
        }),
        words: new fields.SchemaField({
          sense: wordsField("sense", false),
          strengthen: wordsField("strengthen", false),
          restore: wordsField("restore", false),
          control: wordsField("control", false),
          destroy: wordsField("destroy", false),
          create: wordsField("create", false),
          transform: wordsField("transform", false)
        }),
        spells: new fields.ArrayField({ default: [], of: new fields.DataField({ model: MagicOverflowSpellData }) })
      }),
      talents: new fields.ArrayField({ default: [], of: new fields.DataField({ model: MagicOverflowTalentData }) }),
      money: new fields.SchemaField({
        value: new fields.NumberField({ default: 3 }),
        max: new fields.NumberField({ default: 7 })
      }),
      overflow: new fields.SchemaField({
        value: new fields.NumberField({ default: 0 }),
        max: new fields.NumberField({ default: 7 })
      }),
      state: new fields.SchemaField({
        fortune: new fields.BooleanField({ default: false }),
        misfortune: new fields.BooleanField({ default: false })
      }),
      consequences: new fields.SchemaField({
        list: new fields.ArrayField({ default: [], of: new fields.StringField })
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
