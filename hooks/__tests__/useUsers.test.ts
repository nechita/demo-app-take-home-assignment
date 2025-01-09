import { renderHook, act } from '@testing-library/react'
import { useUsers } from '../useUsers'
import { fetchUsers } from '@/utils/api'
import { waitFor } from '@testing-library/react'
import { createWrapper } from '@/hooks/test-utils'

const mockUser1 = {
    id: '1',
    name: { first: 'John', last: 'Doe' },
    email: 'john@example.com',
    picture: {
        large: 'large.jpg',
        medium: 'medium.jpg',
        thumbnail: 'thumbnail.jpg',
    },
    location: {
        country: 'Switzerland',
        city: 'Zurich',
        street: { name: 'Main St', number: 123 },
    },
    nat: 'CH',
}

const mockUser2 = {
    id: '2',
    name: { first: 'Jane', last: 'Smith' },
    email: 'jane@example.com',
    picture: {
        large: 'large2.jpg',
        medium: 'medium2.jpg',
        thumbnail: 'thumbnail2.jpg',
    },
    location: {
        country: 'Germany',
        city: 'Berlin',
        street: { name: 'Second St', number: 456 },
    },
    nat: 'DE',
}

const mockUser3 = {
    id: '3',
    name: { first: 'Bob', last: 'Johnson' },
    email: 'bob@example.com',
    picture: {
        large: 'large3.jpg',
        medium: 'medium3.jpg',
        thumbnail: 'thumbnail3.jpg',
    },
    location: {
        country: 'France',
        city: 'Paris',
        street: { name: 'Third St', number: 789 },
    },
    nat: 'FR',
}

jest.mock('@/utils/api')

describe('useUsers', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('fetches and returns users', async () => {
        const mockResponse = {
            results: [mockUser1, mockUser2],
            info: { seed: 'test', results: 2, page: 1, version: '1.0' },
        }
        ;(fetchUsers as jest.Mock).mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useUsers(), {
            wrapper: createWrapper(),
        })

        expect(result.current.loading).toBe(true)
        expect(result.current.users).toEqual([])

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.users).toEqual([mockUser1, mockUser2])
            expect(result.current.error).toBeNull()
        })
    })

    it('filters users by search term', async () => {
        const mockResponse = {
            results: [mockUser1, mockUser2],
            info: { seed: 'test', results: 2, page: 1, version: '1.0' },
        }
        ;(fetchUsers as jest.Mock).mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useUsers({ searchTerm: 'john' }), {
            wrapper: createWrapper(),
        })

        await waitFor(() => {
            expect(result.current.users).toHaveLength(1)
            expect(result.current.users[0].name.first).toBe('John')
        })
    })

    it('handles API errors', async () => {
        const error = new Error('API Error')
        Object.assign(error, { code: 'API_ERROR', status: 500 })
        ;(fetchUsers as jest.Mock).mockRejectedValue(error)

        const { result } = renderHook(() => useUsers(), {
            wrapper: createWrapper(),
        })

        await waitFor(() => {
            expect(result.current.error).toEqual({
                message: 'API Error',
                code: 'API_ERROR',
                status: 500,
            })
            expect(result.current.users).toEqual([])
            expect(result.current.loading).toBe(false)
        })
    })

    it('loads more users when loadMore is called', async () => {
        const firstResponse = {
            results: [mockUser1, mockUser2],
            info: { seed: 'test', results: 2, page: 1, version: '1.0' },
        }
        const secondResponse = {
            results: [mockUser3],
            info: { seed: 'test', results: 1, page: 2, version: '1.0' },
        }
        ;(fetchUsers as jest.Mock).mockResolvedValueOnce(firstResponse).mockResolvedValueOnce(secondResponse)

        const { result } = renderHook(() => useUsers(), {
            wrapper: createWrapper(),
        })

        await waitFor(() => {
            expect(result.current.users).toHaveLength(2)
        })

        act(() => {
            result.current.loadMore()
        })

        await waitFor(() => {
            expect(result.current.users).toHaveLength(3)
            expect(result.current.users[2]).toEqual(mockUser3)
        })
    })
})
