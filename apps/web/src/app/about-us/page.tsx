'use client'
import React from 'react'
import Link from 'next/link'
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Layout from '@/components/Layout'

const TRUST_POINTS = [
  'Verified caregiver profiles with relevant special-needs experience',
  'Transparent reviews and clear service details',
  'Reliable booking flow with upfront pricing and no hidden surprises',
  'Ongoing support designed for long-term care, not one-time matching',
]

const CAREGIVER_SUPPORT = [
  'Better visibility to families actively seeking care',
  'A professional space to present skills and build trust',
  'More stable booking opportunities and repeat relationships',
  'A platform that values caregiving as meaningful, skilled work',
]

export default function AboutUsPage() {
  return (
    <Layout>
      <Box sx={{ py: { xs: 8, md: 10 }, background: 'linear-gradient(135deg, #FFF0F5 0%, #F6F3FF 50%, #F0FFFE 100%)' }}>
        <Container maxWidth="lg">
          <Chip label="About Carethia" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700, mb: 2 }} />
          <Typography variant="h2" fontWeight={800} lineHeight={1.15} mb={2} sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Our Story, Mission, and Vision
          </Typography>
          <Typography color="text.secondary" fontSize={{ xs: 16, md: 18 }} maxWidth={860} lineHeight={1.8}>
            We are building a trusted, family-centered platform for special-needs care in Thailand.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: 9, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight={800} mb={2}>Our Story</Typography>
              <Stack spacing={2.5}>
                <Typography color="text.secondary" lineHeight={1.9}>
                  Carethia was founded by a family member who experienced firsthand the challenges of finding reliable care for a loved one with an intellectual disability. What began as a deeply personal struggle grew into a shared mission to support families and caregivers facing the same reality every day.
                </Typography>
                <Typography color="text.secondary" lineHeight={1.9}>
                  From that experience, we saw a bigger gap: families were navigating scattered referrals, unclear credentials, and inconsistent information, while many qualified caregivers had limited visibility to the families who needed them most.
                </Typography>
                <Typography color="text.secondary" lineHeight={1.9}>
                  Carethia was created as a trust-focused solution that helps families discover, evaluate, and book verified special-needs caregivers based on real needs, experience, and compatibility.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 4, border: '1px solid #FFD6E8', boxShadow: '0 8px 28px rgba(255,107,157,0.12)', height: '100%' }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Typography variant="h5" fontWeight={800} mb={1.5}>What We Do</Typography>
                  <Typography color="text.secondary" lineHeight={1.8}>
                    We connect families with verified special-needs caregivers through a simple, confidence-first experience. Families can compare profiles, evaluate fit, and book with transparency and peace of mind.
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
              <Chip label="Our Inspiration" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700, mb: 2 }} />
              <Typography variant="h4" fontWeight={800} mb={2}>Inspired by Families, Built for Families</Typography>
              <Typography color="text.secondary" lineHeight={1.9}>
                Behind every booking is a real family seeking stability, dignity, and dependable support. This mission drives every feature we build and every caregiver partnership we grow.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 5, overflow: 'hidden', border: '1px solid #FFD6E8', boxShadow: '0 10px 30px rgba(255,107,157,0.15)' }}>
                <Box sx={{ background: 'linear-gradient(135deg, #FFEAF4 0%, #F3EEFF 100%)', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box component="img" src="/locales/images/carethia_logo.png" alt="Carethia inspiration" sx={{ width: { xs: 160, md: 220 }, height: 'auto', mb: 2 }} />
                  <Typography textAlign="center" color="#7A4A5B" fontWeight={600} lineHeight={1.7}>
                    &ldquo;When care is easier to find, families can focus on growth, connection, and everyday joy.&rdquo;
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
              <Typography variant="h4" fontWeight={800} mb={2}>Why Families Trust Carethia</Typography>
              <Stack spacing={1.5}>
                {TRUST_POINTS.map((point) => (
                  <Box key={point} display="flex" alignItems="flex-start" gap={1.2}>
                    <Typography sx={{ mt: '2px' }}>✅</Typography>
                    <Typography color="text.secondary" lineHeight={1.7}>{point}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={800} mb={2}>How We Support Caregivers</Typography>
              <Stack spacing={1.5}>
                {CAREGIVER_SUPPORT.map((point) => (
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
              <Typography variant="h4" fontWeight={800} mb={2}>Our Vision</Typography>
              <Typography color="text.secondary" lineHeight={1.9} mb={3}>
                Carethia is building a more accessible and dependable care ecosystem where families feel confident, caregivers feel respected, and quality special-needs care becomes easier to find, sustain, and grow over time.
              </Typography>
              <Button component={Link} href="/" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 6, borderColor: '#FF6B9D', color: '#FF6B9D', fontWeight: 700, px: 3 }}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Layout>
  )
}
