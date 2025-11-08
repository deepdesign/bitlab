import { createContext, useCallback, useContext, useId, useMemo, useState, type PropsWithChildren } from 'react'

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

type TabsContextValue = {
  value: string | null
  setValue: (value: string) => void
  baseId: string
  orientation: 'horizontal' | 'vertical'
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>')
  }
  return context
}

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const Tabs = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  orientation = 'horizontal',
}: PropsWithChildren<TabsProps>) => {
  const isControlled = typeof controlledValue !== 'undefined'
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue ?? null)
  const value = (isControlled ? controlledValue : uncontrolled) ?? null
  const baseId = useId()

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolled(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const context = useMemo(() => ({ value, setValue, baseId, orientation }), [value, setValue, baseId, orientation])

  return (
    <TabsContext.Provider value={context}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsTriggerListProps {
  className?: string
}

export const TabsTriggerList = ({ children, className }: PropsWithChildren<TabsTriggerListProps>) => (
  <div role="tablist" className={className}>
    {children}
  </div>
)

interface TabsTriggerProps {
  value: string
  className?: string
}

export const TabsTrigger = ({ value, children, className }: PropsWithChildren<TabsTriggerProps>) => {
  const { value: activeValue, setValue, baseId } = useTabsContext()
  const isActive = activeValue === value
  const triggerId = `${baseId}-trigger-${value}`
  const panelId = `${baseId}-panel-${value}`

  return (
    <button
      type="button"
      id={triggerId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      className={cx('retro-tab', className, isActive && 'retro-tab-active')}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  )
}

interface TabsPanelsProps {
  className?: string
}

export const TabsPanels = ({ children, className }: PropsWithChildren<TabsPanelsProps>) => (
  <div className={className}>{children}</div>
)

interface TabsContentProps {
  value: string
  className?: string
}

export const TabsContent = ({ value, children, className }: PropsWithChildren<TabsContentProps>) => {
  const { value: activeValue, baseId } = useTabsContext()
  const isActive = activeValue === value
  const panelId = `${baseId}-panel-${value}`
  const triggerId = `${baseId}-trigger-${value}`

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      hidden={!isActive}
      className={cx('tab-panel', className)}
    >
      {children}
    </div>
  )
}
