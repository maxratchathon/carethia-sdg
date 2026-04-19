'use client'
import {
  Box, Typography, Stack,
  FormControl, InputLabel, Select, MenuItem,
  RadioGroup, FormControlLabel, Radio,
  Slider,
} from '@mui/material'
import SectionHeader from '../components/SectionHeader'
import CheckboxGroup from '../components/CheckboxGroup'
import ChipSelect from '../components/ChipSelect'
import {
  THAI_DIALECTS, SECONDARY_LANGUAGES, THAI_PROVINCES,
  COMMUNICATION_STYLES, SPIRITUAL_OPTIONS, CULINARY_OPTIONS,
  EDUCATION_LEVELS, CLINICAL_SKILLS, MOBILITY_OPTIONS, CONDITION_EXPERIENCE,
} from '../constants'

interface StepThaiProfileProps {
  // Cultural
  nativeDialect: string;        setNativeDialect: (v: string) => void
  secondaryLanguages: string[]; setSecondaryLanguages: (v: string[]) => void
  hometown: string;             setHometown: (v: string) => void
  communicationStyle: string;   setCommunicationStyle: (v: string) => void
  spiritualSkills: string[];    setSpiritualSkills: (v: string[]) => void
  culinarySpecialties: string[];setCulinarySpecialties: (v: string[]) => void
  // Medical
  education: string;            setEducation: (v: string) => void
  clinicalSkills: string[];     setClinicalSkills: (v: string[]) => void
  mobilitySupport: string;      setMobilitySupport: (v: string) => void
  conditionExperience: string[];setConditionExperience: (v: string[]) => void
  yearsExperience: number;      setYearsExperience: (v: number) => void
}

export default function StepThaiProfile({
  nativeDialect, setNativeDialect,
  secondaryLanguages, setSecondaryLanguages,
  hometown, setHometown,
  communicationStyle, setCommunicationStyle,
  spiritualSkills, setSpiritualSkills,
  culinarySpecialties, setCulinarySpecialties,
  education, setEducation,
  clinicalSkills, setClinicalSkills,
  mobilitySupport, setMobilitySupport,
  conditionExperience, setConditionExperience,
  yearsExperience, setYearsExperience,
}: StepThaiProfileProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5}>🇹🇭 Thai Caregiver Profile</Typography>
      <Typography color="text.secondary" fontSize="0.85rem" mb={2}>
        Complete your cultural and professional profile to be matched with the right families.
      </Typography>

      <SectionHeader emoji="🫶" title="Cultural & Dialect Profile" weight="65% Weight" />
      <Stack spacing={2.5}>
        <FormControl fullWidth>
          <InputLabel>Native Dialect (Tongue) *</InputLabel>
          <Select value={nativeDialect} label="Native Dialect (Tongue) *" onChange={e => setNativeDialect(e.target.value)} sx={{ borderRadius: 3 }}>
            {THAI_DIALECTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>

        <Box>
          <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Secondary Languages</Typography>
          <ChipSelect options={SECONDARY_LANGUAGES} selected={secondaryLanguages} onChange={setSecondaryLanguages} />
        </Box>

        <FormControl fullWidth>
          <InputLabel>Regional Upbringing (Province)</InputLabel>
          <Select value={hometown} label="Regional Upbringing (Province)" onChange={e => setHometown(e.target.value)} sx={{ borderRadius: 3 }}>
            {THAI_PROVINCES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Communication Style</InputLabel>
          <Select value={communicationStyle} label="Communication Style" onChange={e => setCommunicationStyle(e.target.value)} sx={{ borderRadius: 3 }}>
            {COMMUNICATION_STYLES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </Select>
        </FormControl>

        <Box>
          <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Spiritual / Religious Fluency</Typography>
          <CheckboxGroup options={SPIRITUAL_OPTIONS} selected={spiritualSkills} onChange={setSpiritualSkills} />
        </Box>

        <Box>
          <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Culinary Specialty</Typography>
          <CheckboxGroup options={CULINARY_OPTIONS} selected={culinarySpecialties} onChange={setCulinarySpecialties} />
        </Box>
      </Stack>

      <Box mt={3}>
        <SectionHeader emoji="🏥" title="Medical & Professional Skill" weight="35% Weight" />
        <Stack spacing={2.5}>
          <FormControl fullWidth>
            <InputLabel>Formal Education *</InputLabel>
            <Select value={education} label="Formal Education *" onChange={e => setEducation(e.target.value)} sx={{ borderRadius: 3 }}>
              {EDUCATION_LEVELS.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>)}
            </Select>
          </FormControl>

          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Clinical Proficiency</Typography>
            <CheckboxGroup options={CLINICAL_SKILLS} selected={clinicalSkills} onChange={setClinicalSkills} />
          </Box>

          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Physical Strength / Mobility Support</Typography>
            <RadioGroup value={mobilitySupport} onChange={e => setMobilitySupport(e.target.value)}>
              {MOBILITY_OPTIONS.map(o => (
                <FormControlLabel key={o.value} value={o.value} control={<Radio size="small" />}
                  label={<Typography fontSize="0.875rem">{o.label}</Typography>} />
              ))}
            </RadioGroup>
          </Box>

          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Specialized Condition Experience</Typography>
            <CheckboxGroup options={CONDITION_EXPERIENCE} selected={conditionExperience} onChange={setConditionExperience} />
          </Box>

          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={2}>
              Years in Caregiving: <strong>{yearsExperience}{yearsExperience === 20 ? '+' : ''} yr{yearsExperience !== 1 ? 's' : ''}</strong>
            </Typography>
            <Slider
              value={yearsExperience}
              onChange={(_, v) => setYearsExperience(v as number)}
              min={0} max={20} step={1}
              marks={[{ value: 0, label: '0' }, { value: 10, label: '10' }, { value: 20, label: '20+' }]}
              sx={{ color: '#2ECC71' }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
