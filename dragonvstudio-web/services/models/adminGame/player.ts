import { Faction } from './faction'
import { GameItem } from './gameItem'

export type Player = {
  id: any
  playerId: any
  discordId: any
  name: any
  money: any
  bankAmount: any
  horse: any
  horseHarness: any
  equipment_0: any
  equipment_1: any
  equipment_2: any
  equipment_3: any
  armor_Head: any
  armor_Body: any
  armor_Leg: any
  armor_Gloves: any
  armor_Cape: any
  class: any
  customName: any
  faction: Faction
  userId: any
  items: UserGameItems[]
}

export type UserGameItems = {
  id: any
  userId: any
  playerId: any
  gameItemId: any
  receivedDate: any
  expiredDate: any
  itemInfo: GameItem
  isTaken: boolean
  lastTakenTime: any
  timeRemaining: any
  equipped: boolean
}
