// TODO more features dexie
import localforage from 'localforage'

interface Store {
  id?: number
  name: string
  value: unknown
}

const TABLE_Name = 'store'

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'i_music_player',
  storeName: TABLE_Name,
  version: 1.0
})

export async function insertDB ({ name, value }: Store) {
  return await localforage.setItem(name, value)
}

export async function updateDB ({ name, value }: Store) {
  return await insertDB({ name, value })
}

export async function selectAllDB<T> () {
  const keys = await localforage.keys()
  const items = await Promise.all(keys.map(async (key) => {
    const value = await localforage.getItem<T>(key)
    return value != null ? { name: key, value } as unknown as T : null
  }))
  return items.filter((item) => item != null) as T[]
}

export async function selectDB<T> (name: string) {
  return await localforage.getItem<T>(name)
}

export async function deleteDB (name: string) {
  await localforage.removeItem(name)
}
