import Database from 'tauri-plugin-sql-api'

interface Store {
  id?: number
  name: string
  value: string
}

const DB_Name = 'sqlite:store.db'
const TABLE_Name = 'store'

export const loadDB = initDB()

async function initDB () {
  const db = await Database.load(DB_Name)
  // 创建表
  await db.execute(
    `CREATE TABLE IF NOT EXISTS ${TABLE_Name} (id INTEGER PRIMARY KEY, name TEXT UNIQUE, value TEXT)`
  )
  return db
}

export async function disconnectDB () {
  const db = await loadDB
  await db.close()
}

export async function insertDB ({ name, value }: Store) {
  const db = await loadDB
  return await db.execute(
    `INSERT into ${TABLE_Name} (name, value) VALUES ($1, $2)`,
    [name, value]
  )
}

export async function updateDB ({ name, value }: Store) {
  const db = await loadDB
  return await db.execute(
    `INSERT OR REPLACE into ${TABLE_Name} (name, value) VALUES ($1, $2)`,
    [name, value]
  )
}

export async function selectAllDB<T> () {
  const db = await loadDB
  return await db.select<T[]>(`SELECT * from ${TABLE_Name}`)
}

export async function selectDB<T> (name: string) {
  const db = await loadDB
  return await db.select<T[]>(`SELECT * from ${TABLE_Name} WHERE name = $1`, [name])
}

export async function deleteDB (name: string) {
  const db = await loadDB
  return await db.execute(
    `DELETE FROM ${TABLE_Name} WHERE name = $1`, [name])
}

export default {
  loadDB,
  insertDB,
  updateDB,
  selectAllDB,
  deleteDB,
  disconnectDB
}
