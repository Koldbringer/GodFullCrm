"use client"

import { useI18n, useTranslation } from './i18n-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, Globe } from 'lucide-react'

const languages = [
  { code: 'pl', name: 'Polski' },
  { code: 'en', name: 'English' },
]

export function LanguageSwitcher() {
  const { locale, changeLocale } = useI18n()
  const { t } = useTranslation()

  // Find current language name
  const currentLanguage = languages.find(lang => lang.code === locale)?.name || 'Polski'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label={t('accessibility.select_language')}
          aria-haspopup="true"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t('accessibility.select_language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('accessibility.select_language')}</DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLocale(lang.code)}
            className={locale === lang.code ? 'bg-accent font-medium' : ''}
            aria-current={locale === lang.code ? 'true' : 'false'}
          >
            <span className="flex items-center justify-between w-full">
              {lang.name}
              {locale === lang.code && (
                <Check className="h-4 w-4 ml-2" aria-hidden="true" />
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
