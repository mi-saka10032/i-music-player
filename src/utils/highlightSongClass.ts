// 字体特殊高亮类名
const highlightSongClass = (activeId: number, itemId: number, defaultColor: string): string => {
  return 'text-ellipsis text-sm ' + (itemId === activeId ? 'text-red-500 ' : defaultColor + 'group-hover:text-black ')
}

export const highlightNameClass = (activeId: number, itemId: number) =>
  highlightSongClass(activeId, itemId, 'text-[#333] ')

export const highlightArtistClass = (activeId: number, itemId: number) =>
  highlightSongClass(activeId, itemId, 'text-neutral-500 ')

export const highlightDurationClass = (activeId: number, itemId: number) =>
  highlightSongClass(activeId, itemId, 'text-teal-400 ')
