import { useAtomValue } from 'jotai'
import { translationAtom } from '@/store/atoms'

/**
 * Returns the translation function from the global language atom.
 * Usage: const t = useTranslation()
 */
export function useTranslation() {
  return useAtomValue(translationAtom)
}
