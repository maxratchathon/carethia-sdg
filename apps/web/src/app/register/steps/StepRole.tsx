'use client'
import { Box, Typography, Grid, Card, CardActionArea } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'

interface StepRoleProps {
  role: 'CUSTOMER' | 'CAREGIVER' | null
  setRole: (r: 'CUSTOMER' | 'CAREGIVER') => void
}

export default function StepRole({ role, setRole }: StepRoleProps) {
  const { t } = useTranslation('auth')

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5}>{t('register.roleTitle')}</Typography>
      <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('register.roleSubtitle')}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card
            variant="outlined"
            onClick={() => setRole('CUSTOMER')}
            sx={{
              borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
              border: role === 'CUSTOMER' ? '2px solid #FF6B9D' : '1px solid',
              borderColor: role === 'CUSTOMER' ? '#FF6B9D' : 'grey.200',
              bgcolor: role === 'CUSTOMER' ? '#FFF0F5' : 'white',
            }}
          >
            <CardActionArea sx={{ p: 3, textAlign: 'center' }}>
              <Box fontSize={40} mb={1}>👨‍👩‍👧</Box>
              <Typography fontWeight={700}>{t('register.customer')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('register.customerDesc')}</Typography>
              {role === 'CUSTOMER' && (
                <CheckCircleIcon sx={{ color: '#FF6B9D', fontSize: 20, mt: 1, display: 'block', mx: 'auto' }} />
              )}
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            variant="outlined"
            onClick={() => setRole('CAREGIVER')}
            sx={{
              borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
              border: role === 'CAREGIVER' ? '2px solid #2ECC71' : '1px solid',
              borderColor: role === 'CAREGIVER' ? '#2ECC71' : 'grey.200',
              bgcolor: role === 'CAREGIVER' ? '#F0FFF4' : 'white',
            }}
          >
            <CardActionArea sx={{ p: 3, textAlign: 'center' }}>
              <Box fontSize={40} mb={1}>🛡️</Box>
              <Typography fontWeight={700}>{t('register.caregiver')}</Typography>
              <Typography variant="caption" color="text.secondary">{t('register.caregiverDesc')}</Typography>
              {role === 'CAREGIVER' && (
                <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 20, mt: 1, display: 'block', mx: 'auto' }} />
              )}
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
