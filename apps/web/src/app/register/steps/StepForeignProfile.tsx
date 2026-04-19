'use client'
import {
  Box, Typography, Stack, Chip,
  FormControl, InputLabel, Select, MenuItem,
  TextField, RadioGroup, FormControlLabel, Radio,
} from '@mui/material'
import SectionHeader from '../components/SectionHeader'
import CheckboxGroup from '../components/CheckboxGroup'
import {
  STORYTELLING_LEVELS, VOCAB_BREADTH,
  MUSICAL_OPTIONS, CALENDAR_OPTIONS, CULTURAL_ACTIVITIES,
} from '../constants'

interface StepForeignProfileProps {
  // Language (40%)
  motherTongue: string;        setMotherTongue: (v: string) => void
  dialect: string;             setDialect: (v: string) => void
  storytellingLevel: string;   setStorytellingLevel: (v: string) => void
  musicalHeritage: string[];   setMusicalHeritage: (v: string[]) => void
  vocabBreadth: string;        setVocabBreadth: (v: string) => void
  // Cultural Practice (30%)
  ritualMastery: string;       setRitualMastery: (v: string) => void
  ethnicDishes: string;        setEthnicDishes: (v: string) => void
  calendarAwareness: string[]; setCalendarAwareness: (v: string[]) => void
  // Child Facilitation (20%)
  culturalActivities: string[];setCulturalActivities: (v: string[]) => void
  explanationAbility: string;  setExplanationAbility: (v: string) => void
  usesArtifacts: string;       setUsesArtifacts: (v: string) => void
  // Identity Affirmation (10%)
  communityInvolvement: string;setCommunityInvolvement: (v: string) => void
  pridStatement: string;       setPridStatement: (v: string) => void
  traditionalAttire: string;   setTraditionalAttire: (v: string) => void
}

export default function StepForeignProfile({
  motherTongue, setMotherTongue,
  dialect, setDialect,
  storytellingLevel, setStorytellingLevel,
  musicalHeritage, setMusicalHeritage,
  vocabBreadth, setVocabBreadth,
  ritualMastery, setRitualMastery,
  ethnicDishes, setEthnicDishes,
  calendarAwareness, setCalendarAwareness,
  culturalActivities, setCulturalActivities,
  explanationAbility, setExplanationAbility,
  usesArtifacts, setUsesArtifacts,
  communityInvolvement, setCommunityInvolvement,
  pridStatement, setPridStatement,
  traditionalAttire, setTraditionalAttire,
}: StepForeignProfileProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5}>🌍 Cultural Anchor Score (CAS) Profile</Typography>
      <Typography color="text.secondary" fontSize="0.85rem" mb={2}>
        Help us understand your ability to serve as a cultural anchor for children of migrant families.
      </Typography>

      {/* ── Language Fluency (40%) ── */}
      <SectionHeader emoji="🗣️" title="Native Language Fluency" weight="40% Weight" />
      <Stack spacing={2.5}>
        <TextField fullWidth label="Mother Tongue / First Language *" value={motherTongue}
          onChange={e => setMotherTongue(e.target.value)}
          placeholder="e.g. Burmese (Bamar), Mandarin (Cantonese), Tagalog…"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

        <TextField fullWidth label="Specific Dialect / Regional Variant" value={dialect}
          onChange={e => setDialect(e.target.value)}
          placeholder="e.g. Shan, Hakka, Ilocano…"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

        <FormControl fullWidth>
          <InputLabel>Storytelling Proficiency</InputLabel>
          <Select value={storytellingLevel} label="Storytelling Proficiency"
            onChange={e => setStorytellingLevel(e.target.value)} sx={{ borderRadius: 3 }}>
            {STORYTELLING_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </Select>
        </FormControl>

        <Box>
          <Typography fontWeight={600} fontSize="0.875rem" mb={0.5}>
            Musical / Rhythmic Heritage
            <Chip label="🎵 Lullabies = Strongest Bond" size="small"
              sx={{ ml: 1, fontSize: '0.7rem', bgcolor: '#FFF0F5', color: '#FF6B9D' }} />
          </Typography>
          <CheckboxGroup options={MUSICAL_OPTIONS} selected={musicalHeritage} onChange={setMusicalHeritage} />
        </Box>

        <FormControl fullWidth>
          <InputLabel>Vocabulary Breadth</InputLabel>
          <Select value={vocabBreadth} label="Vocabulary Breadth"
            onChange={e => setVocabBreadth(e.target.value)} sx={{ borderRadius: 3 }}>
            {VOCAB_BREADTH.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {/* ── Cultural Practice (30%) ── */}
      <Box mt={3}>
        <SectionHeader emoji="🏺" title="Cultural Practice Knowledge" weight="30% Weight" />
        <Stack spacing={2.5}>
          <TextField fullWidth label="Traditional Ritual Mastery" multiline rows={2}
            value={ritualMastery} onChange={e => setRitualMastery(e.target.value)}
            placeholder="e.g. Can set up Songkran altar, knowledge of Thingyan water festival customs…"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <TextField fullWidth label="Ethnic Culinary Skills" multiline rows={3}
            value={ethnicDishes} onChange={e => setEthnicDishes(e.target.value)}
            placeholder={"List 3–5 traditional dishes you can cook from scratch without a recipe.\ne.g. Mohinga, Laphet Thoke, Ohn No Khao Swè…"}
            helperText="🍽️ Comfort food is the strongest anchor for a child's sense of belonging."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Calendar / Holiday Awareness</Typography>
            <CheckboxGroup options={CALENDAR_OPTIONS} selected={calendarAwareness} onChange={setCalendarAwareness} />
          </Box>
        </Stack>
      </Box>

      {/* ── Child Facilitation (20%) ── */}
      <Box mt={3}>
        <SectionHeader emoji="👧" title="Child Cultural Facilitation Skill" weight="20% Weight" />
        <Stack spacing={2.5}>
          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Interactive Cultural Activities</Typography>
            <CheckboxGroup options={CULTURAL_ACTIVITIES} selected={culturalActivities} onChange={setCulturalActivities} />
          </Box>

          <TextField fullWidth label="Explanation Ability" multiline rows={2}
            value={explanationAbility} onChange={e => setExplanationAbility(e.target.value)}
            placeholder="How would you explain the significance of a cultural holiday to a 5-year-old?"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Educational Engagement with Cultural Artifacts</Typography>
            <RadioGroup value={usesArtifacts} onChange={e => setUsesArtifacts(e.target.value)}>
              <FormControlLabel value="yes" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">Yes — I use traditional clothing, tools, or objects as teaching aids</Typography>} />
              <FormControlLabel value="no" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">Not yet, but willing to learn</Typography>} />
            </RadioGroup>
          </Box>
        </Stack>
      </Box>

      {/* ── Identity Affirmation (10%) ── */}
      <Box mt={3}>
        <SectionHeader emoji="🌟" title="Cultural Identity Affirmation" weight="10% Weight" />
        <Stack spacing={2.5}>
          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Community Involvement</Typography>
            <RadioGroup value={communityInvolvement} onChange={e => setCommunityInvolvement(e.target.value)}>
              <FormControlLabel value="active" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">Actively participate in ethnic community groups / festivals</Typography>} />
              <FormControlLabel value="occasional" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">Occasionally attend cultural events</Typography>} />
              <FormControlLabel value="none" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">Not currently, but would like to</Typography>} />
            </RadioGroup>
          </Box>

          <TextField fullWidth label="Personal Pride Statement" multiline rows={3}
            value={pridStatement} onChange={e => setPridStatement(e.target.value)}
            placeholder="What part of your heritage are you most proud to share with the next generation?"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <Box>
            <Typography fontWeight={600} fontSize="0.875rem" mb={1}>Traditional Attire Availability</Typography>
            <RadioGroup value={traditionalAttire} onChange={e => setTraditionalAttire(e.target.value)}>
              <FormControlLabel value="own" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">I own traditional dress and am happy to wear it</Typography>} />
              <FormControlLabel value="willing" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">Willing to wear traditional dress if provided</Typography>} />
              <FormControlLabel value="prefer_not" control={<Radio size="small" />}
                label={<Typography fontSize="0.875rem">I prefer not to</Typography>} />
            </RadioGroup>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
