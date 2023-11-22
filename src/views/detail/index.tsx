import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { detailCoverStyle, DetailFallback } from '@/components/detailFallback'
import { getPlaylistDetail } from '@/api'
import { millSecondsTransDate } from '@/utils/formatter'
import PlayWhiteIcon from '@/assets/svg/play_white.svg?react'
import PlusWhiteIcon from '@/assets/svg/plus_white.svg?react'

const Detail = memo(() => {
  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(false)
  const [playlistHeader, setPlaylistHeader] = useState<PlayListDetail>({
    id: 0,
    name: '',
    tracks: [],
    trackIds: [],
    coverImgUrl: '',
    createTime: 0,
    creator: {
      userId: 0,
      nickname: '',
      avatarUrl: ''
    },
    subscribedCount: 0,
    shareCount: 0,
    tags: [],
    playCount: 0
  })

  // 播放按钮三色切换 拥有三种红色 2-深色 1-浅色 0-最浅
  const [playEnter, setPlayInter] = useState(0x0000)
  const [collectEnter, setCollectEnter] = useState(0x0000)
  const switchTripleBG = useMemo<[string, string]>(() => {
    const res = playEnter | collectEnter
    if (res === 0x0010) return ['bg-[#cd3232]', 'bg-[#d83535]']
    else if (res === 0x0001) return ['bg-[#d83535]', 'bg-[#cd3232]']
    else return ['', '']
  }, [playEnter, collectEnter])

  useEffect(() => {
    getPlaylistDetail(Number(id))
      .then(res => {
        const playlist = res.playlist
        if (playlist == null || typeof playlist !== 'object') return
        setPlaylistHeader(playlistHeader => ({
          ...playlistHeader,
          id: playlist.id ?? 0,
          name: playlist.name ?? '',
          coverImgUrl: playlist.coverImgUrl ?? '',
          createTime: playlist.createTime ?? 0,
          creator: {
            userId: playlist.creator?.userId ?? 0,
            nickname: playlist.creator?.nickname ?? '',
            avatarUrl: playlist.creator?.avatarUrl ?? ''
          },
          subscribedCount: playlist.subscribedCount,
          shareCount: playlist.shareCount,
          tags: playlist.tags,
          playCount: playlist.playCount
        }))
        setLoading(true)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="pt-8 pl-8">
      {
        loading
          ? (
            <div className="flex">
              <img src={playlistHeader?.coverImgUrl} style={detailCoverStyle} />
              <div className="flex-1 space-y-2">
                <header className="flex items-center">
                  <span className="p-1 text-sm leading-none text-[#ed4141] border border-[#ed4141] rounded">歌单</span>
                  <h1 className="ml-2.5 text-2xl font-sans font-semibold text-[#333]">{playlistHeader.name}</h1>
                </header>
                <section className="flex items-center space-x-2 text-xs">
                  <img src={playlistHeader.creator.avatarUrl} className="w-8 h-8 rounded-full super_link" />
                  <span className="max-w-[10rem] text-ellipsis super_link">{playlistHeader.creator.nickname}</span>
                  <span className="text-gray-600">
                    <span>{millSecondsTransDate(playlistHeader.createTime ?? 0)} </span><span>创建</span>
                  </span>
                </section>
                <nav className="flex items-center space-x-2 text-base">
                  <button className="relative flex items-center h-10 rounded-[1.25rem] text-white bg-[#ec4141]">
                    <nav
                      className={`pl-4 pr-2.5 flex items-center h-full rounded-l-[1.25rem] ${switchTripleBG[0]}`}
                      onMouseEnter={() => { setPlayInter(0x0010) }}
                      onMouseLeave={() => { setPlayInter(0x0000) }}
                    >
                      <PlayWhiteIcon className="w-6 h-6" />
                      <span className="ml-1.5">播放全部</span>
                    </nav>
                    <span className="absolute top-0 right-12 w-[1px] h-full bg-[#ee5454]"></span>
                    <nav
                      className={`pr-4 pl-2.5 flex items-center h-full rounded-r-[1.25rem] ${switchTripleBG[1]}`}
                      onMouseEnter={() => { setCollectEnter(0x0001) }}
                      onMouseLeave={() => { setCollectEnter(0x0000) }}
                    >
                      <PlusWhiteIcon className="w-6 h-6" />
                    </nav>
                  </button>
                </nav>
              </div>
            </div>
            )
          : <DetailFallback />
      }
    </div>
  )
})

Detail.displayName = 'Detail'
export default Detail
