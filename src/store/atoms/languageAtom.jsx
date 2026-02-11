import { atom } from 'jotai'
import { translations } from '@/i18n/translations'

// Language atom
export const languageAtom = atom('en')

// Derived atom for translation function
export const translationAtom = atom((get) => {
  const language = get(languageAtom)
  return (key) => translations[language]?.[key] || translations.en[key] || key
})
