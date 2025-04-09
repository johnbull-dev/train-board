import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, jest } from '@jest/globals'
import StationSearch from '../../src/components/StationSearch'

const mockSearchParams = {
  get: jest.fn().mockReturnValue(null),
  has: jest.fn().mockReturnValue(false),
  getAll: jest.fn().mockReturnValue([]),
  forEach: jest.fn(),
  entries: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  toString: jest.fn().mockReturnValue('')
}

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams
}))

describe('StationSearch', () => {
    it('should render', () => {
        render(<StationSearch />)
        expect(screen.getByText('Train Bored - Train Times')).toBeTruthy()
    })
})  