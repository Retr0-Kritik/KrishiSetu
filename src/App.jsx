import { useState, useEffect, useMemo } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { FarmerDashboard } from '@/components/dashboard/FarmerDashboard'
import { MarketAnalytics } from '@/components/analytics/MarketAnalytics'
import { LogisticsVisualization } from '@/components/logistics/LogisticsVisualization'
import { BottomNavigation, Header, DesktopSidebar } from '@/components/layout/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  activeTabAtom, 
  shipmentsAtom, 
  notificationAtom,
  translationAtom 
} from '@/store/atoms'
import { 
  clusterShipments, 
  generateMockShipments, 
  generateMarketPrices, 
  generatePricePredictions,
  calculatePoolingBenefits 
} from '@/utils/clusteringEngine'
import { User, Settings, Bell, HelpCircle } from 'lucide-react'
import './index.css'

function ProfilePage() {
  const t = useAtomValue(translationAtom)
  const [activeAction, setActiveAction] = useState(null)

  const handleQuickAction = (action) => {
    setActiveAction(action)
    setTimeout(() => setActiveAction(null), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t('farmerProfile')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Ramesh Kumar</h3>
              <p className="text-muted-foreground">{t('bardhaman')}, {t('westBengal')}</p>
              <p className="text-sm text-primary">{t('verifiedFarmer')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">{t('shipmentsMade')}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-primary">₹4,500</p>
              <p className="text-sm text-muted-foreground">{t('totalSavings')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { icon: Settings, labelKey: "accountSettings", action: "settings" },
            { icon: Bell, labelKey: "notifications", action: "notifications" },
            { icon: HelpCircle, labelKey: "helpSupport", action: "help" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(item.action)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left ${
                activeAction === item.action ? 'bg-primary/10 border border-primary' : ''
              }`}
            >
              <item.icon className={`h-5 w-5 ${
                activeAction === item.action ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <span>{activeAction === item.action ? t('comingSoon') : t(item.labelKey)}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function App() {
  const activeTab = useAtomValue(activeTabAtom)
  const [shipments, setShipments] = useAtom(shipmentsAtom)
  const notification = useAtomValue(notificationAtom)
  
  // Initialize with mock data
  useEffect(() => {
    const mockShipments = generateMockShipments(15)
    setShipments(mockShipments)
  }, [setShipments])

  // Cluster shipments using the mock clustering engine
  const clusters = useMemo(() => {
    return clusterShipments(shipments, 10)
  }, [shipments])

  // Calculate pooling benefits
  const benefits = useMemo(() => {
    return calculatePoolingBenefits(clusters)
  }, [clusters])

  // Generate market data
  const marketPrices = useMemo(() => generateMarketPrices(), [])
  const predictions = useMemo(() => generatePricePredictions(), [])

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <FarmerDashboard 
            clusters={clusters} 
            benefits={benefits}
          />
        )
      case "analytics":
        return (
          <MarketAnalytics 
            marketPrices={marketPrices} 
            predictions={predictions}
          />
        )
      case "logistics":
        return <LogisticsVisualization clusters={clusters} />
      case "profile":
        return <ProfilePage />
      default:
        return (
          <FarmerDashboard 
            clusters={clusters} 
            benefits={benefits}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </div>
        </div>
      )}
      
      <div className="flex">
        <DesktopSidebar />
        
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default App
