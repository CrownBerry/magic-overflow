import { DataModel, fields } from "foundry";

export class MagicOverflowActorData extends DataModel {
  static defineSchema() {
    return {
      biography: new fields.SchemaField({ type: String, default: "" }),
      skills: new fields.SchemaField({
        brawl: { type: Object, default: { prof: false, specializations: [] } },
        stealth: { type: Object, default: { prof: false, specializations: [] } },
        communication: { type: Object, default: { prof: false, specializations: [] } },
        coordination: { type: Object, default: { prof: false, specializations: [] } },
        tech: { type: Object, default: { prof: false, specializations: [] } },
        analyze: { type: Object, default: { prof: false, specializations: [] } },
        instinct: { type: Object, default: { prof: false, specializations: [] } }
      }),
      resilience: new fields.SchemaField({
        flesh: { type: Object, default: { value: 0, max: 3, prof: false } },
        mind: { type: Object, default: { value: 0, max: 3, prof: false } },
        spirit: { type: Object, default: { value: 0, max: 3, prof: false } }
      }),
      backgrounds: new fields.SchemaField({
        highSociety: { type: Object, default: { prof: false } },
        militaryOrganization: { type: Object, default: { prof: false } },
        lawEnforcers: { type: Object, default: { prof: false } },
        corporateElites: { type: Object, default: { prof: false } },
        mediaAndTech: { type: Object, default: { prof: false } },
        criminalSyndicate: { type: Object, default: { prof: false } },
        outsiders: { type: Object, default: { prof: false } }
      }),
      knowledge: new fields.SchemaField({
        academics: { type: Object, default: { prof: false } },
        art: { type: Object, default: { prof: false } },
        psychology: { type: Object, default: { prof: false } },
        medicine: { type: Object, default: { prof: false } },
        law: { type: Object, default: { prof: false } },
        occult: { type: Object, default: { prof: false } },
        streetwise: { type: Object, default: { prof: false } }
      }),
      magic: new fields.SchemaField({
        schools: { type: Object, default: {
          matter: { prof: false },
          energy: { prof: false },
          space: { prof: false },
          time: { prof: false },
          mind: { prof: false },
          magic: { prof: false },
          afterlife: { prof: false }
        }},
        words: { type: Object, default: {
          sense: { prof: false },
          strengthen: { prof: false },
          restore: { prof: false },
          control: { prof: false },
          destroy: { prof: false },
          create: { prof: false },
          transform: { prof: false }
        }},
        spells: { type: Array, default: [] }
      }),
      talents: new fields.SchemaField({ type: Array, default: [] }),
      money: new fields.SchemaField({ type: Object, default: { value: 3, max: 7 } }),
      overflow: new fields.SchemaField({ type: Object, default: { value: 0, max: 7 } }),
      state: new fields.SchemaField({ type: Object, default: { fortune: false, misfortune: false } }),
      consequences: new fields.SchemaField({ type: Object, default: { list: [] } })
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