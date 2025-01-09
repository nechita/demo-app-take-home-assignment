// Using interfaces instead of types because we don't need complex type manipulation
export interface User {
    id: string
    name: {
        first: string
        last: string
    }
    login: {
        username: string
    }
    email: string
    phone: string
    cell: string
    picture: {
        large: string
        medium: string
        thumbnail: string
    }
    location: {
        country: string
        city: string
        street: {
            name: string
            number: number
        }
        postcode: string
    }
    nat: string
}

export interface UsersResponse {
    results: User[]
    info: {
        seed: string
        results: number
        page: number
        version: string
    }
}
