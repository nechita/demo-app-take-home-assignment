const MOCK_IMAGES = {
    large: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZmlsbD0iIzU1NSI+TGFyZ2U8L3RleHQ+PC9zdmc+',
    medium: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZmlsbD0iIzU1NSI+TWVkaXVtPC90ZXh0Pjwvc3ZnPg==',
    thumbnail:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZpbGw9IiM1NTUiPlRodW1iPC90ZXh0Pjwvc3ZnPg==',
}

export const MOCK_USER = {
    id: '1',
    name: {
        first: 'John',
        last: 'Doe',
    },
    email: 'john.doe@example.com',
    phone: '+41 79 123 45 67',
    cell: '+41 79 123 45 68',
    login: {
        username: 'johndoe',
    },
    picture: {
        large: MOCK_IMAGES.large,
        medium: MOCK_IMAGES.medium,
        thumbnail: MOCK_IMAGES.thumbnail,
    },
    location: {
        country: 'Switzerland',
        city: 'Zurich',
        street: {
            name: 'Main Street',
            number: 123,
        },
        postcode: '8000',
    },
    nat: 'CH',
}

export const MOCK_USERS = [
    MOCK_USER,
    {
        id: '2',
        name: {
            first: 'Jane',
            last: 'Smith',
        },
        email: 'jane.smith@example.com',
        phone: '+42 79 123 45 67',
        cell: '+42 79 123 45 68',
        login: {
            username: 'janesmith',
        },
        picture: {
            large: MOCK_IMAGES.large,
            medium: MOCK_IMAGES.medium,
            thumbnail: MOCK_IMAGES.thumbnail,
        },
        location: {
            country: 'Germany',
            city: 'Berlin',
            street: {
                name: 'Brandenburg Gate',
                number: 123,
            },
            postcode: '10115',
        },
        nat: 'DE',
    },
]
