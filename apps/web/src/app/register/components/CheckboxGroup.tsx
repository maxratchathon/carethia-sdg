'use client'
import { FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material'

interface Option { value: string; label: string }

interface CheckboxGroupProps {
  options: Option[]
  selected: string[]
  onChange: (v: string[]) => void
}

export default function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])

  return (
    <FormGroup>
      {options.map(o => (
        <FormControlLabel
          key={o.value}
          control={
            <Checkbox
              checked={selected.includes(o.value)}
              onChange={() => toggle(o.value)}
              size="small"
            />
          }
          label={<Typography fontSize="0.875rem">{o.label}</Typography>}
        />
      ))}
    </FormGroup>
  )
}
