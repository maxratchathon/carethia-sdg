'use client'
import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  Box, Container, Typography, Button, TextField, Paper,
  Stack, Alert, CircularProgress, Card, CardActionArea,
  Stepper, Step, StepLabel, Grid, Chip, Slider,
  FormGroup, FormControlLabel, Checkbox, InputAdornment,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import WorkIcon from '@mui/icons-material/Work'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuth } from '@/lib/auth-context'

const SERVICES = [
  { value: 'SPECIAL_NEEDS_TRAINER', icon: '🧠' },
]

const CITIES = ['Bangkok', 'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Chiang Mai', 'Phuket', 'Pattaya', 'Other']

const STEPS = ['role', 'account', 'professional']

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation('auth')
  const { login } = useAuth()

  const initialRole = searchParams.get('role') === 'caregiver' ? 'CAREGIVER' : null
  const [activeStep, setActiveStep] = useState(initialRole ? 1 : 0)
  const [role, setRole] = useState<'CUSTOMER' | 'CAREGIVER' | null>(initialRole)

  // Step 2 fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  // Step 3 (caregiver) fields
  const [services, setServices] = useState<string[]>([])
  const [experience, setExperience] = useState(1)
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState(200)
  const [city, setCity] = useState('Other')
  const [certifications, setCertifications] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleService = (svc: string) => {
    setServices(prev => prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc])
  }

  const handleNext = () => {
    setError('')
    if (activeStep === 0 && !role) { setError(t('register.errors.selectRole')); return }
    if (activeStep === 1) {
      if (!firstName || !lastName || !email || !password) { setError(t('register.errors.requiredFields')); return }
      if (password.length < 6) { setError(t('register.errors.passwordLength')); return }
    }
    if (role === 'CUSTOMER' && activeStep === 1) {
      handleSubmit()
      return
    }
    if (activeStep === 2) {
      if (services.length === 0) { setError(t('register.errors.selectService')); return }
      if (!bio.trim()) { setError(t('register.errors.shortBio')); return }
      handleSubmit()
      return
    }
    setActiveStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        email, password, firstName, lastName, phone,
        role: role || 'CUSTOMER',
      }
      if (role === 'CAREGIVER') {
        Object.assign(body, { services, experience, bio, hourlyRate, city, certifications })
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('register.errors.registerFailed'))
        return
      }
      login(data.user)
      router.push('/dashboard')
    } catch {
      setError(t('register.errors.network'))
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = role === 'CAREGIVER' ? 3 : 2
  const displaySteps = role === 'CAREGIVER' ? STEPS : STEPS.slice(0, 2)

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)', py: 6 }}>
      <Container maxWidth="sm">
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Box
              component="img"
              src="/locales/images/carethia_logo.png"
              alt="Carethia logo"
              sx={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <Typography variant="h5" fontWeight={800} color="#FF6B9D">Carethia</Typography>
          </Link>
          <Typography variant="h5" fontWeight={800} mt={1}>{t('register.title')}</Typography>
          <Typography color="text.secondary" fontSize="0.9rem">{t('register.subtitle')}</Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {displaySteps.map((stepKey) => (
            <Step key={stepKey}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>{t(`register.steps.${stepKey}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'grey.100', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

          {/* Step 0: Role */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>{t('register.roleTitle')}</Typography>
              <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('register.roleSubtitle')}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card
                    variant="outlined"
                    onClick={() => setRole('CUSTOMER')}
                    sx={{
                      borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
                      border: role === 'CUSTOMER' ? '2px solid #FF6B9D' : '1px solid',
                      borderColor: role === 'CUSTOMER' ? '#FF6B9D' : 'grey.200',
                      bgcolor: role === 'CUSTOMER' ? '#FFF0F5' : 'white',
                    }}
                  >
                    <CardActionArea sx={{ p: 3, textAlign: 'center' }}>
                      <Box fontSize={40} mb={1}>👨‍👩‍👧</Box>
                      <Typography fontWeight={700}>{t('register.customer')}</Typography>
                      <Typography variant="caption" color="text.secondary">{t('register.customerDesc')}</Typography>
                      {role === 'CUSTOMER' && <CheckCircleIcon sx={{ color: '#FF6B9D', fontSize: 20, mt: 1, display: 'block', mx: 'auto' }} />}
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    variant="outlined"
                    onClick={() => setRole('CAREGIVER')}
                    sx={{
                      borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
                      border: role === 'CAREGIVER' ? '2px solid #2ECC71' : '1px solid',
                      borderColor: role === 'CAREGIVER' ? '#2ECC71' : 'grey.200',
                      bgcolor: role === 'CAREGIVER' ? '#F0FFF4' : 'white',
                    }}
                  >
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

          {/* Step 1: Account Info */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>{t('register.accountTitle')}</Typography>
              <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('register.accountSubtitle')}</Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth label={t('register.firstName')} value={firstName} onChange={e => setFirstName(e.target.value)} required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    fullWidth label={t('register.lastName')} value={lastName} onChange={e => setLastName(e.target.value)} required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Box>
                <TextField
                  fullWidth label={t('register.email')} type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <TextField
                  fullWidth label={t('register.password')} type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  helperText={t('register.passwordHelp')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <TextField
                  fullWidth label={t('register.phone')} value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="0812345678"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Stack>
            </Box>
          )}

          {/* Step 2: Caregiver Professional Details */}
          {activeStep === 2 && role === 'CAREGIVER' && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>{t('register.professionalTitle')}</Typography>
              <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('register.professionalSubtitle')}</Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography fontWeight={600} mb={1.5}>{t('register.services')}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {SERVICES.map(s => (
                      <Chip
                        key={s.value}
                        label={`${s.icon} ${t('register.serviceSpecialNeeds')}`}
                        onClick={() => toggleService(s.value)}
                        color={services.includes(s.value) ? 'primary' : 'default'}
                        variant={services.includes(s.value) ? 'filled' : 'outlined'}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography fontWeight={600} mb={2}>{t('register.hourlyRate')}: ฿{hourlyRate}/hr</Typography>
                  <Slider
                    value={hourlyRate} onChange={(_, v) => setHourlyRate(v as number)}
                    min={100} max={800} step={50}
                    marks={[{ value: 100, label: '฿100' }, { value: 400, label: '฿400' }, { value: 800, label: '฿800' }]}
                    sx={{ color: '#2ECC71' }}
                  />
                </Box>

                <Box>
                  <Typography fontWeight={600} mb={1}>{t('register.experience')}: {experience}</Typography>
                  <Slider
                    value={experience} onChange={(_, v) => setExperience(v as number)}
                    min={0} max={20} step={1}
                    marks={[{ value: 0, label: '0' }, { value: 10, label: '10' }, { value: 20, label: '20+' }]}
                    sx={{ color: '#2ECC71' }}
                  />
                </Box>

                <Box>
                  <Typography fontWeight={600} mb={1}>{t('register.city')}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {CITIES.map(c => (
                      <Chip
                        key={c} label={t(`register.cities.${c}`)}
                        onClick={() => setCity(c)}
                        color={city === c ? 'secondary' : 'default'}
                        variant={city === c ? 'filled' : 'outlined'}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Box>
                </Box>

                <TextField
                  fullWidth label={t('register.shortBio')} multiline rows={3} value={bio} onChange={e => setBio(e.target.value)}
                  placeholder={t('register.shortBioPlaceholder')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <TextField
                  fullWidth label={t('register.certifications')} value={certifications} onChange={e => setCertifications(e.target.value)}
                  placeholder={t('register.certificationsPlaceholder')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Stack>
            </Box>
          )}

          {/* Navigation */}
          <Stack direction="row" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined" onClick={() => activeStep > 0 ? setActiveStep(s => s - 1) : router.back()}
              sx={{ borderRadius: 3, borderColor: 'grey.200', color: 'text.secondary', fontWeight: 600 }}
            >
              {t('register.back')}
            </Button>
            <Button
              variant="contained" onClick={handleNext} disabled={loading}
              sx={{
                background: role === 'CAREGIVER' ? 'linear-gradient(135deg, #2ECC71, #27AE60)' : 'linear-gradient(135deg, #FF6B9D, #C06C84)',
                borderRadius: 3, px: 4, fontWeight: 700,
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : (
                activeStep === totalSteps - 1 ? `🎉 ${t('register.createAccount')}` : `${t('register.continue')} →`
              )}
            </Button>
          </Stack>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              {t('register.alreadyAccount')}{' '}
              <Link href="/login" style={{ color: '#FF6B9D', fontWeight: 700, textDecoration: 'none' }}>{t('register.signIn')}</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>}>
      <RegisterForm />
    </Suspense>
  )
}



