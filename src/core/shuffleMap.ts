import { selectDB, updateDB } from '@/utils'

type ID = number

type PointID = ID | null | undefined

interface IDValue {
  actualIndex: number
  prevShuffleId: number
  nextShuffleId: number
}

type IDMap = Map<ID, IDValue>

type IDArray = Array<[ID, IDValue]>

export default class ShuffleMap {
  static ExpTime = 1000 * 60 * 60 * 12

  private readonly prefixCacheName = 'ShuffleMap:'

  private playId: ID

  private idMap: IDMap

  // idList every id must not be repeatable
  constructor (idList: number[], playId: number = 0) {
    this.playId = playId
    this.idMap = new Map()
    void this.generateShuffleIdMap(idList, playId)
  }

  private getCacheName () {
    return `${this.prefixCacheName}${this.playId}`
  }

  private async getIdMapByCache (): Promise<boolean> {
    if (this.playId === 0) return false

    const cacheName = this.getCacheName()
    const localTime = window.localStorage.getItem(cacheName)
    if (localTime == null) return false

    const cacheTime = Number(localTime)
    const current = Date.now()
    const prevTime = new Date(cacheTime).getTime()

    const isExp = current - prevTime > ShuffleMap.ExpTime
    if (isExp) return false

    const value = await selectDB<IDArray>(cacheName)
    if (value == null) return false

    this.idMap = new Map(value)
    return true
  }

  private async setIdMapToCache () {
    if (this.idMap.size > 0) {
      const cacheName = this.getCacheName()
      window.localStorage.setItem(cacheName, String(Date.now()))
      await updateDB({
        name: cacheName,
        value: Array.from(this.idMap)
      })
    }
  }

  public async generateShuffleIdMap (idList: number[], playId: number = 0) {
    this.playId = playId
    this.idMap.clear()
    const len = idList.length

    if (len === 0) return

    if (len === 1) {
      const uniqueId = idList[0]
      this.idMap.set(uniqueId, {
        actualIndex: 0,
        prevShuffleId: uniqueId,
        nextShuffleId: uniqueId
      })
      return
    }

    if (len === 2) {
      const prevId = idList[0]
      const nextId = idList[1]
      this.idMap.set(prevId, {
        actualIndex: 0,
        prevShuffleId: nextId,
        nextShuffleId: nextId
      })
      this.idMap.set(nextId, {
        actualIndex: 1,
        prevShuffleId: prevId,
        nextShuffleId: prevId
      })
    }

    // len must be more than 3

    const isCache = await this.getIdMapByCache()
    if (isCache) return

    const originalIndexReflect = new Map<ID, number>()
    let currentIndex = len

    // Fisher-Yates Shuffle
    while (currentIndex !== 0) {
      const shuffleIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      if (!originalIndexReflect.has(idList[currentIndex])) {
        originalIndexReflect.set(idList[currentIndex], currentIndex)
      }

      if (!originalIndexReflect.has(idList[shuffleIndex])) {
        originalIndexReflect.set(idList[shuffleIndex], shuffleIndex)
      }

      // exchange
      const tempId = idList[currentIndex]
      idList[currentIndex] = idList[shuffleIndex]
      idList[shuffleIndex] = tempId
    }

    // insert
    for (let index = 0; index < len; index++) {
      const shuffleId = idList[index]
      const actualIndex = originalIndexReflect.get(shuffleId) as number

      if (index === 0) {
        this.idMap.set(shuffleId, {
          actualIndex,
          prevShuffleId: idList[len - 1],
          nextShuffleId: idList[index + 1]
        })
      } else if (index === len - 1) {
        this.idMap.set(shuffleId, {
          actualIndex,
          prevShuffleId: idList[index - 1],
          nextShuffleId: idList[0]
        })
      } else {
        this.idMap.set(shuffleId, {
          actualIndex,
          prevShuffleId: idList[index - 1],
          nextShuffleId: idList[index + 1]
        })
      }
    }

    void this.setIdMapToCache()
  }

  private getCurrentValue (id: PointID): IDValue | null {
    if (id == null) return null
    const value = this.idMap.get(id)
    return value ?? null
  }

  public getActualIndexById (id: PointID): number | null {
    const value = this.getCurrentValue(id)
    return value != null ? value.actualIndex : null
  }

  public getPrevShuffleIdByCurId (id: PointID): number | null {
    const value = this.getCurrentValue(id)
    return value != null ? value.prevShuffleId : null
  }

  public getNextShuffleIdByCurId (id: PointID): number | null {
    const value = this.getCurrentValue(id)
    return value != null ? value.nextShuffleId : null
  }
}
