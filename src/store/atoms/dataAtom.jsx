import { atom } from 'jotai'

// Shipments data atom
export const shipmentsAtom = atom([])

// Joined pools atom - stores { poolId: { joinedAt: timestamp } }
export const joinedPoolsAtom = atom({})
