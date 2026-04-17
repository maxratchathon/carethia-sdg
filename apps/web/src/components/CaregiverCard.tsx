'use client'
import React from 'react'
import Link from 'next/link'
import {
  Card, CardContent, CardActionArea, Box, Typography, Avatar,
  Chip, Rating, Stack, Tooltip,
} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import type { MockCaregiver } from '@/lib/mockData'
import { SERVICE_ICONS, SERVICE_LABELS, SERVICE_COLORS, CUSTOMER_RATE } from '@/lib/mockData'
import { getTier } from '@/lib/store'

interface CaregiverCardProps {
  caregiver: MockCaregiver
  showServiceChip?: boolean
}

export default function CaregiverCard({ caregiver, showServiceChip = true }: CaregiverCardProps) {
  const mainService = caregiver.service
  const serviceColor = SERVICE_COLORS[mainService]
  const tier = getTier(caregiver.points ?? 0)

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
        overflow: 'visible',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea component={Link} href={`/caregivers/${caregiver.id}`} sx={{ flexGrow: 1 }}>
        {/* Top color band */}
        <Box sx={{ height: 8, background: `linear-gradient(135deg, ${serviceColor}, #C06C84)`, borderRadius: '16px 16px 0 0' }} />

        <CardContent sx={{ pt: 2.5, pb: 2 }}>
          {/* Header row */}
          <Box display="flex" gap={2} alignItems="flex-start" mb={1.5}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={caregiver.avatar}
                sx={{ width: 60, height: 60, border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              {caregiver.isAvailable && (
                <Box
                  sx={{
                    position: 'absolute', bottom: 2, right: 2,
                    width: 12, height: 12, borderRadius: '50%',
                    bgcolor: '#4CAF50', border: '2px solid white',
                  }}
                />
              )}
            </Box>

            <Box flexGrow={1} minWidth={0}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography fontWeight={700} fontSize={15} noWrap>
                  {caregiver.firstName} {caregiver.lastName}
                </Typography>
                {caregiver.verified && (
                  <Tooltip title="Background Verified">
                    <VerifiedIcon sx={{ fontSize: 16, color: '#1DA1F2', flexShrink: 0 }} />
                  </Tooltip>
                )}
                <Tooltip title={`${tier.name} Member • ${caregiver.points ?? 0} CarePoints`}>
                  <Typography fontSize={14} sx={{ cursor: 'default', flexShrink: 0 }}>{tier.icon}</Typography>
                </Tooltip>
              </Box>
              {showServiceChip && (
                <Chip
                  label={`${SERVICE_ICONS[mainService]} ${SERVICE_LABELS[mainService]}`}
                  size="small"
                  sx={{ mt: 0.5, bgcolor: `${serviceColor}20`, color: serviceColor, fontWeight: 600, height: 22, fontSize: 11 }}
                />
              )}
            </Box>

            <Box textAlign="right" flexShrink={0}>
              <Typography fontWeight={800} color="#FF6B9D" fontSize={16}>
                ฿{CUSTOMER_RATE[mainService][caregiver.shift ?? 'DAY']}
              </Typography>
              <Typography variant="caption" color="text.secondary">/hr</Typography>
            </Box>
          </Box>

          {/* Rating */}
          <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
            <Rating value={caregiver.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" fontWeight={600}>{caregiver.rating}</Typography>
            <Typography variant="caption" color="text.secondary">({caregiver.reviewCount} reviews)</Typography>
          </Box>

          {/* CareTrust Score */}
          {caregiver.careTrustScore >= 80 && (
            <Box display="flex" alignItems="center" gap={0.5} mb={1}>
              <Box sx={{ bgcolor: '#F0FFF7', border: '1px solid #2ECC7150', borderRadius: 1.5, px: 1, py: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography fontSize={11}>🛡️</Typography>
                <Typography fontSize={11} fontWeight={700} color="#2ECC71">CareTrust {caregiver.careTrustScore}/100</Typography>
              </Box>
            </Box>
          )}

          {/* Bio */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              mb: 1.5,
            }}
          >
            {caregiver.bio}
          </Typography>

          {/* Meta */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOnIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">{caregiver.city}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">{caregiver.experience} yrs exp</Typography>
            </Box>
          </Stack>

          {/* Languages */}
          <Box mt={1.5} display="flex" gap={0.5} flexWrap="wrap">
            {caregiver.languages.map((lang) => (
              <Chip key={lang} label={lang} size="small" variant="outlined" sx={{ height: 20, fontSize: 10, borderColor: 'grey.200' }} />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
