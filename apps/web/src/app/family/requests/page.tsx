'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import Layout from '@/components/Layout'
import { useAuth } from '@/lib/auth-context'

interface CareRequest {
  id: number
  title: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'FULFILLED' | 'CANCELLED'
  serviceType: 'SPECIAL_NEEDS_TRAINER' | 'DAILY_LIVING_COMPANION'
  locationCity: string
  budgetMin: number
  budgetMax: number
  startDate: string
  familyContext: 'THAI_LOCAL' | 'MIGRANT_HERITAGE' | 'MIXED'
}

interface CareMatch {
  caregiverId: number
  caregiverName: string
  caregiverAvatar: string
  caregiverHourlyRate: number
  finalMatch: number
  requirementFit: number
  serviceFit: number
  culturalFit: number
  confidence: number
  badges: string[]
  reasons: string[]
  potentialGap: string
  aiRecommendationShort: string
  aiRecommendationDetailed?: string[]
}

const SERVICE_LABELS = {
  SPECIAL_NEEDS_TRAINER: 'Child Development Support',
  DAILY_LIVING_COMPANION: 'Daily Living & Companion Care',
}

const STATUS_COLORS: Record<CareRequest['status'], string> = {
  DRAFT: '#7F8C8D',
  ACTIVE: '#2ECC71',
  PAUSED: '#FF8C00',
  FULFILLED: '#6C63FF',
  CANCELLED: '#E74C3C',
}

const FAMILY_REQUEST_DRAFT_KEY = 'carethia_family_request_draft_v1'

export default function FamilyRequestsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [requests, setRequests] = useState<CareRequest[]>([])
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null)
  const [matches, setMatches] = useState<CareMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [matchLoading, setMatchLoading] = useState(false)
  const [bookingLoadingId, setBookingLoadingId] = useState<number | null>(null)
  const [bookingError, setBookingError] = useState('')

  const customerId = user?.id ?? 1

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/family/requests?customerId=${customerId}`)
        const data = await res.json()
        const loaded = data.requests || []
        setRequests(loaded)
        if (loaded.length > 0) {
          setSelectedRequestId(loaded[0].id)
        }
      } finally {
        setLoading(false)
      }
    }
    loadRequests()
  }, [customerId])

  useEffect(() => {
      const FAMILY_REQUEST_DRAFT_KEY = 'carethia_family_request_draft_v1'

    const loadMatches = async () => {
      if (!selectedRequestId) return
      setMatchLoading(true)
      try {
        const res = await fetch(`/api/family/requests/${selectedRequestId}/matches`)
        const data = await res.json()
        setMatches(data.matches || [])
      } finally {
        setMatchLoading(false)
      }
    }
    loadMatches()
  }, [selectedRequestId])

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId) || null,
    [requests, selectedRequestId],
  )

  const handleSelectCaregiver = async (match: CareMatch) => {
    if (!selectedRequest) return

    setBookingError('')
    setBookingLoadingId(match.caregiverId)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id ?? 1,
          customerName: user ? `${user.firstName} ${user.lastName}` : 'Siriporn Wattana',
          caregiverId: match.caregiverId,
          caregiverName: match.caregiverName,
          caregiverAvatar: match.caregiverAvatar,
          serviceType: selectedRequest.serviceType,
          serviceName: SERVICE_LABELS[selectedRequest.serviceType],
          date: selectedRequest.startDate,
          time: '09:00 AM',
          hours: 2,
          hourlyRate: match.caregiverHourlyRate,
          includeInsurance: true,
          isEmergency: false,
          notes: `Booked from Family Request #${selectedRequest.id}`,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setBookingError(data?.error || 'Unable to select caregiver right now.')
        return
      }

      try {
        window.sessionStorage.removeItem(FAMILY_REQUEST_DRAFT_KEY)
      } catch {
        // ignore storage access issues
      }

      router.push('/dashboard')
    } catch {
      setBookingError('Network error while selecting caregiver. Please try again.')
    } finally {
      setBookingLoadingId(null)
    }
  }

  return (
    <Layout>
      <Box sx={{ background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)', py: 4, borderBottom: '1px solid', borderColor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Family Care Requests</Typography>
              <Typography color="text.secondary">Optional assisted matching path. For direct booking, start from Find Caregivers.</Typography>
            </Box>
            <Button component={Link} href="/family/requests/new" variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', fontWeight: 700 }}>
              New Request
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Box textAlign="center" py={8}><CircularProgress sx={{ color: '#FF6B9D' }} /></Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                {requests.map((request) => {
                  const selected = request.id === selectedRequestId
                  return (
                    <Card
                      key={request.id}
                      onClick={() => setSelectedRequestId(request.id)}
                      sx={{
                        borderRadius: 3,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: selected ? '#FF6B9D' : 'grey.200',
                        boxShadow: selected ? '0 6px 24px rgba(255,107,157,0.18)' : 'none',
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography fontWeight={700} mb={0.5}>{request.title}</Typography>
                        <Typography fontSize={12} color="text.secondary" mb={1}>
                          {SERVICE_LABELS[request.serviceType]} · {request.locationCity}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            size="small"
                            label={request.status}
                            sx={{
                              bgcolor: `${STATUS_COLORS[request.status]}14`,
                              color: STATUS_COLORS[request.status],
                              fontWeight: 700,
                            }}
                          />
                          <Chip size="small" label={`฿${request.budgetMin}-${request.budgetMax}/hr`} />
                        </Stack>
                      </CardContent>
                    </Card>
                  )
                })}
                {requests.length === 0 && (
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography fontWeight={700}>No care requests yet</Typography>
                      <Typography color="text.secondary" fontSize={13} mb={2}>Create your first request to start matching.</Typography>
                      <Button component={Link} href="/family/requests/new" variant="outlined" sx={{ borderRadius: 3, color: '#FF6B9D', borderColor: '#FF6B9D' }}>
                        Create Request
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, minHeight: 420 }}>
                <CardContent sx={{ p: 3 }}>
                  {selectedRequest ? (
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
                        <Typography variant="h6" fontWeight={700}>{selectedRequest.title}</Typography>
                        <Chip label={`Context: ${selectedRequest.familyContext.replace('_', ' ')}`} size="small" />
                      </Box>
                      <Typography color="text.secondary" fontSize={13} mb={2}>
                        Start {selectedRequest.startDate} · {SERVICE_LABELS[selectedRequest.serviceType]} · Budget ฿{selectedRequest.budgetMin}-{selectedRequest.budgetMax}/hr
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      {!!bookingError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                          {bookingError}
                        </Alert>
                      )}

                      <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                          component={Link}
                          href={`/caregivers?service=${selectedRequest.serviceType}`}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: 2.5, fontWeight: 700, color: '#6C63FF', borderColor: '#6C63FF' }}
                        >
                          Find More Caregivers
                        </Button>
                      </Box>

                      {matchLoading ? (
                        <Box textAlign="center" py={5}><CircularProgress size={24} /></Box>
                      ) : (
                        <Stack spacing={2}>
                          {matches.map((match) => (
                            <Box key={match.caregiverId} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'grey.200', bgcolor: '#FAFAFA' }}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={1}>
                                <Typography fontWeight={700}>{match.caregiverName}</Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Chip label={`฿${match.caregiverHourlyRate}/hr`} size="small" sx={{ bgcolor: '#FFF8F0', color: '#FF8C00', fontWeight: 700 }} />
                                  <Chip label={`${match.finalMatch}% Match`} sx={{ bgcolor: '#F0FFF7', color: '#2ECC71', fontWeight: 800 }} />
                                </Box>
                              </Box>
                              <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                                {match.badges.map((badge) => (
                                  <Chip key={badge} label={badge} size="small" />
                                ))}
                              </Stack>
                              <Typography fontSize={13} color="text.secondary" mb={1}>
                                {match.aiRecommendationShort}
                              </Typography>

                              <Box sx={{ mt: 1.25, mb: 0.75 }}>
                                <Grid container spacing={1.25}>
                                  {[
                                    { label: 'Requirement Fit', value: match.requirementFit, color: '#FF8C00' },
                                    { label: 'Service Fit', value: match.serviceFit, color: '#6C63FF' },
                                    { label: 'Cultural Fit', value: match.culturalFit, color: '#2ECC71' },
                                    { label: 'Confidence', value: match.confidence, color: '#1DA1F2' },
                                  ].map((metric) => (
                                    <Grid item xs={12} sm={6} key={metric.label}>
                                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.35}>
                                        <Typography fontSize={11.5} color="text.secondary">{metric.label}</Typography>
                                        <Typography fontSize={11.5} fontWeight={700}>{metric.value}%</Typography>
                                      </Box>
                                      <LinearProgress
                                        variant="determinate"
                                        value={metric.value}
                                        sx={{
                                          height: 6,
                                          borderRadius: 3,
                                          bgcolor: 'grey.200',
                                          '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            bgcolor: metric.color,
                                          },
                                        }}
                                      />
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>

                              <Box sx={{ mt: 1.25 }}>
                                <Typography fontSize={12} fontWeight={700} mb={0.5}>Why this matched</Typography>
                                <Stack spacing={0.5}>
                                  {match.reasons.map((reason) => (
                                    <Box key={reason} display="flex" alignItems="flex-start" gap={0.75}>
                                      <AutoAwesomeIcon sx={{ color: '#6C63FF', fontSize: 14, mt: '2px' }} />
                                      <Typography fontSize={12} color="text.secondary">{reason}</Typography>
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>

                              {!!match.aiRecommendationDetailed?.length && (
                                <Box sx={{ mt: 1.25, p: 1.25, borderRadius: 2, bgcolor: '#F7F6FF', border: '1px solid', borderColor: '#E5E2FF' }}>
                                  <Typography fontSize={12} fontWeight={700} mb={0.5}>Recommendation notes</Typography>
                                  <Stack spacing={0.5}>
                                    {match.aiRecommendationDetailed.slice(0, 3).map((detail) => (
                                      <Typography key={detail} fontSize={11.5} color="text.secondary">• {detail}</Typography>
                                    ))}
                                  </Stack>
                                </Box>
                              )}

                              <Box
                                sx={{
                                  mt: 1.25,
                                  p: 1.25,
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: match.potentialGap.startsWith('No major gap') ? '#CFEED9' : '#FFE1B8',
                                  bgcolor: match.potentialGap.startsWith('No major gap') ? '#F0FFF7' : '#FFF8F0',
                                }}
                              >
                                <Typography fontSize={12} fontWeight={700} mb={0.35}>
                                  {match.potentialGap.startsWith('No major gap') ? 'Gap check' : 'Potential gap'}
                                </Typography>
                                <Typography fontSize={11.5} color="text.secondary">{match.potentialGap}</Typography>
                              </Box>

                              <Box display="flex" justifyContent="flex-end" mt={1.5}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleSelectCaregiver(match)}
                                  disabled={bookingLoadingId === match.caregiverId}
                                  sx={{
                                    borderRadius: 2.5,
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #FF6B9D, #C06C84)',
                                  }}
                                >
                                  {bookingLoadingId === match.caregiverId ? 'Selecting...' : 'Select Caregiver'}
                                </Button>
                              </Box>
                            </Box>
                          ))}
                          {matches.length === 0 && (
                            <Typography color="text.secondary">No eligible caregivers found for this request yet.</Typography>
                          )}
                        </Stack>
                      )}
                    </>
                  ) : (
                    <Typography color="text.secondary">Select a request to view recommendations.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  )
}
