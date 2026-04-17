'use client'
import React, { useState, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Box, Container, Typography, Grid, Chip, Stack, TextField,
  InputAdornment, ToggleButtonGroup, ToggleButton, Slider,
  FormControlLabel, Switch, Divider, Button, Skeleton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Layout from '@/components/Layout'
import CaregiverCard from '@/components/CaregiverCard'
import { mockCaregivers, SERVICE_ICONS, SERVICE_LABELS } from '@/lib/mockData'
import type { ServiceType } from '@/lib/mockData'

const ALL_SERVICES: ServiceType[] = ['SPECIAL_NEEDS_TRAINER']
const ALL_CITIES = ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya']

function CaregiversContent() {
  const searchParams = useSearchParams()
  const initialService = (searchParams.get('service') as ServiceType) || 'ALL'

  const [search, setSearch] = useState('')
  const [service, setService] = useState<ServiceType | 'ALL'>(initialService as ServiceType | 'ALL')
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [shift, setShift] = useState<'ALL' | 'DAY' | 'NIGHT'>('ALL')
  const [city, setCity] = useState<string>('ALL')
  const [dynamicCaregivers, setDynamicCaregivers] = useState<typeof mockCaregivers>([]) 
  const [loadingProfiles, setLoadingProfiles] = useState(true)

  useEffect(() => {
    fetch('/api/caregivers')
      .then(r => r.json())
      .then(data => {
        if (data.caregivers) setDynamicCaregivers(data.caregivers)
      })
      .catch(() => {})
      .finally(() => setLoadingProfiles(false))
  }, [])

  // Merge mock + registered, avoid ID collisions
  const allCaregivers = useMemo(() => {
    const mockIds = new Set(mockCaregivers.map(c => c.id))
    const fresh = dynamicCaregivers.filter(c => !mockIds.has(c.id))
    return [...mockCaregivers, ...fresh]
  }, [dynamicCaregivers])

  const filtered = useMemo(() => {
    return allCaregivers.filter((c) => {
      const q = search.toLowerCase()
      const matchSearch = !q || `${c.firstName} ${c.lastName} ${c.bio}`.toLowerCase().includes(q)
      const matchService = service === 'ALL' || c.service === service
      const matchPrice = c.hourlyRate >= priceRange[0] && c.hourlyRate <= priceRange[1]
      const matchVerified = !verifiedOnly || c.verified
      const matchAvail = !availableOnly || c.isAvailable
      const matchShift = shift === 'ALL' || c.shift === shift || c.shift === 'BOTH'
      const matchCity = city === 'ALL' || c.city === city
      return matchSearch && matchService && matchPrice && matchVerified && matchAvail && matchCity && matchShift && matchCity
    })
  }, [search, service, priceRange, verifiedOnly, availableOnly, shift, city, allCaregivers])

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ bgcolor: '#FAFAFA', borderBottom: '1px solid', borderColor: 'grey.100', py: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} mb={0.5}>Find Your Perfect Caregiver</Typography>
          <Typography color="text.secondary">
            {allCaregivers.length} verified professionals available
            {dynamicCaregivers.length > 0 && (
              <Chip label={`+${dynamicCaregivers.length} new`} size="small" sx={{ ml: 1, bgcolor: '#F0FFF7', color: '#2ECC71', fontWeight: 700, fontSize: 11 }} />
            )}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          {/* Sidebar Filters */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 90 }}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <TuneIcon sx={{ color: '#FF6B9D' }} />
                <Typography fontWeight={700} fontSize={16}>Filters</Typography>
                <Button size="small" sx={{ ml: 'auto', color: '#FF6B9D', fontSize: 12 }} onClick={() => { setService('ALL'); setPriceRange([0, 1000]); setVerifiedOnly(false); setAvailableOnly(false); setSearch(''); setShift('ALL'); setCity('ALL') }}>Reset</Button>
              </Box>

              <TextField
                fullWidth size="small" placeholder="Search by name or keyword..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <Typography fontWeight={600} fontSize={13} mb={1.5} color="text.secondary" letterSpacing={0.5}>SERVICE TYPE</Typography>
              <Stack spacing={1} mb={3}>
                <Chip label="All Services" onClick={() => setService('ALL')} variant={service === 'ALL' ? 'filled' : 'outlined'} sx={{ justifyContent: 'flex-start', borderColor: service === 'ALL' ? '#FF6B9D' : undefined, bgcolor: service === 'ALL' ? '#FFF0F5' : undefined, color: service === 'ALL' ? '#FF6B9D' : undefined, fontWeight: service === 'ALL' ? 700 : 400 }} />
                {ALL_SERVICES.map((s) => (
                  <Chip key={s} icon={<span style={{ fontSize: 14 }}>{SERVICE_ICONS[s]}</span>} label={SERVICE_LABELS[s]} onClick={() => setService(s)} variant={service === s ? 'filled' : 'outlined'} sx={{ justifyContent: 'flex-start', borderColor: service === s ? '#FF6B9D' : undefined, bgcolor: service === s ? '#FFF0F5' : undefined, color: service === s ? '#FF6B9D' : undefined, fontWeight: service === s ? 700 : 400 }} />
                ))}
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Typography fontWeight={600} fontSize={13} mb={1.5} color="text.secondary" letterSpacing={0.5}>SCHEDULE</Typography>
              <Stack spacing={1} mb={3}>
                {([['ALL', '🕐 All Hours'], ['DAY', '☀️ Day Care'], ['NIGHT', '🌙 Night Care']] as const).map(([val, label]) => (
                  <Chip key={val} label={label} onClick={() => setShift(val)} variant={shift === val ? 'filled' : 'outlined'} sx={{ justifyContent: 'flex-start', borderColor: shift === val ? '#FF6B9D' : undefined, bgcolor: shift === val ? '#FFF0F5' : undefined, color: shift === val ? '#FF6B9D' : undefined, fontWeight: shift === val ? 700 : 400 }} />
                ))}
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Typography fontWeight={600} fontSize={13} mb={2} color="text.secondary" letterSpacing={0.5}>HOURLY RATE (THB)</Typography>
              <Box px={1} mb={3}>
                <Slider value={priceRange} onChange={(_e, v) => setPriceRange(v as number[])} min={0} max={1000} step={50} valueLabelDisplay="auto" valueLabelFormat={(v) => `฿${v}`} sx={{ color: '#FF6B9D' }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">฿{priceRange[0]}/hr</Typography>
                  <Typography variant="caption" color="text.secondary">฿{priceRange[1]}/hr</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <FormControlLabel control={<Switch checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} size="small" />} label={<Typography fontSize={14}>Verified Only</Typography>} sx={{ mb: 1 }} />
              <FormControlLabel control={<Switch checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} size="small" />} label={<Typography fontSize={14}>Available Now</Typography>} />

              <Divider sx={{ my: 2 }} />

              <Box display="flex" alignItems="center" gap={0.75} mb={1.5}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#FF6B9D' }} />
                <Typography fontWeight={600} fontSize={13} color="text.secondary" letterSpacing={0.5}>LOCATION</Typography>
              </Box>
              <Stack spacing={1}>
                <Chip label="All Locations" onClick={() => setCity('ALL')} variant={city === 'ALL' ? 'filled' : 'outlined'} sx={{ justifyContent: 'flex-start', borderColor: city === 'ALL' ? '#FF6B9D' : undefined, bgcolor: city === 'ALL' ? '#FFF0F5' : undefined, color: city === 'ALL' ? '#FF6B9D' : undefined, fontWeight: city === 'ALL' ? 700 : 400 }} />
                {ALL_CITIES.map((c) => (
                  <Chip key={c} icon={<LocationOnIcon style={{ fontSize: 14 }} />} label={c} onClick={() => setCity(c)} variant={city === c ? 'filled' : 'outlined'} sx={{ justifyContent: 'flex-start', borderColor: city === c ? '#FF6B9D' : undefined, bgcolor: city === c ? '#FFF0F5' : undefined, color: city === c ? '#FF6B9D' : undefined, fontWeight: city === c ? 700 : 400 }} />
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={9}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography fontWeight={600}>{filtered.length} caregivers found</Typography>
              <ToggleButtonGroup size="small" exclusive>
                <ToggleButton value="grid" sx={{ px: 2, fontSize: 12 }}>Grid</ToggleButton>
                <ToggleButton value="list" sx={{ px: 2, fontSize: 12 }}>List</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {filtered.length === 0 && !loadingProfiles ? (
              <Box textAlign="center" py={10}>
                <Typography fontSize={48} mb={2}>🔍</Typography>
                <Typography variant="h6" fontWeight={700} mb={1}>No caregivers found</Typography>
                <Typography color="text.secondary">Try adjusting your filters or search term</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filtered.map((caregiver) => (
                  <Grid item xs={12} sm={6} lg={4} key={caregiver.id}>
                    <CaregiverCard caregiver={caregiver} />
                  </Grid>
                ))}
                {loadingProfiles && [1,2,3].map(i => (
                  <Grid item xs={12} sm={6} lg={4} key={`skel-${i}`}>
                    <Skeleton variant="rounded" height={260} sx={{ borderRadius: 4 }} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default function CaregiversPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>}>
      <CaregiversContent />
    </Suspense>
  )
}


