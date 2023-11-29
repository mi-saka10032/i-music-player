import { type PropsWithChildren, memo } from 'react'
import { millSecondsTransDate, playCountTrans } from '@/utils/formatter'
import { detailCoverStyle, DetailFallback, detailNameStyle } from '@/components/detailFallback'
import {
  PlayAllButton,
  CollectButton,
  ShareButton,
  DownloadButton
} from '@/components/detailButton'

type MusicDetailHeaderProps = PropsWithChildren<{
  loading: boolean
  playlistHeader: PlayListDetail
  onPlayAll: () => void
}>

const MusicDetailHeader = memo((props: PropsWithChildren<MusicDetailHeaderProps>) => {
  return props.loading
    ? <DetailFallback />
    : (
      <>
        <div className="flex px-8 mb-8 w-full font-sans">
          <img src={props.playlistHeader?.coverImgUrl} style={detailCoverStyle} />
          <div className="flex-1 space-y-4">
            <header className="flex items-center">
              <span className="p-1 text-sm leading-none text-[#ed4141] border border-[#ed4141] rounded">歌单</span>
              <h1 className="ml-2.5 text-2xl font-semibold leading-none text-[#333] truncate" style={detailNameStyle}>
                {props.playlistHeader.name}
              </h1>
            </header>
            <section className="flex items-center space-x-2 text-sm">
              {
                props.playlistHeader.creator.avatarUrl.length > 0
                  ? (
                    <>
                      <img src={props.playlistHeader.creator.avatarUrl} className="w-8 h-8 rounded-full super_link" />
                      <span className="max-w-[10rem] text-ellipsis super_link">{props.playlistHeader.creator.nickname}</span>
                    </>
                    )
                  : null
              }
              {
                props.playlistHeader.createTime > 0
                  ? (
                    <span className="text-gray-600">
                      <span>{millSecondsTransDate(props.playlistHeader.createTime ?? 0)} </span><span>创建</span>
                    </span>
                    )
                  : null
              }
            </section>
            <nav className="flex items-center space-x-2 text-sm">
              <PlayAllButton onPlayAll={props.onPlayAll} />
              <CollectButton subscribedCount={props.playlistHeader.subscribedCount ?? 0} />
              <ShareButton shareCount={props.playlistHeader.shareCount ?? 0} />
              <DownloadButton />
            </nav>
            <article className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                {
                  props.playlistHeader.tags.length > 0
                    ? (
                      <>
                        <label className="flex justify-between items-center mr-1 w-14 text-[#363636]">
                          <span>标</span><span>签：</span>
                        </label>
                        {
                          props.playlistHeader.tags.map((tag, index) => (
                            <span key={index}>
                              <span className="super_link">{tag}</span>
                              {
                                index !== props.playlistHeader.tags.length - 1 ? <span className="mx-1">/</span> : null
                              }
                            </span>
                          ))
                        }
                      </>
                      )
                    : null
                }
              </div>
              <div className="flex items-center">
                {
                  props.playlistHeader.trackIds.length > 0
                    ? (
                      <>
                        <label className="mr-1 w-14 text-[#363636]">歌曲数:</label>
                        <span className="text-[#666]">{props.playlistHeader.trackIds.length}</span>
                      </>
                      )
                    : null
                }
                {
                  props.playlistHeader.playCount > 0
                    ? (
                      <>
                        <label className="mr-1 ml-5 w-14 text-[#363636]">播放数:</label>
                        <span className="text-[#666]">{playCountTrans(props.playlistHeader.playCount)}</span>
                      </>
                      )
                    : null
                }
              </div>
              <div className="flex items-center">
                {
                props.playlistHeader.description != null && props.playlistHeader.description?.length > 0
                  ? (
                    <>
                      <label className="flex justify-between items-center mr-1 w-14 text-[#363636]">
                        <span>简</span><span>介：</span>
                      </label>
                      <p className="max-w-md truncate mr-5 text-[#666]" title={props.playlistHeader.description}>{props.playlistHeader.description}</p>
                    </>
                    )
                  : null
               }
              </div>
            </article>
          </div>
        </div>
        { props.children }
      </>
      )
})

MusicDetailHeader.displayName = 'MusicDetailHeader'
export default MusicDetailHeader
