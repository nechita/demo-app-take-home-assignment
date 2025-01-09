import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { UsersList } from '@/components/users/UsersList'
import { MOCK_USERS } from '@/components/users/__mocks__/mockData'

// We don't test the Avatar because of the Radix UI Avatar component works: https://github.com/radix-ui/primitives/issues/1645

describe('UsersList', () => {
    it('renders user information correctly', () => {
        render(<UsersList users={MOCK_USERS} />)

        const testingTable = [
            {
                name: 'John Doe',
                username: 'johndoe',
                email: 'john.doe@example.com',
            },
            {
                name: 'Jane Smith',
                username: 'janesmith',
                email: 'jane.smith@example.com',
            },
        ]

        testingTable.forEach(({ name, username, email }, index) => {
            const cards = screen.getAllByRole('button')
            const card = cards[index]

            expect(card.querySelector('h3')).toHaveTextContent(name)
            expect(card.querySelector('h4')).toHaveTextContent(username)
            expect(card.querySelector('p')).toHaveTextContent(email)
        })
    })
})
