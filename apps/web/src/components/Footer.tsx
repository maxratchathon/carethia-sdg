'use client'
import React from 'react'
import { Box, Container, Grid, Typography, Link as MuiLink, Divider, IconButton, Stack } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

export default function Footer() {
  const { t } = useTranslation('footer')

  const columns = [
    {
      title: t('servicesTitle'),
      links: [
        { label: t('services.childDevelopment'), href: '/caregivers?service=SPECIAL_NEEDS_TRAINER' },
        { label: t('services.dailyLiving'), href: '/caregivers?service=DAILY_LIVING_COMPANION' },
      ],
    },
    {
      title: t('companyTitle'),
      links: [
        { label: t('company.aboutUs'), href: '/about-us' },
        { label: t('company.howItWorks'), href: '/#how-it-works' },
        { label: t('company.safety'), href: '#' },
        { label: t('company.careers'), href: '#' },
        { label: t('company.press'), href: '#' },
        { label: t('company.blog'), href: '#' },
      ],
    },
    {
      title: t('supportTitle'),
      links: [
        { label: t('support.helpCenter'), href: '#' },
        { label: t('support.contactUs'), href: '/contact-us' },
        { label: t('support.privacy'), href: '#' },
        { label: t('support.terms'), href: '#' },
        { label: t('support.cookies'), href: '#' },
      ],
    },
  ]
  return (
    <Box sx={{ bgcolor: '#1a1a2e', color: 'grey.400', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} mb={6}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Image
                src="/locales/images/carethia_logo.png"
                alt="Carethia"
                width={32}
                height={32}
                style={{ objectFit: 'contain' }}
              />
              <Typography fontWeight={800} fontSize={20} color="white">Carethia</Typography>
            </Box>
            <Typography variant="body2" lineHeight={1.8} mb={3}>
              {t('tagline')}
            </Typography>
            <Stack direction="row" spacing={1}>
              {[InstagramIcon, TwitterIcon, LinkedInIcon].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ color: 'grey.500', '&:hover': { color: '#FF6B9D' } }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {columns.map((col) => (
            <Grid item xs={6} sm={4} md={2.5} key={col.title}>
              <Typography fontWeight={700} color="white" mb={2} fontSize={14}>
                {col.title}
              </Typography>
              <Stack spacing={1}>
                {col.links.map((link) => (
                  <MuiLink
                    key={link.label}
                    component={Link}
                    href={link.href}
                    underline="none"
                    variant="body2"
                    sx={{ color: 'grey.500', '&:hover': { color: '#FF6B9D' } }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'grey.800', mb: 3 }} />

        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography variant="body2" color="grey.600">
            {t('copyright')}
          </Typography>
          <Typography variant="body2" color="grey.600">
            {t('taglineBottom')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}



