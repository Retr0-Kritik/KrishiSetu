import { useAtomValue } from 'jotai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { translationAtom } from "@/store/atoms"
import { 
  Truck, 
  MapPin, 
  Users, 
  Package,
  Clock,
  CheckCircle2
} from "lucide-react"

function TruckCapacityCard({ cluster, maxCapacity = 1000, t }) {
  const fillPercentage = Math.min((cluster.totalWeight / maxCapacity) * 100, 100)
  const remainingCapacity = Math.max(maxCapacity - cluster.totalWeight, 0)
  
  // Color based on fill level
  const getProgressColor = () => {
    if (fillPercentage >= 90) return "bg-emerald-600"
    if (fillPercentage >= 70) return "bg-amber-500"
    return "bg-blue-500"
  }

  const getStatusBadge = () => {
    if (fillPercentage >= 90) return { label: t('readyToDepart'), variant: "success" }
    if (fillPercentage >= 70) return { label: t('fillingUp'), variant: "warning" }
    return { label: t('status'), variant: "secondary" }
  }

  const status = getStatusBadge()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{t(cluster.centroid.name)}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3" />
                {cluster.farmerCount} {t('farmers')}
              </CardDescription>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('truckCapacity')}</span>
            <span className="font-medium">{Math.round(fillPercentage)}% {t('full')}</span>
          </div>
          <Progress 
            value={fillPercentage} 
            className="h-3"
            indicatorClassName={getProgressColor()}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{cluster.totalWeight} kg {t('loaded')}</span>
            <span>{remainingCapacity} kg {t('remaining')}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{cluster.shipments?.length || 0} {t('shipments')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>10km {t('radius')}</span>
          </div>
        </div>

        {/* Savings Info */}
        <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t('estimatedSavings')}</p>
            <p className="text-lg font-bold text-primary">₹{cluster.estimatedSavings}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t('status')}</p>
            {fillPercentage >= 90 ? (
              <p className="text-sm font-medium text-primary flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                {t('readyToDepart')}
              </p>
            ) : (
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t('fillingUp')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LogisticsVisualization({ clusters }) {
  const t = useAtomValue(translationAtom)
  // Filter to only show active pools (clusters with multiple farmers)
  const activeClusters = clusters.filter(c => c.farmerCount > 1)
  
  // Calculate overall statistics
  const totalTrucks = activeClusters.length
  const readyToDispatch = activeClusters.filter(c => c.totalWeight >= 900).length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalTrucks}</p>
                <p className="text-xs text-muted-foreground">{t('activeTrucks')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{readyToDispatch}</p>
                <p className="text-xs text-muted-foreground">{t('readyToDepart')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">
                  {activeClusters.reduce((sum, c) => sum + c.farmerCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground">{t('farmers')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(activeClusters.reduce((sum, c) => sum + c.totalWeight, 0) / 1000 * 10) / 10}T
                </p>
                <p className="text-xs text-muted-foreground">{t('totalCapacity')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Truck Capacity Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            {t('sharedTruckStatus')}
          </CardTitle>
          <CardDescription>
            {t('logisticsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeClusters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeClusters.map((cluster) => (
                <TruckCapacityCard key={cluster.id} cluster={cluster} t={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Truck className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t('noActivePools')}</p>
              <p className="text-sm">{t('noActivePoolsDesc')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
