'use client'
import * as React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import EmotionCacheProvider from './EmotionCache'

const theme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' },
    secondary: { main: '#C06C84' },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
  },
})

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCacheProvider>
  )
}
