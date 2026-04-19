'use client'
import React, { useState } from 'react'
import {
  Box, Container, Typography, Grid, TextField, Button, MenuItem,
  Select, InputLabel, FormControl, CircularProgress, Alert, Snackbar,
  Paper, Stack, Divider,
} from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SendIcon from '@mui/icons-material/Send'
import Layout from '@/components/Layout'

const CONTACT_TYPES = [
  'General Inquiry',
  'Booking Support',
  'Caregiver Application',
  'Billing & Payments',
  'Technical Issue',
  'Partnership',
  'Other',
]

interface FormState {
  name: string
  email: string
  phone: string
  contactType: string
  message: string
}

const INITIAL: FormState = { name: '', email: '', phone: '', contactType: '', message: '' }

export default function ContactUsPage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Something went wrong')
      setSuccess(true)
      setForm(INITIAL)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': { borderColor: '#FF6B9D' },
      '&.Mui-focused fieldset': { borderColor: '#FF6B9D' },
    },
    '& label.Mui-focused': { color: '#FF6B9D' },
  }

  return (
    <Layout>
      {/* Hero */}
      <Box sx={{ bgcolor: '#FAFAFA', borderBottom: '1px solid', borderColor: 'grey.100', py: 7 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={800} mb={1}>Contact Us</Typography>
          <Typography color="text.secondary" fontSize={17}>
            Have a question or need help? We&apos;re here for you.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Grid container spacing={6}>
          {/* Left info panel */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={700} mb={1}>Get in touch</Typography>
            <Typography color="text.secondary" mb={4} lineHeight={1.8}>
              Fill in the form and our team will get back to you within 1–2 business days.
            </Typography>

            {/* <Stack spacing={3}>
              {[
                { icon: <EmailOutlinedIcon sx={{ color: '#FF6B9D' }} />, label: 'Email', value: '-' },
                { icon: <PhoneOutlinedIcon sx={{ color: '#FF6B9D' }} />, label: 'Phone', value: '-' },
                { icon: <LocationOnOutlinedIcon sx={{ color: '#FF6B9D' }} />, label: 'Office', value: 'Bangkok, Thailand' },
              ].map(({ icon, label, value }) => (
                <Box key={label} display="flex" alignItems="flex-start" gap={1.5}>
                  <Box mt={0.25}>{icon}</Box>
                  <Box>
                    <Typography fontWeight={600} fontSize={13} color="text.secondary">{label}</Typography>
                    <Typography fontSize={15}>{value}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack> */}

            <Divider sx={{ my: 4 }} />

            <Paper sx={{ bgcolor: '#FFF0F5', borderRadius: 3, p: 3 }} elevation={0}>
              <Typography fontWeight={700} mb={0.5} color="#FF6B9D">Response time</Typography>
              <Typography fontSize={14} color="text.secondary">
                We typically respond within 24 hours on weekdays. For urgent booking issues, please call us directly.
              </Typography>
            </Paper>
          </Grid>

          {/* Right form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 4, p: { xs: 3, md: 5 } }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={600} fontSize={14} mb={0.75}>
                      Name <span style={{ color: '#e53935' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth size="small" placeholder="Your full name"
                      value={form.name} onChange={handleChange('name')}
                      required sx={fieldSx}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={600} fontSize={14} mb={0.75}>
                      Email <span style={{ color: '#e53935' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth size="small" type="email" placeholder="your@email.com"
                      value={form.email} onChange={handleChange('email')}
                      required sx={fieldSx}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={600} fontSize={14} mb={0.75}>
                      Phone <span style={{ color: '#e53935' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth size="small" placeholder="+66 8X XXX XXXX"
                      value={form.phone} onChange={handleChange('phone')}
                      required sx={fieldSx}
                    />
                  </Grid>

                  {/* Contact Type */}
                  <Grid item xs={12} sm={6}>
                    <Typography fontWeight={600} fontSize={14} mb={0.75}>
                      Contact Type <span style={{ color: '#e53935' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small" required sx={fieldSx}>
                      <Select
                        displayEmpty
                        value={form.contactType}
                        onChange={(e) => setForm((p) => ({ ...p, contactType: e.target.value }))}
                        renderValue={(v) => v || <span style={{ color: '#aaa' }}>Please Select</span>}
                      >
                        {CONTACT_TYPES.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Message */}
                  <Grid item xs={12}>
                    <Typography fontWeight={600} fontSize={14} mb={0.75}>
                      Message <span style={{ color: '#e53935' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth multiline rows={5} placeholder="Tell us how we can help..."
                      value={form.message} onChange={handleChange('message')}
                      required sx={fieldSx}
                    />
                  </Grid>

                  {/* Submit */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || !form.name || !form.email || !form.phone || !form.contactType || !form.message}
                      endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                      sx={{
                        bgcolor: '#FF6B9D', '&:hover': { bgcolor: '#e55588' },
                        borderRadius: 3, px: 5, py: 1.5, fontWeight: 700, fontSize: 15,
                        boxShadow: '0 4px 15px rgba(255,107,157,0.35)',
                        '&:disabled': { bgcolor: 'grey.200', color: 'grey.400', boxShadow: 'none' },
                      }}
                    >
                      {loading ? 'Sending…' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Success snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: 2, fontWeight: 600 }} onClose={() => setSuccess(false)}>
          Message sent! We&apos;ll be in touch soon. 🎉
        </Alert>
      </Snackbar>
    </Layout>
  )
}
