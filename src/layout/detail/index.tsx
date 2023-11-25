import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Row, Col } from 'antd'
import { Lrc, type LrcLine, useRecoverAutoScrollImmediately } from 'react-lrc'
import { getSongLyric } from '@/api'
import { staticLyricTrans } from '@/utils/formatter'
import { type SongData } from '@/core/playerType'
import styles from './index.module.less'
import Needle from '@/assets/png/playing_page_needle.png'
import Disc from '@/assets/png/playing_page_disc.png'
import ArrowDown from '@/assets/svg/arrow-down.svg?react'

interface DetailProps {
  detailRef: React.MutableRefObject<boolean>
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
  playlistId: number
  playlistName: string
  songItem: SongData | null
  playStatus: MediaSessionPlaybackState
  progress: number
}

const Detail = memo((props: DetailProps) => {
  // 切换Detail显示/隐藏
  const switchDetailStatus = useCallback(() => {
    props.detailRef.current = false
    props.setShowDetail(props.detailRef.current)
  }, [])

  // 探针旋转状态判断
  const needRotating = useMemo<string>(() => {
    return props.playStatus === 'playing' ? 'rotate(0)' : 'rotate(-45deg)'
  }, [props.playStatus])

  // 碟片旋转状态判断
  const discRotating = useMemo<React.CSSProperties>(() => {
    return {
      animationDuration: '20s',
      animationPlayState: props.playStatus === 'playing' ? 'running' : 'paused'
    }
  }, [props.playStatus])

  // 图片组件缓存
  const DiscImage = memo(({ src }: { src: string }) => {
    return src?.length > 0
      ? (
        <img src={src} className="absolute-middle-full z-30 w-[14.5rem] h-[14.5rem] rounded-full" />
        )
      : null
  })
  DiscImage.displayName = 'DiscImage'

  // album图片路径缓存
  const imagePath = useMemo<string>(() => {
    if (props.songItem == null) return ''
    return props.songItem?.album?.picUrl ?? ''
  }, [props.songItem])

  const artistsName = useMemo<string>(() => {
    const artists = props.songItem != null && Array.isArray(props.songItem.artists) ? props.songItem.artists : []
    return artists.map(item => item.name).join(' / ')
  }, [props.songItem])

  // 歌词正则表达
  const lrcReg = useRef(/\[\d{2}:\d{2}\.\d{3}\]/)
  // 是否为有效可滚动歌词
  const [validLrc, setValidLrc] = useState(false)
  // 歌词字符串
  const [lrc, setLrc] = useState('')
  // 回滚参数
  const { signal } = useRecoverAutoScrollImmediately()

  // 根据songId获取歌词
  useEffect(() => {
    if (props.songItem != null && props.songItem?.id > 0) {
      void getSongLyric(props.songItem.id)
        .then(res => {
          const flag = res.lrc != null && res.lrc.lyric != null && res.lrc.lyric.length > 0
          if (flag) {
            const lyric = res.lrc.lyric
            if (lrcReg.current.test(lyric)) {
              setValidLrc(true)
            } else {
              setValidLrc(false)
            }
            setLrc(lyric)
          } else {
            setValidLrc(false)
            setLrc('')
          }
        })
        .catch(error => {
          console.log(error)
          setValidLrc(false)
          setLrc('')
        })
    }
  }, [props.songItem])

  // 正常歌词行渲染
  const lineRenderer = useCallback(({ active, line }: { active: boolean, line: LrcLine }) => {
    return (
      <div className={`min-h-[12px] py-1.5 text-base ${active ? 'text-lg font-medium text-zinc-950' : 'text-gray-600'}`}>
        {line.content}
      </div>
    )
  }, [])

  // 正则不通过的静态歌词行渲染
  const staticLineRender = useCallback((lyric: string) => {
    const lyricArr = staticLyricTrans(lyric)
    return lyricArr.map((item, index) => (
      <div key={index} className="min-h-[12px] py-1.5 text-base text-gray-600">
        {item}
      </div>
    ))
  }, [])

  // 当前歌词时间毫秒数
  const currentMillisecond = useMemo<number>(() => {
    const duration = props.songItem?.time ?? 0
    return duration * props.progress / 100
  }, [props.songItem, props.progress])

  return (
    <>
      <div className="relative flex" style={{ height: 'calc(100% - 60px)' }}>
        <ArrowDown
          className="absolute z-40 left-5 top-5 w-5 h-5 cursor-pointer"
          onClick={switchDetailStatus}
      />
        <aside className="relative flex justify-center items-center w-1/2">
          {/* 唱片探针 */}
          <img
            src={Needle}
            className="absolute z-30 w-[7.5rem] h-auto left-1/2 transition-all duration-1000 origin-top-left"
            style={{ top: 'calc(50% - 17.5rem)', transform: needRotating }}
          />
          <div className="relative animate-spin" style={discRotating}>
            {/* 唱片碟 */}
            <img src={Disc} className="relative z-20 w-[22rem] h-[22rem]" />
            {/* 内圈背景阴影 */}
            <div className="absolute-middle-full z-10 w-56 h-56 bg-transparent rounded-full shadow-[0_0_0_0.5rem_#141519]"></div>
            {/* 外圈背景阴影 */}
            <div className="absolute-middle-full z-10 w-[22rem] h-[22rem] bg-transparent rounded-full shadow-[0_0_0_1rem_#e9e9e9]"></div>
            {/* 唱片图 */}
            <DiscImage src={imagePath}/>
          </div>
        </aside>
        <main className={`w-1/2 pt-6 pr-32 pb-16 flex flex-col ${styles.vague}`}>
          {
            props.songItem != null
              ? (
                <>
                  <h1 className="mb-5 font-sans text-2xl font-medium text-slate-900">{props.songItem.name}</h1>
                  <Row
                    className="w-full mb-8 text-gray-600"
                    justify={'space-between'}
                    align={'middle'}
                    gutter={0}
                    wrap={false}
                  >
                    <Col span={9} className="flex items-center text-sm">
                      <span>专辑：</span>
                      <span className="flex-1 text-ellipsis super_link">
                        {props.songItem.album.name}
                      </span>
                    </Col>
                    <Col span={8} className="text-ellipsis text-sm">
                      <span>歌手：</span>
                      <span className="flex-1 text-ellipsis super_link">
                        {artistsName}
                      </span>
                    </Col>
                    <Col span={7} className="text-ellipsis text-sm">
                      <span>来源：</span>
                      <span className="flex-1 text-ellipsis super_link">
                        {props.playlistName}
                      </span>
                    </Col>
                  </Row>
                  {
                    lrc.length > 0
                      ? (
                          validLrc
                            ? (
                              <Lrc
                                verticalSpace
                                className={`flex-1 min-h-0 ${styles.hidden_scroll}`}
                                lrc={lrc}
                                lineRenderer={lineRenderer}
                                currentMillisecond={currentMillisecond}
                                recoverAutoScrollSingal={signal}
                                recoverAutoScrollInterval={2000}
                              />
                              )
                            : <div className={`flex-1 pt-12 overflow-auto ${styles.hidden_scroll}`}>
                              { staticLineRender(lrc) }
                            </div>
                        )
                      : null
                    }
                </>
                )
              : null
          }
        </main>
      </div>
      <div className="h-[60px]"></div>
    </>
  )
})

Detail.displayName = 'Detail'
export default Detail
