import { memo, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/hooks'
import { getSongDetail } from '@/api'
import { type SongData } from '@/core/playerType'
import { debounce } from 'throttle-debounce'
import LoadingInstance from '@/components/loadingInstance'
import { generateZebraClass, serializeNumberTrans, artistsArrayTrans, durationTrans } from '@/utils/formatter'
import { highlightNameClass, highlightArtistClass, highlightDurationClass } from '@/utils/highlightSongClass'
import { CONTENT_CONTAINER_ID } from '@/utils/constant'
import PlayInActiveIcon from '@/assets/svg/play_inactive.svg?react'
import PlayActiveIcon from '@/assets/svg/play_active.svg?react'
import FavoriteIcon from '@/assets/svg/favorite.svg?react'
import DownloadIcon from '@/assets/svg/download.svg?react'

// 详情列表支持懒加载
const MusicDetailLists = memo((props: { trackIds: TrackIdsLists }) => {
  // 详情列表表头
  const ListHeader = memo(() => {
    return (
      <li className="relative flex items-center w-full h-[36px] px-8 py-[4px] text-neutral-500">
        <span className="w-[7.5rem]"/>
        <span className="flex-1 text-sm">音乐标题</span>
        <span className="w-2/12 text-sm">歌手</span>
        <span className="w-3/12 text-sm">专辑</span>
        <span className="w-1/12 text-sm">时长</span>
      </li>
    )
  })
  ListHeader.displayName = 'ListHeader'

  // 全局activeId
  const { playId } = useAppSelector(state => state.playlist)
  const playStatus = useAppSelector(state => state.playlist.playerInstance.status)

  const [loading, setLoading] = useState(false)
  const playlistsRef = useRef<SongData[]>([])
  const [sliceLists, setSliceLists] = useState<SongData[]>([])
  const batchRef = useRef(200)

  // 初始挂载时读取前200首
  useEffect(() => {
    setLoading(true)
    const allIds = props.trackIds.map(item => item.id)
    getSongDetail(allIds)
      .then(res => {
        playlistsRef.current = res.map(item => ({
          id: item.id,
          name: item.name,
          artists: item.ar,
          album: item.al,
          time: item.dt
        }))
        // 首切前200首
        setSliceLists(() => [...playlistsRef.current.splice(0, batchRef.current)])
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.trackIds])

  // 监听滚动条触底切割playlistsRef
  useEffect(() => {
    const extraHeight = 300
    const content = document.getElementById(CONTENT_CONTAINER_ID)!
    const handleScroll = debounce(
      50,
      () => {
        const curHeight = content.clientHeight + content.scrollTop + extraHeight
        if (curHeight >= content.scrollHeight && playlistsRef.current.length > 0) {
          setSliceLists(sliceLists => [...sliceLists, ...playlistsRef.current.splice(0, batchRef.current)])
        }
      }
    )
    content.addEventListener('scroll', handleScroll)
    return () => {
      content.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <ul className="relative min-h-[12rem]">
      <LoadingInstance loading={loading} />
      {
        !loading && sliceLists.length > 0
          ? (
            <>
              <ListHeader />
              {
                sliceLists.map((item, index) => (
                  (
                    <li
                      key={item.id}
                      className={`relative flex items-center w-full h-[36px] px-8 py-[8px] group ${generateZebraClass(index)}`}
                    >
                      <span className="w-[7.5rem] flex justify-between items-center pr-5">
                        {
                          item.id === playId
                            ? (
                                playStatus === 'playing'
                                  ? <PlayActiveIcon className="w-4 h-4" />
                                  : <PlayInActiveIcon className="w-5 h-5" />
                              )
                            : (
                              <span className="text-sm text-[#cbcbcc] leading-none">
                                {serializeNumberTrans(index)}
                              </span>
                              )
                        }
                        <span className="flex items-center">
                          <FavoriteIcon className="w-5 h-5" />
                          <DownloadIcon className="ml-2 w-5 h-5" />
                        </span>
                      </span>
                      <span
                        title={item.name}
                        className={`flex-1 ${highlightNameClass(playId, item.id)}`}
                      >
                        {item.name}
                      </span>
                      <span
                        title={artistsArrayTrans(item.artists)}
                        className={`w-2/12 ${highlightArtistClass(playId, item.id)}`}
                      >
                        {artistsArrayTrans(item.artists)}
                      </span>
                      <span className={`w-3/12 ${highlightArtistClass(playId, item.id)}`}>
                        {item.album.name}
                      </span>
                      <span className={`w-1/12 ${highlightDurationClass(playId, item.id)}`}>
                        {durationTrans(item.time ?? 0)}
                      </span>
                    </li>
                  )
                ))
              }
            </>
            )
          : null
      }
    </ul>
  )
})

MusicDetailLists.displayName = 'MusicDetailLists'
export default MusicDetailLists
