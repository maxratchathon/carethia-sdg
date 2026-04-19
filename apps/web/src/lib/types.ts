// ─── Shared Enums ────────────────────────────────────────────────────────────
// Single source of truth for all domain enums — used by store, components, forms

export enum UserRole {
    Customer  = 'CUSTOMER',
    Caregiver = 'CAREGIVER',
    Admin     = 'ADMIN',
}

export enum CaregiverType {
    Thai      = 'THAI',
    Foreigner = 'FOREIGNER',
}

export enum BookingStatus {
    Pending   = 'PENDING',
    Confirmed = 'CONFIRMED',
    Completed = 'COMPLETED',
    Cancelled = 'CANCELLED',
}

export enum ApplicationStatus {
    Pending  = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
}

// ── Thai Caregiver ────────────────────────────────────────────────────────────

export enum ThaiDialect {
    Central        = 'Central (Standard Thai)',
    Isan           = 'Isan',
    Northern       = 'Northern (Kam Mueang)',
    Southern       = 'Southern (Pak Tai)',
    Yawi           = 'Yawi',
    TeochewHokkien = 'Teochew/Hokkien',
}

export enum SecondaryLanguage {
    English    = 'English',
    Mandarin   = 'Mandarin',
    Japanese   = 'Japanese',
    Korean     = 'Korean',
    German     = 'German',
    French     = 'French',
    Arabic     = 'Arabic',
    Burmese    = 'Burmese',
    Khmer      = 'Khmer',
    Vietnamese = 'Vietnamese',
}

export enum CommunicationStyle {
    JaJaa       = 'ja-jaa',
    KhuaySanuk  = 'khuay-sanuk',
    SanguanTa   = 'sanguan-ta',
    DuedDun     = 'dued-dun',
}

export enum SpiritualSkill {
    TakBat   = 'tak_bat',
    Chanting = 'chanting',
    Holidays = 'holidays',
}

export enum CulinarySpecialty {
    SoftFood  = 'soft_food',
    LowSodium = 'low_sodium',
    NamPrik   = 'nam_prik',
    Western   = 'western',
}

export enum EducationLevel {
    BachelorNursing  = 'Bachelor of Nursing (RN)',
    PracticalNurse   = 'Practical Nurse (PN)',
    NursingAssistant = 'Nursing Assistant (NA)',
    FirstAid         = 'First Aid Certified',
    LifeExperience   = 'Life-Experience (Informal)',
}

export enum ClinicalSkill {
    Vitals     = 'vitals',
    Medication = 'medication',
    Wound      = 'wound',
    NgTube     = 'ng_tube',
    Suction    = 'suction',
    Oxygen     = 'oxygen',
}

export enum MobilitySupport {
    HeavyLift    = 'heavy_lift',
    AssistedWalk = 'assisted_walk',
    Bedridden    = 'bedridden',
}

export enum ConditionExperience {
    Dementia   = 'dementia',
    Stroke     = 'stroke',
    Diabetes   = 'diabetes',
    Palliative = 'palliative',
}

// ── Foreign Caregiver ─────────────────────────────────────────────────────────

export enum StorytellingLevel {
    Basic        = 'Basic — Simple conversation only',
    Intermediate = 'Intermediate — Can retell familiar stories',
    Advanced     = "Advanced — Can translate children's books & folk tales",
    Expert       = 'Expert — Rich proverbial / literary usage',
}

export enum MusicalHeritage {
    Lullabies = 'lullabies',
    Nursery   = 'nursery',
    FolkSongs = 'folk_songs',
}

export enum VocabBreadth {
    Basic        = 'Basic communication',
    Intermediate = 'Intermediate',
    Advanced     = 'Advanced / Literary / Proverbial usage',
}

export enum CalendarAwareness {
    LunarNewYear = 'lunar_new_year',
    Harvest      = 'harvest',
    Religious    = 'religious',
    OtherEthnic  = 'other_ethnic',
}

export enum CulturalActivity {
    Games      = 'games',
    Crafts     = 'crafts',
    Dance      = 'dance',
    Instrument = 'instrument',
}

export enum ArtifactUsage {
    Yes = 'yes',
    No  = 'no',
}

export enum CommunityInvolvement {
    Active     = 'active',
    Occasional = 'occasional',
    None       = 'none',
}

export enum TraditionalAttire {
    Own       = 'own',
    Willing   = 'willing',
    PreferNot = 'prefer_not',
}

export enum RelationshipLevel {
    New      = 'New',
    Familiar = 'Familiar',
    Regular  = 'Regular',
    Trusted  = 'Trusted',
}
