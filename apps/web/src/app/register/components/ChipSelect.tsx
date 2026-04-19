'use client'
import { Box, Chip } from '@mui/material'

interface ChipSelectProps {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  color?: string
}

export default function ChipSelect({ options, selected, onChange, color = '#2ECC71' }: ChipSelectProps) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map(o => (
        <Chip
          key={o}
          label={o}
          onClick={() => toggle(o)}
          variant={selected.includes(o) ? 'filled' : 'outlined'}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.78rem',
            bgcolor: selected.includes(o) ? color : 'transparent',
            color: selected.includes(o) ? '#fff' : 'text.primary',
            borderColor: selected.includes(o) ? color : 'grey.300',
          }}
        />
      ))}
    </Box>
  )
}
