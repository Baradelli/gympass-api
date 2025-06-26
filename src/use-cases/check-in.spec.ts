import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest'
import { InMemoryCheckInsrepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsrepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsrepository()
    sut = new CheckinUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be albe to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 3, 12, 14, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be albe to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 12, 14, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    vi.setSystemTime(new Date(2023, 3, 13, 14, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
