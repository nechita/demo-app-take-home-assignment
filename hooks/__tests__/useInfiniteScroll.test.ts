import { renderHook } from '@testing-library/react'
import { useInfiniteScroll } from '../useInfiniteScroll'

describe('useInfiniteScroll', () => {
    const mockIntersectionObserver = jest.fn()

    beforeEach(() => {
        mockIntersectionObserver.mockReset()
        mockIntersectionObserver.mockReturnValue({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        })
        window.IntersectionObserver = mockIntersectionObserver
    })

    it('does not call onLoadMore when loading', () => {
        const onLoadMore = jest.fn()
        const { result } = renderHook(() =>
            useInfiniteScroll({
                onLoadMore,
                hasMore: true,
                loading: true,
            })
        )

        const element = document.createElement('div')
        result.current.lastElementRef(element)

        expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('calls onLoadMore when element intersects and has more items', () => {
        const onLoadMore = jest.fn()
        const { result } = renderHook(() =>
            useInfiniteScroll({
                onLoadMore,
                hasMore: true,
                loading: false,
            })
        )

        const element = document.createElement('div')
        result.current.lastElementRef(element)

        const [observerCallback] = mockIntersectionObserver.mock.calls[0]
        observerCallback([{ isIntersecting: true }])

        expect(onLoadMore).toHaveBeenCalled()
    })

    it('does not call onLoadMore when element intersects but has no more items', () => {
        const onLoadMore = jest.fn()
        const { result } = renderHook(() =>
            useInfiniteScroll({
                onLoadMore,
                hasMore: false,
                loading: false,
            })
        )

        const element = document.createElement('div')
        result.current.lastElementRef(element)

        const [observerCallback] = mockIntersectionObserver.mock.calls[0]
        observerCallback([{ isIntersecting: true }])

        expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('disconnects observer when component unmounts', () => {
        const disconnect = jest.fn()
        mockIntersectionObserver.mockReturnValue({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect,
        })

        const { result, unmount } = renderHook(() =>
            useInfiniteScroll({
                onLoadMore: jest.fn(),
                hasMore: true,
                loading: false,
            })
        )

        const element = document.createElement('div')
        result.current.lastElementRef(element)

        unmount()

        expect(disconnect).toHaveBeenCalled()
    })
})
