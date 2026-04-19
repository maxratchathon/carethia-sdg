'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Chip, Stack, Button, LinearProgress, Divider,
  Tab, Tabs, CircularProgress,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ReceiptIcon from '@mui/icons-material/Receipt'
import StarIcon from '@mui/icons-material/Star'
import AddIcon from '@mui/icons-material/Add'
import Layout from '@/components/Layout'
import { mockCaregivers, SERVICE_ICONS, SERVICE_LABELS, SERVICE_COLORS } from '@/lib/mockData'
import type { ServiceType } from '@/lib/mockData'
import { useAuth } from '@/lib/auth-context'
import { getTier, TIER_CONFIG } from '@/lib/store'
import type { StoredBooking } from '@/lib/store'

const STATUS_COLORS: Record<string, string> = { CONFIRMED: '#2ECC71', PENDING: '#FF8C00', COMPLETED: '#6C63FF', CANCELLED: '#E74C3C' }
const STATUS_BG: Record<string, string> = { CONFIRMED: '#F0FFF7', PENDING: '#FFF8F0', COMPLETED: '#F3F2FF', CANCELLED: '#FFF0F0' }

export default function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const tier = getTier(user?.points ?? 0)
  const nextTier = TIER_CONFIG.find(t => (user?.points ?? 0) < t.min) ?? null
  const pointsToNext = nextTier ? nextTier.min - (user?.points ?? 0) : 0
  const progressPct = nextTier
    ? Math.round(((user?.points ?? 0) - tier.min) / (nextTier.min - tier.min) * 100)
    : 100
  const [tab, setTab] = useState(0)
  const [bookings, setBookings] = useState<StoredBooking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const favorites = mockCaregivers.filter((c) => c.verified).slice(0, 4)

  useEffect(() => {
    if (user?.role === 'CAREGIVER') {
      router.replace('/caregiver-portal')
      return
    }

    const fetchBookings = async () => {
      const userId = user?.id ?? 1 // fall back to demo user (Siriporn) if not logged in
      try {
        const res = await fetch(`/api/bookings?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setBookings(data.bookings || [])
        }
      } catch {
        // silently fail — empty state
      } finally {
        setLoadingBookings(false)
      }
    }
    fetchBookings()
  }, [router, user])

  const upcomingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED')
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')
  const totalSpent = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalPrice, 0)

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)', borderBottom: '1px solid', borderColor: 'grey.100', py: 5 }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <Avatar src="https://i.pravatar.cc/80?img=9" sx={{ width: 64, height: 64, border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Box flexGrow={1}>
              <Typography variant="h5" fontWeight={800}>Welcome back, {user?.firstName ?? 'Siriporn'} 👋</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <Typography color="text.secondary" fontSize={14}>{user?.email ?? 'siriporn.w@email.com'}</Typography>
                <Chip
                  label={`${tier.icon} ${tier.name} Member`}
                  size="small"
                  sx={{ bgcolor: tier.bg, color: tier.color, fontWeight: 700, fontSize: 12, border: `1px solid ${tier.color}30` }}
                />
              </Box>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
              <Button
                variant="contained"
                component={Link}
                href="/caregivers"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B9D, #C06C84)',
                  borderRadius: 3,
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(255,107,157,0.35)',
                }}
              >
                Find Caregiver
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                component={Link}
                href="/family/requests/new"
                sx={{ borderRadius: 3, fontWeight: 600, borderColor: '#6C63FF', color: '#6C63FF' }}
              >
                New Care Request
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Stats */}
        <Grid container spacing={3} mb={5}>
          {[
            { label: 'Upcoming Bookings', value: upcomingBookings.length, icon: <CalendarTodayIcon />, color: '#FF6B9D', bg: '#FFF0F5' },
            { label: 'Total Spent', value: totalSpent > 0 ? `฿${totalSpent.toLocaleString()}` : '฿0', icon: <ReceiptIcon />, color: '#6C63FF', bg: '#F3F2FF' },
            { label: 'Saved Caregivers', value: favorites.length, icon: <FavoriteIcon />, color: '#E74C3C', bg: '#FFF5F5' },
            { label: 'Total Bookings', value: bookings.length, icon: <StarIcon />, color: '#FF8C00', bg: '#FFF8F0' },
          ].map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'grey.100' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography fontSize={12} color="text.secondary" fontWeight={600} letterSpacing={0.5} textTransform="uppercase">{stat.label}</Typography>
                    <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 18 } })}
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight={800} color={stat.color}>{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Bookings */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>My Bookings</Typography>
                <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 600, fontSize: 13 }, '& .Mui-selected': { color: '#FF6B9D' }, '& .MuiTabs-indicator': { bgcolor: '#FF6B9D' } }}>
                  <Tab label={`Upcoming (${upcomingBookings.length})`} />
                  <Tab label={`Past (${pastBookings.length})`} />
                </Tabs>

                {loadingBookings ? (
                  <Box textAlign="center" py={4}><CircularProgress sx={{ color: '#FF6B9D' }} /></Box>
                ) : (
                <Stack spacing={2}>
                  {(tab === 0 ? upcomingBookings : pastBookings).map((booking) => {
                    const svc = booking.serviceType as ServiceType
                    const svcColor = SERVICE_COLORS[svc] || '#FF6B9D'
                    return (
                      <Box key={booking.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: '#FAFAFA', border: '1px solid', borderColor: 'grey.100', flexWrap: 'wrap' }}>
                        <Avatar src={booking.caregiverAvatar} sx={{ width: 44, height: 44 }} />
                        <Box flexGrow={1} minWidth={140}>
                          <Typography fontWeight={700} fontSize={14}>{booking.caregiverName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {SERVICE_ICONS[svc] || '🔹'} {booking.serviceName}
                          </Typography>
                        </Box>
                        <Box textAlign="center" minWidth={90}>
                          <Typography fontSize={12} fontWeight={600}>{booking.date}</Typography>
                          <Typography variant="caption" color="text.secondary">{booking.time} · {booking.hours}h</Typography>
                        </Box>
                        <Chip label={booking.status} size="small" sx={{ bgcolor: STATUS_BG[booking.status] || '#F9F9F9', color: STATUS_COLORS[booking.status] || '#666', fontWeight: 700, fontSize: 11 }} />
                        <Typography fontWeight={700} fontSize={14} minWidth={50} textAlign="right">฿{booking.totalPrice.toLocaleString()}</Typography>
                        {tab === 1 && booking.status === 'COMPLETED' && (
                          <Button size="small" variant="outlined" sx={{ borderRadius: 2, borderColor: '#FF6B9D', color: '#FF6B9D', fontSize: 11 }}>Leave Review</Button>
                        )}
                      </Box>
                    )
                  })}
                  {(tab === 0 ? upcomingBookings : pastBookings).length === 0 && (
                    <Box textAlign="center" py={4}>
                      <Typography fontSize={40} mb={1}>{tab === 0 ? '📅' : '📋'}</Typography>
                      <Typography color="text.secondary" fontSize={14}>
                        {tab === 0 ? 'No upcoming bookings' : 'No past bookings'}
                      </Typography>
                      {tab === 0 && (
                        <Button component={Link} href="/caregivers" variant="contained" sx={{ mt: 2, background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', borderRadius: 3 }}>Find a Caregiver</Button>
                      )}
                    </Box>
                  )}
                </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Saved Caregivers */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={700}>Saved Caregivers</Typography>
                  <Button size="small" component={Link} href="/caregivers" sx={{ color: '#FF6B9D', fontSize: 12 }}>Browse</Button>
                </Box>
                <Stack spacing={2}>
                  {favorites.map((cg) => {
                    const color = SERVICE_COLORS[cg.service]
                    return (
                      <Box key={cg.id} component={Link} href={`/caregivers/${cg.id}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
                        <Avatar src={cg.avatar} sx={{ width: 38, height: 38 }} />
                        <Box flexGrow={1}>
                          <Typography fontWeight={700} fontSize={13}>{cg.firstName} {cg.lastName}</Typography>
                          <Typography variant="caption" color="text.secondary">{SERVICE_ICONS[cg.service]} {SERVICE_LABELS[cg.service]}</Typography>
                        </Box>
                        <Typography fontWeight={700} color={color} fontSize={13}>฿{cg.hourlyRate}/hr</Typography>
                      </Box>
                    )
                  })}
                </Stack>
              </CardContent>
            </Card>

            {/* CarePoints & Tier */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', mb: 3, border: `2px solid ${tier.color}30` }}>
              <CardContent sx={{ p: 3 }}>
                {/* Tier badge + points */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={32}>{tier.icon}</Typography>
                    <Box>
                      <Typography fontWeight={800} fontSize={16} color={tier.color}>{tier.name} Tier</Typography>
                      <Typography variant="caption" color="text.secondary">{tier.fee} platform fee</Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography fontWeight={800} fontSize={20} color={tier.color}>{(user?.points ?? 0).toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">CarePoints</Typography>
                  </Box>
                </Box>

                {/* Progress to next tier */}
                {nextTier ? (
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.75}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {pointsToNext.toLocaleString()} pts to {nextTier.icon} {nextTier.name}
                      </Typography>
                      <Typography variant="caption" fontWeight={700} color={tier.color}>{progressPct}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate" value={progressPct}
                      sx={{ height: 8, borderRadius: 4, bgcolor: `${tier.color}18`,
                        '& .MuiLinearProgress-bar': { bgcolor: tier.color, borderRadius: 4 } }}
                    />
                  </Box>
                ) : (
                  <Box mb={2} sx={{ bgcolor: `${tier.color}12`, borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                    <Typography fontSize={13} fontWeight={700} color={tier.color}>🏆 Max tier reached! Enjoy 5% fees forever.</Typography>
                  </Box>
                )}

                <Divider sx={{ mb: 2 }} />

                {/* How to earn more */}
                <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>Earn more points</Typography>
                <Stack spacing={1} mt={1}>
                  {[
                    { icon: '📅', action: 'Complete a booking', pts: '+50 pts' },
                    { icon: '⭐', action: 'Leave a review', pts: '+20 pts' },
                    { icon: '👥', action: 'Refer a friend', pts: '+100 pts' },
                  ].map(item => (
                    <Box key={item.action} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography fontSize={13} color="text.secondary">{item.icon} {item.action}</Typography>
                      <Chip label={item.pts} size="small"
                        sx={{ height: 18, fontSize: 11, fontWeight: 700, bgcolor: `${tier.color}12`, color: tier.color }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Care Progress */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography fontWeight={700} mb={2}>📈 Care Progress</Typography>
                <Stack spacing={2}>
                  {[
                    { label: 'Nida — Special Needs Care', date: 'Mar 7, 9:00–12:00', note: 'Worked on sensory play. Very calm day 💚', score: 95 },
                    { label: 'Suda — Special Needs Care', date: 'Mar 5, 8:00–12:00', note: 'Medication taken. Physiotherapy exercises completed.', score: 97 },
                  ].map((rep) => (
                    <Box key={rep.label} sx={{ p: 1.5, bgcolor: '#F9FAFB', borderRadius: 2, border: '1px solid', borderColor: 'grey.100' }}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography fontSize={13} fontWeight={700}>{rep.label}</Typography>
                        <Typography variant="caption" color="#2ECC71" fontWeight={700}>🛡️ {rep.score}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{rep.date}</Typography>
                      <Typography variant="caption" color="text.secondary" fontStyle="italic">{rep.note}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}


