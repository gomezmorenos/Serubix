import { describe, it, expect, vi, beforeEach } from 'vitest'
import { contentService } from '../../services/content.service'
import { AppError } from '../../lib/errors'

const mockCreate = vi.hoisted(() => vi.fn())
const mockUpdate = vi.hoisted(() => vi.fn())
const mockFindMany = vi.hoisted(() => vi.fn())
const mockFindFirst = vi.hoisted(() => vi.fn())

vi.mock('../../lib/prisma', () => ({
  prisma: {
    generatedContent: {
      create: mockCreate,
      update: mockUpdate,
      findMany: mockFindMany,
      findFirst: mockFindFirst,
    },
  },
}))

describe('contentService', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('createPending', () => {
    it('crea un registro con status pending', async () => {
      mockCreate.mockResolvedValue({ id: 'c1', status: 'pending' })
      const result = await contentService.createPending('u1', 'tts', 'Hola mundo')
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { userId: 'u1', tool: 'tts', label: 'Hola mundo', status: 'pending' },
        }),
      )
      expect(result.status).toBe('pending')
    })
  })

  describe('markDone', () => {
    it('actualiza el registro a status done con filename', async () => {
      mockUpdate.mockResolvedValue({ id: 'c1', status: 'done', filename: 'c1.mp3' })
      const result = await contentService.markDone('c1', 'c1.mp3')
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'c1' },
          data: { status: 'done', filename: 'c1.mp3' },
        }),
      )
      expect(result.status).toBe('done')
    })
  })

  describe('markError', () => {
    it('actualiza el registro a status error', async () => {
      mockUpdate.mockResolvedValue({ id: 'c1', status: 'error' })
      await contentService.markError('c1')
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'c1' },
          data: { status: 'error' },
        }),
      )
    })
  })

  describe('getRecent', () => {
    it('devuelve los items de los últimos 7 días ordenados por fecha desc', async () => {
      const items = [{ id: 'c1', tool: 'tts', status: 'done' }]
      mockFindMany.mockResolvedValue(items)
      const result = await contentService.getRecent('u1')
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'u1' }),
          orderBy: { createdAt: 'desc' },
        }),
      )
      expect(result).toEqual(items)
    })

    it('devuelve array vacío si no hay items', async () => {
      mockFindMany.mockResolvedValue([])
      const result = await contentService.getRecent('u1')
      expect(result).toEqual([])
    })
  })

  describe('getById', () => {
    it('devuelve el item si existe y pertenece al usuario', async () => {
      const item = { id: 'c1', userId: 'u1', status: 'done', filename: 'c1.mp3' }
      mockFindFirst.mockResolvedValue(item)
      const result = await contentService.getById('c1', 'u1')
      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'c1', userId: 'u1' } }),
      )
      expect(result).toEqual(item)
    })

    it('lanza AppError 404 si no se encuentra', async () => {
      mockFindFirst.mockResolvedValue(null)
      await expect(contentService.getById('c1', 'u1')).rejects.toBeInstanceOf(AppError)
      await expect(contentService.getById('c2', 'u1')).rejects.toMatchObject({ statusCode: 404 })
    })
  })
})
