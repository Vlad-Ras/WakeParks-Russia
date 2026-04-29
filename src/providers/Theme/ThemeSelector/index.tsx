'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from '../types'

import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'

type ThemeSelectValue = Theme | 'auto'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState<ThemeSelectValue>('auto')

  const onThemeChange = (themeToSet: ThemeSelectValue) => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
      return
    }

    setTheme(themeToSet)
    setValue(themeToSet)
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference === 'light' || preference === 'dark' ? preference : 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Выбрать тему"
        className="w-[150px] border-white/20 bg-white/10 text-white"
      >
        <SelectValue placeholder="Тема" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Авто</SelectItem>
        <SelectItem value="light">Светлая</SelectItem>
        <SelectItem value="dark">Тёмная</SelectItem>
      </SelectContent>
    </Select>
  )
}
