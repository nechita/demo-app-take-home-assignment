import { useState, useEffect } from 'react'
import { LOCAL_STORAGE_NATIONALITIES_KEY } from '@/utils/constants'

export const useNationalities = () => {
    const [selectedNationalities, setSelectedNationalities] = useState<string[]>(() => {
        if (typeof window === 'undefined') return []

        const stored = localStorage.getItem(LOCAL_STORAGE_NATIONALITIES_KEY)
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_NATIONALITIES_KEY, JSON.stringify(selectedNationalities))
    }, [selectedNationalities])

    const toggleNationality = (nationalityCode: string) => {
        setSelectedNationalities((prev) =>
            prev.includes(nationalityCode)
                ? prev.filter((code) => code !== nationalityCode)
                : [...prev, nationalityCode]
        )
    }

    return {
        selectedNationalities,
        toggleNationality,
        setSelectedNationalities,
    }
}
