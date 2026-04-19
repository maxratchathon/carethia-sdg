'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Chip, Stack, Button, Divider, Tab, Tabs,
  CircularProgress, Paper, Switch, FormControlLabel,
  Alert, Snackbar, Badge, Tooltip, LinearProgress,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Layout from '@/components/Layout'
import { useAuth } from '@/lib/auth-context'
import type { StoredBooking } from '@/lib/store'

interface ActiveFamilyRequest {
  id: number
  title: string
  serviceType: 'SPECIAL_NEEDS_TRAINER' | 'DAILY_LIVING_COMPANION'
  locationCity: string
  budgetMin: number
  budgetMax: number
  startDate: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'FULFILLED' | 'CANCELLED'
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: '#2ECC71', PENDING: '#FF8C00', COMPLETED: '#6C63FF', CANCELLED: '#E74C3C',
}
const STATUS_BG: Record<string, string> = {
  CONFIRMED: '#F0FFF7', PENDING: '#FFF8F0', COMPLETED: '#F3F2FF', CANCELLED: '#FFF0F0',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function daysBetween(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Past'
  if (days === 0) return 'Today!'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

export default function CaregiverPortal() {
  const { user } = useAuth()
  const caregiverId = user?.id ?? 2  // default to demo caregiver Nida

  const [bookings, setBookings] = useState<StoredBooking[]>([])
  const [activeRequests, setActiveRequests] = useState<ActiveFamilyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [isAvailable, setIsAvailable] = useState(true)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  })

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings?caregiverId=${caregiverId}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings || [])
      }
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }, [caregiverId])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  useEffect(() => {
    const serviceType = user?.id === 5 ? 'DAILY_LIVING_COMPANION' : 'SPECIAL_NEEDS_TRAINER'

    fetch(`/api/family/requests?serviceType=${serviceType}&status=ACTIVE`)
      .then((res) => res.json())
      .then((data) => setActiveRequests((data.requests || []).slice(0, 4)))
      .catch(() => setActiveRequests([]))
  }, [user?.id])

  const handleStatusChange = async (booking: StoredBooking, newStatus: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, currentStatus: booking.status }),
      })
      const data = await res.json()
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === booking.id ? data.booking : b))
        const msgs: Record<string, string> = {
          CONFIRMED: `✅ You accepted the booking from ${booking.customerName}`,
          CANCELLED: `❌ Booking from ${booking.customerName} declined`,
          COMPLETED: `🎉 Booking marked as complete!`,
        }
        setSnackbar({ open: true, message: msgs[newStatus], severity: newStatus === 'CANCELLED' ? 'error' : 'success' })
      } else {
        setSnackbar({ open: true, message: data.error || 'Update failed', severity: 'error' })
      }
    } catch {
      setSnackbar({ open: true, message: 'Network error', severity: 'error' })
    }
  }

  // Derived data
  const pending = bookings.filter(b => b.status === 'PENDING')
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED')
  const completed = bookings.filter(b => b.status === 'COMPLETED')
  const totalEarned = completed.reduce((s, b) => s + (b.totalPrice - b.platformFee), 0)
  const totalBookings = bookings.length
  const completionRate = totalBookings > 0 ? Math.round((completed.length / totalBookings) * 100) : 0
  const pendingEarnings = confirmed.reduce((s, b) => s + (b.totalPrice - b.platformFee), 0)

  const tabBookings = [pending, confirmed, completed, bookings.filter(b => b.status === 'CANCELLED')][tab]
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Nida Somchai'

  return (
    <Layout>
      {/* Hero Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #F0FFF4 0%, #E8F5E9 100%)', borderBottom: '1px solid', borderColor: 'grey.100', py: 5 }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <Box position="relative">
              <Avatar
                sx={{ width: 72, height: 72, bgcolor: '#2ECC71', fontSize: 28, fontWeight: 800, border: '3px solid white', boxShadow: '0 4px 16px rgba(46,204,113,0.3)' }}
              >
                {displayName[0]}
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: '50%', bgcolor: isAvailable ? '#2ECC71' : '#999', border: '2px solid white' }} />
            </Box>
            <Box flexGrow={1}>
              <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                <Typography variant="h5" fontWeight={800}>{displayName}</Typography>
                <Chip label="🛡️ Caregiver" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2ECC71', fontWeight: 700 }} />
                {pending.length > 0 && (
                  <Chip
                    icon={<NotificationsActiveIcon sx={{ fontSize: '14px !important' }} />}
                    label={`${pending.length} new request${pending.length > 1 ? 's' : ''}`}
                    size="small"
                    sx={{ bgcolor: '#FFF8F0', color: '#FF8C00', fontWeight: 700, animation: 'pulse 2s infinite' }}
                  />
                )}
              </Box>
              <Typography color="text.secondary" fontSize={14}>{user?.email ?? 'nida@example.com'}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <FormControlLabel
                control={
                  <Switch
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { bgcolor: isAvailable ? '#2ECC71' : '#999' }, '& .Mui-checked+.MuiSwitch-track': { bgcolor: '#2ECC7150 !important' } }}
                  />
                }
                label={
                  <Typography fontWeight={700} fontSize={14} color={isAvailable ? '#2ECC71' : 'text.secondary'}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </Typography>
                }
              />
              <Button
                component={Link}
                href={`/caregivers/${user?.id}`}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 3, borderColor: '#2ECC71', color: '#2ECC71', fontWeight: 600 }}
              >
                My Public Profile
              </Button>
              <Button
                component={Link}
                href="/caregiver-portal/edit-profile"
                variant="contained"
                size="small"
                sx={{
                  borderRadius: 3, fontWeight: 600,
                  background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Stats */}
        <Grid container spacing={3} mb={5}>
          {[
            { label: 'Pending Requests', value: pending.length, icon: '⏳', color: '#FF8C00', bg: '#FFF8F0', badge: pending.length > 0 },
            { label: 'Upcoming Sessions', value: confirmed.length, icon: '📅', color: '#2ECC71', bg: '#F0FFF7', badge: false },
            { label: 'Total Earned (85%)', value: `฿${totalEarned.toLocaleString()}`, icon: '💰', color: '#6C63FF', bg: '#F3F2FF', badge: false },
            { label: 'Pending Payout', value: `฿${pendingEarnings.toLocaleString()}`, icon: '🕐', color: '#FF6B9D', bg: '#FFF0F5', badge: false },
          ].map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.100', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography fontSize={11} fontWeight={700} textTransform="uppercase" letterSpacing={0.5} color="text.secondary">{stat.label}</Typography>
                    <Badge badgeContent={stat.badge ? pending.length : 0} color="error">
                      <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        {stat.icon}
                      </Box>
                    </Badge>
                  </Box>
                  <Typography variant="h4" fontWeight={800} color={stat.color}>{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Left: Booking Tabs */}
          <Grid item xs={12} lg={8}>

            {/* Pending requests — highlighted banner */}
            {pending.length > 0 && (
              <Alert
                severity="warning"
                icon={<NotificationsActiveIcon />}
                sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}
              >
                You have <strong>{pending.length} new booking request{pending.length > 1 ? 's' : ''}</strong> waiting for your response.
              </Alert>
            )}

            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>My Bookings</Typography>
                <Tabs
                  value={tab} onChange={(_e, v) => setTab(v)}
                  sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 600, fontSize: 13 }, '& .Mui-selected': { color: '#2ECC71' }, '& .MuiTabs-indicator': { bgcolor: '#2ECC71' } }}
                >
                  <Tab label={
                    <Badge badgeContent={pending.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16, right: -8 } }}>
                      Requests
                    </Badge>
                  } />
                  <Tab label={`Upcoming (${confirmed.length})`} />
                  <Tab label={`Completed (${completed.length})`} />
                  <Tab label="Cancelled" />
                </Tabs>

                {loading ? (
                  <Box textAlign="center" py={4}><CircularProgress sx={{ color: '#2ECC71' }} /></Box>
                ) : tabBookings.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <Typography fontSize={40} mb={1}>{['📭', '📅', '✅', '🚫'][tab]}</Typography>
                    <Typography color="text.secondary">{['No new booking requests', 'No upcoming sessions', 'No completed sessions yet', 'No cancelled bookings'][tab]}</Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {tabBookings.map((booking) => (
                      <Paper
                        key={booking.id}
                        variant="outlined"
                        sx={{
                          borderRadius: 3, p: 2.5,
                          borderColor: booking.status === 'PENDING' ? '#FF8C0040' : 'grey.200',
                          bgcolor: booking.status === 'PENDING' ? '#FFFBF0' : 'white',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Box display="flex" gap={2} flexWrap="wrap">
                          {/* Customer avatar */}
                          <Avatar sx={{ width: 46, height: 46, bgcolor: '#FF6B9D', fontWeight: 700, fontSize: 18 }}>
                            {booking.customerName[0]}
                          </Avatar>

                          {/* Booking details */}
                          <Box flexGrow={1} minWidth={160}>
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <Typography fontWeight={800} fontSize={15}>{booking.customerName}</Typography>
                              {booking.isEmergency && (
                                <Tooltip title="Emergency booking — +20% surcharge">
                                  <Chip icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />} label="Emergency" size="small" sx={{ bgcolor: '#FFF0F0', color: '#E74C3C', fontWeight: 700, fontSize: 11 }} />
                                </Tooltip>
                              )}
                              <Chip label={booking.status} size="small" sx={{ bgcolor: STATUS_BG[booking.status], color: STATUS_COLORS[booking.status], fontWeight: 700, fontSize: 11 }} />
                            </Box>

                            <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
                              {booking.serviceName} · {booking.hours}h session
                            </Typography>

                            <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                <Typography fontSize={13} fontWeight={600}>{formatDate(booking.date)}</Typography>
                                <Typography fontSize={12} color={booking.date >= new Date().toISOString().split('T')[0] ? '#2ECC71' : 'text.secondary'} fontWeight={600}>
                                  ({daysBetween(booking.date)})
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                <Typography fontSize={13}>{booking.time}</Typography>
                              </Box>
                            </Stack>

                            {booking.notes && (
                              <Box mt={1} sx={{ bgcolor: '#F9FAFB', border: '1px solid', borderColor: 'grey.200', borderRadius: 2, px: 1.5, py: 1 }}>
                                <Typography variant="caption" color="text.secondary">📝 {booking.notes}</Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Price + actions */}
                          <Box textAlign="right" minWidth={120}>
                            <Typography fontWeight={800} fontSize={16} color="#2ECC71">
                              ฿{(booking.totalPrice - booking.platformFee).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              you earn (85%)
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                              Total ฿{booking.totalPrice.toLocaleString()}
                            </Typography>

                            {booking.status === 'PENDING' && (
                              <Stack spacing={1}>
                                <Button
                                  size="small" variant="contained" fullWidth
                                  startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                                  onClick={() => handleStatusChange(booking, 'CONFIRMED')}
                                  sx={{ background: 'linear-gradient(135deg, #2ECC71, #27AE60)', borderRadius: 2.5, fontWeight: 700, py: 0.75, fontSize: 12 }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="small" variant="outlined" fullWidth
                                  startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                                  onClick={() => handleStatusChange(booking, 'CANCELLED')}
                                  sx={{ borderRadius: 2.5, borderColor: '#E74C3C', color: '#E74C3C', fontWeight: 700, py: 0.75, fontSize: 12 }}
                                >
                                  Decline
                                </Button>
                              </Stack>
                            )}

                            {booking.status === 'CONFIRMED' && (
                              <Button
                                size="small" variant="outlined" fullWidth
                                onClick={() => handleStatusChange(booking, 'COMPLETED')}
                                sx={{ borderRadius: 2.5, borderColor: '#6C63FF', color: '#6C63FF', fontWeight: 700, fontSize: 12, mt: 0.5 }}
                              >
                                Mark Complete
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Performance card */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                  <TrendingUpIcon sx={{ color: '#2ECC71' }} />
                  <Typography fontWeight={700}>Performance</Typography>
                </Box>
                <Stack spacing={2.5}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography fontSize={13} color="text.secondary">Completion rate</Typography>
                      <Typography fontSize={13} fontWeight={700} color="#2ECC71">{completionRate}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={completionRate} sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: '#2ECC71', borderRadius: 3 } }} />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography fontSize={13} color="text.secondary">Response rate</Typography>
                      <Typography fontSize={13} fontWeight={700} color="#FF8C00">100%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: '#FF8C00', borderRadius: 3 } }} />
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Box textAlign="center">
                      <Typography fontWeight={800} fontSize={20} color="#FF8C00">{totalBookings}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Jobs</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography fontWeight={800} fontSize={20} color="#6C63FF">{completed.length}</Typography>
                      <Typography variant="caption" color="text.secondary">Completed</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Box display="flex" alignItems="center" gap={0.25} justifyContent="center">
                        <Typography fontWeight={800} fontSize={20} color="#FFC107">4.9</Typography>
                        <StarIcon sx={{ color: '#FFC107', fontSize: 16, mt: '-2px' }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">Rating</Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Matching family requests */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={700}>Matching Family Requests</Typography>
                  <Chip size="small" label={`${activeRequests.length} active`} sx={{ bgcolor: '#F3F2FF', color: '#6C63FF', fontWeight: 700 }} />
                </Box>
                {activeRequests.length === 0 ? (
                  <Typography fontSize={13} color="text.secondary">No active requests currently match your service.</Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {activeRequests.map((request) => (
                      <Box key={request.id} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'grey.200', bgcolor: '#FAFAFA' }}>
                        <Typography fontSize={13} fontWeight={700}>{request.title}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                          {request.locationCity} · Starts {request.startDate}
                        </Typography>
                        <Typography variant="caption" color="#2ECC71" fontWeight={700}>
                          Budget ฿{request.budgetMin}-{request.budgetMax}/hr
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Earnings summary */}
            <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #2ECC71, #27AE60)', color: 'white', boxShadow: '0 6px 24px rgba(46,204,113,0.35)', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AttachMoneyIcon />
                  <Typography fontWeight={800} fontSize={16}>Earnings Summary</Typography>
                </Box>
                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={13} sx={{ opacity: 0.9 }}>Total earned (all time)</Typography>
                    <Typography fontWeight={800}>฿{totalEarned.toLocaleString()}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={13} sx={{ opacity: 0.9 }}>Pending payout</Typography>
                    <Typography fontWeight={700}>฿{pendingEarnings.toLocaleString()}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={12} sx={{ opacity: 0.8 }}>Platform keeps (15%)</Typography>
                    <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                      ฿{completed.reduce((s, b) => s + b.platformFee, 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      💡 You keep <strong>85%</strong> of every booking
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* This week schedule preview */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CalendarTodayIcon sx={{ color: '#2ECC71', fontSize: 20 }} />
                  <Typography fontWeight={700}>Upcoming Schedule</Typography>
                </Box>
                {confirmed.length === 0 ? (
                  <Box textAlign="center" py={2}>
                    <Typography fontSize={28} mb={1}>📭</Typography>
                    <Typography fontSize={13} color="text.secondary">No confirmed sessions yet</Typography>
                    <Typography variant="caption" color="text.secondary">Accept a request to see it here</Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    {confirmed.slice(0, 4).map(b => (
                      <Box key={b.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#F0FFF7', borderRadius: 2, border: '1px solid #2ECC7130' }}>
                        <Box sx={{ textAlign: 'center', minWidth: 38 }}>
                          <Typography fontSize={10} fontWeight={700} color="#2ECC71" textTransform="uppercase">
                            {new Date(b.date).toLocaleDateString('en-GB', { month: 'short' })}
                          </Typography>
                          <Typography fontSize={18} fontWeight={800} lineHeight={1} color="#2ECC71">
                            {new Date(b.date).getDate()}
                          </Typography>
                        </Box>
                        <Box flexGrow={1}>
                          <Typography fontSize={13} fontWeight={700}>{b.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{b.time} · {b.hours}h</Typography>
                        </Box>
                        {b.isEmergency && <WarningAmberIcon sx={{ fontSize: 16, color: '#E74C3C' }} />}
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer notice */}
      <Box sx={{ bgcolor: '#FAFAFA', borderTop: '1px solid', borderColor: 'grey.100', py: 3 }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" gap={1} justifyContent="center">
            <FavoriteIcon sx={{ fontSize: 14, color: '#FF6B9D' }} />
            <Typography variant="caption" color="text.secondary">
              Carethia takes a flat <strong>15% platform fee</strong>. You keep <strong>85%</strong> of all earnings. Payouts processed weekly.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  )
}

