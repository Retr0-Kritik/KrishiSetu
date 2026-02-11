import { useState, useEffect } from "react"
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { translationAtom, joinedPoolsAtom, notificationAtom, shipmentsAtom } from "@/store/atoms"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Users, 
  Package, 
  Truck,
  MapPin,
  Plus,
  X,
  Clock
} from "lucide-react"

// Isolated component for pool action cell - only this re-renders for countdown
function PoolActionCell({ poolId, poolName, joinedAt, onJoinPool, onLeavePool, t }) {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (!joinedAt) return 0
    const elapsed = Date.now() - joinedAt
    return Math.max(0, 15 * 60 * 1000 - elapsed)
  })

  useEffect(() => {
    if (!joinedAt) return
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - joinedAt
      const remaining = Math.max(0, 15 * 60 * 1000 - elapsed)
      setTimeRemaining(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [joinedAt])

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (joinedAt) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="success" className="gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('joined')}
        </Badge>
        {timeRemaining > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onLeavePool && onLeavePool(poolId, poolName)}
          >
            <X className="h-3 w-3 mr-1" />
            {t('leave')}
            <span className="ml-1 text-muted-foreground">
              ({formatTime(timeRemaining)})
            </span>
          </Button>
        )}
      </div>
    )
  }

  return (
    <Button 
      size="sm" 
      variant="outline"
      onClick={() => onJoinPool && onJoinPool(poolId, poolName)}
    >
      {t('join')}
    </Button>
  )
}

export function FarmerDashboard({ clusters, benefits }) {
  const t = useAtomValue(translationAtom)
  const [joinedPools, setJoinedPools] = useAtom(joinedPoolsAtom)
  const setNotification = useSetAtom(notificationAtom)
  const setShipments = useSetAtom(shipmentsAtom)
  const [cropType, setCropType] = useState("")
  const [weight, setWeight] = useState("")
  const [location, setLocation] = useState("")

  const handleAddShipment = (newShipment) => {
    const locations = {
      bardhaman: { name: "bardhaman", lat: 23.2324, lon: 87.8615 },
      durgapur: { name: "durgapur", lat: 23.5204, lon: 87.3119 },
      asansol: { name: "asansol", lat: 23.6850, lon: 86.9537 },
      siliguri: { name: "siliguri", lat: 26.7271, lon: 88.6393 },
      howrah: { name: "howrah", lat: 22.5958, lon: 88.2636 },
      kolkata: { name: "kolkata", lat: 22.5726, lon: 88.3639 },
      malda: { name: "malda", lat: 25.0108, lon: 88.1411 },
      murshidabad: { name: "murshidabad", lat: 24.1745, lon: 88.2749 },
    }

    const baseLocation = locations[newShipment.location]
    const offset = () => (Math.random() - 0.5) * 0.05

    const shipment = {
      id: `shipment-${Date.now()}`,
      farmerName: "You",
      crop: newShipment.crop,
      weight: newShipment.weight,
      location: {
        name: baseLocation.name,
        lat: baseLocation.lat + offset(),
        lon: baseLocation.lon + offset()
      },
      requestedDate: new Date().toLocaleDateString('en-IN'),
      status: "pending"
    }

    setShipments(prev => [...prev, shipment])
  }

  const handleJoinPool = (poolId, locationName) => {
    setJoinedPools(prev => ({
      ...prev,
      [poolId]: { joinedAt: Date.now() }
    }))
    setNotification(`Joined ${locationName} pool! You can opt out within 15 minutes.`)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleLeavePool = (poolId, locationName) => {
    setJoinedPools(prev => {
      const updated = { ...prev }
      delete updated[poolId]
      return updated
    })
    setNotification(`Left ${locationName} transport pool.`)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (cropType && weight && location) {
      handleAddShipment({
        crop: cropType,
        weight: parseFloat(weight),
        location: location
      })
      setCropType("")
      setWeight("")
      setLocation("")
    }
  }

  // All pools from clusters - show both active (>1 farmer) and pending (1 farmer)
  const allPools = clusters.filter(c => c.farmerCount >= 1)

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('estimatedSavings')}</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{benefits.totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('savings')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('trend')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-emerald-600">+2.3%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('rice')} {t('price')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activePools')}</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefits.activePoolsCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('joinPoolsDesc')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalWeight')}</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefits.totalWeight} kg</div>
            <p className="text-xs text-muted-foreground">
              {t('shipments')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {t('newShipment')}
            </CardTitle>
            <CardDescription>
              {t('fillDetails')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crop">{t('cropType')}</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger id="crop">
                    <SelectValue placeholder={t('selectCrop')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">{t('rice')}</SelectItem>
                    <SelectItem value="potato">{t('potato')}</SelectItem>
                    <SelectItem value="jute">{t('jute')}</SelectItem>
                    <SelectItem value="wheat">{t('wheat')}</SelectItem>
                    <SelectItem value="vegetables">{t('vegetables')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">{t('weight')}</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={t('weight')}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                  max="5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t('pickupLocation')}</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder={t('selectLocation')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bardhaman">{t('bardhaman')}</SelectItem>
                    <SelectItem value="durgapur">{t('durgapur')}</SelectItem>
                    <SelectItem value="asansol">{t('asansol')}</SelectItem>
                    <SelectItem value="siliguri">{t('siliguri')}</SelectItem>
                    <SelectItem value="howrah">{t('howrah')}</SelectItem>
                    <SelectItem value="kolkata">{t('kolkata')}</SelectItem>
                    <SelectItem value="malda">{t('malda')}</SelectItem>
                    <SelectItem value="murshidabad">{t('murshidabad')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('addShipment')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Pools Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('availablePools')}
            </CardTitle>
            <CardDescription>
              {t('joinPoolsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allPools.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('location')}</TableHead>
                    <TableHead>{t('farmers')}</TableHead>
                    <TableHead>{t('totalWeight')}</TableHead>
                    <TableHead>{t('savings')}</TableHead>
                    <TableHead>{t('action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPools.map((pool) => {
                    const isPending = pool.farmerCount === 1
                    return (
                      <TableRow key={pool.id} className={isPending ? "opacity-75" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-4 w-4 ${isPending ? "text-muted-foreground" : "text-primary"}`} />
                            {t(pool.centroid.name)}
                            {isPending && (
                              <Badge variant="outline" className="text-xs ml-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {t('waiting')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isPending ? "outline" : "secondary"}>
                            {pool.farmerCount} {t('farmers')}
                          </Badge>
                        </TableCell>
                        <TableCell>{pool.totalWeight} kg</TableCell>
                        <TableCell>
                          {isPending ? (
                            <span className="text-muted-foreground text-sm">
                              {t('needsMoreFarmers')}
                            </span>
                          ) : (
                            <span className="text-primary font-semibold">
                              ₹{pool.estimatedSavings}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {!isPending && (
                            <PoolActionCell
                              poolId={pool.id}
                              poolName={t(pool.centroid.name)}
                              joinedAt={joinedPools[pool.id]?.joinedAt}
                              onJoinPool={handleJoinPool}
                              onLeavePool={handleLeavePool}
                              t={t}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('noActivePools')}</p>
                <p className="text-sm">{t('fillDetails')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
