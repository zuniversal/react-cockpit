import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

type ScrollMeta = {
  scrollTop: number
  scrollBottom: number
  scrollLeft: number
  scrollHeight: number
  scrollWidth: number
  offsetWidth: number
  offsetHeight: number
}

type ScrollPositionRef = RefObject<HTMLElement> | MutableRefObject<HTMLElement>

export function useElementScroll(ref?: ScrollPositionRef): ScrollMeta {
  const el = useMemo(() => {
    return ref ? ref.current : document.documentElement
  }, [ref])

  const getPosition = useCallback(() => {
    if (!el) {
      return {
        scrollTop: 0,
        scrollBottom: 0,
        scrollLeft: 0,
        scrollHeight: 0,
        scrollWidth: 0,
        offsetWidth: 0,
        offsetHeight: 0,
      }
    }
    return {
      scrollTop: el.scrollTop,
      scrollBottom: el.scrollTop + el.offsetHeight,
      scrollLeft: el.scrollLeft,
      scrollHeight: el.scrollHeight,
      scrollWidth: el.scrollWidth,
      offsetWidth: el.offsetWidth,
      offsetHeight: el.offsetHeight,
    }
  }, [el])

  const [rect, setRect] = useState(getPosition())

  useEffect(() => {
    if (el) {
      setRect(getPosition())
      const onScroll = () => {
        requestAnimationFrame((): void => {
          setRect(getPosition())
        })
      }
      const target = el === document.documentElement ? window : el
      target.addEventListener('scroll', onScroll)

      return (): void => {
        target.removeEventListener('scroll', onScroll)
      }
    }
  }, [el, getPosition])

  return rect
}
