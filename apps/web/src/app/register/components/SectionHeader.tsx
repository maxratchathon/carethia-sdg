'use client'
import { Box, Stack, Typography, Chip, Divider } from '@mui/material'

interface SectionHeaderProps {
  emoji: string
  title: string
  weight: string
}

export default function SectionHeader({ emoji, title, weight }: SectionHeaderProps) {
  return (
    <Box mb={2} mt={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontSize={22}>{emoji}</Typography>
        <Typography fontWeight={800} fontSize="1rem">{title}</Typography>
        <Chip
          label={weight}
          size="small"
          sx={{ ml: 'auto !important', fontWeight: 700, bgcolor: '#FFF0F5', color: '#FF6B9D' }}
        />
      </Stack>
      <Divider sx={{ mt: 1 }} />
    </Box>
  )
}
