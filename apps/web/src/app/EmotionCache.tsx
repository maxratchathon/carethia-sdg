'use client'
import * as React from 'react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider } from '@emotion/react'

export default function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const c = createCache({ key: 'mui' })
    c.compat = true
    const prevInsert = c.insert.bind(c)
    let inserted: string[] = []
    c.insert = (...args) => {
      const serialized = args[1]
      if (c.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prev = inserted
      inserted = []
      return prev
    }
    return { cache: c, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) return null
    let styles = ''
    for (const name of names) {
      styles += cache.inserted[name]
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
