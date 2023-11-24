import { memo, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPlaylistDetail } from '@/api'
import { playNow } from '@/hooks'
import { millSecondsTransDate, playCountTrans } from '@/utils/formatter'
import { detailCoverStyle, DetailFallback } from '@/components/detailFallback'
import {
  PlayAllButton,
  CollectButton,
  ShareButton,
  DownloadButton
} from '@/components/detailButton'
import MusicDetailTab from './detailTab'

const MusicDetail = memo(() => {
  const { id } = useParams<{ id: string }>()

  const getPlaylists = playNow()

  const [loading, setLoading] = useState(false)
  const [playlistCount, setPlaylistCount] = useState(0)
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
    playCount: 0,
    description: ''
  })

  useEffect(() => {
    setLoading(true)
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
          playCount: playlist.playCount,
          description: playlist.description,
          trackIds: playlist.trackIds
        }))
        setPlaylistCount(playlist.trackIds?.length ?? 0)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="pt-8">
      {
        loading
          ? <DetailFallback />
          : (
            <>
              <div className="flex px-8 mb-8 w-full font-sans">
                <img src={playlistHeader?.coverImgUrl} style={detailCoverStyle} />
                <div className="flex-1 space-y-4">
                  <header className="flex items-center">
                    <span className="p-1 text-sm leading-none text-[#ed4141] border border-[#ed4141] rounded">歌单</span>
                    <h1 className="ml-2.5 text-2xl font-semibold leading-none text-[#333]">{playlistHeader.name}</h1>
                  </header>
                  <section className="flex items-center space-x-2 text-sm">
                    <img src={playlistHeader.creator.avatarUrl} className="w-8 h-8 rounded-full super_link" />
                    <span className="max-w-[10rem] text-ellipsis super_link">{playlistHeader.creator.nickname}</span>
                    <span className="text-gray-600">
                      <span>{millSecondsTransDate(playlistHeader.createTime ?? 0)} </span><span>创建</span>
                    </span>
                  </section>
                  <nav className="flex items-center space-x-2 text-sm">
                    <PlayAllButton onPlayAll={() => { getPlaylists(Number(id)) }} />
                    <CollectButton subscribedCount={playlistHeader.subscribedCount ?? 0} />
                    <ShareButton shareCount={playlistHeader.shareCount ?? 0} />
                    <DownloadButton />
                  </nav>
                  <article className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center">
                      <label className="flex justify-between items-center mr-1 w-14 text-[#363636]">
                        <span>标</span><span>签：</span>
                      </label>
                      {
                      playlistHeader.tags.map((tag, index) => (
                        <span key={index}>
                          <span className="super_link">{tag}</span>
                          {
                              index !== playlistHeader.tags.length - 1 ? <span className="mx-1">/</span> : null
                          }
                        </span>
                      ))
                    }
                    </div>
                    <div className="flex items-center">
                      <label className="mr-1 w-14 text-[#363636]">歌曲数:</label>
                      <span className="text-[#666]">{playlistCount}</span>
                      <label className="mr-1 ml-5 w-14 text-[#363636]">播放数:</label>
                      <span className="text-[#666]">{playCountTrans(playlistHeader.playCount ?? 0)}</span>
                    </div>
                    <div className="flex items-center">
                      <label className="flex justify-between items-center mr-1 w-14 text-[#363636]">
                        <span>简</span><span>介：</span>
                      </label>
                      <p className="max-w-md truncate mr-5 text-[#666]" title={playlistHeader.description}>{playlistHeader.description}</p>
                    </div>
                  </article>
                </div>
              </div>
              <MusicDetailTab trackIds={playlistHeader.trackIds} />
            </>
            )
      }
    </div>
  )
})

MusicDetail.displayName = 'Detail'
export default MusicDetail
