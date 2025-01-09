import { render, screen, fireEvent, act } from '@testing-library/react'
import { UserSearch } from '../UserSearch'
import { SEARCH_DEBOUNCE_MS } from '@/utils/constants'

jest.useFakeTimers()

describe('UserSearch', () => {
    it('renders search input', () => {
        render(<UserSearch onSearch={() => {}} nationalities={[]} totalUsers={0} filteredCount={0} />)
        expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
    })

    it('calls onSearch with debounce after user input', () => {
        const handleSearch = jest.fn()
        render(<UserSearch onSearch={handleSearch} nationalities={[]} totalUsers={0} filteredCount={0} />)

        const input = screen.getByPlaceholderText('Search users...')
        fireEvent.change(input, { target: { value: 'john' } })

        expect(handleSearch).not.toHaveBeenCalled()

        act(() => {
            jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS)
        })

        expect(handleSearch).toHaveBeenCalledWith('john')
    })

    it('shows nationality filter message when nationalities are selected', () => {
        render(<UserSearch onSearch={() => {}} nationalities={['CH', 'FR']} totalUsers={0} filteredCount={0} />)
        expect(screen.getByText(/Showing people from 2 nationalities/)).toBeInTheDocument()
        expect(screen.getByText(/(CH, FR)/)).toBeInTheDocument()
    })

    it('shows single nationality message when one nationality is selected', () => {
        render(<UserSearch onSearch={() => {}} nationalities={['CH']} totalUsers={0} filteredCount={0} />)
        expect(screen.getByText(/Showing people from one nationality/)).toBeInTheDocument()
        expect(screen.getByText(/(CH)/)).toBeInTheDocument()
    })

    it('does not show nationality message when no nationalities are selected', () => {
        render(<UserSearch onSearch={() => {}} nationalities={[]} totalUsers={0} filteredCount={0} />)
        expect(screen.queryByText(/Showing people from/)).not.toBeInTheDocument()
    })

    it('has a link to settings page', () => {
        render(<UserSearch onSearch={() => {}} nationalities={['CH']} totalUsers={0} filteredCount={0} />)
        const link = screen.getByText('Change your settings')
        expect(link).toBeInTheDocument()
        expect(link.getAttribute('href')).toBe('/settings')
    })
})
