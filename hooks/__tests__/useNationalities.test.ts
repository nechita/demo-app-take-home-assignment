import { renderHook, act } from '@testing-library/react'
import { useNationalities } from '../useNationalities'
import { LOCAL_STORAGE_NATIONALITIES_KEY } from '@/utils/constants'

describe('useNationalities', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('initializes with empty array when no stored nationalities', () => {
        const { result } = renderHook(() => useNationalities())
        expect(result.current.selectedNationalities).toEqual([])
    })

    it('initializes with stored nationalities from localStorage', () => {
        const storedNationalities = ['CH', 'DE']
        localStorage.setItem(LOCAL_STORAGE_NATIONALITIES_KEY, JSON.stringify(storedNationalities))

        const { result } = renderHook(() => useNationalities())
        expect(result.current.selectedNationalities).toEqual(storedNationalities)
    })

    it('toggles nationality correctly', () => {
        const { result } = renderHook(() => useNationalities())

        act(() => {
            result.current.toggleNationality('CH')
        })
        expect(result.current.selectedNationalities).toEqual(['CH'])

        act(() => {
            result.current.toggleNationality('DE')
        })
        expect(result.current.selectedNationalities).toEqual(['CH', 'DE'])

        act(() => {
            result.current.toggleNationality('CH')
        })
        expect(result.current.selectedNationalities).toEqual(['DE'])
    })

    it('persists changes to localStorage', () => {
        const { result } = renderHook(() => useNationalities())

        act(() => {
            result.current.toggleNationality('CH')
        })

        const stored = localStorage.getItem(LOCAL_STORAGE_NATIONALITIES_KEY)
        expect(JSON.parse(stored!)).toEqual(['CH'])
    })

    it('allows setting nationalities directly', () => {
        const { result } = renderHook(() => useNationalities())

        act(() => {
            result.current.setSelectedNationalities(['FR', 'DE'])
        })

        expect(result.current.selectedNationalities).toEqual(['FR', 'DE'])
        const stored = localStorage.getItem(LOCAL_STORAGE_NATIONALITIES_KEY)
        expect(JSON.parse(stored!)).toEqual(['FR', 'DE'])
    })
})
