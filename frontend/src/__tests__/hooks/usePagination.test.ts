import { renderHook, act } from '@testing-library/react'
import { usePagination } from '@/hooks/usePagination'

const items = Array.from({ length: 25 }, (_, i) => i + 1)

describe('usePagination', () => {
  it('começa na página 1', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    expect(result.current.page).toBe(1)
  })

  it('calcula totalPages corretamente', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    expect(result.current.totalPages).toBe(3)
  })

  it('retorna a fatia correta na página 1', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    expect(result.current.paged).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('next() avança para a próxima página', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    act(() => result.current.next())
    expect(result.current.page).toBe(2)
    expect(result.current.paged[0]).toBe(11)
  })

  it('next() não passa de totalPages', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.next())
    expect(result.current.page).toBe(3)
  })

  it('prev() volta para a página anterior', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    act(() => result.current.next())
    act(() => result.current.prev())
    expect(result.current.page).toBe(1)
  })

  it('prev() não vai abaixo de 1', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    act(() => result.current.prev())
    expect(result.current.page).toBe(1)
  })

  it('reset() volta para a página 1', () => {
    const { result } = renderHook(() => usePagination(items, 10))
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.reset())
    expect(result.current.page).toBe(1)
  })

  it('lista vazia resulta em totalPages = 1', () => {
    const { result } = renderHook(() => usePagination([], 10))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.paged).toEqual([])
  })
})
