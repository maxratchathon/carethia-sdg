'use client'
import { Box, Typography, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import { COUNTRIES } from '../constants'

interface StepNationalityProps {
  country: string
  setCountry: (v: string) => void
}

export default function StepNationality({ country, setCountry }: StepNationalityProps) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
        <PublicIcon sx={{ color: '#2ECC71', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700}>Country of Origin</Typography>
      </Stack>
      <Typography color="text.secondary" fontSize="0.9rem" mb={3}>
        Select your home country. This determines your caregiver profile type and matching algorithm.
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select your country</InputLabel>
        <Select
          value={country}
          label="Select your country"
          onChange={e => setCountry(e.target.value)}
          sx={{ borderRadius: 3 }}
        >
          {COUNTRIES.map(c => (
            <MenuItem key={c} value={c}>{c === 'Thailand' ? '🇹🇭 Thailand' : c}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
