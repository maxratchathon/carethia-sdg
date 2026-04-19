'use client'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Rating, Stack, Chip, Paper, Divider,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShieldIcon from '@mui/icons-material/Shield'
import SearchIcon from '@mui/icons-material/Search'
import StarIcon from '@mui/icons-material/Star'
import Layout from '@/components/Layout'
import CaregiverCard from '@/components/CaregiverCard'
import { mockCaregivers, COMMUNITY_ADS } from '@/lib/mockData'
import { TIER_CONFIG } from '@/lib/store'
import type { ServiceType } from '@/lib/mockData'

const PROGRAMS: {
  id: string
  type: ServiceType
  title: string
  subtitle: string
  details: string
  image: string
  color: string
  bg: string
}[] = [
  {
    id: 'child-development',
    type: 'SPECIAL_NEEDS_TRAINER',
    title: 'Child Development Support',
    subtitle: 'ADHD, autism, and learning support',
    details: 'Structured sessions focused on communication, routines, emotional regulation, and confidence building.',
    image: '/locales/images/development-support.png',
    color: '#6C63FF',
    bg: '#F3F2FF',
  },
  {
    id: 'daily-living',
    type: 'SPECIAL_NEEDS_TRAINER',
    title: 'Daily Living & Companion Care',
    subtitle: 'Reliable special-needs support at home and outside',
    details: 'Special-needs care assistance with hygiene, meals, mobility, social activities, and day-to-day wellbeing for children, teens, and adults.',
    image: '/locales/images/daily-care.png',
    color: '#1F9D8A',
    bg: '#EDFFFB',
  },
]

const STATS = [
  { value: '50+', label: 'Verified Professionals' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '1,200+', label: 'Special-Needs Families Supported' },
  { value: '4.9★', label: 'Average Rating' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: '📝', title: 'Tell Us Your Needs', desc: 'Share details about your family, schedule, special requirements, and preferences.' },
  { step: '02', icon: '🤝', title: 'Get Matched', desc: 'We review 50+ factors to find your perfect caregiver — from personality to proximity.' },
  { step: '03', icon: '😌', title: 'Book with Confidence', desc: 'Every caregiver is background-checked and verified. Book instantly with full safety guarantee.' },
]

const TESTIMONIALS = [
  { name: 'Natthakan P.', role: 'Parent of child with autism, Thailand', avatar: 'https://i.pravatar.cc/60?img=5', text: 'Carethia helped us find a caregiver who understands my daughter’s sensory needs and communication style. Her daily routine is now calmer and more consistent.', rating: 5 },
  { name: 'Siriporn W.', role: 'Parent of child with ADHD, Thailand', avatar: 'https://i.pravatar.cc/60?img=8', text: 'I was nervous about trust and qualifications, but the screening process gave me confidence. Our trainer supports homework focus and emotional regulation every week.', rating: 5 },
  { name: 'Duanpen K.', role: 'Mother of teen with special needs, Chiang Mai', avatar: 'https://i.pravatar.cc/60?img=12', text: 'The home therapy support program made a real difference. Our caregiver follows therapist guidance closely, and we can finally keep progress steady between sessions.', rating: 5 },
]

const PRICING = [
  {
    service: 'Special Needs Child Day Care',
    icon: '👶',
    caregiverRate: 300,
    serviceFeeRate: 0.15,
    taxFee: 15,
    insuranceFee: 45,
    isNight: false,
  },
  {
    service: 'Special Needs Child Night Care',
    icon: '👶',
    caregiverRate: 400,
    serviceFeeRate: 0.15,
    taxFee: 15,
    insuranceFee: 45,
    isNight: true,
  },
]

const TIER_PERKS = [
  { ...TIER_CONFIG[0], pointsLabel: '0 – 499 pts', perks: ['Access to all caregivers', 'Up to 3 active bookings', '฿99 flat service fee per booking', 'Email support'] },
  { ...TIER_CONFIG[1], pointsLabel: '500 – 1,999 pts', perks: ['Unlimited bookings', '฿79 flat service fee per booking', 'Priority matching', 'Phone & chat support', '1× emergency replacement / month'] },
  { ...TIER_CONFIG[2], pointsLabel: '2,000+ pts', perks: ['Unlimited bookings', '฿59 flat service fee per booking', 'Top-priority matching', '24/7 dedicated care advisor', 'Unlimited emergency replacements', 'Gold-verified caregiver access'] },
]

const HOW_TO_EARN = [
  { icon: '💼', pts: '+50 pts', label: 'Complete a booking', sub: 'Every completed session earns you points' },
  { icon: '⭐', pts: '+20 pts', label: 'Leave a review', sub: 'Share feedback after each booking' },
  { icon: '👤', pts: '+100 pts', label: 'Refer a friend', sub: 'When they complete their first booking' },
  { icon: '📅', pts: '+30 pts', label: 'Book 3+ months in a row', sub: 'Consistency streak bonus' },
]

export default function Home() {
  const { t } = useTranslation('home')

  const programs = PROGRAMS.map((program) => {
    if (program.id === 'child-development') {
      return {
        ...program,
        title: t('service1'),
        subtitle: t('service1Subtitle'),
        details: t('service1Description'),
      }
    }

    if (program.id === 'daily-living') {
      return {
        ...program,
        title: t('service2'),
        subtitle: t('service2Subtitle'),
        details: t('service2Description'),
      }
    }

    return program
  })

  const stats = [
    { value: '50+', label: t('statsVerifiedProfessionals') },
    { value: '98%', label: t('statsSatisfactionRate') },
    { value: '1,200+', label: t('statsFamiliesSupported') },
    { value: '4.9★', label: t('statsAverageRating') },
  ]

  const howItWorks = [
    { step: '01', icon: '📝', title: t('step1Title'), desc: t('step1Desc') },
    { step: '02', icon: '🤝', title: t('step2Title'), desc: t('step2Desc') },
    { step: '03', icon: '😌', title: t('step3Title'), desc: t('step3Desc') },
  ]

  return (
    <Layout>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 50%, #F0FFFE 100%)', pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 10 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,107,157,0.08)', pointerEvents: 'none' }} />
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label={`🏆 ${t('heroBadge')}`} sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 3, border: '1px solid #FFCCE4' }} />
              <Typography variant="h2" fontWeight={800} lineHeight={1.1} mb={2.5} sx={{ fontSize: { xs: '2.2rem', md: '3rem' } }}>
                {t('heroTitleMain')}
                <Box component="span" sx={{ color: '#FF6B9D', display: 'block' }}>{t('heroTitleAccent')}</Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400} lineHeight={1.7} mb={4} sx={{ fontSize: '1.05rem' }}>
                {t('heroSubtitle')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
                <Button variant="contained" size="large" component={Link} href="/caregivers" endIcon={<ArrowForwardIcon />} sx={{ background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', borderRadius: 6, px: 4, py: 1.5, fontWeight: 700, boxShadow: '0 6px 20px rgba(255,107,157,0.4)' }}>
                  {t('heroPrimaryCta')}
                </Button>
                <Button variant="outlined" size="large" sx={{ borderRadius: 6, px: 4, py: 1.5, fontWeight: 600, borderColor: '#FF6B9D', color: '#FF6B9D', '&:hover': { bgcolor: '#FFF0F5' } }}>
                  {t('heroSecondaryCta')}
                </Button>
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {[{ icon: <ShieldIcon sx={{ fontSize: 16 }} />, label: t('heroTrust1') }, { icon: <VerifiedIcon sx={{ fontSize: 16 }} />, label: t('heroTrust2') }, { icon: <StarIcon sx={{ fontSize: 16 }} />, label: t('heroTrust3') }].map((badge) => (
                  <Box key={badge.label} display="flex" alignItems="center" gap={0.5} sx={{ color: 'text.secondary' }}>
                    {badge.icon}
                    <Typography variant="caption" fontWeight={600}>{badge.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: 380, display: { xs: 'none', md: 'block' } }}>
                {COMMUNITY_ADS.map((ad, i) => (
                  <Paper key={ad.id} component={Link} href="/events" elevation={0} sx={{ position: 'absolute', top: `${i * 100}px`, left: `${i * 25}px`, right: `${(2 - i) * 20}px`, p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', bgcolor: 'white', zIndex: 3 - i, textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 30px ${ad.badgeColor}30` } }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: `${ad.badgeColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                      {ad.emoji}
                    </Box>
                    <Box flexGrow={1} minWidth={0}>
                      <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap" mb={0.25}>
                        <Typography fontWeight={700} fontSize={13} noWrap>{ad.title}</Typography>
                        <Chip label={ad.badge} size="small" sx={{ bgcolor: `${ad.badgeColor}18`, color: ad.badgeColor, fontWeight: 700, fontSize: 10, height: 18 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">📅 {ad.date} · 📍 {ad.location}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box sx={{ bgcolor: '#1a1a2e', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {stats.map((stat) => (
              <Grid item xs={6} sm={3} key={stat.label} textAlign="center">
                <Typography fontWeight={800} fontSize={28} color="#FF6B9D">{stat.value}</Typography>
                <Typography variant="body2" color="grey.400">{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Grid */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label={t('servicesChip')} sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1.5}>{t('servicesSectionTitle')}</Typography>
            <Typography color="text.secondary" maxWidth={620} mx="auto">{t('servicesSectionDescription')}</Typography>
          </Box>
          <Grid container spacing={3}>
            {programs.map(({ id, type, title, subtitle, details, image, color, bg }) => (
              <Grid item xs={12} sm={6} md={6} key={id}>
                <Card
                  component={Link}
                  href={`/caregivers?service=${type}`}
                  sx={{
                    textDecoration: 'none',
                    borderRadius: 4,
                    bgcolor: bg,
                    boxShadow: 'none',
                    border: '1px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: color,
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${color}30`,
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: 200, sm: 220, md: 240 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: bg,
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transform: 'scale(1.08)',
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 3.5 }}>
                    <Typography fontWeight={800} fontSize={20} mb={0.5} color="#1a1a2e">{title}</Typography>
                    <Typography fontWeight={600} fontSize={14} color={color} mb={1.5}>{subtitle}</Typography>
                    <Typography color="text.secondary" fontSize={14} lineHeight={1.7}>{details}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box id="how-it-works" sx={{ py: 10, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Chip label={t('howItWorksChip')} sx={{ bgcolor: '#F3F2FF', color: '#6C63FF', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1}>{t('howItWorksTitle')}</Typography>
            <Typography color="text.secondary">{t('howItWorksSubtitle')}</Typography>
          </Box>
          <Grid container spacing={4}>
            {howItWorks.map((step) => (
              <Grid item xs={12} md={4} key={step.step}>
                <Box textAlign="center">
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B9D20, #C06C8430)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 28 }}>{step.icon}</Box>
                  <Typography variant="caption" fontWeight={700} color="#FF6B9D" letterSpacing={2}>STEP {step.step}</Typography>
                  <Typography variant="h6" fontWeight={700} mt={0.5} mb={1}>{step.title}</Typography>
                  <Typography color="text.secondary" fontSize="0.9rem" lineHeight={1.7}>{step.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Us Preview */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Paper variant="outlined" sx={{ borderRadius: 5, p: { xs: 3, md: 5 }, borderColor: '#FFD6E8', background: 'linear-gradient(135deg, #FFF8FC 0%, #F9F4FF 100%)' }}>
            <Box textAlign="center" mb={3}>
              <Chip label={t('aboutChip')} sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
              <Typography variant="h3" fontWeight={800} mb={1.5}>{t('aboutTitle')}</Typography>
            </Box>
            <Typography color="text.secondary" fontSize={{ xs: 15, md: 16 }} lineHeight={1.9} textAlign="center" mb={2.5}>
              {t('aboutDescription')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} justifyContent="center" alignItems="center" mb={4}>
              <Chip label={t('aboutPill1')} size="small" sx={{ bgcolor: 'white', border: '1px solid #FFD6E8', color: '#7A4A5B', fontWeight: 600 }} />
              <Chip label={t('aboutPill2')} size="small" sx={{ bgcolor: 'white', border: '1px solid #FFD6E8', color: '#7A4A5B', fontWeight: 600 }} />
              <Chip label={t('aboutPill3')} size="small" sx={{ bgcolor: 'white', border: '1px solid #FFD6E8', color: '#7A4A5B', fontWeight: 600 }} />
            </Stack>
            <Box textAlign="center">
              <Button component={Link} href="/about-us" variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', borderRadius: 6, px: 4, fontWeight: 700, boxShadow: '0 6px 20px rgba(255,107,157,0.35)' }}>
                {t('viewMore')}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Featured Caregivers */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={5}>
            <Box>
              <Chip label={t('featuredChip')} sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 1 }} />
              <Typography variant="h3" fontWeight={800}>{t('featuredTitle')}</Typography>
            </Box>
            <Button component={Link} href="/caregivers" endIcon={<ArrowForwardIcon />} sx={{ color: '#FF6B9D', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}>{t('viewAll')}</Button>
          </Box>
          <Grid container spacing={3}>
            {mockCaregivers.slice(0, 6).map((caregiver) => (
              <Grid item xs={12} sm={6} md={4} key={caregiver.id}>
                <CaregiverCard caregiver={caregiver} showServiceChip={false} />
              </Grid>
            ))}
          </Grid>
          <Box textAlign="center" mt={5}>
            <Button variant="outlined" size="large" component={Link} href="/caregivers" startIcon={<SearchIcon />} sx={{ borderRadius: 6, px: 4, borderColor: '#FF6B9D', color: '#FF6B9D' }}>{t('browseAll')}</Button>
          </Box>
        </Container>
      </Box>

      {/* Trust Section */}
      <Box sx={{ py: 10, background: 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)' }}>
        <Container maxWidth="md">
          <Box textAlign="center" color="white">
            <Typography variant="h3" fontWeight={800} mb={2}>Safety You Can Count On</Typography>
            <Typography fontSize="1.1rem" mb={5} sx={{ opacity: 0.9 }}>Every caregiver goes through our rigorous 5-step verification process</Typography>
            <Grid container spacing={3}>
              {[{ icon: '🔍', title: 'Background Check', desc: 'Criminal record & ID verification' }, { icon: '📜', title: 'Certifications', desc: 'Verified degrees & licenses' }, { icon: '💼', title: 'Work History', desc: 'Confirmed references' }, { icon: '🤝', title: 'Interview', desc: 'Reviewed by our care team' }, { icon: '⭐', title: 'Safety Score', desc: 'Ongoing monitoring' }].map((item) => (
                <Grid item xs={6} sm={4} md={2.4} key={item.title}>
                  <Box textAlign="center">
                    <Typography fontSize={32} mb={1}>{item.icon}</Typography>
                    <Typography fontWeight={700} mb={0.5} color="white" fontSize={14}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85, color: 'white' }}>{item.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Pricing Model */}
      <Box id="pricing" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Transparent Pricing" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} mb={1.5}>Caregivers Keep 100%</Typography>
            <Typography color="text.secondary" maxWidth={540} mx="auto">Caregivers keep every baht they earn. Customers see clear tax and fee charges before checkout.</Typography>
          </Box>
          <Grid container spacing={3} mb={5} justifyContent="center">
            {PRICING.map((p) => {
                const serviceFee = Math.round(p.caregiverRate * p.serviceFeeRate)
                const totalTaxAndFee = serviceFee + p.taxFee
                const customerPays = p.caregiverRate + totalTaxAndFee + p.insuranceFee
                return (
                <Grid item xs={12} sm={6} md={5} key={p.service}>
                <Card sx={{ borderRadius: 4, boxShadow: p.isNight ? '0 4px 24px rgba(26,26,46,0.18)' : '0 4px 20px rgba(255,193,7,0.10)', border: '2px solid', borderColor: p.isNight ? '#1a1a2e' : '#FFD580', overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: p.isNight ? '#1a1a2e' : '#FFF8E1', p: 2.5, textAlign: 'center' }}>
                    <Typography fontSize={36} mb={0.5}>{p.icon}</Typography>
                    <Typography fontWeight={700} color={p.isNight ? 'white' : '#7B5E00'} fontSize={16}>{p.service}</Typography>
                  </Box>
                    <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={1.5} alignItems="center">
                      <Typography color="text.secondary" fontSize={13}>Caregiver earns</Typography>
                      <Typography fontWeight={800} fontSize={20} color="#2ECC71">฿{p.caregiverRate.toLocaleString()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                      <Typography color="text.secondary" fontSize={13}>Tax and fee</Typography>
                      <Typography fontWeight={700} color="#4ECDC4">฿{totalTaxAndFee}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                      <Typography color="text.secondary" fontSize={13}>Insurance fee</Typography>
                      <Typography fontWeight={700} color="#4ECDC4">฿{p.insuranceFee}</Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary" fontSize={13}>Customer pays (total)</Typography>
                      <Typography fontWeight={800} fontSize={18}>฿{customerPays.toLocaleString()}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )})}
          </Grid>
          {/* Loyalty Tiers */}
          <Box textAlign="center" mt={8} mb={5}>
            <Chip label="🏆 CarePoints Loyalty Programme" sx={{ bgcolor: '#FFF8F0', color: '#FF8C00', fontWeight: 600, mb: 2, border: '1px solid #FFD580' }} />
            <Typography variant="h4" fontWeight={800} mb={1}>Earn Points. Level Up. Pay Less.</Typography>
            <Typography color="text.secondary" maxWidth={520} mx="auto">
              Every booking earns you CarePoints. Accumulate points to unlock Bronze, Silver, and Gold tiers — each with lower platform fees and exclusive perks.
            </Typography>
          </Box>

          {/* How to earn */}
          <Grid container spacing={2} mb={5}>
            {HOW_TO_EARN.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.label}>
                <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start', borderColor: 'grey.200', height: '100%' }}>
                  <Typography fontSize={28}>{item.icon}</Typography>
                  <Box>
                    <Chip label={item.pts} size="small" sx={{ bgcolor: '#FFF8F0', color: '#FF8C00', fontWeight: 800, fontSize: 12, mb: 0.5 }} />
                    <Typography fontWeight={700} fontSize={13}>{item.label}</Typography>
                    <Typography fontSize={12} color="text.secondary">{item.sub}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Tier cards */}
          <Grid container spacing={3} alignItems="stretch">
            {TIER_PERKS.map((tier, i) => (
              <Grid item xs={12} md={4} key={tier.name}>
                <Card sx={{
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: i === 2 ? tier.color : `${tier.color}50`,
                  boxShadow: i === 2 ? `0 8px 32px ${tier.color}25` : '0 4px 20px rgba(0,0,0,0.05)',
                  height: '100%', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'visible',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 36px ${tier.color}30` },
                }}>
                  {i === 2 && (
                    <Chip label="Most Rewarding" size="small" sx={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      bgcolor: tier.color, color: 'white', fontWeight: 700, fontSize: 11, zIndex: 1,
                      boxShadow: `0 4px 12px ${tier.color}50`,
                    }} />
                  )}
                  <Box sx={{ bgcolor: tier.bg, p: 3, borderRadius: '14px 14px 0 0', textAlign: 'center', borderBottom: `1px solid ${tier.color}20` }}>
                    <Typography fontSize={44} mb={0.5}>{tier.icon}</Typography>
                    <Typography variant="h5" fontWeight={800} color={tier.color}>{tier.name}</Typography>
                    <Chip label={tier.pointsLabel} size="small" sx={{ mt: 1, bgcolor: `${tier.color}18`, color: tier.color, fontWeight: 700, fontSize: 12 }} />
                    <Box mt={1.5}>
                      <Chip label={`${tier.fee} platform fee`} size="small" sx={{ bgcolor: 'white', color: tier.color, fontWeight: 800, border: `1px solid ${tier.color}40` }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Stack spacing={1.5}>
                      {tier.perks.map((perk) => (
                        <Box key={perk} display="flex" alignItems="flex-start" gap={1}>
                          <Typography fontSize={15} lineHeight={1.4}>✅</Typography>
                          <Typography fontSize={14} color="text.secondary" lineHeight={1.5}>{perk}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 10, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip label="Testimonials" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 600, mb: 2 }} />
            <Typography variant="h3" fontWeight={800}>Trusted by Special-Needs Families</Typography>
          </Box>
          <Grid container spacing={4}>
            {TESTIMONIALS.map((t) => (
              <Grid item xs={12} md={4} key={t.name}>
                <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: '100%', border: '1px solid', borderColor: 'grey.100' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Rating value={t.rating} readOnly size="small" sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" lineHeight={1.7} mb={3} fontStyle="italic">&ldquo;{t.text}&rdquo;</Typography>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar src={t.avatar} sx={{ width: 44, height: 44 }} />
                      <Box>
                        <Typography fontWeight={700} fontSize={14}>{t.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="sm">
          <Box textAlign="center" sx={{ background: 'linear-gradient(135deg, #FFF0F5, #F3F2FF)', borderRadius: 6, p: { xs: 4, md: 7 }, border: '1px solid #FFD6E8' }}>
            <Typography fontSize={48} mb={2}>🌸</Typography>
            <Typography variant="h4" fontWeight={800} mb={1.5}>{t('finalTitle')}</Typography>
            <Typography color="text.secondary" mb={4}>{t('finalSubtitle')}</Typography>
            <Button variant="contained" size="large" component={Link} href="/caregivers" sx={{ background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', borderRadius: 6, px: 5, py: 1.5, fontWeight: 700, boxShadow: '0 6px 20px rgba(255,107,157,0.4)' }}>
              {t('finalCta')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  )
}



