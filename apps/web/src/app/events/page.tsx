'use client'
import React, { useEffect, useState } from 'react'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, Stack, Button, Avatar, Divider, Paper,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Layout from '@/components/Layout'

type EventCard = {
  id: number
  title: string
  badge: string
  badgeColor: string
  badgeBg: string
  date: string
  location: string
  category: string
  categoryColor: string
  description: string
  highlights: string[]
  attendees: number
  maxAttendees: number
  image: string
  host: { name: string; avatar: string }
}

type TicketmasterEvent = {
  id: string
  name: string
  url?: string
  images?: { url: string; ratio?: string; width?: number; height?: number }[]
  dates?: { start?: { localDate?: string; localTime?: string } }
  classifications?: Array<{ segment?: { name?: string }; genre?: { name?: string } }>
  priceRanges?: Array<{ min?: number; max?: number; currency?: string }>
  _embedded?: {
    venues?: Array<{ name?: string; city?: { name?: string }; country?: { countryCode?: string } }>
    attractions?: Array<{ name?: string }>
  }
}

type TicketmasterSearchResponse = {
  _embedded?: {
    events?: TicketmasterEvent[]
  }
}

const FALLBACK_EVENTS: EventCard[] = [
  {
    id: 1,
    title: 'Caregiver Skills Workshop',
    badge: 'Free Event',
    badgeColor: '#2ECC71',
    badgeBg: '#F0FFF7',
    date: 'Sat, 15 Mar 2026',
    location: 'Chiang Mai City, Chiang Mai',
    category: 'Workshop',
    categoryColor: '#6C63FF',
    description:
      'Join our hands-on workshop designed for both new and experienced caregivers. Learn essential care techniques, communication skills, and best practices directly from certified professionals.',
    highlights: ['CPR & First Aid basics', 'Special-needs communication tips', 'Medication reminders 101', 'Q&A with special needs care experts'],
    attendees: 48,
    maxAttendees: 60,
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80',
    host: { name: 'Carethia Learning Team', avatar: 'https://i.pravatar.cc/40?img=47' },
  },
  {
    id: 2,
    title: 'Family Caregivers Networking Night',
    badge: 'Community',
    badgeColor: '#FF6B9D',
    badgeBg: '#FFF0F5',
    date: 'Sun, 22 Mar 2026',
    location: 'Phuket Town, Phuket',
    category: 'Networking',
    categoryColor: '#FF6B9D',
    description:
      'A warm, judgment-free evening for family caregivers across Thailand to connect, share stories, and support each other. Light refreshments provided. Children welcome.',
    highlights: ['Speed-networking rounds', 'Peer support circle', 'Resource sharing board', 'Carethia app demo'],
    attendees: 62,
    maxAttendees: 80,
    image: 'https://images.unsplash.com/photo-1607748851687-ba9a10438621?w=600&q=80',
    host: { name: 'Carethia Community', avatar: 'https://i.pravatar.cc/40?img=45' },
  },
  {
    id: 3,
    title: 'Child First Aid Certification',
    badge: 'Limited Seats',
    badgeColor: '#E67E22',
    badgeBg: '#FFF5EC',
    date: 'Sat, 5 Apr 2026',
    location: 'Khon Kaen City, Khon Kaen',
    category: 'Certification',
    categoryColor: '#E74C3C',
    description:
      'Earn your Child First Aid certificate in one day. Covering choking, burns, allergic reactions, and emergency protocols. Certification recognized by Thai Ministry of Public Health.',
    highlights: ['Official MOPH-recognized cert', 'Hands-on mannequin training', 'Pediatric CPR', 'Take-home emergency guide'],
    attendees: 28,
    maxAttendees: 30,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
    host: { name: 'Dr. Siriporn Malee, RN', avatar: 'https://i.pravatar.cc/40?img=44' },
  },
]

const PAST_EVENTS = [
  { title: 'Dementia Care 101', date: 'Feb 2026', attendees: 74, icon: '🧠' },
  { title: 'Parent & Caregiver Mixer', date: 'Jan 2026', attendees: 93, icon: '🤝' },
  { title: 'Inclusive Home Support Workshop', date: 'Dec 2025', attendees: 55, icon: '🏡' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<EventCard[]>(FALLBACK_EVENTS)
  const [eventsDataSource, setEventsDataSource] = useState<'city-api' | 'fallback'>('fallback')
  const [registered, setRegistered] = useState<number[]>([])

  useEffect(() => {
    const loadCityEvents = async () => {
      const city = process.env.NEXT_PUBLIC_EVENTS_CITY || ''
      const countryCode = process.env.NEXT_PUBLIC_EVENTS_COUNTRY_CODE || 'TH'
      const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY
      const topicKeyword = process.env.NEXT_PUBLIC_EVENTS_KEYWORD || 'special needs caregiving disability autism therapy support'
      const relevanceTerms = ['special need', 'caregiver', 'caregiving', 'disability', 'autism', 'therapy', 'inclusive', 'support']

      try {
        if (!apiKey) {
          throw new Error('Missing NEXT_PUBLIC_TICKETMASTER_API_KEY')
        }

        const params = new URLSearchParams({
          apikey: apiKey,
          countryCode,
          keyword: topicKeyword,
          size: '6',
          sort: 'date,asc',
          locale: '*',
        })
        if (city) params.set('city', city)

        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`)

        if (!response.ok) {
          throw new Error('Unable to load city events')
        }

        const data: TicketmasterSearchResponse = await response.json()
        const upcoming = (data._embedded?.events ?? []).filter((event) => {
          const segment = event.classifications?.[0]?.segment?.name || ''
          const genre = event.classifications?.[0]?.genre?.name || ''
          const haystack = `${event.name} ${segment} ${genre}`.toLowerCase()
          return relevanceTerms.some((term) => haystack.includes(term))
        })

        if (!upcoming.length) {
          throw new Error('No relevant special-needs events found')
        }

        const mapped: EventCard[] = upcoming.map((event, idx) => {
          const venue = event._embedded?.venues?.[0]
          const segment = event.classifications?.[0]?.segment?.name || 'City Event'
          const genre = event.classifications?.[0]?.genre?.name
          const localDate = event.dates?.start?.localDate
          const localTime = event.dates?.start?.localTime
          const bestImage = event.images?.find((img) => img.ratio === '16_9')?.url || event.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80'
          const hasPrice = typeof event.priceRanges?.[0]?.min === 'number'
          const minPrice = event.priceRanges?.[0]?.min
          const currency = event.priceRanges?.[0]?.currency || 'THB'
          const dateLabel = localDate
            ? new Date(`${localDate}T${localTime || '00:00:00'}`).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'Date TBA'

          const venueCity = venue?.city?.name
          const locationLabel = venueCity ? `${venueCity}, Thailand` : city ? `${city}, Thailand` : 'Thailand'
          const scopeLabel = city ? `${city}, Thailand` : 'Thailand'

          return {
            id: 2000 + idx,
            title: event.name,
            badge: hasPrice ? `From ${minPrice} ${currency}` : 'Free / TBA',
            badgeColor: hasPrice ? '#E67E22' : '#2ECC71',
            badgeBg: hasPrice ? '#FFF5EC' : '#F0FFF7',
            date: dateLabel,
            location: locationLabel,
            category: segment,
            categoryColor: '#6C63FF',
            description: `${event.name} in ${scopeLabel}. ${genre ? `Topic: ${genre}. ` : ''}Potentially relevant for special-needs caregiving families and support professionals.`,
            highlights: [
              `Venue: ${venue?.name || 'TBA'}`,
              `Category: ${segment}${genre ? ` / ${genre}` : ''}`,
              'Live city-level feed filtered for special-needs care topics',
            ],
            attendees: 20 + idx * 7,
            maxAttendees: 80,
            image: bestImage,
            host: { name: venue?.name || 'Ticketmaster Listing', avatar: 'https://i.pravatar.cc/40?img=33' },
          }
        })

        setEvents(mapped)
        setEventsDataSource('city-api')
      } catch {
        setEvents(FALLBACK_EVENTS)
        setEventsDataSource('fallback')
      }
    }

    loadCityEvents()
  }, [])

  const toggle = (id: number) =>
    setRegistered((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <Layout>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FFF0F5 0%, #F3F2FF 60%, #F0FFFB 100%)',
          py: { xs: 7, md: 10 },
          borderBottom: '1px solid',
          borderColor: 'grey.100',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,107,157,0.07)', pointerEvents: 'none' }} />
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Chip label="Community Events" sx={{ bgcolor: '#FFF0F5', color: '#FF6B9D', fontWeight: 700, mb: 2, border: '1px solid #FFCCE4' }} />
            <Typography variant="h3" fontWeight={800} mb={1.5}>
              Grow Together with Carethia
            </Typography>
            <Typography color="text.secondary" fontSize="1.05rem" maxWidth={540} mx="auto" lineHeight={1.7}>
              Free workshops, networking nights, and certifications — all built for caregivers and the families they support across Thailand.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        {/* Upcoming Events */}
        <Box mb={2}>
          <Typography variant="h5" fontWeight={800} mb={0.5}>Upcoming Events</Typography>
          <Typography color="text.secondary" fontSize={14}>
            {eventsDataSource === 'city-api'
              ? 'Live Thailand events feed (special-needs filtered)'
              : 'Curated special-needs events (fallback mode - set NEXT_PUBLIC_TICKETMASTER_API_KEY for live events)'}
          </Typography>
        </Box>

        <Grid container spacing={4} mb={8}>
          {events.map((event) => {
            const isReg = registered.includes(event.id)
            const spotsLeft = event.maxAttendees - event.attendees
            const isFull = spotsLeft <= 0

            return (
              <Grid item xs={12} md={4} key={event.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isReg ? `0 8px 32px ${event.categoryColor}30` : '0 4px 20px rgba(0,0,0,0.07)',
                    border: '2px solid',
                    borderColor: isReg ? event.categoryColor : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 36px ${event.categoryColor}25` },
                  }}
                >
                  {/* Image */}
                  <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={event.image}
                      alt={event.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      <Chip
                        label={event.badge}
                        size="small"
                        sx={{ bgcolor: event.badgeBg, color: event.badgeColor, fontWeight: 700, fontSize: 11, border: `1px solid ${event.badgeColor}40` }}
                      />
                    </Box>
                    {spotsLeft <= 5 && !isFull && (
                      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <Chip label={`${spotsLeft} spots left`} size="small" sx={{ bgcolor: '#FFF5EC', color: '#E67E22', fontWeight: 700, fontSize: 11 }} />
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Chip label={event.category} size="small" sx={{ alignSelf: 'flex-start', mb: 1.5, bgcolor: `${event.categoryColor}15`, color: event.categoryColor, fontWeight: 700, fontSize: 11 }} />
                    <Typography variant="h6" fontWeight={800} mb={1.5} lineHeight={1.3}>{event.title}</Typography>

                    <Stack spacing={0.75} mb={2}>
                      <Box display="flex" alignItems="center" gap={0.75}>
                        <Typography fontSize={13} color="text.secondary" fontWeight={600}>{event.date}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.75}>
                        <Typography fontSize={13} color="text.secondary">{event.location}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.75}>
                        <Typography fontSize={13} color="text.secondary">{event.attendees} / {event.maxAttendees} registered</Typography>
                      </Box>
                    </Stack>

                    <Typography color="text.secondary" fontSize={13} lineHeight={1.65} mb={2}>{event.description}</Typography>

                    {/* Highlights */}
                    <Box mb={2.5} flexGrow={1}>
                      {event.highlights.map((h) => (
                        <Box key={h} display="flex" alignItems="flex-start" gap={0.75} mb={0.5}>
                          <Typography fontSize={12} color={event.categoryColor} mt={0.1}>✓</Typography>
                          <Typography fontSize={12} color="text.secondary">{h}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Host */}
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Avatar src={event.host.avatar} sx={{ width: 28, height: 28 }} />
                      <Typography fontSize={12} color="text.secondary">Hosted by <strong>{event.host.name}</strong></Typography>
                    </Box>

                    {/* Attendance bar */}
                    <Box mb={2}>
                      <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'grey.100', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${(event.attendees / event.maxAttendees) * 100}%`, bgcolor: isFull ? '#E74C3C' : event.categoryColor, borderRadius: 2, transition: 'width 0.5s' }} />
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant={isReg ? 'outlined' : 'contained'}
                      disabled={isFull && !isReg}
                      onClick={() => toggle(event.id)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        py: 1.25,
                        ...(isReg
                          ? { borderColor: event.categoryColor, color: event.categoryColor }
                          : { background: `linear-gradient(135deg, ${event.categoryColor}, #C06C84)`, boxShadow: `0 4px 14px ${event.categoryColor}40` }),
                      }}
                    >
                      {isFull && !isReg ? 'Fully Booked' : isReg ? '✓ Registered — Cancel' : 'Register Now →'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* Past Events */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={800} mb={0.5}>Past Events</Typography>
          <Typography color="text.secondary" fontSize={14} mb={3}>Missed one? We run similar events regularly.</Typography>
          <Grid container spacing={2}>
            {PAST_EVENTS.map((e) => (
              <Grid item xs={12} sm={4} key={e.title}>
                <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, display: 'flex', alignItems: 'center', gap: 2, borderColor: 'grey.200' }}>
                  <Typography fontSize={28}>{e.icon}</Typography>
                  <Box flexGrow={1}>
                    <Typography fontWeight={700} fontSize={14}>{e.title}</Typography>
                    <Typography fontSize={12} color="text.secondary">{e.date} · {e.attendees} attended</Typography>
                  </Box>
                  <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ color: '#FF6B9D', fontWeight: 600, fontSize: 11, flexShrink: 0 }}>Recap</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Newsletter CTA */}
        <Box sx={{ mt: 4, background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', borderRadius: 5, p: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography fontSize={40} mb={1}>📬</Typography>
          <Typography variant="h5" fontWeight={800} color="white" mb={1}>Never Miss an Event</Typography>
          <Typography color="grey.400" mb={3} maxWidth={400} mx="auto">Get notified about upcoming workshops, networking nights, and free certifications in your city.</Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ background: 'linear-gradient(135deg, #FF6B9D, #C06C84)', borderRadius: 6, px: 5, fontWeight: 700, boxShadow: '0 6px 20px rgba(255,107,157,0.4)' }}
          >
            Subscribe to Event Updates
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}



