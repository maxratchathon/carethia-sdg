'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Chip, Stack, Paper, Divider, TextField, Slider,
  Accordion, AccordionSummary, AccordionDetails, InputAdornment,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShieldIcon from '@mui/icons-material/Shield'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PaymentsIcon from '@mui/icons-material/Payments'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Layout from '@/components/Layout'
import { SERVICE_ICONS, SERVICE_LABELS } from '@/lib/mockData'
import type { ServiceType } from '@/lib/mockData'

type CareShift = 'DAY' | 'NIGHT'

const STATS = [
  { value: '50+', label: 'Active Caregivers', icon: '👩' },
  { value: '฿18,000', label: 'Avg Monthly Earnings', icon: '💰' },
  { value: '1,200+', label: 'Bookings/Month', icon: '📅' },
  { value: '100%', label: 'You Keep Per Booking', icon: '🏦' },
]

const BENEFITS = [
  {
    icon: <PaymentsIcon />,
    title: 'Earn on Your Schedule',
    color: '#FF6B9D',
    bg: '#FFF0F5',
    desc: 'Set your own hours, accept only bookings that suit your lifestyle. No minimum commitments — work full-time or part-time.',
  },
  {
    icon: <VerifiedIcon />,
    title: 'CareTrust Badge™',
    color: '#2ECC71',
    bg: '#F0FFF7',
    desc: 'Earn a CareTrust score that grows with every job. High scores unlock priority placement, premium clients, and higher rates.',
  },
  {
    icon: <TrendingUpIcon />,
    title: 'We Send You Clients',
    color: '#6C63FF',
    bg: '#F3F2FF',
    desc: 'Our matching engine connects you directly with families who need exactly your skills — no chasing leads, no cold calls.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Safe & Secure',
    color: '#FF8C00',
    bg: '#FFF8F0',
    desc: 'All payments processed through Carethia. Background-checked families, live session check-in/out, and 24/7 support.',
  },
  {
    icon: <AccessTimeIcon />,
    title: 'Fast Payouts',
    color: '#4ECDC4',
    bg: '#F0FFFE',
    desc: 'Earnings transferred within 24 hours of booking completion directly to your Thai bank account or PromptPay.',
  },
  {
    icon: <PhoneIphoneIcon />,
    title: 'Caregiver App',
    color: '#9B59B6',
    bg: '#FAF0FF',
    desc: 'Manage bookings, track earnings, upload certifications, and communicate with families — all from one mobile-friendly dashboard.',
  },
]

const STEPS = [
  {
    step: '01',
    icon: '📝',
    title: 'Create Your Profile',
    desc: 'Sign up free, describe your experience, upload certifications, and set your hourly rate and availability.',
  },
  {
    step: '02',
    icon: '🔍',
    title: 'Pass Verification',
    desc: 'Complete our background check, skill certification review, and a short video interview with the Carethia team.',
  },
  {
    step: '03',
    icon: '🔎',
    title: 'Get Matched',
    desc: 'Once verified, we immediately start matching you to families based on your skills, location, and availability.',
  },
  {
    step: '04',
    icon: '💰',
    title: 'Start Earning',
    desc: 'Accept bookings, complete care sessions, build your CareTrust score, and receive payouts within 24 hours.',
  },
]

const VERIFICATION_STEPS = [
  { icon: '🪪', title: 'Thai National ID Verification', desc: 'Secure identity check via government ID' },
  { icon: '🔍', title: 'Criminal Background Check', desc: 'Partnered with trusted screening agencies' },
  { icon: '📜', title: 'Certification Upload', desc: 'Nursing license, teaching degree, ABA certificates, etc.' },
  { icon: '✅', title: 'Skills Assessment', desc: 'Short online quiz or practical skills demonstration' },
  { icon: '🎥', title: 'Video Interview', desc: '15-minute interview with a Carethia care coordinator' },
]

const SERVICE_RATES: { type: ServiceType; sessions: number }[] = [
  { type: 'SPECIAL_NEEDS_TRAINER', sessions: 14 },
]

const CAREGIVER_HOURLY_RATE: Record<CareShift, number> = {
  DAY: 300,
  NIGHT: 400,
}

const TESTIMONIALS = [
  {
    name: 'Nida Somchai',
    role: 'Special Needs Caregiver · Thailand',
    avatar: 'https://i.pravatar.cc/80?img=47',
    careTrust: 95,
    text: 'I used to work at a care home for a fixed salary. Now I earn ฿22,000/month working the same hours — but on my own schedule. The families are wonderful and Carethia always matches me with people with special needs I genuinely enjoy caring for.',
    earning: '฿22,000/mo',
  },
  {
    name: 'Malee Thanakit',
    role: 'Special Needs Caregiver · Thailand',
    avatar: 'https://i.pravatar.cc/80?img=45',
    careTrust: 92,
    text: 'Carethia lets me provide dedicated special needs care on a flexible schedule. The background-checked families give me confidence, and the payout arrives the next morning.',
    earning: '฿35,000/mo',
  },
  {
    name: 'Aisha Rahman',
    role: 'Special Needs Trainer · Thailand',
    avatar: 'https://i.pravatar.cc/80?img=48',
    careTrust: 98,
    text: 'Finding families with autistic children used to be so difficult. Carethia matches me perfectly every time. My CareTrust score opened doors to premium clients and a 30% rate increase.',
    earning: '฿28,000/mo',
  },
]

const FAQS = [
  {
    q: 'Is it free to join as a caregiver?',
    a: 'Yes, 100% free. There are no registration fees, no monthly charges, and no upfront costs. You keep 100% of your booking rate — Carethia charges a small service fee directly to the booking family.',
  },
  {
    q: 'How long does verification take?',
    a: 'Typically 3–5 business days from the time you submit all documents. Criminal background checks are the main variable. Once approved, your profile goes live immediately.',
  },
  {
    q: 'Can I set my own hourly rate?',
    a: 'Yes. You set your own rate within recommended ranges per service type. Higher CareTrust scores unlock higher recommended rate brackets and premium client access.',
  },
  {
    q: 'What if a client cancels last-minute?',
    a: 'If a client cancels less than 4 hours before the booking, you receive a 50% cancellation protection payment automatically. Repeat cancellations by clients affect their own trust score.',
  },
  {
    q: 'Can I join from anywhere in Thailand?',
    a: 'Yes. Carethia supports caregivers across Thailand. Sign up from your city and we will match you with families in your area based on your availability and service type.',
  },
]

export default function ForCaregiversPage() {
  const [selectedService, setSelectedService] = useState<ServiceType>('SPECIAL_NEEDS_TRAINER')
  const [selectedShift, setSelectedShift] = useState<CareShift>('DAY')
  const [hoursPerWeek, setHoursPerWeek] = useState(20)

  const baseRate = CAREGIVER_HOURLY_RATE[selectedShift]
  const weeklyEarnings = Math.round(baseRate * hoursPerWeek)
  const monthlyEarnings = weeklyEarnings * 4

  return (
    <Layout>
      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 60%, #1a2a3e 100%)',
        pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 14 },
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,107,157,0.07)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(108,99,255,0.08)', pointerEvents: 'none' }} />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="🌸 Join 50+ Verified Caregivers"
                sx={{ bgcolor: 'rgba(255,107,157,0.15)', color: '#FF6B9D', fontWeight: 600, mb: 3, border: '1px solid rgba(255,107,157,0.3)' }}
              />
              <Typography
                variant="h2" fontWeight={800} color="white" lineHeight={1.1} mb={2.5}
                sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' } }}
              >
                Turn Your Care Skills
                <Box component="span" sx={{ color: '#FF6B9D', display: 'block' }}>into a Career</Box>
              </Typography>
              <Typography
                variant="h6" color="grey.400" fontWeight={400} lineHeight={1.8} mb={4}
                sx={{ fontSize: '1.05rem', maxWidth: 520 }}
              >
                Join Carethia and get matched with verified families across Thailand who need your expertise — on your schedule, at your rate. Keep 100% of your booking rate.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={5}>
                <Button
                  variant="contained" size="large"
                  component={Link} href="/register?role=caregiver"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B9D, #C06C84)',
                    borderRadius: 6, px: 4, py: 1.5, fontWeight: 700,
                    boxShadow: '0 6px 20px rgba(255,107,157,0.4)',
                  }}
                >
                  Apply to Join Free
                </Button>
                <Button
                  variant="outlined" size="large"
                  sx={{ borderRadius: 6, px: 4, py: 1.5, fontWeight: 600, borderColor: 'rgba(255,255,255,0.3)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' } }}
                >
                  Watch How It Works
                </Button>
              </Stack>
              <Stack direction="row" spacing={3} flexWrap="wrap" rowGap={1.5}>
                {[
                  { icon: '✅', label: 'No registration fee' },
                  { icon: '💸', label: '100% earnings kept' },
                  { icon: '⚡', label: '24hrs payouts' },
                  { icon: '🔎', label: 'We send you clients' },
                ].map((b) => (
                  <Box key={b.label} display="flex" alignItems="center" gap={0.75}>
                    <Typography fontSize={14}>{b.icon}</Typography>
                    <Typography variant="caption" color="grey.300" fontWeight={600}>{b.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Hero stats card */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper elevation={0} sx={{ borderRadius: 5, p: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <Typography fontWeight={700} color="white" mb={3} fontSize={16}>💡 Top Earner This Month</Typography>
                <Box display="flex" gap={2} alignItems="center" mb={3}>
                  <Avatar src="https://i.pravatar.cc/80?img=48" sx={{ width: 56, height: 56, border: '2px solid #FF6B9D' }} />
                  <Box>
                    <Typography color="white" fontWeight={700}>Aisha Rahman</Typography>
                    <Typography variant="caption" color="grey.400">Special Needs Trainer · Thailand</Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                      <Typography fontSize={12}>🛡️</Typography>
                      <Typography fontSize={12} color="#2ECC71" fontWeight={700}>CareTrust 98/100</Typography>
                    </Box>
                  </Box>
                  <Box ml="auto" textAlign="right">
                    <Typography color="#FF6B9D" fontWeight={800} fontSize={20}>฿28,000</Typography>
                    <Typography variant="caption" color="grey.500">this month</Typography>
                  </Box>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />
                <Stack spacing={1.5}>
                  {[
                    { label: 'Bookings this month', value: '14' },
                    { label: 'Avg session rate', value: '฿400/hr' },
                    { label: 'Client repeat rate', value: '78%' },
                    { label: 'Response time', value: '< 30 min' },
                  ].map((item) => (
                    <Box key={item.label} display="flex" justifyContent="space-between">
                      <Typography variant="caption" color="grey.500">{item.label}</Typography>
                      <Typography variant="caption" color="white" fontWeight={700}>{item.value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box sx={{ bgcolor: '#FF6B9D', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {STATS.map((s) => (
              <Grid item xs={6} sm={3} key={s.label} textAlign="center">
                <Typography fontSize={22} mb={0.25}>{s.icon}</Typography>
                <Typography fontWeight={800} fontSize={26} color="white">{s.value}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Why Carethia" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1.5}>Everything You Need to Thrive</Typography>
            <Typography color="text.secondary" maxWidth={520} mx="auto">
              We built Carethia to make professional caregiving sustainable, safe, and rewarding — not just for families, but for you too.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {BENEFITS.map((b) => (
              <Grid item xs={12} sm={6} md={4} key={b.title}>
                <Card sx={{
                  borderRadius: 4, boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  border: `1px solid ${b.color}20`, height: '100%',
                  transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 10px 28px ${b.color}18` },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.color, mb: 2 }}>
                      {React.cloneElement(b.icon, { sx: { fontSize: 22 } })}
                    </Box>
                    <Typography fontWeight={700} mb={1} fontSize={15}>{b.title}</Typography>
                    <Typography color="text.secondary" fontSize="0.88rem" lineHeight={1.7}>{b.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Earnings Calculator */}
      <Box sx={{ py: 10, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Chip label="💰 Earnings Calculator" sx={{ bgcolor: '#F0FFF7', color: '#2ECC71', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1}>See What You Could Earn</Typography>
            <Typography color="text.secondary">Estimated based on current Carethia rates across Thailand. You keep 100% of your booking rate.</Typography>
          </Box>

          <Paper elevation={0} sx={{ borderRadius: 5, p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'grey.100', boxShadow: '0 4px 30px rgba(0,0,0,0.06)' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography fontWeight={700} mb={2}>Select your service type</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
                  {SERVICE_RATES.map(({ type }) => (
                    <Chip
                      key={type}
                      icon={<span style={{ fontSize: 14 }}>{SERVICE_ICONS[type]}</span>}
                      label={SERVICE_LABELS[type]}
                      onClick={() => setSelectedService(type)}
                      variant={selectedService === type ? 'filled' : 'outlined'}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedService === type ? '#FFF0F5' : undefined,
                        color: selectedService === type ? '#FF6B9D' : undefined,
                        borderColor: selectedService === type ? '#FF6B9D' : undefined,
                        fontWeight: selectedService === type ? 700 : 400,
                      }}
                    />
                  ))}
                </Stack>

                <Typography fontWeight={700} mb={1}>Hours per week: <Box component="span" color="#FF6B9D">{hoursPerWeek}h</Box></Typography>
                <Slider
                  value={hoursPerWeek}
                  onChange={(_e, v) => setHoursPerWeek(v as number)}
                  min={4} max={60} step={4}
                  marks={[{ value: 4, label: '4h' }, { value: 20, label: '20h' }, { value: 40, label: '40h' }, { value: 60, label: '60h' }]}
                  sx={{ color: '#FF6B9D', mb: 1 }}
                />

                <Typography fontWeight={700} mb={1.25} mt={2}>Select shift type</Typography>
                <Stack direction="row" gap={1} mb={1.5}>
                  <Chip
                    label="Day Care"
                    onClick={() => setSelectedShift('DAY')}
                    variant={selectedShift === 'DAY' ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedShift === 'DAY' ? '#FFF0F5' : undefined,
                      color: selectedShift === 'DAY' ? '#FF6B9D' : undefined,
                      borderColor: selectedShift === 'DAY' ? '#FF6B9D' : undefined,
                      fontWeight: selectedShift === 'DAY' ? 700 : 500,
                    }}
                  />
                  <Chip
                    label="Night Care"
                    onClick={() => setSelectedShift('NIGHT')}
                    variant={selectedShift === 'NIGHT' ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedShift === 'NIGHT' ? '#FFF0F5' : undefined,
                      color: selectedShift === 'NIGHT' ? '#FF6B9D' : undefined,
                      borderColor: selectedShift === 'NIGHT' ? '#FF6B9D' : undefined,
                      fontWeight: selectedShift === 'NIGHT' ? 700 : 500,
                    }}
                  />
                </Stack>

                <Box mt={3} p={2} sx={{ bgcolor: '#F9F9F9', borderRadius: 2, border: '1px dashed', borderColor: 'grey.200' }}>
                  <Typography fontSize={13} color="text.secondary">
                    Based on caregiver rate of <strong>฿{baseRate.toLocaleString()}/hr</strong> for {SERVICE_LABELS[selectedService]} ({selectedShift === 'DAY' ? 'Day Care' : 'Night Care'}). Actual earnings depend on your set rate, experience, and CareTrust score.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box sx={{ bgcolor: 'linear-gradient(135deg, #FFF0F5, #F3F2FF)', borderRadius: 4, p: 3.5, textAlign: 'center', background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)', border: '1px solid #FFD6E8' }}>
                  <Typography color="text.secondary" fontSize={13} fontWeight={600} mb={1} textTransform="uppercase" letterSpacing={1}>Estimated Monthly Earnings</Typography>
                  <Typography variant="h2" fontWeight={800} color="#FF6B9D" lineHeight={1} mb={0.5}>
                    ฿{monthlyEarnings.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">100% goes to you</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    {[
                      { label: 'Weekly earnings', value: `฿${weeklyEarnings.toLocaleString()}` },
                      { label: 'Service rate used', value: `฿${baseRate.toLocaleString()}/hr` },
                    ].map((row) => (
                      <Box key={row.label} display="flex" justifyContent="space-between">
                        <Typography fontSize={13} color="text.secondary">{row.label}</Typography>
                        <Typography fontSize={13} fontWeight={700}>{row.value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* How to Join */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Chip label="How to Join" sx={{ bgcolor: '#F3F2FF', color: '#6C63FF', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1}>Start Earning in 4 Steps</Typography>
            <Typography color="text.secondary">Verification typically takes 3–5 business days. Then you&apos;re live.</Typography>
          </Box>
          <Grid container spacing={3}>
            {STEPS.map((s, i) => (
              <Grid item xs={12} sm={6} md={3} key={s.step}>
                <Box textAlign="center" position="relative">
                  {i < STEPS.length - 1 && (
                    <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 28, left: '65%', width: '70%', height: 2, background: 'linear-gradient(90deg, #FF6B9D40, transparent)', zIndex: 0 }} />
                  )}
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B9D20, #C06C8430)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 26, position: 'relative', zIndex: 1 }}>
                    {s.icon}
                  </Box>
                  <Typography variant="caption" fontWeight={700} color="#FF6B9D" letterSpacing={2}>STEP {s.step}</Typography>
                  <Typography variant="h6" fontWeight={700} mt={0.5} mb={1}>{s.title}</Typography>
                  <Typography color="text.secondary" fontSize="0.88rem" lineHeight={1.7}>{s.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Verification Process */}
      <Box sx={{ py: 10, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Chip label="🛡️ Verification" sx={{ bgcolor: '#F0FFF7', color: '#2ECC71', fontWeight: 600, mb: 2 }} />
              <Typography variant="h3" fontWeight={800} mb={2}>Safety is Our Foundation</Typography>
              <Typography color="text.secondary" lineHeight={1.8} mb={3}>
                Every caregiver on Carethia is manually vetted. Our 5-step verification process builds trust with families — which means more bookings and higher rates for you.
              </Typography>
              <Typography color="text.secondary" lineHeight={1.8} mb={4}>
                Once verified, you earn the <strong>Carethia Verified Badge</strong> which is displayed prominently on your profile and increases booking conversion by up to 3×.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/register?role=caregiver"
                endIcon={<ArrowForwardIcon />}
                sx={{ background: 'linear-gradient(135deg, #2ECC71, #27AE60)', borderRadius: 6, px: 3.5, py: 1.2, fontWeight: 700 }}
              >
                Start Verification
              </Button>
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                {VERIFICATION_STEPS.map((v, i) => (
                  <Paper key={v.title} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.100', display: 'flex', gap: 2, alignItems: 'flex-start', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'all 0.2s', '&:hover': { borderColor: '#2ECC71', boxShadow: '0 4px 16px rgba(46,204,113,0.12)' } }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#F0FFF7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {v.icon}
                    </Box>
                    <Box flexGrow={1}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography fontWeight={700} fontSize={14}>{v.title}</Typography>
                        <Chip label={`Step ${i + 1}`} size="small" sx={{ bgcolor: '#F0FFF7', color: '#2ECC71', fontSize: 10, fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{v.desc}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services & Rates */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Service Rates" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1.5}>What You Can Earn Per Service</Typography>
            <Typography color="text.secondary">Estimated monthly income based on recommended Thailand rates and typical session volumes.</Typography>
          </Box>
          <Grid container spacing={3}>
            {SERVICE_RATES.map(({ type, sessions }) => {
              const dayRate = CAREGIVER_HOURLY_RATE.DAY
              const nightRate = CAREGIVER_HOURLY_RATE.NIGHT
              const dayMonthlyEst = dayRate * sessions
              const nightMonthlyEst = nightRate * sessions
              return (
                <Grid item xs={12} sm={6} md={4} key={type}>
                  <Card sx={{ borderRadius: 4, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'grey.100', overflow: 'hidden', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
                    <Box sx={{ p: 2, bgcolor: '#FAFAFA', borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography fontSize={28}>{SERVICE_ICONS[type]}</Typography>
                      <Typography fontWeight={700}>{SERVICE_LABELS[type]}</Typography>
                    </Box>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography fontSize={13} color="text.secondary">Day care rate</Typography>
                        <Typography fontSize={13} fontWeight={700} color="#2ECC71">฿{dayRate.toLocaleString()}/hr</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography fontSize={13} color="text.secondary">Night care rate</Typography>
                        <Typography fontSize={13} fontWeight={700} color="#2ECC71">฿{nightRate.toLocaleString()}/hr</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
                        <Typography fontSize={13} color="text.secondary" fontWeight={600}>Est. monthly (day)</Typography>
                        <Typography fontWeight={800} color="#FF6B9D" fontSize={16}>฿{dayMonthlyEst.toLocaleString()}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontSize={13} color="text.secondary" fontWeight={600}>Est. monthly (night)</Typography>
                        <Typography fontWeight={800} color="#FF6B9D" fontSize={16}>฿{nightMonthlyEst.toLocaleString()}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      {/* Caregiver Testimonials */}
      <Box sx={{ py: 10, background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Caregiver Stories" sx={{ bgcolor: 'white', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1}>Hear From Our Caregivers</Typography>
          </Box>
          <Grid container spacing={4}>
            {TESTIMONIALS.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ p: 3.5, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', height: '100%', border: '1px solid', borderColor: 'grey.100' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                      <Avatar src={t.avatar} sx={{ width: 52, height: 52, border: '2px solid #FF6B9D' }} />
                      <Box flexGrow={1}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography fontWeight={700} fontSize={14}>{t.name}</Typography>
                          <VerifiedIcon sx={{ fontSize: 15, color: '#1DA1F2' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                        <Box display="flex" alignItems="center" gap={0.5} mt={0.25}>
                          <Typography fontSize={11}>🛡️</Typography>
                          <Typography fontSize={11} fontWeight={700} color="#2ECC71">CareTrust {t.careTrust}/100</Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography fontWeight={800} color="#FF6B9D" fontSize={15}>{t.earning}</Typography>
                        <Typography variant="caption" color="text.secondary">monthly</Typography>
                      </Box>
                    </Box>
                    <Typography color="text.secondary" lineHeight={1.8} fontSize="0.9rem" fontStyle="italic">
                      &ldquo;{t.text}&rdquo;
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={2.5}>
                      <EmojiEventsIcon sx={{ fontSize: 16, color: '#FF8C00' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>Top-rated caregiver · Thailand</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Chip label="FAQ" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1}>Common Questions</Typography>
            <Typography color="text.secondary">Everything you need to know before applying.</Typography>
          </Box>
          <Stack spacing={1.5}>
            {FAQS.map((faq) => (
              <Accordion key={faq.q} elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FF6B9D' }} />} sx={{ px: 3, py: 1 }}>
                  <Typography fontWeight={600} fontSize={15}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Typography color="text.secondary" lineHeight={1.8} fontSize="0.9rem">{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: 12, background: 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)' }}>
        <Container maxWidth="md">
          <Box textAlign="center" color="white">
            <Typography fontSize={52} mb={2}>🌸</Typography>
            <Typography variant="h3" fontWeight={800} mb={2}>Ready to Start Your Journey?</Typography>
            <Typography fontSize="1.1rem" mb={5} sx={{ opacity: 0.9 }} maxWidth={520} mx="auto">
              Join 500+ verified caregivers earning on their terms. Free to apply — takes less than 10 minutes.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/register?role=caregiver"
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: 'white', color: '#FF6B9D', borderRadius: 6, px: 5, py: 1.5, fontWeight: 800, fontSize: '1rem', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', '&:hover': { bgcolor: 'grey.50' } }}
              >
                Apply to Join Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ borderRadius: 6, px: 5, py: 1.5, fontWeight: 600, borderColor: 'rgba(255,255,255,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' } }}
              >
                Talk to Our Team
              </Button>
            </Stack>
            <Box mt={5} display="flex" justifyContent="center" gap={4} flexWrap="wrap">
              {[
                { icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Free to join' },
                { icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: '100% earnings kept' },
                { icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, label: 'Verified family clients' },
              ].map((b) => (
                <Box key={b.label} display="flex" alignItems="center" gap={0.75} sx={{ opacity: 0.9 }}>
                  {b.icon}
                  <Typography variant="caption" fontWeight={600}>{b.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  )
}



