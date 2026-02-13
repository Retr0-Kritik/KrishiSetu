import { useTranslation } from '@/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  BarChart3, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

function TrendLine({ data, color = "emerald" }) {
  if (!data || data.length === 0) return null
  
  const maxPrice = Math.max(...data.map(d => d.price))
  const minPrice = Math.min(...data.map(d => d.price))
  const range = maxPrice - minPrice || 1
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.price - minPrice) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')

  const colorClasses = {
    emerald: "stroke-emerald-500",
    red: "stroke-red-500",
    amber: "stroke-amber-500",
    blue: "stroke-blue-500"
  }

  return (
    <div className="relative h-24 w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          className={colorClasses[color] || colorClasses.emerald}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots on each point */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d.price - minPrice) / range) * 80 - 10
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              className={`fill-current ${colorClasses[color]?.replace('stroke-', 'text-') || 'text-emerald-500'}`}
            />
          )
        })}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        {data.map((d, i) => (
          <span key={i} className="text-center">{d.day}</span>
        ))}
      </div>
    </div>
  )
}

export function MarketAnalytics({ marketPrices, predictions }) {
  const t = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t('marketAnalytics')}
        </CardTitle>
        <CardDescription>
          {t('marketDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('livePrices')}
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t('aiPredictions')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('crop')}</TableHead>
                  <TableHead>{t('price')} (₹{t('perQuintal')})</TableHead>
                  <TableHead>{t('change')}</TableHead>
                  <TableHead>{t('trend')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketPrices.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{t(item.crop)}</TableCell>
                    <TableCell>₹{item.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${
                        item.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {item.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {Math.abs(item.change)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.trend === 'up' ? 'success' : 'warning'}>
                        {item.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {item.trend === 'up' ? t('up') : t('down')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="predictions" className="mt-4">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span>{t('aiPredictionDesc')}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {predictions.map((item, index) => {
                  const lastPrice = item.predictions[item.predictions.length - 1]?.price || item.current
                  const change = ((lastPrice - item.current) / item.current * 100).toFixed(1)
                  const isPositive = change >= 0
                  const colors = ["emerald", "blue", "amber", "red"]
                  
                  return (
                    <Card key={index} className="border-dashed">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{t(item.crop)}</CardTitle>
                          <Badge variant={isPositive ? "success" : "warning"}>
                            {isPositive ? '+' : ''}{change}%
                          </Badge>
                        </div>
                        <CardDescription>
                          {t('current')}: ₹{item.current.toLocaleString()}{t('perQuintal')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TrendLine 
                          data={item.predictions} 
                          color={colors[index % colors.length]}
                        />
                        <div className="flex justify-between text-sm mt-6 pt-2 border-t">
                          <span className="text-muted-foreground">{t('today')}</span>
                          <span className="font-medium">
                            {t('predicted')}: ₹{lastPrice.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
