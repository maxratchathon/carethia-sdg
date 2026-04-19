'use client'
import { Box, Typography, Stack, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface StepAccountProps {
  firstName: string; setFirstName: (v: string) => void
  lastName:  string; setLastName:  (v: string) => void
  email:     string; setEmail:     (v: string) => void
  password:  string; setPassword:  (v: string) => void
  phone:     string; setPhone:     (v: string) => void
}

export default function StepAccount({
  firstName, setFirstName,
  lastName,  setLastName,
  email,     setEmail,
  password,  setPassword,
  phone,     setPhone,
}: StepAccountProps) {
  const { t } = useTranslation('auth')

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5}>{t('register.accountTitle')}</Typography>
      <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('register.accountSubtitle')}</Typography>
      <Stack spacing={2.5}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth label={t('register.firstName')} value={firstName}
            onChange={e => setFirstName(e.target.value)} required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <TextField
            fullWidth label={t('register.lastName')} value={lastName}
            onChange={e => setLastName(e.target.value)} required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </Box>
        <TextField
          fullWidth label={t('register.email')} type="email" value={email}
          onChange={e => setEmail(e.target.value)} required
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <TextField
          fullWidth label={t('register.password')} type="password" value={password}
          onChange={e => setPassword(e.target.value)} required
          helperText={t('register.passwordHelp')}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <TextField
          fullWidth label={t('register.phone')} value={phone}
          onChange={e => setPhone(e.target.value)} placeholder="0812345678"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
      </Stack>
    </Box>
  )
}
