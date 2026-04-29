'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'wakeparks-cookie-consent-v1'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== 'accepted')
    } catch {
      setVisible(false)
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-2xl backdrop-blur">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Мы используем локальное хранилище браузера</p>
          <p className="mt-1">
            Оно нужно для избранного, сравнения парков, темы интерфейса и сохранения этого уведомления. Подробнее — на странице{' '}
            <Link className="text-primary underline" href="/cookies">Cookie</Link>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-full border border-border px-4 py-2 text-sm font-medium" href="/privacy">
            Политика ПДн
          </Link>
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={accept} type="button">
            Понятно
          </button>
        </div>
      </div>
    </div>
  )
}
