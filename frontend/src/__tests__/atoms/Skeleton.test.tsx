import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/atoms/Skeleton'

describe('Skeleton', () => {
  it('renderiza uma linha por padrão', () => {
    const { container } = render(<Skeleton />)
    const bars = container.querySelectorAll('.animate-pulse')
    expect(bars).toHaveLength(1)
  })

  it('renderiza o número correto de linhas', () => {
    const { container } = render(<Skeleton lines={4} />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(4)
  })

  it('aplica classe de altura Tailwind', () => {
    const { container } = render(<Skeleton height="h-8" />)
    expect(container.querySelector('.h-8')).toBeInTheDocument()
  })

  it('aplica classe de largura Tailwind', () => {
    const { container } = render(<Skeleton width="w-1/2" />)
    expect(container.querySelector('.w-1\\/2')).toBeInTheDocument()
  })

  it('aplica classe de border-radius', () => {
    const { container } = render(<Skeleton radius="rounded-full" />)
    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
  })

  it('aplica altura via style quando valor CSS é passado', () => {
    const { container } = render(<Skeleton height="24px" />)
    const bar = container.querySelector('.animate-pulse') as HTMLElement
    expect(bar.style.height).toBe('24px')
  })

  it('aplica largura via style quando valor CSS é passado', () => {
    const { container } = render(<Skeleton width="200px" />)
    const bar = container.querySelector('.animate-pulse') as HTMLElement
    expect(bar.style.width).toBe('200px')
  })

  it('aplica gap personalizado entre linhas', () => {
    const { container } = render(<Skeleton lines={3} gap="gap-4" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('gap-4')
  })

  it('aplica className extra', () => {
    const { container } = render(<Skeleton className="opacity-50" />)
    expect(container.querySelector('.opacity-50')).toBeInTheDocument()
  })

  it('tem animação pulse em todas as linhas', () => {
    const { container } = render(<Skeleton lines={3} />)
    container.querySelectorAll('.animate-pulse').forEach((el) => {
      expect(el).toHaveClass('bg-gray-200')
    })
  })
})
