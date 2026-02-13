import { useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { shipmentsAtom } from '@/store/atoms'
import {
  clusterShipments,
  generateMockShipments,
  generateMarketPrices,
  generatePricePredictions,
  calculatePoolingBenefits,
} from '@/utils/clusteringEngine'

/**
 * Initializes mock shipments and derives clusters, benefits, and market data.
 * Encapsulates all the data-fetching / computation logic from App.
 */
export function useAppData() {
  const [shipments, setShipments] = useAtom(shipmentsAtom)

  // Seed mock shipments once
  useEffect(() => {
    const mockShipments = generateMockShipments(15)
    setShipments(mockShipments)
  }, [setShipments])

  // Derived data
  const clusters = useMemo(() => clusterShipments(shipments, 10), [shipments])
  const benefits = useMemo(() => calculatePoolingBenefits(clusters), [clusters])
  const marketPrices = useMemo(() => generateMarketPrices(), [])
  const predictions = useMemo(() => generatePricePredictions(), [])

  return { shipments, clusters, benefits, marketPrices, predictions }
}
