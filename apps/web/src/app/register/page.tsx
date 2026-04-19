'use client'
import React, { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  Box, Container, Typography, Button, TextField, Paper,
  Stack, Alert, CircularProgress, Card, CardActionArea,
  Stepper, Step, StepLabel, Grid, Chip, Slider,
  FormGroup, FormControlLabel, Checkbox,
  Select, MenuItem, FormControl, InputLabel, Divider,
  RadioGroup, Radio,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PublicIcon from '@mui/icons-material/Public'
import { useAuth } from '@/lib/auth-context'

// ─── Static Data ───────────────────────────────────────────────────────────────

const COUNTRIES = [
  'Thailand', 'Myanmar', 'Cambodia', 'Laos', 'Vietnam', 'Philippines',
  'Indonesia', 'Malaysia', 'Singapore', 'China', 'Japan', 'South Korea',
  'India', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Pakistan',
  'United States', 'United Kingdom', 'Australia', 'Canada', 'Germany',
  'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland',
  'Russia', 'Ukraine', 'Poland', 'Brazil', 'Argentina', 'Mexico',
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Morocco',
  'Saudi Arabia', 'UAE', 'Israel', 'Turkey', 'Iran', 'Iraq', 'Other',
]

const THAI_DIALECTS = ['Central (Standard Thai)', 'Isan', 'Northern (Kam Mueang)', 'Southern (Pak Tai)', 'Yawi', 'Teochew/Hokkien']
const SECONDARY_LANGUAGES = ['English', 'Mandarin', 'Japanese', 'Korean', 'German', 'French', 'Arabic', 'Burmese', 'Khmer', 'Vietnamese']
const THAI_PROVINCES = [
  'Bangkok', 'Chiang Mai', 'Chiang Rai', 'Nakhon Ratchasima', 'Khon Kaen',
  'Udon Thani', 'Ubon Ratchathani', 'Nakhon Si Thammarat', 'Songkhla', 'Phuket',
  'Ayutthaya', 'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Chonburi',
  'Rayong', 'Surat Thani', 'Lampang', 'Phitsanulok', 'Phetchaburi', 'Other',
]
const COMMUNICATION_STYLES = [
  { value: 'ja-jaa', label: '"Ja-Jaa" — Polite / Soft' },
  { value: 'khuay-sanuk', label: '"Khuay-Sanuk" — Talkative / Entertaining' },
  { value: 'sanguan-ta', label: '"Sanguan-Ta" — Reserved / Respectful' },
  { value: 'dued-dun', label: '"Dued-Dun" — Firm / Assertive' },
]
const SPIRITUAL_OPTIONS = [
  { value: 'tak_bat', label: 'Morning Almsgiving (Tak Bat) assistance' },
  { value: 'chanting', label: 'Chanting / Prayer accompaniment' },
  { value: 'holidays', label: 'Knowledge of Thai Buddhist holidays & rituals' },
]
const CULINARY_OPTIONS = [
  { value: 'soft_food', label: 'Soft Food (Khao Tom)' },
  { value: 'low_sodium', label: 'Low-Sodium Thai' },
  { value: 'nam_prik', label: 'Regional Specialties (Nam Prik, Gaeng Som…)' },
  { value: 'western', label: 'Western Basics' },
]
const EDUCATION_LEVELS = [
  'Bachelor of Nursing (RN)', 'Practical Nurse (PN)', 'Nursing Assistant (NA)',
  'First Aid Certified', 'Life-Experience (Informal)',
]
const CLINICAL_SKILLS = [
  { value: 'vitals', label: 'Vital signs monitoring' },
  { value: 'medication', label: 'Medication administration' },
  { value: 'wound', label: 'Wound dressing' },
  { value: 'ng_tube', label: 'Tube feeding (NG Tube)' },
  { value: 'suction', label: 'Suctioning' },
  { value: 'oxygen', label: 'Oxygen therapy' },
]
const MOBILITY_OPTIONS = [
  { value: 'heavy_lift', label: 'Can lift / transfer patients >80 kg' },
  { value: 'assisted_walk', label: 'Assisted walking only' },
  { value: 'bedridden', label: 'Bedridden positioning' },
]
const CONDITION_EXPERIENCE = [
  { value: 'dementia', label: "Alzheimer's / Dementia (Behavioral management)" },
  { value: 'stroke', label: 'Stroke recovery' },
  { value: 'diabetes', label: 'Diabetes care' },
  { value: 'palliative', label: 'Palliative / End-of-life care' },
]
const STORYTELLING_LEVELS = [
  'Basic — Simple conversation only',
  'Intermediate — Can retell familiar stories',
  'Advanced — Can translate children\'s books & folk tales',
  'Expert — Rich proverbial / literary usage',
]
const VOCAB_BREADTH = ['Basic communication', 'Intermediate', 'Advanced / Literary / Proverbial usage']
const MUSICAL_OPTIONS = [
  { value: 'lullabies', label: 'Traditional lullabies (🎵 Highest priority)' },
  { value: 'nursery', label: 'Nursery rhymes in native tongue' },
  { value: 'folk_songs', label: 'Folk songs / cultural anthems' },
]
const CULTURAL_ACTIVITIES = [
  { value: 'games', label: 'Traditional games' },
  { value: 'crafts', label: 'Ethnic crafts / weaving' },
  { value: 'dance', label: 'Traditional dance' },
  { value: 'instrument', label: 'Traditional instrument playing' },
]
const CALENDAR_OPTIONS = [
  { value: 'lunar_new_year', label: 'Lunar New Year & customs' },
  { value: 'harvest', label: 'Harvest / agricultural festivals' },
  { value: 'religious', label: 'Ethnic religious observances' },
  { value: 'other_ethnic', label: 'Other ethnic / community festivals' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const SectionHeader = ({ emoji, title, weight }: { emoji: string; title: string; weight: string }) => (
  <Box mb={2} mt={1}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography fontSize={22}>{emoji}</Typography>
      <Typography fontWeight={800} fontSize="1rem">{title}</Typography>
      <Chip label={weight} size="small" sx={{ ml: 'auto !important', fontWeight: 700, bgcolor: '#FFF0F5', color: '#FF6B9D' }} />
    </Stack>
    <Divider sx={{ mt: 1 }} />
  </Box>
)

function CheckboxGroup({ options, selected, onChange }: { options: { value: string; label: string }[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  return (
    <FormGroup>
      {options.map(o => (
        <FormControlLabel key={o.value}
          control={<Checkbox checked={selected.includes(o.value)} onChange={() => toggle(o.value)} size="small" />}
          label={<Typography fontSize="0.875rem">{o.label}</Typography>}
        />
      ))}
    </FormGroup>
  )
}

function ChipSelect({ options, selected, onChange, color = '#2ECC71' }: { options: string[]; selected: string[]; onChange: (v: string[]) => void; color?: string }) {
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map(o => (
        <Chip key={o} label={o} onClick={() => toggle(o)}
          variant={selected.includes(o) ? 'filled' : 'outlined'}
          sx={{
            borderRadius: 2, fontWeight: 600, fontSize: '0.78rem',
            bgcolor: selected.includes(o) ? color : 'transparent',
            color: selected.includes(o) ? '#fff' : 'text.primary',
            borderColor: selected.includes(o) ? color : 'grey.300',
          }}
        />
      ))}
    </Box>
  )
}

const CAREGIVER_STEP_KEYS = ['role', 'account', 'nationality', 'profile']
const CUSTOMER_STEP_KEYS = ['role', 'account']

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation('auth')
  const { login } = useAuth()

  const initialRole = searchParams.get('role') === 'caregiver' ? 'CAREGIVER' : null
  const [activeStep, setActiveStep] = useState(initialRole ? 1 : 0)
  const [role, setRole] = useState<'CUSTOMER' | 'CAREGIVER' | null>(initialRole)

  // Step 1: Account
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  // Step 2: Nationality
  const [country, setCountry] = useState('')
  const caregiverType: 'THAI' | 'FOREIGNER' | null = country === 'Thailand' ? 'THAI' : country ? 'FOREIGNER' : null

  // Step 3a: Thai — Cultural
  const [nativeDialect, setNativeDialect] = useState('')
  const [secondaryLanguages, setSecondaryLanguages] = useState<string[]>([])
  const [hometown, setHometown] = useState('')
  const [communicationStyle, setCommunicationStyle] = useState('')
  const [spiritualSkills, setSpiritualSkills] = useState<string[]>([])
  const [culinarySpecialties, setCulinarySpecialties] = useState<string[]>([])

  // Step 3a: Thai — Medical
  const [education, setEducation] = useState('')
  const [clinicalSkills, setClinicalSkills] = useState<string[]>([])
  const [mobilitySupport, setMobilitySupport] = useState('')
  const [conditionExperience, setConditionExperience] = useState<string[]>([])
  const [yearsExperience, setYearsExperience] = useState(0)

  // Step 3b: Foreign — Language
  const [motherTongue, setMotherTongue] = useState('')
  const [dialect, setDialect] = useState('')
  const [storytellingLevel, setStorytellingLevel] = useState('')
  const [musicalHeritage, setMusicalHeritage] = useState<string[]>([])
  const [vocabBreadth, setVocabBreadth] = useState('')

  // Step 3b: Foreign — Cultural Practice
  const [ritualMastery, setRitualMastery] = useState('')
  const [ethnicDishes, setEthnicDishes] = useState('')
  const [calendarAwareness, setCalendarAwareness] = useState<string[]>([])

  // Step 3b: Foreign — Child Facilitation
  const [culturalActivities, setCulturalActivities] = useState<string[]>([])
  const [explanationAbility, setExplanationAbility] = useState('')
  const [usesArtifacts, setUsesArtifacts] = useState('')

  // Step 3b: Foreign — Identity Affirmation
  const [communityInvolvement, setCommunityInvolvement] = useState('')
  const [pridStatement, setPridStatement] = useState('')
  const [traditionalAttire, setTraditionalAttire] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const stepKeys = role === 'CAREGIVER' ? CAREGIVER_STEP_KEYS : CUSTOMER_STEP_KEYS
  const totalSteps = stepKeys.length

  const handleNext = () => {
    setError('')
    if (activeStep === 0 && !role) { setError(t('register.errors.selectRole')); return }
    if (activeStep === 1) {
      if (!firstName || !lastName || !email || !password) { setError(t('register.errors.requiredFields')); return }
      if (password.length < 6) { setError(t('register.errors.passwordLength')); return }
      if (role === 'CUSTOMER') { handleSubmit(); return }
    }
    if (activeStep === 2 && role === 'CAREGIVER') {
      if (!country) { setError('Please select your country of origin.'); return }
    }
    if (activeStep === 3 && role === 'CAREGIVER') {
      if (caregiverType === 'THAI' && !nativeDialect) { setError('Please select your native dialect.'); return }
      if (caregiverType === 'THAI' && !education) { setError('Please select your education level.'); return }
      if (caregiverType === 'FOREIGNER' && !motherTongue) { setError('Please enter your mother tongue / first language.'); return }
      handleSubmit(); return
    }
    setActiveStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        email, password, firstName, lastName, phone,
        role: role || 'CUSTOMER', country, caregiverType,
      }
      if (role === 'CAREGIVER' && caregiverType === 'THAI') {
        Object.assign(body, {
          nativeDialect, secondaryLanguages, hometown, communicationStyle,
          spiritualSkills, culinarySpecialties,
          education, clinicalSkills, mobilitySupport, conditionExperience, yearsExperience,
        })
      }
      if (role === 'CAREGIVER' && caregiverType === 'FOREIGNER') {
        Object.assign(body, {
          motherTongue, dialect, storytellingLevel, musicalHeritage, vocabBreadth,
          ritualMastery, ethnicDishes, calendarAwareness,
          culturalActivities, explanationAbility, usesArtifacts,
          communityInvolvement, pridStatement, traditionalAttire,
        })
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || t('register.errors.registerFailed')); return }
      login(data.user)
      router.push('/dashboard')
    } catch {
      setError(t('register.errors.network'))
    } finally {
      setLoading(false)
    }
  }

  const btnGradient = role === 'CAREGIVER'
    ? 'linear-gradient(135deg, #2ECC71, #27AE60)'
    : 'linear-gradient(135deg, #FF6B9D, #C06C84)'
  const isLastStep = activeStep === totalSteps - 1

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)', py: 6 }}>
      <Container maxWidth="sm">
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Box component="img" src="/locales/images/carethia_logo.png" alt="Carethia logo" sx={{ width: 32, height: 32, objectFit: 'contain' }} />
            <Typography variant="h5" fontWeight={800} color="#FF6B9D">Carethia</Typography>
          </Link>
          <Typography variant="h5" fontWeight={800} mt={1}>{t('register.title')}</Typography>
          <Typography color="text.secondary" fontSize="0.9rem">{t('register.subtitle')}</Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {stepKeys.map((key) => (
            <Step key={key}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600, fontSize: '0.75rem' } }}>
                {key === 'role' ? 'Role' : key === 'account' ? 'Account' : key === 'nationality' ? 'Origin' :
                  caregiverType === 'THAI' ? 'Thai Profile' : 'Cultural Profile'}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={0} sx={{
          borderRadius: 4, p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'grey.100',
          boxShadow: '0 4px 30px rgba(0,0,0,0.08)', maxHeight: '68vh', overflowY: 'auto',
        }}>
          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

          {/* ── Step 0: Role ── */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>{t('register.roleTitle')}</Typography>
              <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('register.roleSubtitle')}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined" onClick={() => setRole('CUSTOMER')} sx={{
                    borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
                    border: role === 'CUSTOMER' ? '2px solid #FF6B9D' : '1px solid',
                    borderColor: role === 'CUSTOMER' ? '#FF6B9D' : 'grey.200',
                    bgcolor: role === 'CUSTOMER' ? '#FFF0F5' : 'white',
                  }}>
                    <CardActionArea sx={{ p: 3, textAlign: 'center' }}>
                      <Box fontSize={40} mb={1}>👨‍👩‍👧</Box>
                      <Typography fontWeight={700}>{t('register.customer')}</Typography>
                      <Typography variant="caption" color="text.secondary">{t('register.customerDesc')}</Typography>
                      {role === 'CUSTOMER' && <CheckCircleIcon sx={{ color: '#FF6B9D', fontSize: 20, mt: 1, display: 'block', mx: 'auto' }} />}
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined" onClick={() => setRole('CAREGIVER')} sx={{
                    borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
                    border: role === 'CAREGIVER' ? '2px solid #2ECC71' : '1px solid',
                    borderColor: role === 'CAREGIVER' ? '#2ECC71' : 'grey.200',
                    bgcolor: role === 'CAREGIVER' ? '#F0FFF4' : 'white',
                  }}>
                    <CardActionArea sx={{ p: 3, textAlign: 'center' }}>
                      <Box fontSize={40} mb={1}>🛡️</Box>
                      <Typography fontWeight={700}>{t('register.caregiver')}</Typography>
                      <Typography variant="caption" color="text.secondary">{t('register.caregiverDesc')}</Typography>
                      {role === 'CAREGIVER' && <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 20, mt: 1, display: 'block', mx: 'auto' }} />}
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ── Step 1: Account Info ── */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>{t('register.accountTitle')}</Typography>
              <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('register.accountSubtitle')}</Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField fullWidth label={t('register.firstName')} value={firstName} onChange={e => setFirstName(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  <TextField fullWidth label={t('register.lastName')} value={lastName} onChange={e => setLastName(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                </Box>
                <TextField fullWidth label={t('register.email')} type="email" value={email} onChange={e => setEmail(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <TextField fullWidth label={t('register.password')} type="password" value={password} onChange={e => setPassword(e.target.value)} required helperText={t('register.passwordHelp')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <TextField fullWidth label={t('register.phone')} value={phone} onChange={e => setPhone(e.target.value)} placeholder="0812345678" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              </Stack>
            </Box>
          )}

          {/* ── Step 2: Nationality ── */}
          {activeStep === 2 && role === 'CAREGIVER' && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                <PublicIcon sx={{ color: '#2ECC71', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>Country of Origin</Typography>
              </Stack>
              <Typography color="text.secondary" fontSize="0.9rem" mb={3}>
                Select your home country. This determines your caregiver profile type and matching algorithm.
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select your country</InputLabel>
                <Select value={country} label="Select your country" onChange={e => setCountry(e.target.value)} sx={{ borderRadius: 3 }}>
                  {COUNTRIES.map(c => (
                    <MenuItem key={c} value={c}>{c === 'Thailand' ? '🇹🇭 Thailand' : c}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {country && (
                <Box sx={{
                  p: 2.5, borderRadius: 3,
                  bgcolor: country === 'Thailand' ? '#F0FFF4' : '#F3F2FF',
                  border: '1px solid', borderColor: country === 'Thailand' ? '#2ECC71' : '#9B8BFF',
                }}>
                  {country === 'Thailand' ? (
                    <>
                      <Typography fontWeight={700} color="#27AE60" mb={0.5}>🇹🇭 Thai Caregiver Path</Typography>
                      <Typography fontSize="0.85rem" color="text.secondary">
                        Your profile will use the <strong>Sook-Jai Score</strong> — our &ldquo;Heart-to-Heart&rdquo; matching system focused on cultural dialect, regional upbringing, and Thai Buddhist fluency <strong>(65%)</strong> combined with medical skill <strong>(35%)</strong>.
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={700} color="#6C5CE7" mb={0.5}>🌍 Foreigner Caregiver Path — Cultural Anchor Score (CAS)</Typography>
                      <Typography fontSize="0.85rem" color="text.secondary">
                        Your profile uses the <strong>CAS</strong> — our cultural preservation model. We assess native language fluency <strong>(40%)</strong>, cultural practice knowledge <strong>(30%)</strong>, child facilitation skill <strong>(20%)</strong>, and cultural identity affirmation <strong>(10%)</strong>.
                      </Typography>
                      <Typography fontSize="0.8rem" mt={1} fontWeight={700} color="#6C5CE7">
                        Final Match Score = 0.35 × Medical Skill + 0.65 × CAS
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* ── Step 3: Thai Caregiver Profile ── */}
          {activeStep === 3 && role === 'CAREGIVER' && caregiverType === 'THAI' && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>🇹🇭 Thai Caregiver Profile</Typography>
              <Typography color="text.secondary" fontSize="0.85rem" mb={2}>Complete your cultural and professional profile to be matched with the right families.</Typography>

              <SectionHeader emoji="🫶" title="Cultural & Dialect Profile" weight="65% Weight" />
              <Stack spacing={2.5}>
                <FormControl fullWidth>
                  <InputLabel>Native Dialect (Tongue) *</InputLabel>
                  <Select value={nativeDialect} label="Native Dialect (Tongue) *" onChange={e => setNativeDialect(e.target.value)} sx={{ borderRadius: 3 }}>
                    {THAI_DIALECTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>

                <Box>
                  <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Secondary Languages</Typography>
                  <ChipSelect options={SECONDARY_LANGUAGES} selected={secondaryLanguages} onChange={setSecondaryLanguages} />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Regional Upbringing (Province)</InputLabel>
                  <Select value={hometown} label="Regional Upbringing (Province)" onChange={e => setHometown(e.target.value)} sx={{ borderRadius: 3 }}>
                    {THAI_PROVINCES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Communication Style</InputLabel>
                  <Select value={communicationStyle} label="Communication Style" onChange={e => setCommunicationStyle(e.target.value)} sx={{ borderRadius: 3 }}>
                    {COMMUNICATION_STYLES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                  </Select>
                </FormControl>

                <Box>
                  <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Spiritual / Religious Fluency</Typography>
                  <CheckboxGroup options={SPIRITUAL_OPTIONS} selected={spiritualSkills} onChange={setSpiritualSkills} />
                </Box>

                <Box>
                  <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Culinary Specialty</Typography>
                  <CheckboxGroup options={CULINARY_OPTIONS} selected={culinarySpecialties} onChange={setCulinarySpecialties} />
                </Box>
              </Stack>

              <Box mt={3}>
                <SectionHeader emoji="🏥" title="Medical & Professional Skill" weight="35% Weight" />
                <Stack spacing={2.5}>
                  <FormControl fullWidth>
                    <InputLabel>Formal Education *</InputLabel>
                    <Select value={education} label="Formal Education *" onChange={e => setEducation(e.target.value)} sx={{ borderRadius: 3 }}>
                      {EDUCATION_LEVELS.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>)}
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Clinical Proficiency</Typography>
                    <CheckboxGroup options={CLINICAL_SKILLS} selected={clinicalSkills} onChange={setClinicalSkills} />
                  </Box>

                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Physical Strength / Mobility Support</Typography>
                    <RadioGroup value={mobilitySupport} onChange={e => setMobilitySupport(e.target.value)}>
                      {MOBILITY_OPTIONS.map(o => (
                        <FormControlLabel key={o.value} value={o.value} control={<Radio size="small" />} label={<Typography fontSize="0.875rem">{o.label}</Typography>} />
                      ))}
                    </RadioGroup>
                  </Box>

                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Specialized Condition Experience</Typography>
                    <CheckboxGroup options={CONDITION_EXPERIENCE} selected={conditionExperience} onChange={setConditionExperience} />
                  </Box>

                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={2}>
                      Years in Caregiving: <strong>{yearsExperience}{yearsExperience === 20 ? '+' : ''} yr{yearsExperience !== 1 ? 's' : ''}</strong>
                    </Typography>
                    <Slider
                      value={yearsExperience} onChange={(_, v) => setYearsExperience(v as number)}
                      min={0} max={20} step={1}
                      marks={[{ value: 0, label: '0' }, { value: 10, label: '10' }, { value: 20, label: '20+' }]}
                      sx={{ color: '#2ECC71' }}
                    />
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}

          {/* ── Step 3: Foreign Caregiver Profile (CAS) ── */}
          {activeStep === 3 && role === 'CAREGIVER' && caregiverType === 'FOREIGNER' && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>🌍 Cultural Anchor Score (CAS) Profile</Typography>
              <Typography color="text.secondary" fontSize="0.85rem" mb={2}>
                Help us understand your ability to serve as a cultural anchor for children of migrant families.
              </Typography>

              <SectionHeader emoji="🗣️" title="Native Language Fluency" weight="40% Weight" />
              <Stack spacing={2.5}>
                <TextField fullWidth label="Mother Tongue / First Language *" value={motherTongue} onChange={e => setMotherTongue(e.target.value)}
                  placeholder="e.g. Burmese (Bamar), Mandarin (Cantonese), Tagalog…" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <TextField fullWidth label="Specific Dialect / Regional Variant" value={dialect} onChange={e => setDialect(e.target.value)}
                  placeholder="e.g. Shan, Hakka, Ilocano…" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <FormControl fullWidth>
                  <InputLabel>Storytelling Proficiency</InputLabel>
                  <Select value={storytellingLevel} label="Storytelling Proficiency" onChange={e => setStorytellingLevel(e.target.value)} sx={{ borderRadius: 3 }}>
                    {STORYTELLING_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
                <Box>
                  <Typography fontWeight={600} fontSize="0.875rem" mb={0.5}>
                    Musical / Rhythmic Heritage
                    <Chip label="🎵 Lullabies = Strongest Bond" size="small" sx={{ ml: 1, fontSize: '0.7rem', bgcolor: '#FFF0F5', color: '#FF6B9D' }} />
                  </Typography>
                  <CheckboxGroup options={MUSICAL_OPTIONS} selected={musicalHeritage} onChange={setMusicalHeritage} />
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Vocabulary Breadth</InputLabel>
                  <Select value={vocabBreadth} label="Vocabulary Breadth" onChange={e => setVocabBreadth(e.target.value)} sx={{ borderRadius: 3 }}>
                    {VOCAB_BREADTH.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                  </Select>
                </FormControl>
              </Stack>

              <Box mt={3}>
                <SectionHeader emoji="🏺" title="Cultural Practice Knowledge" weight="30% Weight" />
                <Stack spacing={2.5}>
                  <TextField fullWidth label="Traditional Ritual Mastery" multiline rows={2} value={ritualMastery} onChange={e => setRitualMastery(e.target.value)}
                    placeholder="e.g. Can set up Songkran altar, knowledge of Thingyan water festival customs…" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  <TextField fullWidth label="Ethnic Culinary Skills" multiline rows={3} value={ethnicDishes} onChange={e => setEthnicDishes(e.target.value)}
                    placeholder={"List 3–5 traditional dishes you can cook from scratch without a recipe.\ne.g. Mohinga, Laphet Thoke, Ohn No Khao Swè…"}
                    helperText="🍽️ Comfort food is the strongest anchor for a child's sense of belonging."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Calendar / Holiday Awareness</Typography>
                    <CheckboxGroup options={CALENDAR_OPTIONS} selected={calendarAwareness} onChange={setCalendarAwareness} />
                  </Box>
                </Stack>
              </Box>

              <Box mt={3}>
                <SectionHeader emoji="👧" title="Child Cultural Facilitation Skill" weight="20% Weight" />
                <Stack spacing={2.5}>
                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Interactive Cultural Activities</Typography>
                    <CheckboxGroup options={CULTURAL_ACTIVITIES} selected={culturalActivities} onChange={setCulturalActivities} />
                  </Box>
                  <TextField fullWidth label="Explanation Ability" multiline rows={2} value={explanationAbility} onChange={e => setExplanationAbility(e.target.value)}
                    placeholder="How would you explain the significance of a cultural holiday to a 5-year-old?" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Educational Engagement with Cultural Artifacts</Typography>
                    <RadioGroup value={usesArtifacts} onChange={e => setUsesArtifacts(e.target.value)}>
                      <FormControlLabel value="yes" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">Yes — I use traditional clothing, tools, or objects as teaching aids</Typography>} />
                      <FormControlLabel value="no" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">Not yet, but willing to learn</Typography>} />
                    </RadioGroup>
                  </Box>
                </Stack>
              </Box>

              <Box mt={3}>
                <SectionHeader emoji="🌟" title="Cultural Identity Affirmation" weight="10% Weight" />
                <Stack spacing={2.5}>
                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Community Involvement</Typography>
                    <RadioGroup value={communityInvolvement} onChange={e => setCommunityInvolvement(e.target.value)}>
                      <FormControlLabel value="active" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">Actively participate in ethnic community groups / festivals</Typography>} />
                      <FormControlLabel value="occasional" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">Occasionally attend cultural events</Typography>} />
                      <FormControlLabel value="none" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">Not currently, but would like to</Typography>} />
                    </RadioGroup>
                  </Box>
                  <TextField fullWidth label="Personal Pride Statement" multiline rows={3} value={pridStatement} onChange={e => setPridStatement(e.target.value)}
                    placeholder="What part of your heritage are you most proud to share with the next generation?" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Traditional Attire Availability</Typography>
                    <RadioGroup value={traditionalAttire} onChange={e => setTraditionalAttire(e.target.value)}>
                      <FormControlLabel value="own" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">I own traditional dress and am happy to wear it</Typography>} />
                      <FormControlLabel value="willing" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">Willing to wear traditional dress if provided</Typography>} />
                      <FormControlLabel value="prefer_not" control={<Radio size="small" />} label={<Typography fontSize="0.875rem">I prefer not to</Typography>} />
                    </RadioGroup>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Navigation */}
        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={() => activeStep > 0 ? setActiveStep(s => s - 1) : router.back()}
            sx={{ borderRadius: 3, borderColor: 'grey.200', color: 'text.secondary', fontWeight: 600, px: 3 }}>
            {t('register.back')}
          </Button>
          <Button variant="contained" onClick={handleNext} disabled={loading}
            sx={{ background: btnGradient, borderRadius: 3, px: 4, fontWeight: 700 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : (
              isLastStep ? `🎉 ${t('register.createAccount')}` : `${t('register.continue')} →`
            )}
          </Button>
        </Stack>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {t('register.alreadyAccount')}{' '}
            <Link href="/login" style={{ color: '#FF6B9D', fontWeight: 700, textDecoration: 'none' }}>{t('register.signIn')}</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

const RegisterFormDynamic = dynamic(() => Promise.resolve(RegisterForm), { ssr: false })

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <RegisterFormDynamic />
    </Suspense>
  )
}
