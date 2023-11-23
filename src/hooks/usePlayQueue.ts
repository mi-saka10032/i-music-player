import { useMemo } from 'react'
import { type SongData } from '@/core/playerType'
import { durationTrans } from '@/utils/formatter'
import { highlightNameClass, highlightArtistClass, highlightDurationClass } from '@/utils/highlightSongClass'

export interface LocalPlayQueue {
  id: number
  name: string
  albumName: string
  artistsName: string
  duration: string
  zebraClass: string
  songNameClass: string
  artistClass: string
  durationClass: string
}

export function usePlayQueue (playlists: SongData[], activeId: number) {
  /** 本地转化播放列表数据字段 */
  const localPlayQueue = useMemo<LocalPlayQueue[]>(() => {
    const getArtistNames = (artists: AR[]): string => {
      return artists.map(item => item.name).join(' / ')
    }
    return playlists.map((item, index) => ({
      id: item.id,
      name: item.name,
      albumName: item.album.name,
      artistsName: getArtistNames(item.artists),
      duration: durationTrans(item.time ?? 0),
      zebraClass: index % 2 !== 0 ? 'bg-[#f6f6f6] hover:bg-[#f2f2f2] ' : 'bg-[#fdfdfd] hover:bg-[#f3f3f3] ',
      songNameClass: highlightNameClass(activeId, item.id),
      artistClass: highlightArtistClass(activeId, item.id),
      durationClass: highlightDurationClass(activeId, item.id)
    }))
  }, [playlists, activeId])
  /** 本地转化播放列表数据字段 */

  return localPlayQueue
}
