'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { i18n } from '@/lib/i18n'
import {
  AppBar, Toolbar, Box, Button, Container, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText,
  Typography, Avatar, Menu, MenuItem, Chip, Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import TranslateIcon from '@mui/icons-material/Translate'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useAuth } from '@/lib/auth-context'
import { getTier } from '@/lib/store'

const NAV_KEYS = [
  { key: 'findCaregivers', href: '/caregivers' },
  { key: 'aboutUs', href: '/about-us' },
  { key: 'pricing', href: '/#pricing' },
  { key: 'forCaregivers', href: '/for-caregivers' },
  { key: 'events', href: '/events' },
  { key: 'contactUs', href: '/contact-us' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslation('nav')
  const { user, logout } = useAuth()
  const tier = user ? getTier(user.points ?? 0) : null
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'th'>(i18n.language.startsWith('th') ? 'th' : 'en')
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null)
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null)

  const switchLocale = (locale: 'en' | 'th') => {
    i18n.changeLanguage(locale)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('carethia_lang', locale)
    }
    setLang(locale)
    setLangAnchor(null)
  }

  const navLabel = (key: string) => {
    const label = t(key)
    return key === 'events' ? label.replace('📅', '').trim() : label
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.100',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, py: 0.5 }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Image
                src="/locales/images/carethia_logo.png"
                alt="Carethia"
                width={32}
                height={32}
                style={{ objectFit: 'contain' }}
                priority
              />
              <Typography variant="h6" fontWeight={800} sx={{ color: '#FF6B9D', letterSpacing: '-0.5px' }}>
                Carethia
              </Typography>
            </Link>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 3, flexGrow: 1 }}>
              {NAV_KEYS.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '&:hover': { color: '#FF6B9D', background: 'transparent' },
                  }}
                >
                  {navLabel(link.key)}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              {/* Language Switcher */}
              <Button
                size="small"
                startIcon={<TranslateIcon fontSize="small" />}
                endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                onClick={(e) => setLangAnchor(e.currentTarget)}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                {lang === 'th' ? 'TH' : 'EN'}
              </Button>
              <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}>
                <MenuItem onClick={() => switchLocale('en')}>🇺🇸 {t('english')}</MenuItem>
                <MenuItem onClick={() => switchLocale('th')}>🇹🇭 {t('thai')}</MenuItem>
              </Menu>

              {user ? (
                <>
                  <Button
                    onClick={(e) => setUserAnchor(e.currentTarget)}
                    startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: '#FF6B9D', fontSize: 13, fontWeight: 700 }}>{user.firstName[0]}</Avatar>}
                    endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                    sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none', borderRadius: 6, border: '1px solid', borderColor: 'grey.200', px: 1.5 }}
                  >
                    {user.firstName}
                  </Button>
                  <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)}
                    PaperProps={{ sx: { borderRadius: 3, mt: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', minWidth: 180 } }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={700} fontSize={14}>{user.firstName} {user.lastName}</Typography>
                        {tier && (
                          <Chip
                            label={`${tier.icon} ${tier.name}`}
                            size="small"
                            sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: tier.bg, color: tier.color }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                    </Box>
                    <MenuItem component={Link} href="/dashboard" onClick={() => setUserAnchor(null)} sx={{ gap: 1.5, py: 1.25 }}>
                      <DashboardIcon fontSize="small" sx={{ color: '#FF6B9D' }} />
                      <Typography fontWeight={600} fontSize={14}>{t('dashboard')}</Typography>
                    </MenuItem>
                    {user.role === 'CUSTOMER' && (
                      <MenuItem component={Link} href="/family/requests/new" onClick={() => setUserAnchor(null)} sx={{ gap: 1.5, py: 1.25 }}>
                        <AssignmentIcon fontSize="small" sx={{ color: '#6C63FF' }} />
                        <Typography fontWeight={600} fontSize={14}>Family Request</Typography>
                      </MenuItem>
                    )}
                    {user.role === 'CAREGIVER' && (
                      <MenuItem component={Link} href="/caregiver-portal" onClick={() => setUserAnchor(null)} sx={{ gap: 1.5, py: 1.25 }}>
                        <Box component="span" sx={{ fontSize: 16, lineHeight: 1 }}>🛡️</Box>
                        <Typography fontWeight={600} fontSize={14}>{t('caregiverPortal')}</Typography>
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={() => { logout(); setUserAnchor(null) }} sx={{ gap: 1.5, py: 1.25, color: '#E74C3C' }}>
                      <LogoutIcon fontSize="small" />
                      <Typography fontWeight={600} fontSize={14}>{t('signOut')}</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    sx={{ color: 'text.primary', fontWeight: 500 }}
                  >
                    {t('signIn')}
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/register"
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B9D, #C06C84)',
                      borderRadius: 6,
                      px: 2.5,
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(255,107,157,0.3)',
                      '&:hover': { boxShadow: '0 6px 20px rgba(255,107,157,0.4)' },
                    }}
                  >
                    {t('getStarted')}
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon sx={{ color: '#FF6B9D' }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image
              src="/locales/images/carethia_logo.png"
              alt="Carethia"
              width={28}
              height={28}
              style={{ objectFit: 'contain' }}
            />
            <Typography fontWeight={800} color="#FF6B9D">Carethia</Typography>
          </Box>
          <Divider />
          <List>
            {NAV_KEYS.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton component={Link} href={link.href} onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={navLabel(link.key)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {user ? (
              <>
                <Box sx={{ px: 1, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#FF6B9D', fontWeight: 700 }}>{user.firstName[0]}</Avatar>
                  <Box>
                    <Box display="flex" alignItems="center" gap={0.75}>
                      <Typography fontWeight={700} fontSize={14}>{user.firstName} {user.lastName}</Typography>
                      {tier && (
                        <Typography fontSize={16} title={`${tier.name} Member`}>{tier.icon}</Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                </Box>
                <Button fullWidth variant="outlined" component={Link} href="/dashboard" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 6, borderColor: '#FF6B9D', color: '#FF6B9D' }}>{t('dashboard')}</Button>
                {user.role === 'CUSTOMER' && (
                  <Button fullWidth variant="outlined" component={Link} href="/family/requests/new" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 6, borderColor: '#6C63FF', color: '#6C63FF' }}>
                    Family Request
                  </Button>
                )}
                <Button fullWidth variant="outlined" onClick={() => { logout(); setDrawerOpen(false) }} sx={{ borderRadius: 6, borderColor: '#E74C3C', color: '#E74C3C' }}>{t('signOut')}</Button>
              </>
            ) : (
              <>
                <Button fullWidth variant="outlined" component={Link} href="/login" sx={{ borderRadius: 6 }}>{t('signIn')}</Button>
                <Button fullWidth variant="contained" component={Link} href="/register" sx={{ background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', borderRadius: 6, fontWeight: 600 }}>
                  {t('getStarted')}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

