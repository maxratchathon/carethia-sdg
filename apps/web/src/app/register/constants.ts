// ─── Register Form Static Data ────────────────────────────────────────────────
// All label maps and option arrays for the registration form.
// Enum values come from @/lib/types — no duplicated string literals.

import {
  ThaiDialect, SecondaryLanguage, CommunicationStyle,
  SpiritualSkill, CulinarySpecialty, EducationLevel,
  ClinicalSkill, MobilitySupport, ConditionExperience,
  StorytellingLevel, VocabBreadth,
  MusicalHeritage, CalendarAwareness, CulturalActivity,
} from '@/lib/types'

// ── Geography ─────────────────────────────────────────────────────────────────

export const COUNTRIES = [
  'Thailand', 'Myanmar', 'Cambodia', 'Laos', 'Vietnam', 'Philippines',
  'Indonesia', 'Malaysia', 'Singapore', 'China', 'Japan', 'South Korea',
  'India', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Pakistan',
  'United States', 'United Kingdom', 'Australia', 'Canada', 'Germany',
  'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland',
  'Russia', 'Ukraine', 'Poland', 'Brazil', 'Argentina', 'Mexico',
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Morocco',
  'Saudi Arabia', 'UAE', 'Israel', 'Turkey', 'Iran', 'Iraq', 'Other',
]

export const THAI_PROVINCES = [
  'Bangkok', 'Chiang Mai', 'Chiang Rai', 'Nakhon Ratchasima', 'Khon Kaen',
  'Udon Thani', 'Ubon Ratchathani', 'Nakhon Si Thammarat', 'Songkhla', 'Phuket',
  'Ayutthaya', 'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Chonburi',
  'Rayong', 'Surat Thani', 'Lampang', 'Phitsanulok', 'Phetchaburi', 'Other',
]

// ── Thai Caregiver Option Arrays (derived from enums) ─────────────────────────

export const THAI_DIALECTS = Object.values(ThaiDialect)

export const SECONDARY_LANGUAGES = Object.values(SecondaryLanguage)

export const COMMUNICATION_STYLES = [
  { value: CommunicationStyle.JaJaa,      label: '"Ja-Jaa" — Polite / Soft' },
  { value: CommunicationStyle.KhuaySanuk, label: '"Khuay-Sanuk" — Talkative / Entertaining' },
  { value: CommunicationStyle.SanguanTa,  label: '"Sanguan-Ta" — Reserved / Respectful' },
  { value: CommunicationStyle.DuedDun,    label: '"Dued-Dun" — Firm / Assertive' },
]

export const SPIRITUAL_OPTIONS = [
  { value: SpiritualSkill.TakBat,   label: 'Morning Almsgiving (Tak Bat) assistance' },
  { value: SpiritualSkill.Chanting, label: 'Chanting / Prayer accompaniment' },
  { value: SpiritualSkill.Holidays, label: 'Knowledge of Thai Buddhist holidays & rituals' },
]

export const CULINARY_OPTIONS = [
  { value: CulinarySpecialty.SoftFood,  label: 'Soft Food (Khao Tom)' },
  { value: CulinarySpecialty.LowSodium, label: 'Low-Sodium Thai' },
  { value: CulinarySpecialty.NamPrik,   label: 'Regional Specialties (Nam Prik, Gaeng Som…)' },
  { value: CulinarySpecialty.Western,   label: 'Western Basics' },
]

export const EDUCATION_LEVELS = Object.values(EducationLevel)

export const CLINICAL_SKILLS = [
  { value: ClinicalSkill.Vitals,     label: 'Vital signs monitoring' },
  { value: ClinicalSkill.Medication, label: 'Medication administration' },
  { value: ClinicalSkill.Wound,      label: 'Wound dressing' },
  { value: ClinicalSkill.NgTube,     label: 'Tube feeding (NG Tube)' },
  { value: ClinicalSkill.Suction,    label: 'Suctioning' },
  { value: ClinicalSkill.Oxygen,     label: 'Oxygen therapy' },
]

export const MOBILITY_OPTIONS = [
  { value: MobilitySupport.HeavyLift,    label: 'Can lift / transfer patients >80 kg' },
  { value: MobilitySupport.AssistedWalk, label: 'Assisted walking only' },
  { value: MobilitySupport.Bedridden,    label: 'Bedridden positioning' },
]

export const CONDITION_EXPERIENCE = [
  { value: ConditionExperience.Dementia,   label: "Alzheimer's / Dementia (Behavioral management)" },
  { value: ConditionExperience.Stroke,     label: 'Stroke recovery' },
  { value: ConditionExperience.Diabetes,   label: 'Diabetes care' },
  { value: ConditionExperience.Palliative, label: 'Palliative / End-of-life care' },
]

// ── Foreign Caregiver Option Arrays (derived from enums) ──────────────────────

export const STORYTELLING_LEVELS = Object.values(StorytellingLevel)

export const VOCAB_BREADTH = Object.values(VocabBreadth)

export const MUSICAL_OPTIONS = [
  { value: MusicalHeritage.Lullabies, label: 'Traditional lullabies (🎵 Highest priority)' },
  { value: MusicalHeritage.Nursery,   label: 'Nursery rhymes in native tongue' },
  { value: MusicalHeritage.FolkSongs, label: 'Folk songs / cultural anthems' },
]

export const CULTURAL_ACTIVITIES = [
  { value: CulturalActivity.Games,      label: 'Traditional games' },
  { value: CulturalActivity.Crafts,     label: 'Ethnic crafts / weaving' },
  { value: CulturalActivity.Dance,      label: 'Traditional dance' },
  { value: CulturalActivity.Instrument, label: 'Traditional instrument playing' },
]

export const CALENDAR_OPTIONS = [
  { value: CalendarAwareness.LunarNewYear, label: 'Lunar New Year & customs' },
  { value: CalendarAwareness.Harvest,      label: 'Harvest / agricultural festivals' },
  { value: CalendarAwareness.Religious,    label: 'Ethnic religious observances' },
  { value: CalendarAwareness.OtherEthnic,  label: 'Other ethnic / community festivals' },
]

// ── Demo Fill Data ─────────────────────────────────────────────────────────────

export const DEMO_THAI = {
  firstName: 'Nipa', lastName: 'Somboon',
  email: 'nipa.demo@carethia.com', password: 'demo1234', phone: '0812345678',
  country: 'Thailand',
  nativeDialect: ThaiDialect.Central,
  secondaryLanguages: [SecondaryLanguage.English],
  hometown: 'Bangkok',
  communicationStyle: CommunicationStyle.JaJaa,
  spiritualSkills: [SpiritualSkill.TakBat, SpiritualSkill.Holidays],
  culinarySpecialties: [CulinarySpecialty.SoftFood, CulinarySpecialty.LowSodium],
  education: EducationLevel.NursingAssistant,
  clinicalSkills: [ClinicalSkill.Vitals, ClinicalSkill.Medication],
  mobilitySupport: MobilitySupport.AssistedWalk,
  conditionExperience: [ConditionExperience.Dementia],
  yearsExperience: 5,
}

export const DEMO_FOREIGNER = {
  firstName: 'Aye', lastName: 'Myat',
  email: 'aye.demo@carethia.com', password: 'demo1234', phone: '0898765432',
  country: 'Myanmar',
  motherTongue: 'Burmese (Bamar)',
  dialect: 'Shan',
  storytellingLevel: StorytellingLevel.Advanced,
  musicalHeritage: [MusicalHeritage.Lullabies, MusicalHeritage.FolkSongs],
  vocabBreadth: VocabBreadth.Intermediate,
  ritualMastery: 'Knowledge of Thingyan water festival, merit-making ceremonies',
  ethnicDishes: 'Mohinga, Laphet Thoke, Ohn No Khao Swè, Mont Lone Yay Paw',
  calendarAwareness: [CalendarAwareness.LunarNewYear, CalendarAwareness.Harvest],
  culturalActivities: [CulturalActivity.Games, CulturalActivity.Crafts],
  explanationAbility: 'I use simple stories, songs and hands-on activities to explain our traditions.',
  usesArtifacts: 'yes',
  communityInvolvement: 'active',
  pridStatement: 'I am proud to keep our language and food culture alive for the next generation.',
  traditionalAttire: 'own',
}
