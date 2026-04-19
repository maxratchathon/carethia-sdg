'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Layout from '@/components/Layout'

export default function AboutUsPage() {
  const { t } = useTranslation('about')
  const trustPoints = t('trustPoints', { returnObjects: true }) as string[]
  const caregiverSupport = t('caregiverSupportPoints', { returnObjects: true }) as string[]

  return (
    <Layout>
      <Box sx={{ py: { xs: 8, md: 10 }, background: 'linear-gradient(135deg, #FFF0F5 0%, #F6F3FF 50%, #F0FFFE 100%)' }}>
        <Container maxWidth="lg">
          <Chip label={t('heroChip')} sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700, mb: 2 }} />
          <Typography variant="h2" fontWeight={800} lineHeight={1.15} mb={2} sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            {t('heroTitle')}
          </Typography>
          <Typography color="text.secondary" fontSize={{ xs: 16, md: 18 }} maxWidth={860} lineHeight={1.8}>
            {t('heroSubtitle')}
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 9, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight={800} mb={2}>{t('storyTitle')}</Typography>
              <Stack spacing={2.5}>
                <Typography color="text.secondary" lineHeight={1.9}>
                  {t('storyP1')}
                </Typography>
                <Typography color="text.secondary" lineHeight={1.9}>
                  {t('storyP2')}
                </Typography>
                <Typography color="text.secondary" lineHeight={1.9}>
                  {t('storyP3')}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 4, border: '1px solid #FFD6E8', boxShadow: '0 8px 28px rgba(255,107,157,0.12)', height: '100%' }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Typography variant="h5" fontWeight={800} mb={1.5}>{t('whatWeDoTitle')}</Typography>
                  <Typography color="text.secondary" lineHeight={1.8}>
                    {t('whatWeDoBody')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 9, bgcolor: '#FFF8FC' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label={t('inspirationChip')} sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700, mb: 2 }} />
              <Typography variant="h4" fontWeight={800} mb={2}>{t('inspirationTitle')}</Typography>
              <Typography color="text.secondary" lineHeight={1.9}>
                {t('inspirationBody')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 5, overflow: 'hidden', border: '1px solid #FFD6E8', boxShadow: '0 10px 30px rgba(255,107,157,0.15)' }}>
                <Box sx={{ background: 'linear-gradient(135deg, #FFEAF4 0%, #F3EEFF 100%)', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="/locales/images/family-story.png"
                    alt="Family story inspiration"
                    sx={{
                      width: '100%',
                      maxWidth: 460,
                      height: { xs: 210, md: 250 },
                      objectFit: 'cover',
                      objectPosition: 'center 38%',
                      borderRadius: 3,
                      mb: 2,
                    }}
                  />
                  <Typography textAlign="center" color="#7A4A5B" fontWeight={600} lineHeight={1.7}>
                    &ldquo;{t('inspirationQuote')}&rdquo;
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 9, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={800} mb={2}>{t('trustTitle')}</Typography>
              <Stack spacing={1.5}>
                {trustPoints.map((point) => (
                  <Box key={point} display="flex" alignItems="flex-start" gap={1.2}>
                    <Typography sx={{ mt: '2px' }}>✅</Typography>
                    <Typography color="text.secondary" lineHeight={1.7}>{point}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={800} mb={2}>{t('caregiverSupportTitle')}</Typography>
              <Stack spacing={1.5}>
                {caregiverSupport.map((point) => (
                  <Box key={point} display="flex" alignItems="flex-start" gap={1.2}>
                    <Typography sx={{ mt: '2px' }}>🌱</Typography>
                    <Typography color="text.secondary" lineHeight={1.7}>{point}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 9, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Card sx={{ borderRadius: 5, border: '1px solid #EBDCF8', background: 'linear-gradient(135deg, #FFF8FC 0%, #F5F2FF 100%)', boxShadow: 'none' }}>
            <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} mb={2}>{t('visionTitle')}</Typography>
              <Typography color="text.secondary" lineHeight={1.9} mb={3}>
                {t('visionBody')}
              </Typography>
              <Button component={Link} href="/" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 6, borderColor: '#FF6B9D', color: '#FF6B9D', fontWeight: 700, px: 3 }}>
                {t('backHome')}
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Layout>
  )
}
