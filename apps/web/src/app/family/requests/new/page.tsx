'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  MenuItem,
  Slider,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import Layout from '@/components/Layout'
import { useAuth } from '@/lib/auth-context'

const serviceOptions = [
  { value: 'SPECIAL_NEEDS_TRAINER', label: 'Child Development Support' },
  { value: 'DAILY_LIVING_COMPANION', label: 'Daily Living & Companion Care' },
] as const

const familyContextOptions = [
  { value: 'THAI_LOCAL', label: 'Thai household' },
  { value: 'MIGRANT_HERITAGE', label: 'International / Expat household' },
  { value: 'MIXED', label: 'Multicultural household' },
] as const

const skillOptions = [
  'Special-needs training',
  'Progress reporting',
  'Medication reminders',
  'Mobility assistance',
  'Speech support',
  'Behavior regulation',
]

const childGoalOptions = [
  'Communication/language',
  'Social interaction',
  'Routine independence',
  'Behavior regulation',
  'Sensory integration',
] as const

const childConditionOptions = [
  'Autism spectrum',
  'ADHD',
  'Speech/language delay',
  'Global developmental delay',
  'Learning differences',
] as const

const dailyTaskOptions = [
  'Companionship/conversation',
  'Meal support',
  'Medication reminders',
  'Mobility assistance',
  'Appointment escort',
] as const

const AGE_BAND_OPTIONS = ['1-5', '6-12', '13-17', '18-24', '25-30'] as const

const FAMILY_REQUEST_DRAFT_KEY = 'carethia_family_request_draft_v1'

export default function NewFamilyRequestPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [serviceType, setServiceType] = useState<'SPECIAL_NEEDS_TRAINER' | 'DAILY_LIVING_COMPANION'>('SPECIAL_NEEDS_TRAINER')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [locationCity, setLocationCity] = useState('Chiang Mai')
  const [budgetMin, setBudgetMin] = useState(250)
  const [budgetMax, setBudgetMax] = useState(450)
  const [familyContext, setFamilyContext] = useState<'THAI_LOCAL' | 'MIGRANT_HERITAGE' | 'MIXED'>('THAI_LOCAL')
  const [mustHaveLanguages, setMustHaveLanguages] = useState('Thai, English')
  const [mustHaveSkills, setMustHaveSkills] = useState<string[]>(['Special-needs training'])
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT')
  const [childAgeBand, setChildAgeBand] = useState('6-12')
  const [childSessionStyle, setChildSessionStyle] = useState<'STRUCTURED' | 'PLAY_BASED' | 'MIXED'>('MIXED')
  const [childGoals, setChildGoals] = useState<string[]>(['Communication/language'])
  const [childConditions, setChildConditions] = useState<string[]>(['Speech/language delay'])
  const [recipientAgeBand, setRecipientAgeBand] = useState('13-17')
  const [mobilityLevel, setMobilityLevel] = useState<'LOW' | 'MODERATE' | 'HIGH'>('MODERATE')
  const [complexityLevel, setComplexityLevel] = useState<'LOW' | 'MODERATE' | 'HIGH'>('MODERATE')
  const [interactionStyle, setInteractionStyle] = useState<'CALM' | 'ENGAGING' | 'FORMAL'>('CALM')
  const [dailyTaskPriorities, setDailyTaskPriorities] = useState<string[]>(['Companionship/conversation'])
  const [matchWeightRequirement, setMatchWeightRequirement] = useState(40)
  const [matchWeightService, setMatchWeightService] = useState(35)
  const [matchWeightCultural, setMatchWeightCultural] = useState(25)
  const [requirementsText, setRequirementsText] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [draftHydrated, setDraftHydrated] = useState(false)

  const buildDraftPayload = () => ({
    title,
    serviceType,
    startDate,
    locationCity,
    budgetMin,
    budgetMax,
    familyContext,
    mustHaveLanguages,
    mustHaveSkills,
    status,
    childAgeBand,
    childSessionStyle,
    childGoals,
    childConditions,
    recipientAgeBand,
    mobilityLevel,
    complexityLevel,
    interactionStyle,
    dailyTaskPriorities,
    matchWeightRequirement,
    matchWeightService,
    matchWeightCultural,
    requirementsText,
  })

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(FAMILY_REQUEST_DRAFT_KEY)
      if (!raw) {
        setDraftHydrated(true)
        return
      }
      const draft = JSON.parse(raw) as Partial<{
        title: string
        serviceType: 'SPECIAL_NEEDS_TRAINER' | 'DAILY_LIVING_COMPANION'
        startDate: string
        locationCity: string
        budgetMin: number
        budgetMax: number
        familyContext: 'THAI_LOCAL' | 'MIGRANT_HERITAGE' | 'MIXED'
        mustHaveLanguages: string
        mustHaveSkills: string[]
        status: 'DRAFT' | 'ACTIVE'
        childAgeBand: string
        childSessionStyle: 'STRUCTURED' | 'PLAY_BASED' | 'MIXED'
        childGoals: string[]
        childConditions: string[]
        recipientAgeBand: string
        mobilityLevel: 'LOW' | 'MODERATE' | 'HIGH'
        complexityLevel: 'LOW' | 'MODERATE' | 'HIGH'
        interactionStyle: 'CALM' | 'ENGAGING' | 'FORMAL'
        dailyTaskPriorities: string[]
        matchWeightRequirement: number
        matchWeightService: number
        matchWeightCultural: number
        requirementsText: string
      }>

      if (draft.title !== undefined) setTitle(draft.title)
      if (draft.serviceType !== undefined) setServiceType(draft.serviceType)
      if (draft.startDate !== undefined) setStartDate(draft.startDate)
      if (draft.locationCity !== undefined) setLocationCity(draft.locationCity)
      if (draft.budgetMin !== undefined) setBudgetMin(draft.budgetMin)
      if (draft.budgetMax !== undefined) setBudgetMax(draft.budgetMax)
      if (draft.familyContext !== undefined) setFamilyContext(draft.familyContext)
      if (draft.mustHaveLanguages !== undefined) setMustHaveLanguages(draft.mustHaveLanguages)
      if (draft.mustHaveSkills !== undefined) setMustHaveSkills(draft.mustHaveSkills)
      if (draft.status !== undefined) setStatus(draft.status)
      if (draft.childAgeBand !== undefined) setChildAgeBand(draft.childAgeBand)
      if (draft.childSessionStyle !== undefined) setChildSessionStyle(draft.childSessionStyle)
      if (draft.childGoals !== undefined) setChildGoals(draft.childGoals)
      if (draft.childConditions !== undefined) setChildConditions(draft.childConditions)
      if (draft.recipientAgeBand !== undefined) setRecipientAgeBand(draft.recipientAgeBand)
      if (draft.mobilityLevel !== undefined) setMobilityLevel(draft.mobilityLevel)
      if (draft.complexityLevel !== undefined) setComplexityLevel(draft.complexityLevel)
      if (draft.interactionStyle !== undefined) setInteractionStyle(draft.interactionStyle)
      if (draft.dailyTaskPriorities !== undefined) setDailyTaskPriorities(draft.dailyTaskPriorities)
      if (draft.matchWeightRequirement !== undefined) setMatchWeightRequirement(draft.matchWeightRequirement)
      if (draft.matchWeightService !== undefined) setMatchWeightService(draft.matchWeightService)
      if (draft.matchWeightCultural !== undefined) setMatchWeightCultural(draft.matchWeightCultural)
      if (draft.requirementsText !== undefined) setRequirementsText(draft.requirementsText)
    } catch {
      // Ignore corrupted draft payloads
    } finally {
      setDraftHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!draftHydrated) return
    try {
      window.sessionStorage.setItem(
        FAMILY_REQUEST_DRAFT_KEY,
        JSON.stringify(buildDraftPayload()),
      )
    } catch {
      // Storage may be blocked; fail silently for UX continuity
    }
  }, [
    draftHydrated,
    title,
    serviceType,
    startDate,
    locationCity,
    budgetMin,
    budgetMax,
    familyContext,
    mustHaveLanguages,
    mustHaveSkills,
    status,
    childAgeBand,
    childSessionStyle,
    childGoals,
    childConditions,
    recipientAgeBand,
    mobilityLevel,
    complexityLevel,
    interactionStyle,
    dailyTaskPriorities,
    matchWeightRequirement,
    matchWeightService,
    matchWeightCultural,
    requirementsText,
  ])

  const canSubmit = useMemo(
    () => title.trim().length > 4 && budgetMax >= budgetMin,
    [title, budgetMin, budgetMax],
  )

  const toggleSkill = (skill: string) => {
    setMustHaveSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill],
    )
  }

  const toggleItem = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    )
  }

  const handleCreate = async () => {
    if (!canSubmit) {
      setSubmitError('Please add a title (at least 5 characters) and make sure budget max is not lower than budget min.')
      return
    }

    if (mustHaveSkills.length === 0) {
      setSubmitError('Please select at least one must-have skill.')
      return
    }

    if (!mustHaveLanguages.split(',').map((item) => item.trim()).filter(Boolean).length) {
      setSubmitError('Please provide at least one must-have language.')
      return
    }

    setSaving(true)
    setSubmitError('')
    try {
      try {
        window.sessionStorage.setItem(FAMILY_REQUEST_DRAFT_KEY, JSON.stringify(buildDraftPayload()))
      } catch {
        // ignore storage failures
      }

      const payload = {
        customerId: user?.id ?? 1,
        title,
        serviceType,
        startDate,
        locationCity,
        budgetMin,
        budgetMax,
        familyContext,
        status,
        mustHaveLanguages: mustHaveLanguages.split(',').map((item) => item.trim()).filter(Boolean),
        mustHaveSkills,
        niceToHaveSkills: [],
        schedule: ['DAY'],
        dialectImportance: 60,
        regionalImportance: 55,
        culturalPriority: familyContext === 'MIGRANT_HERITAGE' ? 'HIGH' : 'MEDIUM',
        culturalRequirements: ['Respectful communication'],
        matchWeightRequirement,
        matchWeightService,
        matchWeightCultural,
        requirementsText: requirementsText.trim(),
      }

      if (serviceType === 'SPECIAL_NEEDS_TRAINER') {
        Object.assign(payload, {
          childAgeBand,
          childGoals,
          childConditions,
          childSessionStyle,
        })
      } else {
        Object.assign(payload, {
          recipientAgeBand,
          mobilityLevel,
          dailyTaskPriorities,
          complexityLevel,
          interactionStyle,
        })
      }

      const res = await fetch('/api/family/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        const requestId = data?.request?.id
        if (requestId) {
          router.push(`/caregivers?service=${serviceType}&requestId=${requestId}`)
        } else {
          router.push(`/caregivers?service=${serviceType}`)
        }
        return
      }

      let message = 'Unable to create request. Please try again.'
      try {
        const data = await res.json()
        if (data?.error) {
          message = data.error
        }
      } catch {
        message = `Unable to create request (HTTP ${res.status}).`
      }
      setSubmitError(message)
    } catch {
      setSubmitError('Network error while creating request. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'grey.100' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={800} mb={0.5}>Create Family Care Request</Typography>
            <Typography color="text.secondary" mb={3}>Use this form for either service. You can add more requests anytime.</Typography>

            {!!submitError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {submitError}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField label="Request title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />

              <TextField
                select
                label="Service type"
                value={serviceType}
                onChange={(e) => {
                  const nextService = e.target.value as 'SPECIAL_NEEDS_TRAINER' | 'DAILY_LIVING_COMPANION'
                  setServiceType(nextService)
                  if (nextService === 'SPECIAL_NEEDS_TRAINER') {
                    setMustHaveSkills((prev) => (
                      prev.length > 0 ? prev : ['Special-needs training']
                    ))
                    setMustHaveLanguages((prev) => (prev.trim().length > 0 ? prev : 'Thai, English'))
                  } else {
                    setMustHaveSkills((prev) => (
                      prev.length > 0 ? prev : ['Medication reminders', 'Mobility assistance']
                    ))
                    setMustHaveLanguages((prev) => (prev.trim().length > 0 ? prev : 'Thai'))
                  }
                }}
                fullWidth
              >
                {serviceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                <TextField label="Location city" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} fullWidth />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Budget min (THB/hr)" type="number" value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value || 0))} fullWidth />
                <TextField label="Budget max (THB/hr)" type="number" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value || 0))} fullWidth />
              </Stack>

              <TextField
                select
                label="Home environment"
                value={familyContext}
                onChange={(e) => setFamilyContext(e.target.value as 'THAI_LOCAL' | 'MIGRANT_HERITAGE' | 'MIXED')}
                fullWidth
              >
                {familyContextOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Must-have languages (comma-separated)"
                value={mustHaveLanguages}
                onChange={(e) => setMustHaveLanguages(e.target.value)}
                fullWidth
              />

              <Box>
                <Typography fontWeight={700} mb={1}>Matching Priority (User POV)</Typography>
                <Typography fontSize={13} color="text.secondary" mb={1.5}>
                  Tune what matters more for your family. The system will normalize these three values.
                </Typography>
                <Stack spacing={2.25}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography fontSize={13}>Requirements (budget/schedule/language)</Typography>
                      <Typography fontSize={13} fontWeight={700}>{matchWeightRequirement}</Typography>
                    </Box>
                    <Slider
                      value={matchWeightRequirement}
                      min={0}
                      max={100}
                      step={5}
                      onChange={(_e, value) => setMatchWeightRequirement(value as number)}
                      sx={{ color: '#FF8C00' }}
                    />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography fontSize={13}>Service expertise (skills/conditions/tasks)</Typography>
                      <Typography fontSize={13} fontWeight={700}>{matchWeightService}</Typography>
                    </Box>
                    <Slider
                      value={matchWeightService}
                      min={0}
                      max={100}
                      step={5}
                      onChange={(_e, value) => setMatchWeightService(value as number)}
                      sx={{ color: '#6C63FF' }}
                    />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography fontSize={13}>Cultural fit (context/regional style)</Typography>
                      <Typography fontSize={13} fontWeight={700}>{matchWeightCultural}</Typography>
                    </Box>
                    <Slider
                      value={matchWeightCultural}
                      min={0}
                      max={100}
                      step={5}
                      onChange={(_e, value) => setMatchWeightCultural(value as number)}
                      sx={{ color: '#2ECC71' }}
                    />
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Typography fontWeight={700} mb={1}>Must-have skills</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {skillOptions.map((skill) => (
                    <ToggleButton
                      key={skill}
                      size="small"
                      value={skill}
                      selected={mustHaveSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      sx={{ mb: 1, borderRadius: 3, textTransform: 'none' }}
                    >
                      {skill}
                    </ToggleButton>
                  ))}
                </Stack>
              </Box>

              <TextField
                label="Requirements summary"
                multiline
                minRows={3}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="Summarize your practical requirements and preferred caregiver profile."
                fullWidth
              />

              {serviceType === 'SPECIAL_NEEDS_TRAINER' ? (
                <Stack spacing={2.5}>
                  <Typography fontWeight={700}>Child Development Details</Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select
                      label="Child age band (1-30)"
                      value={childAgeBand}
                      onChange={(e) => setChildAgeBand(e.target.value)}
                      fullWidth
                    >
                      {AGE_BAND_OPTIONS.map((band) => (
                        <MenuItem key={band} value={band}>{band}</MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Session style"
                      value={childSessionStyle}
                      onChange={(e) => setChildSessionStyle(e.target.value as 'STRUCTURED' | 'PLAY_BASED' | 'MIXED')}
                      fullWidth
                    >
                      <MenuItem value="STRUCTURED">Structured</MenuItem>
                      <MenuItem value="PLAY_BASED">Play-based</MenuItem>
                      <MenuItem value="MIXED">Mixed</MenuItem>
                    </TextField>
                  </Stack>

                  <Box>
                    <Typography fontWeight={700} mb={1}>Primary goals</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {childGoalOptions.map((goal) => {
                        const selected = childGoals.includes(goal)
                        return (
                          <Chip
                            key={goal}
                            label={goal}
                            clickable
                            color={selected ? 'primary' : 'default'}
                            onClick={() => toggleItem(goal, setChildGoals)}
                            sx={{ mb: 1, borderRadius: 3 }}
                          />
                        )
                      })}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography fontWeight={700} mb={1}>Known conditions (if any)</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {childConditionOptions.map((condition) => {
                        const selected = childConditions.includes(condition)
                        return (
                          <Chip
                            key={condition}
                            label={condition}
                            clickable
                            color={selected ? 'secondary' : 'default'}
                            onClick={() => toggleItem(condition, setChildConditions)}
                            sx={{ mb: 1, borderRadius: 3 }}
                          />
                        )
                      })}
                    </Stack>
                  </Box>
                </Stack>
              ) : (
                <Stack spacing={2.5}>
                  <Typography fontWeight={700}>Daily Living & Companion Details</Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select
                      label="Recipient age band (1-30)"
                      value={recipientAgeBand}
                      onChange={(e) => setRecipientAgeBand(e.target.value)}
                      fullWidth
                    >
                      {AGE_BAND_OPTIONS.map((band) => (
                        <MenuItem key={band} value={band}>{band}</MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Mobility level"
                      value={mobilityLevel}
                      onChange={(e) => setMobilityLevel(e.target.value as 'LOW' | 'MODERATE' | 'HIGH')}
                      fullWidth
                    >
                      <MenuItem value="LOW">Low support needed</MenuItem>
                      <MenuItem value="MODERATE">Moderate support needed</MenuItem>
                      <MenuItem value="HIGH">High support needed</MenuItem>
                    </TextField>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select
                      label="Complexity"
                      value={complexityLevel}
                      onChange={(e) => setComplexityLevel(e.target.value as 'LOW' | 'MODERATE' | 'HIGH')}
                      fullWidth
                    >
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MODERATE">Moderate</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                    </TextField>

                    <TextField
                      select
                      label="Interaction style"
                      value={interactionStyle}
                      onChange={(e) => setInteractionStyle(e.target.value as 'CALM' | 'ENGAGING' | 'FORMAL')}
                      fullWidth
                    >
                      <MenuItem value="CALM">Calm</MenuItem>
                      <MenuItem value="ENGAGING">Engaging</MenuItem>
                      <MenuItem value="FORMAL">Formal</MenuItem>
                    </TextField>
                  </Stack>

                  <Box>
                    <Typography fontWeight={700} mb={1}>Daily task priorities</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {dailyTaskOptions.map((task) => {
                        const selected = dailyTaskPriorities.includes(task)
                        return (
                          <Chip
                            key={task}
                            label={task}
                            clickable
                            color={selected ? 'primary' : 'default'}
                            onClick={() => toggleItem(task, setDailyTaskPriorities)}
                            sx={{ mb: 1, borderRadius: 3 }}
                          />
                        )
                      })}
                    </Stack>
                  </Box>
                </Stack>
              )}

              <Box>
                <Typography fontWeight={700} mb={1}>Save as</Typography>
                <ToggleButtonGroup
                  exclusive
                  value={status}
                  onChange={(_event, value) => {
                    if (value) setStatus(value)
                  }}
                  size="small"
                >
                  <ToggleButton value="DRAFT">Draft</ToggleButton>
                  <ToggleButton value="ACTIVE">Active (start matching)</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Stack direction="row" spacing={1.5} justifyContent="flex-end" pt={1}>
                <Button variant="outlined" onClick={() => router.push('/family/requests')} sx={{ borderRadius: 3 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={!canSubmit || saving}
                  sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', fontWeight: 700 }}
                >
                  {saving ? 'Saving...' : 'Create Request'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={!!submitError}
        autoHideDuration={5000}
        onClose={() => setSubmitError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setSubmitError('')} sx={{ borderRadius: 2 }}>
          {submitError}
        </Alert>
      </Snackbar>
    </Layout>
  )
}
