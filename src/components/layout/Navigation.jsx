import { useAtom, useAtomValue } from 'jotai'
import { cn } from "@/lib/utils"
import { languageAtom, translationAtom, activeTabAtom } from "@/store/atoms"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Home, 
  BarChart3, 
  Truck, 
  User,
  Sprout,
  Globe
} from "lucide-react"

const navKeys = [
  { id: "dashboard", labelKey: "home", icon: Home },
  { id: "analytics", labelKey: "market", icon: BarChart3 },
  { id: "logistics", labelKey: "logistics", icon: Truck },
  { id: "profile", labelKey: "profile", icon: User },
]

function LanguageSwitcher() {
  const [language, setLanguage] = useAtom(languageAtom)
  
  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[130px] h-9">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="bn">বাংলা</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function BottomNavigation() {
  const t = useAtomValue(translationAtom)
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navKeys.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs",
                isActive && "font-medium"
              )}>
                {t(item.labelKey)}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Krishi<span className="text-primary">Setu</span></span>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export function DesktopSidebar() {
  const t = useAtomValue(translationAtom)
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)
  
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-[calc(100vh-3.5rem)] sticky top-14">
      <nav className="flex-1 p-4 space-y-2">
        {navKeys.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {t(item.labelKey)}
            </button>
          )
        })}
      </nav>
      
      {/* Bottom section */}
      <div className="p-4 border-t">
        <div className="bg-primary/10 rounded-lg p-3">
          <p className="text-sm font-medium text-primary">{t('needHelp')}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('supportText')}
          </p>
        </div>
      </div>
    </aside>
  )
}
