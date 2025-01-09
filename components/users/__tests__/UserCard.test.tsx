import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { UserCard } from '@/components/users/UserCard'
import { MOCK_USER } from '@/components/users/__mocks__/mockData'

// We don't test the Avatar because of the Radix UI Avatar component works: https://github.com/radix-ui/primitives/issues/1645

describe('UserCard', () => {
    it('renders user information correctly', () => {
        render(<UserCard user={MOCK_USER} />)

        expect(screen.getByText(`${MOCK_USER.name.first} ${MOCK_USER.name.last}`)).toBeInTheDocument()
        expect(screen.getByText(MOCK_USER.login.username)).toBeInTheDocument()
        expect(screen.getByText(MOCK_USER.email)).toBeInTheDocument()
    })

    it('handles keyboard navigation', () => {
        const onClick = jest.fn()
        render(<UserCard user={MOCK_USER} onClick={onClick} />)

        const card = screen.getByRole('button')
        card.focus()

        card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
        expect(onClick).toHaveBeenCalledTimes(1)

        card.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
        expect(onClick).toHaveBeenCalledTimes(2)
    })
})
