'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  Box, Container, Typography, Button, TextField, Paper,
  Divider, Stack, Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation('auth')
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('login.errors.loginFailed'))
        return
      }
      login(data.user)
      router.push('/dashboard')
    } catch {
      setError(t('login.errors.network'))
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (type: 'customer' | 'thai-caregiver' | 'foreign-caregiver') => {
    if (type === 'customer') { setEmail('siriporn@example.com'); setPassword('demo1234') }
    if (type === 'thai-caregiver') { setEmail('nipa.demo@carethia.com'); setPassword('demo1234') }
    if (type === 'foreign-caregiver') { setEmail('aye.demo@carethia.com'); setPassword('demo1234') }
    setError('')
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 100%)', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="xs">
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Box
              component="img"
              src="/locales/images/carethia_logo.png"
              alt="Carethia logo"
              sx={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <Typography variant="h5" fontWeight={800} color="#FF6B9D">Carethia</Typography>
          </Link>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'grey.100', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
          <Typography variant="h5" fontWeight={800} mb={0.5}>{t('login.welcome')} 👋</Typography>
          <Typography color="text.secondary" fontSize="0.9rem" mb={3}>{t('login.subtitle')}</Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth label={t('login.email')} type="email"
                value={email} onChange={(e) => setEmail(e.target.value)} required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <TextField
                fullWidth label={t('login.password')}
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)} required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit" variant="contained" fullWidth size="large" disabled={loading}
                sx={{ background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', borderRadius: 3, py: 1.5, fontWeight: 700, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : t('login.signIn')}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>{t('login.demoTitle')}</Typography>
          </Divider>

          <Stack spacing={1.5}>
            <Button
              fullWidth variant="outlined" onClick={() => fillDemo('customer')}
              sx={{ borderRadius: 3, borderColor: '#FF6B9D', color: '#FF6B9D', fontWeight: 600, justifyContent: 'flex-start', px: 2 }}
            >
              <Box mr={1.5} fontSize={18}>👩‍👧</Box>
              <Box textAlign="left">
                <Typography fontSize={13} fontWeight={700}>{t('login.customerDemo')}</Typography>
                <Typography variant="caption" color="text.secondary">siriporn@example.com</Typography>
              </Box>
            </Button>
            <Button
              fullWidth variant="outlined" onClick={() => fillDemo('thai-caregiver')}
              sx={{ borderRadius: 3, borderColor: '#2ECC71', color: '#2ECC71', fontWeight: 600, justifyContent: 'flex-start', px: 2 }}
            >
              <Box mr={1.5} fontSize={18}>🇹🇭</Box>
              <Box textAlign="left">
                <Typography fontSize={13} fontWeight={700}>Thai Caregiver — Sook-Jai Score</Typography>
                <Typography variant="caption" color="text.secondary">Nipa · nipa.demo@carethia.com</Typography>
              </Box>
            </Button>
            <Button
              fullWidth variant="outlined" onClick={() => fillDemo('foreign-caregiver')}
              sx={{ borderRadius: 3, borderColor: '#6C5CE7', color: '#6C5CE7', fontWeight: 600, justifyContent: 'flex-start', px: 2 }}
            >
              <Box mr={1.5} fontSize={18}>🇲🇲</Box>
              <Box textAlign="left">
                <Typography fontSize={13} fontWeight={700}>Foreigner Caregiver — CAS Score</Typography>
                <Typography variant="caption" color="text.secondary">Aye · aye.demo@carethia.com</Typography>
              </Box>
            </Button>
          </Stack>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              {t('login.noAccount')}{' '}
              <Link href="/register" style={{ color: '#FF6B9D', fontWeight: 700, textDecoration: 'none' }}>
                {t('login.signUp')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

