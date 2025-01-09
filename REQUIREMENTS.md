# Address Book App Requirements

## Overview

This document outlines the requirements for building an address book application that allows users to browse, search,
and filter user data fetched from the randomuser.me API.

## Technical Stack

- Next.js 14 (Pages Router)
- TypeScript
- Tailwind CSS
- Shadcn UI components
- PNPM package manager
- Unit testing framework

## Core Features

### Home Page (`/`)

#### User Grid

- Display users in a responsive grid layout
- Each user card must show:
    - Thumbnail picture
    - First name
    - Last name
    - Username
    - Email

#### Infinite Scroll

- Load users in batches of 50
- Maximum catalog size: 1000 users
- Display animated loading state during fetches
- Show "End of users catalog" message at the end
- Optional: Pre-fetch next batch during idle time

#### Search

- Positioned at the top of the page
- Case-insensitive filtering
- Filter by first name + last name
- Sticky positioning on scroll
- Filter only visible users
- Pause infinite loading while search is active
- Clear indication when filtering is active

### Settings Page (`/settings`)

#### Nationality Filter

- Available options:
    - Switzerland (CH)
    - Spain (ES)
    - France (FR)
    - Great Britain (GB)
- Features:
    - Persistent settings between refreshes
    - No page reload on changes
    - Immediate effect on home page content
- Clear navigation between pages

### Optional: User Details Modal

When clicking a user, show modal with:

- Street address
- City
- State
- Postcode
- Phone number
- Cell number
- Closable interface

## Technical Requirements

### API Integration

- Base: randomuser.me API
- Implementation requirements:
    - Batch loading (50 users/request)
    - Nationality filtering
    - Error handling
    - Loading states

### Performance

- Efficient infinite scroll implementation
- Optional: Preemptive data fetching
- Smooth transitions and animations
- Responsive design across devices

### Development Requirements

1. Clean Code

    - Clear variable naming
    - Consistent formatting
    - Proper TypeScript usage
    - Component modularity

2. Testing

    - Comprehensive unit tests
    - Component testing
    - User interaction testing
    - API integration testing

3. Accessibility

    - Semantic HTML
    - ARIA labels where needed
    - Keyboard navigation
    - Screen reader compatibility

4. Documentation
    - Clear README
    - Setup instructions
    - Component documentation
    - API documentation

## Development Guidelines

### Code Organization

- Clear folder structure
- Component modularity
- Consistent file naming
- Proper type definitions

### Version Control

- Clear commit messages
- Logical commit history
- Feature-based branching
- Clean PR descriptions

### Styling

- Tailwind CSS usage
- Consistent design system
- Responsive layouts
- Clean component styling

## Deliverables

1. Complete source code
2. Documentation
3. Test suite
4. Setup instructions

## Timeline

Estimated development time: 8-10 hours

## Success Criteria

- All core features implemented
- Clean, maintainable code
- Comprehensive test coverage
- Smooth user experience
- Accessible interface
