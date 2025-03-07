import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from '@jest/globals'
import StationSearch from '../../src/components/StationSearch'

describe('StationSearch', () => {
    it('should render', () => {
        render(<StationSearch />)
        expect(screen.getByText('Train Station Information')).toBeTruthy()
    })
})  