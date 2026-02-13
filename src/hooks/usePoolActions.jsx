import { useAtom, useSetAtom } from 'jotai'
import { joinedPoolsAtom, notificationAtom, shipmentsAtom } from '@/store/atoms'

const LOCATIONS = {
  bardhaman:   { name: "bardhaman",   lat: 23.2324, lon: 87.8615 },
  durgapur:    { name: "durgapur",    lat: 23.5204, lon: 87.3119 },
  asansol:     { name: "asansol",     lat: 23.6850, lon: 86.9537 },
  siliguri:    { name: "siliguri",    lat: 26.7271, lon: 88.6393 },
  howrah:      { name: "howrah",      lat: 22.5958, lon: 88.2636 },
  kolkata:     { name: "kolkata",     lat: 22.5726, lon: 88.3639 },
  malda:       { name: "malda",       lat: 25.0108, lon: 88.1411 },
  murshidabad: { name: "murshidabad", lat: 24.1745, lon: 88.2749 },
}

/**
 * Manages pool join/leave actions and adding new shipments.
 * Extracts all mutation logic out of FarmerDashboard.
 */
export function usePoolActions() {
  const [joinedPools, setJoinedPools] = useAtom(joinedPoolsAtom)
  const setNotification = useSetAtom(notificationAtom)
  const setShipments = useSetAtom(shipmentsAtom)

  const addShipment = ({ crop, weight, location }) => {
    const baseLocation = LOCATIONS[location]
    if (!baseLocation) return
    const offset = () => (Math.random() - 0.5) * 0.05

    const shipment = {
      id: `shipment-${Date.now()}`,
      farmerName: "You",
      crop,
      weight,
      location: {
        name: baseLocation.name,
        lat: baseLocation.lat + offset(),
        lon: baseLocation.lon + offset(),
      },
      requestedDate: new Date().toLocaleDateString('en-IN'),
      status: "pending",
    }

    setShipments(prev => [...prev, shipment])
  }

  const joinPool = (poolId, locationName) => {
    setJoinedPools(prev => ({
      ...prev,
      [poolId]: { joinedAt: Date.now() },
    }))
    setNotification(`Joined ${locationName} pool! You can opt out within 15 minutes.`)
    setTimeout(() => setNotification(null), 4000)
  }

  const leavePool = (poolId, locationName) => {
    setJoinedPools(prev => {
      const updated = { ...prev }
      delete updated[poolId]
      return updated
    })
    setNotification(`Left ${locationName} transport pool.`)
    setTimeout(() => setNotification(null), 3000)
  }

  return { joinedPools, addShipment, joinPool, leavePool }
}
