import React, { memo, useState, useCallback, useRef, useEffect } from 'react'

interface ProgressBarProps {
  vertical?: boolean
  round?: boolean
  percent: number
  onInput?: (num: number) => void
  onChange?: (num: number) => void
  barWidth?: string
  pointSize?: string
  alwaysPoint?: boolean
}

// 原生实现进度条组件
const ProgressBar = memo(
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

    // 来自外部的进度值更新
    useEffect(() => {
      if (!isDragging.current && progress !== percent) {
        setProgress(Math.min(100, Math.max(0, percent)))
      }
    }, [percent, progress])

    // 计算最新进度值
    const calculateNewPercent = useCallback((e: MouseEvent | React.MouseEvent, rect: DOMRect): number => {
      let newPercent: number
      if (vertical) {
        const offsetY = rect.bottom - e.clientY
        newPercent = (offsetY / rect.height) * 100
      } else {
        const offsetX = e.clientX - rect.left
        newPercent = (offsetX / rect.width) * 100
      }
      return Math.min(100, Math.max(0, Math.round(newPercent * 100) / 100))
    }, [vertical])

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
      const newPercent = calculateNewPercent(e, startPoint.current)
      // 与mouseup的区别
      typeof (props.onInput) === 'function' && props.onInput(newPercent)
      setProgress(newPercent)
    }, [vertical, props.onInput])

    // mouseup函数，关闭drag并回传进度值
    // onChange 不涉及state值时，无需dep
    const handleMouseUp = useCallback((e: MouseEvent) => {
      if (!isDragging.current || startPoint.current == null) return
      const newPercent = calculateNewPercent(e, startPoint.current)
      // 与mousemove的区别
      typeof (props.onChange) === 'function' && props.onChange(newPercent)
      setProgress(newPercent)
      // mouseup执行后需移除drag和rect
      isDragging.current = false
      startPoint.current = null
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
    const handleClick = useCallback((e: React.MouseEvent) => {
      if (progressBarRef.current == null) return
      const progressBarRect = progressBarRef.current.getBoundingClientRect()
      const newPercent = calculateNewPercent(e, progressBarRect)
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
