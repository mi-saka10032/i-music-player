import { memo, Suspense, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from 'antd'
import { getPlaylistDetail } from '@/api'
import { type WrapPromise, wrapPromise } from '@/utils/wrapPromise'

const Fallback = memo(() => (
  <Skeleton.Image active={true} style={{ width: '14rem', height: '14rem', borderRadius: '0.5rem' }} />
))
Fallback.displayName = 'Fallback'

const PlaylistHeader = memo((props: { wrapPlaylistDetail: WrapPromise<PlayListDetail> }) => {
  const playlistHeader = useMemo(() => {
    const header: PlayListDetail = {
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
    }
    const detail = props.wrapPlaylistDetail.read()
    if (detail == null || detail instanceof Error) {
      return header
    } else {
      return detail
    }
  }, [props.wrapPlaylistDetail])
  return (
    <img src={playlistHeader?.coverImgUrl} className="w-56 h-56 rounded-lg" />
  )
})
PlaylistHeader.displayName = 'PlaylistHeader'

const Detail = memo(() => {
  const { id } = useParams<{ id: string }>()
  // 提供一个获取歌单详情接口的wrapPromise，用以激活Suspense
  const wrapDetailRef = useRef(wrapPromise(getPlaylistDetail(Number(id)).then(res => res.playlist)))

  return (
    <div className="pt-4 pl-8">
      <Suspense fallback={<Fallback />}>
        <PlaylistHeader wrapPlaylistDetail={wrapDetailRef.current} />
      </Suspense>
    </div>
  )
})

Detail.displayName = 'Detail'
export default Detail
