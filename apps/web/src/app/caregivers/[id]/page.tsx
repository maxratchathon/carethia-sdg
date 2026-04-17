'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box, Container, Typography, Grid, Avatar, Chip, Button,
  Stack, Card, CardContent, Rating, Divider, TextField,
  Paper, LinearProgress, CircularProgress, Skeleton,
} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import LockIcon from '@mui/icons-material/Lock'
import Layout from '@/components/Layout'
import { mockCaregivers, mockReviews, SERVICE_LABELS, SERVICE_ICONS, FIXED_SERVICE_FEE, INSURANCE_FEE } from '@/lib/mockData'
import type { MockCaregiver } from '@/lib/mockData'
import { useAuth } from '@/lib/auth-context'
import type { RelationshipScore } from '@/lib/store'

interface Props {
  params: { id: string }
}

const PLATFORM_FEE_RATE = 0.15
const TAX_RATE = 0.07
const PROCESSING_FEE = 39

export default function CaregiverDetail({ params }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const numId = Number(params.id)

  // Try mock data first; if not found and ID>=100, fetch from API
  const mockMatch = mockCaregivers.find((c) => c.id === numId)
  const [caregiver, setCaregiver] = useState<MockCaregiver | null>(mockMatch ?? null)
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'done' | 'notfound'>(
    mockMatch ? 'done' : numId >= 100 ? 'loading' : 'notfound',
  )

  useEffect(() => {
    if (fetchState !== 'loading') return
    fetch(`/api/caregivers/${numId}`)
      .then(r => r.json())
      .then(data => {
        if (data.caregiver) {
          setCaregiver(data.caregiver as MockCaregiver)
          setFetchState('done')
        } else {
          setFetchState('notfound')
        }
      })
      .catch(() => setFetchState('notfound'))
  }, [numId, fetchState])

  const reviews = mockReviews[numId] || []
  const [showBooking, setShowBooking] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingHours, setBookingHours] = useState(2)
  const [bookingTime, setBookingTime] = useState('09:00 AM')
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [booked, setBooked] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingRef, setBookingRef] = useState<number | null>(null)
  const [bookingError, setBookingError] = useState('')
  const [relScore, setRelScore] = useState<RelationshipScore | null>(null)

  const baseFare = (caregiver?.hourlyRate ?? 0) * bookingHours
  const platformFee = Math.round(baseFare * PLATFORM_FEE_RATE)
  const taxFee = Math.round(baseFare * TAX_RATE)
  const taxesAndFees = platformFee + taxFee
  const processingFee = 0
  const insuranceFee = includeInsurance ? INSURANCE_FEE : 0
  const totalPayable = baseFare + taxesAndFees + processingFee + insuranceFee

  useEffect(() => {
    if (!user || !caregiver) return
    fetch(`/api/relationship?customerId=${user.id}&caregiverId=${caregiver.id}`)
      .then(r => r.json())
      .then(data => { if (data.score) setRelScore(data.score) })
      .catch(() => {})
  }, [user, caregiver])

  if (fetchState === 'loading') {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={180} sx={{ borderRadius: 4, mb: 3 }} />
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4, mb: 3 }} />
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 4 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    )
  }

  if (fetchState === 'notfound' || !caregiver) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
          <Typography fontSize={64}>🔍</Typography>
          <Typography variant="h5" fontWeight={700} mt={2} mb={1}>Caregiver not found</Typography>
          <Button component={Link} href="/caregivers" startIcon={<ArrowBackIcon />} sx={{ color: '#FF6B9D' }}>Back to Caregivers</Button>
        </Container>
      </Layout>
    )
  }

  const color = '#FF6B9D'
  const svcLabel = SERVICE_LABELS[caregiver.service as keyof typeof SERVICE_LABELS] ?? caregiver.service
  const svcIcon = SERVICE_ICONS[caregiver.service as keyof typeof SERVICE_ICONS] ?? '🛡️'
  const isNewProfile = (caregiver as MockCaregiver & { isNew?: boolean }).isNew === true
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({ star, pct: star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1 }))

  const handleConfirmBooking = async () => {
    if (!user) {
      router.push(`/login`)
      return
    }
    setBookingError('')
    setBookingLoading(true)
    try {
      const totalPrice = baseFare + taxesAndFees + insuranceFee
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          customerName: `${user.firstName} ${user.lastName}`,
          caregiverId: caregiver.id,
          caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
          caregiverAvatar: caregiver.avatar,
          serviceType: caregiver.service,
          serviceName: SERVICE_LABELS[caregiver.service],
          date: bookingDate,
          time: bookingTime,
          hours: bookingHours,
          hourlyRate: caregiver.hourlyRate,
          totalPrice,
          includeInsurance,
          platformFee,
          taxFee,
          processingFee,
          isEmergency: false,
          notes: '',
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setBookingRef(data.booking.id)
        setBooked(true)
      } else {
        setBookingError(data.error || 'Booking failed. Please try again.')
      }
    } catch {
      setBookingError('Network error. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: '#FAFAFA', borderBottom: '1px solid', borderColor: 'grey.100', py: 1.5 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={Link} href="/caregivers" startIcon={<ArrowBackIcon />} size="small" sx={{ color: 'text.secondary', fontWeight: 500 }}>Back</Button>
            <Typography color="text.secondary" fontSize={13}>/</Typography>
            <Typography fontSize={13} color="text.secondary">Caregivers</Typography>
            <Typography color="text.secondary" fontSize={13}>/</Typography>
            <Typography fontSize={13} fontWeight={600}>{caregiver.firstName} {caregiver.lastName}</Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          {/* Left: Profile */}
          <Grid item xs={12} md={8}>
            {/* Profile Header */}
            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', mb: 3 }}>
              <Box sx={{ height: 6, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" gap={3} flexWrap="wrap">
                  <Box position="relative">
                    <Avatar src={caregiver.avatar} sx={{ width: 100, height: 100, border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
                    <Box sx={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: '50%', bgcolor: caregiver.isAvailable ? '#2ECC71' : '#999', border: '2px solid white' }} />
                  </Box>
                  <Box flexGrow={1}>
                    <Box display="flex" alignItems="flex-start" gap={1} flexWrap="wrap">
                      <Typography variant="h5" fontWeight={800}>{caregiver.firstName} {caregiver.lastName}</Typography>
                      {caregiver.verified && <VerifiedIcon sx={{ color: '#1DA1F2', mt: 0.5 }} />}
                      {isNewProfile && <Chip label="🆕 New Profile" size="small" sx={{ bgcolor: '#F0FFF7', color: '#2ECC71', fontWeight: 700, fontSize: 11 }} />}
                    </Box>
                    <Chip label={`${svcIcon} ${svcLabel}`} size="small" sx={{ bgcolor: `${color}20`, color, fontWeight: 600, mt: 0.5, mb: 1 }} />
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      {caregiver.rating > 0 ? (
                        <>
                          <Rating value={caregiver.rating} readOnly precision={0.5} size="small" />
                          <Typography fontWeight={700} fontSize={14}>{caregiver.rating}</Typography>
                          <Typography color="text.secondary" fontSize={13}>({caregiver.reviewCount} reviews)</Typography>
                        </>
                      ) : (
                        <Typography fontSize={13} color="text.secondary">⭐ No reviews yet — be the first!</Typography>
                      )}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      {caregiver.careTrustScore > 0 ? (
                        <Box sx={{ bgcolor: '#F0FFF7', border: '1px solid #2ECC7150', borderRadius: 2, px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography fontSize={14}>🛡️</Typography>
                          <Typography fontSize={13} fontWeight={700} color="#2ECC71">CareTrust {caregiver.careTrustScore}/100</Typography>
                        </Box>
                      ) : (
                        <Chip label="🕐 Verification Pending" size="small" sx={{ bgcolor: '#FFF8F0', color: '#FF8C00', fontSize: 11, fontWeight: 600 }} />
                      )}
                      {caregiver.verified && <Chip label="✓ Verified" size="small" sx={{ bgcolor: '#F3F2FF', color: '#6C63FF', fontSize: 11, fontWeight: 600 }} />}
                    </Box>
                    <Stack direction="row" spacing={2} mt={1.5} flexWrap="wrap">
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationOnIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                        <Typography fontSize={13} color="text.secondary">{caregiver.city}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <WorkHistoryIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                        <Typography fontSize={13} color="text.secondary">{caregiver.experience} yrs experience</Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h4" fontWeight={800} color={color}>฿{caregiver.hourlyRate}</Typography>
                    <Typography variant="caption" color="text.secondary">per hour</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* About */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.05)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>About</Typography>
                <Typography color="text.secondary" lineHeight={1.8}>{caregiver.bio}</Typography>
              </CardContent>
            </Card>

            {/* Languages + Certs */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.05)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={700} mb={1.5}>Languages</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {caregiver.languages.map((lang) => <Chip key={lang} label={lang} size="small" sx={{ bgcolor: '#F3F2FF', color: '#6C63FF' }} />)}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={700} mb={1.5}>Certifications</Typography>
                    <Stack spacing={1}>
                      {caregiver.certifications.map((cert) => (
                        <Box key={cert} display="flex" alignItems="center" gap={0.5}>
                          <CheckCircleIcon sx={{ fontSize: 15, color: '#2ECC71' }} />
                          <Typography fontSize={13}>{cert}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={3}>Reviews</Typography>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={4} textAlign="center">
                    <Typography variant="h2" fontWeight={800} color={color}>{caregiver.rating}</Typography>
                    <Rating value={caregiver.rating} readOnly precision={0.5} />
                    <Typography variant="caption" color="text.secondary">{caregiver.reviewCount} reviews</Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    {ratingBreakdown.map(({ star, pct }) => (
                      <Box key={star} display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography fontSize={12} width={8}>{star}</Typography>
                        <StarIcon sx={{ fontSize: 14, color: '#FFC107' }} />
                        <LinearProgress variant="determinate" value={pct} sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: '#FFC107', borderRadius: 3 } }} />
                        <Typography fontSize={12} color="text.secondary" width={28}>{pct}%</Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 3 }} />
                {reviews.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" py={3}>No reviews yet — be the first!</Typography>
                ) : (
                  <Stack spacing={3}>
                    {reviews.map((review) => (
                      <Box key={review.id} display="flex" gap={2}>
                        <Avatar src={review.avatar} sx={{ width: 40, height: 40 }} />
                        <Box flexGrow={1}>
                          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                            <Typography fontWeight={700} fontSize={14}>{review.author}</Typography>
                            <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                          </Box>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" mt={0.5} lineHeight={1.7}>{review.comment}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Booking Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', p: 3, position: 'sticky', top: 90, border: '1px solid', borderColor: 'grey.100' }}>
              {booked ? (
                <Box textAlign="center" py={3}>
                  <Typography fontSize={56} mb={2}>🎉</Typography>
                  <Typography variant="h6" fontWeight={800} mb={1}>Booking Confirmed!</Typography>
                  <Typography color="text.secondary" fontSize={13} mb={1}>{caregiver.firstName} will be there on {bookingDate}.</Typography>
                  {bookingRef && <Typography variant="caption" color="text.secondary" display="block" mb={2}>Booking Ref: <strong>#{bookingRef}</strong></Typography>}
                  <Button variant="outlined" fullWidth component={Link} href="/dashboard" sx={{ borderRadius: 3, borderColor: '#FF6B9D', color: '#FF6B9D' }}>View Dashboard</Button>
                </Box>
              ) : (
                <>
                  <Typography variant="h6" fontWeight={800} mb={0.5}>Book {caregiver.firstName}</Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <Typography variant="h4" fontWeight={800} color={color}>฿{caregiver.hourlyRate}</Typography>
                    <Typography color="text.secondary" fontSize={13}>/hr</Typography>
                  </Box>

                  {showBooking ? (
                    <>
                      <TextField fullWidth type="date" label="Select Date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                      <Box mb={2}>
                        <Typography fontSize={13} fontWeight={600} mb={1}>Hours needed: {bookingHours}h</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {[1, 2, 3, 4, 6, 8].map((h) => (
                            <Chip key={h} label={`${h}h`} size="small" onClick={() => setBookingHours(h)} variant="outlined" sx={{ cursor: 'pointer', bgcolor: bookingHours === h ? `${color}20` : undefined, color: bookingHours === h ? color : undefined, borderColor: bookingHours === h ? color : undefined, fontWeight: bookingHours === h ? 700 : 400 }} />
                          ))}
                        </Stack>
                      </Box>

                      <Box sx={{ mb: 2, p: 2, bgcolor: '#FAFAFA', borderRadius: 2.5, border: '1px solid', borderColor: 'grey.200' }}>
                        <Typography fontWeight={700} fontSize={14} mb={1}>Price breakdown</Typography>
                        <Box display="flex" justifyContent="space-between" mb={0.75}>
                          <Typography fontSize={13} color="text.secondary">Base fare (฿{caregiver.hourlyRate} x {bookingHours}h)</Typography>
                          <Typography fontSize={13} fontWeight={600}>฿{baseFare}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={0.75}>
                          <Typography fontSize={13} color="text.secondary">Taxes and fees</Typography>
                          <Typography fontSize={13} fontWeight={600}>฿{taxesAndFees}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={0.75}>
                          <Typography fontSize={13} color="text.secondary">Processing cost</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={12.5} color="text.secondary" sx={{ textDecoration: 'line-through' }}>฿{PROCESSING_FEE}</Typography>
                            <Typography fontSize={13} fontWeight={700} color="#2ECC71">฿{processingFee}</Typography>
                          </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography fontSize={13} color="text.secondary">Insurance</Typography>
                          <Typography fontSize={13} fontWeight={600} color="#4ECDC4">฿{insuranceFee}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2, p: 2, bgcolor: '#FFF8F0', borderRadius: 2.5, border: '1px solid #FFD580' }}>
                        <Typography fontWeight={700} fontSize={14} mb={1}>Would you like to include insurance?</Typography>
                        <Typography fontSize={12} color="text.secondary" mb={1.5}>Protection for booking changes and unexpected incidents during care sessions.</Typography>

                        <Stack spacing={1}>
                          <Box
                            role="button"
                            onClick={() => setIncludeInsurance(true)}
                            sx={{
                              p: 1.25,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: includeInsurance ? '#2ECC71' : 'grey.300',
                              bgcolor: includeInsurance ? '#F0FFF7' : 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography fontSize={12.5} fontWeight={700}>Yes, include insurance</Typography>
                              <Typography fontSize={12.5} fontWeight={700} color="#2ECC71">฿{INSURANCE_FEE}</Typography>
                            </Box>
                            <Stack spacing={0.5} mt={1.25}>
                              {[
                                'Last-minute care session cancellation support',
                                'Accidental damage protection during care sessions',
                                'Delay and disruption support for confirmed bookings',
                                'Personal accident and emergency medical support',
                              ].map((benefit) => (
                                <Box key={benefit} display="flex" alignItems="flex-start" gap={0.75}>
                                  <Typography fontSize={11.5} color="#2ECC71" mt={0.05}>✓</Typography>
                                  <Typography fontSize={11.5} color="text.secondary">{benefit}</Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>

                          <Box
                            role="button"
                            onClick={() => setIncludeInsurance(false)}
                            sx={{
                              p: 1.25,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: !includeInsurance ? '#FF6B9D' : 'grey.300',
                              bgcolor: !includeInsurance ? '#FFF0F5' : 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography fontSize={12.5} fontWeight={700}>No, continue without insurance</Typography>
                              <Typography fontSize={12.5} fontWeight={700}>฿0</Typography>
                            </Box>
                          </Box>
                        </Stack>

                        <Typography fontSize={10.5} color="text.secondary" mt={1.25}>
                          Coverage is subject to policy terms and conditions.
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" justifyContent="space-between" mb={3}>
                        <Typography fontWeight={700}>Total</Typography>
                        <Typography fontWeight={800} color={color} fontSize={18}>฿{totalPayable}</Typography>
                      </Box>
                      {bookingError && <Typography color="error" fontSize={12} mb={1}>{bookingError}</Typography>}
                      <Button variant="contained" fullWidth size="large" disabled={!bookingDate || bookingLoading} onClick={handleConfirmBooking} sx={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, borderRadius: 3, fontWeight: 700, py: 1.5 }}>
                        {bookingLoading ? <CircularProgress size={22} color="inherit" /> : 'Confirm Booking'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Stack spacing={2} mb={3}>
                        {[
                          { icon: '✅', label: `${caregiver.experience} years experience` },
                          { icon: '🔒', label: 'Background verified' },
                          { icon: '⭐', label: `${caregiver.rating} star rated (${caregiver.reviewCount} reviews)` },
                          { icon: caregiver.isAvailable ? '🟢' : '🔴', label: caregiver.isAvailable ? 'Available now' : 'Check availability' },
                        ].map((item) => (
                          <Box key={item.label} display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={16}>{item.icon}</Typography>
                            <Typography fontSize={13} color="text.secondary">{item.label}</Typography>
                          </Box>
                        ))}
                      </Stack>
                      {!user && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#FFF0F5', border: '1px solid #FF6B9D30', borderRadius: 2, textAlign: 'center' }}>
                          <LockIcon sx={{ fontSize: 18, color: '#FF6B9D', mb: 0.5 }} />
                          <Typography fontSize={13} fontWeight={600} color="#FF6B9D">Sign in to book</Typography>
                          <Typography variant="caption" color="text.secondary">You need an account to make a booking</Typography>
                        </Box>
                      )}
                      {user && relScore && (
                        <Box sx={{ mb: 2, p: 1.75, bgcolor: `${relScore.color}12`, border: `1px solid ${relScore.color}30`, borderRadius: 2.5 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.75}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography fontSize={20} lineHeight={1}>{relScore.icon}</Typography>
                              <Box>
                                <Typography fontSize={12} fontWeight={700} color={relScore.color}>Relationship Score</Typography>
                                <Typography fontSize={11} color="text.secondary">
                                  {relScore.bookingCount === 0
                                    ? 'First booking together'
                                    : `${relScore.bookingCount} session${relScore.bookingCount > 1 ? 's' : ''} completed`}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip label={relScore.level} size="small" sx={{ bgcolor: `${relScore.color}20`, color: relScore.color, fontWeight: 700, fontSize: 11, height: 20 }} />
                          </Box>
                          <LinearProgress variant="determinate" value={relScore.score} sx={{ height: 4, borderRadius: 3, bgcolor: `${relScore.color}20`, '& .MuiLinearProgress-bar': { bgcolor: relScore.color, borderRadius: 3 } }} />
                        </Box>
                      )}
                      <Button variant="contained" fullWidth size="large" onClick={() => user ? setShowBooking(true) : router.push('/login')} sx={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, borderRadius: 3, fontWeight: 700, py: 1.5, mb: 1.5, boxShadow: `0 6px 20px ${color}50` }}>
                        <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />{user ? 'Book Now' : 'Sign In to Book'}
                      </Button>
                      <Button variant="outlined" fullWidth sx={{ borderRadius: 3, borderColor: color, color }}>Send Message</Button>
                      <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#FFF8F0', border: '1px solid #FF8C0030', borderRadius: 2, textAlign: 'center' }}>
                        <Typography fontSize={12} fontWeight={700} color="#FF8C00">⚡ Need care today?</Typography>
                        <Typography variant="caption" color="text.secondary">Emergency same-day booking available — extra 20% fee applies</Typography>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}
