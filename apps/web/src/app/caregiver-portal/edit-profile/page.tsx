'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box, Container, Typography, Card, CardContent, Grid,
  TextField, Button, Stack, Chip, Slider, Switch,
  FormControlLabel, CircularProgress, Alert, Snackbar,
  Divider, InputAdornment, FormLabel,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import Layout from '@/components/Layout'
import { useAuth } from '@/lib/auth-context'
import { SERVICE_LABELS, SERVICE_ICONS } from '@/lib/mockData'
import type { ServiceType } from '@/lib/mockData'

const ALL_SERVICES: ServiceType[] = ['SPECIAL_NEEDS_TRAINER']

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const caregiverId = user?.id ?? 2

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  })

  const [bio, setBio] = useState('')
  const [services, setServices] = useState<ServiceType[]>(['SPECIAL_NEEDS_TRAINER'])
  const [hourlyRate, setHourlyRate] = useState(200)
  const [experience, setExperience] = useState(1)
  const [city, setCity] = useState('Other')
  const [certifications, setCertifications] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/caregivers/${caregiverId}`)
        if (res.ok) {
          const data = await res.json()
          const c = data.caregiver
          setBio(c.bio ?? '')
          setServices((c.services as ServiceType[]) ?? ['SPECIAL_NEEDS_TRAINER'])
          setHourlyRate(c.hourlyRate ?? 200)
          setExperience(c.experience ?? 1)
          setCity(c.city ?? 'Other')
          setCertifications(Array.isArray(c.certifications) ? c.certifications.join(', ') : (c.certifications ?? ''))
          setIsAvailable(c.isAvailable ?? true)
        }
      } catch { /* silent */ } finally {
        setLoading(false)
      }
    }
    load()
  }, [caregiverId])

  const toggleService = (svc: ServiceType) => {
    setServices(prev =>
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc],
    )
  }

  const handleSave = async () => {
    if (services.length === 0) {
      setSnackbar({ open: true, message: 'Please select at least one service.', severity: 'error' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/caregivers/${caregiverId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, services, hourlyRate, experience, city, certifications, isAvailable }),
      })
      if (res.ok) {
        setSnackbar({ open: true, message: '✅ Profile saved successfully!', severity: 'success' })
        setTimeout(() => router.push('/caregiver-portal'), 1200)
      } else {
        const data = await res.json()
        setSnackbar({ open: true, message: data.error || 'Save failed', severity: 'error' })
      }
    } catch {
      setSnackbar({ open: true, message: 'Network error, please try again.', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: '#9B59B6' }} />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box sx={{ background: 'linear-gradient(135deg, #FAF0FF 0%, #F3E8FF 100%)', borderBottom: '1px solid', borderColor: 'grey.100', py: 4 }}>
        <Container maxWidth="md">
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              component={Link}
              href="/caregiver-portal"
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Back to Portal
            </Button>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h5" fontWeight={800}>Edit Profile</Typography>
              <Typography fontSize={14} color="text.secondary">Keep your profile up to date to attract more families</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Stack spacing={3}>
          {/* Availability */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>Availability Status</Typography>
                  <Typography fontSize={13} color="text.secondary">Toggle off to pause new booking requests</Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAvailable}
                      onChange={e => setIsAvailable(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-thumb': { bgcolor: isAvailable ? '#9B59B6' : '#999' },
                        '& .Mui-checked+.MuiSwitch-track': { bgcolor: '#9B59B650 !important' },
                      }}
                    />
                  }
                  label={
                    <Typography fontWeight={700} color={isAvailable ? '#9B59B6' : 'text.secondary'}>
                      {isAvailable ? '🟢 Available' : '⚫ Unavailable'}
                    </Typography>
                  }
                />
              </Box>
            </CardContent>
          </Card>

          {/* Service Type */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <FormLabel sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary', mb: 0.5, display: 'block' }}>
                Service Type
              </FormLabel>
              <Typography fontSize={13} color="text.secondary" mb={2}>Select the care services you provide</Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {ALL_SERVICES.map(svc => {
                  const selected = services.includes(svc)
                  return (
                    <Chip
                      key={svc}
                      icon={<span style={{ fontSize: 18 }}>{SERVICE_ICONS[svc]}</span>}
                      label={SERVICE_LABELS[svc]}
                      onClick={() => toggleService(svc)}
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        px: 1,
                        py: 2.5,
                        bgcolor: selected ? '#9B59B6' : 'grey.100',
                        color: selected ? 'white' : 'text.primary',
                        border: selected ? '2px solid #7D3C98' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': { bgcolor: selected ? '#7D3C98' : 'grey.200' },
                      }}
                    />
                  )
                })}
              </Box>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={700} fontSize={16} mb={0.5}>About You</Typography>
              <Typography fontSize={13} color="text.secondary" mb={2}>Tell families about your background and approach</Typography>
              <TextField
                multiline
                minRows={4}
                maxRows={8}
                fullWidth
                placeholder="e.g. I have 6 years of experience supporting people with special needs with daily living, companionship, and post-hospital recovery..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                inputProps={{ maxLength: 600 }}
                helperText={`${bio.length}/600`}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </CardContent>
          </Card>

          {/* Rate & Experience */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={700} fontSize={16} mb={2.5}>Rate & Experience</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Typography fontSize={13} fontWeight={600} color="text.secondary" mb={1}>
                    Hourly Rate: <strong style={{ color: '#9B59B6' }}>฿{hourlyRate}</strong>
                  </Typography>
                  <Slider
                    value={hourlyRate}
                    onChange={(_e, val) => setHourlyRate(val as number)}
                    min={100} max={1500} step={50}
                    marks={[{ value: 100, label: '฿100' }, { value: 750, label: '฿750' }, { value: 1500, label: '฿1,500' }]}
                    sx={{ color: '#9B59B6', '& .MuiSlider-markLabel': { fontSize: 11 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography fontSize={13} fontWeight={600} color="text.secondary" mb={1}>
                    Years of Experience: <strong style={{ color: '#4ECDC4' }}>{experience} yr{experience !== 1 ? 's' : ''}</strong>
                  </Typography>
                  <Slider
                    value={experience}
                    onChange={(_e, val) => setExperience(val as number)}
                    min={0} max={30} step={1}
                    marks={[{ value: 0, label: '0' }, { value: 15, label: '15' }, { value: 30, label: '30' }]}
                    sx={{ color: '#4ECDC4', '& .MuiSlider-markLabel': { fontSize: 11 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Location & Credentials */}
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={700} fontSize={16} mb={2.5}>Location & Credentials</Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="City"
                  fullWidth
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">📍</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <TextField
                  label="Certifications"
                  fullWidth
                  value={certifications}
                  onChange={e => setCertifications(e.target.value)}
                  placeholder="e.g. Dementia Care Specialist, CPR Certified"
                  helperText="Separate multiple certifications with commas"
                  InputProps={{ startAdornment: <InputAdornment position="start">🏅</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Stack>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              component={Link}
              href="/caregiver-portal"
              variant="outlined"
              sx={{ borderRadius: 3, fontWeight: 600, px: 3 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                borderRadius: 3, fontWeight: 700, px: 4,
                background: 'linear-gradient(135deg, #9B59B6, #7D3C98)',
                boxShadow: '0 4px 16px rgba(155,89,182,0.35)',
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ borderRadius: 3, fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  )
}


