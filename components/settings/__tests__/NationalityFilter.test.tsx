import { render, screen, fireEvent } from '@testing-library/react'
import { NationalityFilter } from '../NationalityFilter'
import { NATIONALITIES } from '@/utils/constants'

describe('NationalityFilter', () => {
    it('renders all available nationalities', () => {
        render(<NationalityFilter selectedNationalities={[]} onToggle={() => {}} />)

        NATIONALITIES.forEach((nationality) => {
            expect(screen.getByText(`${nationality.name} (${nationality.code})`)).toBeInTheDocument()
        })
    })

    it('shows correct checked state for selected nationalities', () => {
        const selectedNationalities = ['CH', 'FR']
        render(<NationalityFilter selectedNationalities={selectedNationalities} onToggle={() => {}} />)

        const swissCheckbox = screen.getByRole('checkbox', { name: /Swiss/i })
        const frenchCheckbox = screen.getByRole('checkbox', { name: /French/i })
        const britishCheckbox = screen.getByRole('checkbox', { name: /British/i })

        expect(swissCheckbox).toBeChecked()
        expect(frenchCheckbox).toBeChecked()
        expect(britishCheckbox).not.toBeChecked()
    })

    it('calls onToggle with correct nationality code when clicked', () => {
        const handleToggle = jest.fn()
        render(<NationalityFilter selectedNationalities={[]} onToggle={handleToggle} />)

        fireEvent.click(screen.getByRole('checkbox', { name: /Swiss/i }))
        expect(handleToggle).toHaveBeenCalledWith('CH')
    })

    it('displays correct message when some nationalities are selected', () => {
        const selectedNationalities = ['CH', 'FR']
        render(<NationalityFilter selectedNationalities={selectedNationalities} onToggle={() => {}} />)

        expect(screen.getByText(/Showing people from: CH, FR/i)).toBeInTheDocument()
    })

    it('displays correct message when no nationalities are selected', () => {
        render(<NationalityFilter selectedNationalities={[]} onToggle={() => {}} />)

        expect(
            screen.getByText(/No nationality filter applied - showing people from all countries/i)
        ).toBeInTheDocument()
    })
})
