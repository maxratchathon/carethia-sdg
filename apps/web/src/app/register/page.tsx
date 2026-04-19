'use client'
import React, { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  Box, Container, Typography, Button, Paper,
  Stack, Alert, CircularProgress,
  Stepper, Step, StepLabel,
} from '@mui/material'
import { useAuth } from '@/lib/auth-context'
import StepRole        from './steps/StepRole'
import StepAccount     from './steps/StepAccount'
import StepNationality from './steps/StepNationality'
import StepThaiProfile    from './steps/StepThaiProfile'
import StepForeignProfile from './steps/StepForeignProfile'
import { DEMO_THAI, DEMO_FOREIGNER } from './constants'

const CAREGIVER_STEP_KEYS = ['role', 'account', 'nationality', 'profile']
const CUSTOMER_STEP_KEYS  = ['role', 'account']

const STEP_LABELS: Record<string, string> = {
  role: 'Role', account: 'Account', nationality: 'Origin',
}

function RegisterForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { t }        = useTranslation('auth')
  const { login }    = useAuth()

  const initialRole = searchParams.get('role') === 'caregiver' ? 'CAREGIVER' : null
  const [activeStep, setActiveStep] = useState(initialRole ? 1 : 0)
  const [role, setRole] = useState<'CUSTOMER' | 'CAREGIVER' | null>(initialRole)

  // Step 1 — Account
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [phone,     setPhone]     = useState('')

  // Step 2 — Nationality
  const [country, setCountry] = useState('')
  const caregiverType: 'THAI' | 'FOREIGNER' | null =
    country === 'Thailand' ? 'THAI' : country ? 'FOREIGNER' : null

  // Step 3a — Thai Cultural
  const [nativeDialect,       setNativeDialect]       = useState('')
  const [secondaryLanguages,  setSecondaryLanguages]  = useState<string[]>([])
  const [hometown,            setHometown]            = useState('')
  const [communicationStyle,  setCommunicationStyle]  = useState('')
  const [spiritualSkills,     setSpiritualSkills]     = useState<string[]>([])
  const [culinarySpecialties, setCulinarySpecialties] = useState<string[]>([])

  // Step 3a — Thai Medical
  const [education,           setEducation]           = useState('')
  const [clinicalSkills,      setClinicalSkills]      = useState<string[]>([])
  const [mobilitySupport,     setMobilitySupport]     = useState('')
  const [conditionExperience, setConditionExperience] = useState<string[]>([])
  const [yearsExperience,     setYearsExperience]     = useState(0)

  // Step 3b — Foreign Language
  const [motherTongue,      setMotherTongue]      = useState('')
  const [dialect,           setDialect]           = useState('')
  const [storytellingLevel, setStorytellingLevel] = useState('')
  const [musicalHeritage,   setMusicalHeritage]   = useState<string[]>([])
  const [vocabBreadth,      setVocabBreadth]      = useState('')

  // Step 3b — Foreign Cultural Practice
  const [ritualMastery,     setRitualMastery]     = useState('')
  const [ethnicDishes,      setEthnicDishes]      = useState('')
  const [calendarAwareness, setCalendarAwareness] = useState<string[]>([])

  // Step 3b — Foreign Child Facilitation
  const [culturalActivities,  setCulturalActivities]  = useState<string[]>([])
  const [explanationAbility,  setExplanationAbility]  = useState('')
  const [usesArtifacts,       setUsesArtifacts]       = useState('')

  // Step 3b — Foreign Identity Affirmation
  const [communityInvolvement, setCommunityInvolvement] = useState('')
  const [pridStatement,        setPridStatement]        = useState('')
  const [traditionalAttire,    setTraditionalAttire]    = useState('')

  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const stepKeys   = role === 'CAREGIVER' ? CAREGIVER_STEP_KEYS : CUSTOMER_STEP_KEYS
  const totalSteps = stepKeys.length
  const isLastStep = activeStep === totalSteps - 1

  // ── Demo fill ──────────────────────────────────────────────────────────────
  const fillDemo = (type: 'thai' | 'foreigner') => {
    const d = type === 'thai' ? DEMO_THAI : DEMO_FOREIGNER
    setRole('CAREGIVER')
    setFirstName(d.firstName); setLastName(d.lastName)
    setEmail(d.email); setPassword(d.password); setPhone(d.phone)
    setCountry(d.country)
    if (type === 'thai') {
      const th = DEMO_THAI
      setNativeDialect(th.nativeDialect); setSecondaryLanguages(th.secondaryLanguages)
      setHometown(th.hometown); setCommunicationStyle(th.communicationStyle)
      setSpiritualSkills(th.spiritualSkills); setCulinarySpecialties(th.culinarySpecialties)
      setEducation(th.education); setClinicalSkills(th.clinicalSkills)
      setMobilitySupport(th.mobilitySupport); setConditionExperience(th.conditionExperience)
      setYearsExperience(th.yearsExperience)
    } else {
      const f = DEMO_FOREIGNER
      setMotherTongue(f.motherTongue); setDialect(f.dialect)
      setStorytellingLevel(f.storytellingLevel); setMusicalHeritage(f.musicalHeritage)
      setVocabBreadth(f.vocabBreadth); setRitualMastery(f.ritualMastery)
      setEthnicDishes(f.ethnicDishes); setCalendarAwareness(f.calendarAwareness)
      setCulturalActivities(f.culturalActivities); setExplanationAbility(f.explanationAbility)
      setUsesArtifacts(f.usesArtifacts); setCommunityInvolvement(f.communityInvolvement)
      setPridStatement(f.pridStatement); setTraditionalAttire(f.traditionalAttire)
    }
    setActiveStep(3)
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
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
      if (caregiverType === 'THAI' && !education)     { setError('Please select your education level.'); return }
      if (caregiverType === 'FOREIGNER' && !motherTongue) { setError('Please enter your mother tongue.'); return }
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
      const res  = await fetch('/api/auth/register', {
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

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)', py: 6 }}>
      <Container maxWidth="sm">
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Box component="img" src="/locales/images/carethia_logo.png" alt="Carethia logo"
              sx={{ width: 32, height: 32, objectFit: 'contain' }} />
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
                {STEP_LABELS[key] ?? (caregiverType === 'THAI' ? 'Thai Profile' : 'Cultural Profile')}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={0} sx={{
          borderRadius: 4, p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'grey.100',
          boxShadow: '0 4px 30px rgba(0,0,0,0.08)', maxHeight: '68vh', overflowY: 'auto',
        }}>
          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

          {activeStep === 0 && (
            <StepRole role={role} setRole={setRole} />
          )}

          {activeStep === 1 && (
            <StepAccount
              firstName={firstName} setFirstName={setFirstName}
              lastName={lastName}   setLastName={setLastName}
              email={email}         setEmail={setEmail}
              password={password}   setPassword={setPassword}
              phone={phone}         setPhone={setPhone}
            />
          )}

          {activeStep === 2 && role === 'CAREGIVER' && (
            <StepNationality country={country} setCountry={setCountry} />
          )}

          {activeStep === 3 && role === 'CAREGIVER' && caregiverType === 'THAI' && (
            <StepThaiProfile
              nativeDialect={nativeDialect}             setNativeDialect={setNativeDialect}
              secondaryLanguages={secondaryLanguages}   setSecondaryLanguages={setSecondaryLanguages}
              hometown={hometown}                       setHometown={setHometown}
              communicationStyle={communicationStyle}   setCommunicationStyle={setCommunicationStyle}
              spiritualSkills={spiritualSkills}         setSpiritualSkills={setSpiritualSkills}
              culinarySpecialties={culinarySpecialties} setCulinarySpecialties={setCulinarySpecialties}
              education={education}                     setEducation={setEducation}
              clinicalSkills={clinicalSkills}           setClinicalSkills={setClinicalSkills}
              mobilitySupport={mobilitySupport}         setMobilitySupport={setMobilitySupport}
              conditionExperience={conditionExperience} setConditionExperience={setConditionExperience}
              yearsExperience={yearsExperience}         setYearsExperience={setYearsExperience}
            />
          )}

          {activeStep === 3 && role === 'CAREGIVER' && caregiverType === 'FOREIGNER' && (
            <StepForeignProfile
              motherTongue={motherTongue}           setMotherTongue={setMotherTongue}
              dialect={dialect}                     setDialect={setDialect}
              storytellingLevel={storytellingLevel} setStorytellingLevel={setStorytellingLevel}
              musicalHeritage={musicalHeritage}     setMusicalHeritage={setMusicalHeritage}
              vocabBreadth={vocabBreadth}           setVocabBreadth={setVocabBreadth}
              ritualMastery={ritualMastery}         setRitualMastery={setRitualMastery}
              ethnicDishes={ethnicDishes}           setEthnicDishes={setEthnicDishes}
              calendarAwareness={calendarAwareness} setCalendarAwareness={setCalendarAwareness}
              culturalActivities={culturalActivities}     setCulturalActivities={setCulturalActivities}
              explanationAbility={explanationAbility}     setExplanationAbility={setExplanationAbility}
              usesArtifacts={usesArtifacts}               setUsesArtifacts={setUsesArtifacts}
              communityInvolvement={communityInvolvement} setCommunityInvolvement={setCommunityInvolvement}
              pridStatement={pridStatement}               setPridStatement={setPridStatement}
              traditionalAttire={traditionalAttire}       setTraditionalAttire={setTraditionalAttire}
            />
          )}
        </Paper>

        {/* Demo shortcuts (only on step 0)
        {activeStep === 0 && (
          <Stack direction="row" spacing={1} mt={2} justifyContent="center">
            <Button size="small" variant="outlined"
              onClick={() => fillDemo('thai')}
              sx={{ borderRadius: 3, fontSize: '0.75rem', borderColor: '#2ECC71', color: '#27AE60' }}>
              🇹🇭 Demo Thai
            </Button>
            <Button size="small" variant="outlined"
              onClick={() => fillDemo('foreigner')}
              sx={{ borderRadius: 3, fontSize: '0.75rem', borderColor: '#6C5CE7', color: '#6C5CE7' }}>
              🌍 Demo Foreigner
            </Button>
          </Stack>
        )} */}

        {/* Navigation */}
        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            onClick={() => activeStep > 0 ? setActiveStep(s => s - 1) : router.back()}
            sx={{ borderRadius: 3, borderColor: 'grey.200', color: 'text.secondary', fontWeight: 600, px: 3 }}>
            {t('register.back')}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{ background: btnGradient, borderRadius: 3, px: 4, fontWeight: 700 }}>
            {loading
              ? <CircularProgress size={22} color="inherit" />
              : isLastStep ? `🎉 ${t('register.createAccount')}` : `${t('register.continue')} →`}
          </Button>
        </Stack>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {t('register.alreadyAccount')}{' '}
            <Link href="/login" style={{ color: '#FF6B9D', fontWeight: 700, textDecoration: 'none' }}>
              {t('register.signIn')}
            </Link>
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
