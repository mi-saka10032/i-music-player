import { type FC, memo, useState, useCallback, useRef, useEffect } from 'react'

interface ProgressBarProps {
  vertical?: boolean
  round?: boolean
  percent: number
  onInput?: (percent: number) => void
  onChange?: (percent: number) => void
  barWidth?: string
  pointSize?: string
  alwaysPoint?: boolean
}

// 原生实现音量进度条组件
const ProgressBar: FC<ProgressBarProps> = memo(
  (props: ProgressBarProps) => {
    const vertical = props.vertical ?? false
    const round = props.round ?? false
    const alwaysPoint = props.alwaysPoint ?? false
    const barWidth = props.barWidth ?? '2px'
    const pointSize = props.pointSize ?? '12px'
    const percent = props.percent
    // 进度条div元素
    const progressBarRef = useRef<HTMLDivElement | null>(null)
    // 进度条div元素的矩形元素对象
    const startPoint = useRef< DOMRect | null>()
    // 进度值
    const [progress, setProgress] = useState<number>(() => Math.min(100, Math.max(0, percent)))
    // 拖拽判断
    const isDragging = useRef(false)

    useEffect(() => {
      if (!isDragging.current) {
        setProgress(Math.min(100, Math.max(0, percent)))
      }
    }, [percent])

    // mousedown函数，设置Rect对象，开启drag
    const handleMouseDown = useCallback(() => {
      if (progressBarRef.current != null) {
        startPoint.current = progressBarRef.current.getBoundingClientRect()
      }
      isDragging.current = true
    }, [])

    // mousemove函数，一般只有drag判断变动时才会重新触发
    // onInput 不涉及state值时，无需dep
    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging.current || startPoint.current == null) return
      let newPercent: number
      const start = startPoint.current
      if (vertical) {
        const offsetY = start.bottom - e.clientY
        newPercent = (offsetY / start.height) * 100
      } else {
        const offsetX = e.clientX - start.left
        newPercent = (offsetX / start.width) * 100
      }
      newPercent = Math.min(
        100,
        Math.max(0, Math.round(newPercent * 100) / 100)
      )
      setProgress(newPercent)
      typeof (props.onInput) === 'function' && props.onInput(newPercent)
    }, [vertical, props.onInput])

    // mouseup函数，关闭drag并回传进度值
    // onChange 不涉及state值时，无需dep
    const handleMouseUp = useCallback((e: MouseEvent) => {
      if (!isDragging.current || startPoint.current == null) return
      isDragging.current = false
      let newPercent: number
      const start = startPoint.current
      if (vertical) {
        const offsetY = start.bottom - e.clientY
        newPercent = (offsetY / start.height) * 100
      } else {
        const offsetX = e.clientX - start.left
        newPercent = (offsetX / start.width) * 100
      }
      newPercent = Math.min(
        100,
        Math.max(0, Math.round(newPercent * 100) / 100)
      )
      typeof (props.onChange) === 'function' && props.onChange(newPercent)
    }, [vertical, props.onChange])

    useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }, [handleMouseMove, handleMouseUp])

    // mouseClick函数，单次进度值设置
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (progressBarRef.current == null) return
      const progressBarRect = progressBarRef.current.getBoundingClientRect()

      let newPercent: number
      if (vertical) {
        const offsetY = progressBarRect.top + progressBarRect.height - e.clientY
        newPercent = (offsetY / progressBarRect.height) * 100
      } else {
        const offsetX = e.clientX - progressBarRect.left
        newPercent = (offsetX / progressBarRect.width) * 100
      }
      newPercent = Math.min(
        100,
        Math.max(0, Math.round(newPercent * 100) / 100)
      )
      setProgress(newPercent)
      typeof (props.onInput) === 'function' && props.onInput(newPercent)
      typeof (props.onChange) === 'function' && props.onChange(newPercent)
    }, [props.onInput, props.onChange])

    return (
      <div
        className="bg-[#e5e5e5] relative"
        ref={progressBarRef}
        style={{
          width: vertical ? barWidth : '100%',
          height: vertical ? '100%' : barWidth,
          borderRadius: round ? '9999px' : '0'
        }}
      >
        <div
          className="absolute left-0 bottom-0 bg-primary "
          style={{
            height: vertical ? `${progress}%` : '100%',
            width: vertical ? '100%' : `${progress}%`,
            borderRadius: round ? '9999px' : '0'
          }}
        ></div>
        <div
          className="group/progress absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            width: vertical ? pointSize : '100%',
            height: vertical ? '100%' : pointSize
          }}
          onClick={handleClick}
        >
          <div
            className="absolute bg-primary rounded-full cursor-grab hidden group-hover/progress:inline-block"
            style={{
              width: pointSize,
              height: pointSize,
              transform: vertical ? 'translateY(50%)' : 'translateX(-50%)',
              left: vertical ? '0' : `${progress}%`,
              bottom: vertical ? `${progress}%` : '0',
              ...alwaysPoint && { display: 'inline-block' }
            }}
            onMouseDown={handleMouseDown}
          ></div>
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'
export default ProgressBar
