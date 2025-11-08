import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Button, Card } from 'pixel-retroui'

import { Tabs, TabsTriggerList, TabsTrigger, TabsPanels, TabsContent } from './components/retroui/Tab'
import { Switch } from './components/retroui/Switch'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from './components/retroui/Select'

import {
  createSpriteController,
  type BlendModeOption,
  type GeneratorState,
  type SpriteController,
  type SpriteMode,
  type MovementMode,
  type BackgroundMode,
} from './generator'
import { getPixelArtIconById, pixelArtIconAssets } from './data/pixelartIconAssets'
import { palettes } from './data/palettes'
const BUTTON_PRIMARY = {
  bg: 'var(--btn-primary-bg)',
  textColor: 'var(--btn-primary-text)',
  shadow: 'var(--btn-primary-shadow)',
  borderColor: 'var(--btn-primary-border)',
}

const BUTTON_SECONDARY = {
  bg: 'var(--btn-secondary-bg)',
  textColor: 'var(--btn-secondary-text)',
  shadow: 'var(--btn-secondary-shadow)',
  borderColor: 'var(--btn-secondary-border)',
}

const BLEND_MODES: BlendModeOption[] = ['NONE', 'MULTIPLY', 'SCREEN', 'HARD_LIGHT', 'OVERLAY']
const BACKGROUND_OPTIONS = [
  { value: 'palette', label: 'Palette (auto)' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'charcoal', label: 'Charcoal' },
  { value: 'dusk', label: 'Dusk' },
  { value: 'dawn', label: 'Dawn' },
  { value: 'nebula', label: 'Nebula' },
] as const

type ThemeMode = 'system' | 'light' | 'dark'
type ThemeColor = 'amber' | 'mint' | 'violet' | 'ember' | 'lagoon' | 'rose'

const THEME_MODE_STORAGE_KEY = 'retro-theme-mode'
const THEME_COLOR_STORAGE_KEY = 'retro-theme-color'
const THEME_COLOR_OPTIONS: Array<{ value: ThemeColor; label: string }> = [
  { value: 'amber', label: 'Sunburst' },
  { value: 'mint', label: 'Neon Grid' },
  { value: 'violet', label: 'Nebula' },
  { value: 'ember', label: 'Ember Glow' },
  { value: 'lagoon', label: 'Lagoon Tide' },
  { value: 'rose', label: 'Rose Quartz' },
]

const THEME_COLOR_PREVIEW: Record<ThemeColor, string> = {
  amber: '#ffdb33',
  mint: '#58f5c2',
  violet: '#c99cff',
  ember: '#ff6b3d',
  lagoon: '#3ad7ff',
  rose: '#ff7cc8',
}

const SPRITE_MODES: Array<{ value: SpriteMode; label: string; description: string }> = [
  { value: 'pixel-glass', label: 'Pixel Glass', description: 'Dense pixel mosaics with retro motion' },
  { value: 'circle', label: 'Circle', description: 'Soft orbital clusters with rounded silhouettes' },
  { value: 'square', label: 'Square', description: 'Chunky voxel tiles snapped to a tight grid' },
  { value: 'triangle', label: 'Triangle', description: 'Angular shards with sharp tessellations' },
  { value: 'hexagon', label: 'Hexagon', description: 'Honeycomb lattices with layered depth' },
  { value: 'ring', label: 'Orbit Rings', description: 'Outlined halos that wobble and pulse like retro radar' },
  { value: 'diamond', label: 'Crystal Diamonds', description: 'Faceted lozenges drifting in shimmering parallax' },
  { value: 'star', label: 'Starburst', description: 'Five-point bursts that twinkle with layered motion' },
  { value: 'line', label: 'Neon Lines', description: 'Light trails that slice across the canvas with rhythm' },
  { value: 'icon', label: 'Icon', description: 'Single pixelart icon from the library' },
]

const PALETTE_OPTIONS = palettes.map((palette) => ({ value: palette.id, label: palette.name }))

const CLUSTER_PRESET_OPTIONS = [
  { value: 'single', label: 'Single Tile Preset' },
  { value: 'nebula', label: 'Nebula Cluster' },
  { value: 'minimal', label: 'Minimal Grid' },
  { value: 'shuffle', label: 'Shuffle Cluster' },
]

const MOVEMENT_MODES: Array<{ value: MovementMode; label: string }> = [
  { value: 'sway', label: 'Sway' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'orbit', label: 'Orbit' },
  { value: 'drift', label: 'Drift' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'zigzag', label: 'Zigzag' },
  { value: 'cascade', label: 'Cascade' },
  { value: 'spiral', label: 'Spiral Orbit' },
  { value: 'comet', label: 'Comet Trail' },
  { value: 'wavefront', label: 'Wavefront' },
]

const formatBlendMode = (mode: BlendModeOption) =>
  mode
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const formatMovementMode = (mode: MovementMode) =>
  MOVEMENT_MODES.find((entry) => entry.value === mode)?.label ?? 'Sway'

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)
    listener()
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [query])

  return matches
}

const TooltipIcon = ({ id, text, label }: { id: string; text: string; label: string }) => (
  <span className="retro-tooltip">
    <button
      type="button"
      className="tooltip-trigger"
      aria-describedby={id}
      aria-label={`More about ${label}`}
    >
      ?
    </button>
    <span id={id} role="tooltip" className="tooltip-content">
      {text}
    </span>
  </span>
)

const ControlSlider = ({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  displayValue,
  disabled,
  tooltip,
}: {
  id: string
  label: string
  min: number
  max: number
  step?: number
  value: number
  displayValue: string
  onChange: (value: number) => void
  disabled?: boolean
  tooltip?: string
}) => {
  return (
    <div className="control-field">
      <div className="field-heading">
        <div className="field-heading-left">
          <span className="field-label" id={`${id}-label`}>
            {label}
          </span>
          {tooltip && <TooltipIcon id={`${id}-tip`} text={tooltip} label={label} />}
        </div>
        <span className="field-value">{displayValue}</span>
      </div>
      <input
        className="control-slider"
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        aria-labelledby={`${id}-label`}
      />
    </div>
  )
}

const ControlSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder,
  tooltip,
  currentLabel,
}: {
  id: string
  label: string
  options: Array<{ value: string; label: string }>
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  tooltip?: string
  currentLabel?: string
}) => {
  const tooltipId = tooltip ? `${id}-tip` : undefined
  const resolvedLabel = currentLabel ?? options.find((option) => option.value === value)?.label ?? placeholder ?? 'Select'

  return (
    <div className="control-field">
      <div className="field-heading">
        <div className="field-heading-left">
          <span className="field-label" id={`${id}-label`}>
            {label}
          </span>
          {tooltip && tooltipId && <TooltipIcon id={tooltipId} text={tooltip} label={label} />}
        </div>
      </div>
      <Select value={value ?? undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="control-dropdown-trigger" aria-labelledby={`${id}-label`}>
          <SelectValue placeholder={placeholder ?? 'Select'}>{resolvedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="control-dropdown-menu">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="control-dropdown-item">
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

const BitlabLogo = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 330 45"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M52.5 7.5h-7.5V0h7.5v7.5h7.5v30h-7.5v7.5H0v-7.5h45v-7.5h7.5v-7.5h-7.5v-7.5h7.5v-7.5zm-30 7.5V7.5h7.5V15h-7.5zm0 15v-7.5h7.5V30h-7.5zM90 45h-30v-7.5h22.5V0H90v45zM90 7.5h15v7.5H90V7.5zm45 22.5h-7.5V7.5h15V0h7.5v15h-15v15h7.5v15h-45v-7.5h37.5v-7.5zM210 45h-60v-7.5h52.5v-7.5H210V45zm-37.5-15V0h7.5v30h-7.5zM262.5 7.5h-7.5V0h7.5v7.5h7.5v37.5h-60v-7.5h22.5v-7.5h7.5v7.5h22.5V7.5zm-30 15V7.5h7.5v15h-7.5zM322.5 7.5h-7.5V0h7.5v7.5h7.5v30h-7.5v7.5h-52.5v-7.5h45v-7.5h7.5v-7.5h-7.5v-7.5h7.5v-7.5zm-30 7.5V7.5h7.5V15h-7.5zm0 15v-7.5h7.5V30h-7.5z"
    />
  </svg>
)

const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'system'
  }
  const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

const getStoredThemeColor = (): ThemeColor => {
  if (typeof window === 'undefined') {
    return 'amber'
  }
  const stored = window.localStorage.getItem(THEME_COLOR_STORAGE_KEY)
  return stored === 'mint' ||
    stored === 'violet' ||
    stored === 'ember' ||
    stored === 'lagoon' ||
    stored === 'rose'
    ? (stored as ThemeColor)
    : 'amber'
}

const App = () => {
  const sketchContainerRef = useRef<HTMLDivElement | null>(null)
  const controllerRef = useRef<SpriteController | null>(null)
  const [spriteState, setSpriteState] = useState<GeneratorState | null>(null)
  const [frameRate, setFrameRate] = useState<number>(60)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredThemeMode())
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => getStoredThemeColor())
  const [clusterPreset, setClusterPreset] = useState<'single' | 'nebula' | 'minimal' | 'shuffle'>('shuffle')
  const [controlTab, setControlTab] = useState<'sprites' | 'fx'>('sprites')
  const isStudioLayout = useMediaQuery('(min-width: 1760px)')
  const themeColorLabel = useMemo(
    () => THEME_COLOR_OPTIONS.find((option) => option.value === themeColor)?.label ?? THEME_COLOR_OPTIONS[0].label,
    [themeColor],
  )

  const cycleThemeMode = useCallback(() => {
    setThemeMode((prev) => {
      if (prev === 'system') return 'light'
      if (prev === 'light') return 'dark'
      return 'system'
    })
  }, [])

  const themeModeText = useMemo(() => {
    switch (themeMode) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      default:
        return 'System'
    }
  }, [themeMode])

  const themeModeIcon = useMemo(() => {
    switch (themeMode) {
      case 'light':
        return '☀'
      case 'dark':
        return '☾'
      default:
        return '◎'
    }
  }, [themeMode])

  const ready = spriteState !== null && controllerRef.current !== null

  const currentPalette = useMemo(
    () => palettes.find((item) => item.id === spriteState?.paletteId) ?? palettes[0],
    [spriteState?.paletteId],
  )

  const currentModeLabel = useMemo(() => {
    if (!spriteState) return SPRITE_MODES[0].label
    return SPRITE_MODES.find((mode) => mode.value === spriteState.spriteMode)?.label ?? SPRITE_MODES[0].label
  }, [spriteState])

  const currentIconAsset = useMemo(() => {
    if (!spriteState || spriteState.spriteMode !== 'icon') {
      return null
    }
    return getPixelArtIconById(spriteState.iconAssetId) ?? pixelArtIconAssets[0]
  }, [spriteState?.iconAssetId, spriteState?.spriteMode])

  useEffect(() => {
    const container = sketchContainerRef.current
    if (!container) {
      return
    }

    const controller = createSpriteController(container, {
      onStateChange: (state) => {
        setSpriteState(state)
      },
      onFrameRate: setFrameRate,
    })

    controllerRef.current = controller
    setSpriteState(controller.getState())
    controller.randomizeAll()

    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  const handlePaletteSelection = useCallback((paletteId: string) => {
    controllerRef.current?.usePalette(paletteId)
  }, [])

  const handleBackgroundSelect = useCallback((mode: string) => {
    controllerRef.current?.setBackgroundMode(mode as BackgroundMode)
  }, [])

  const handleBlendSelect = useCallback((mode: BlendModeOption) => {
    controllerRef.current?.setBlendMode(mode)
  }, [])

  const handleBlendAutoToggle = useCallback((checked: boolean) => {
    controllerRef.current?.setBlendModeAuto(checked)
  }, [])

  const handleModeChange = useCallback((mode: SpriteMode) => {
    controllerRef.current?.setSpriteMode(mode)
  }, [])

  const handleMovementSelect = useCallback((mode: MovementMode) => {
    controllerRef.current?.setMovementMode(mode)
  }, [])

  const handleIconAssetSelect = useCallback((iconId: string) => {
    controllerRef.current?.setIconAsset(iconId)
  }, [])

  const handleThemeSelect = useCallback((value: string) => {
    if (value === 'amber' || value === 'mint' || value === 'violet' || value === 'ember' || value === 'lagoon' || value === 'rose') {
      setThemeColor(value)
    }
  }, [])

  const randomiseCluster = useCallback(() => {
    controllerRef.current?.randomizeCluster()
  }, [])

  const applySingleTilePreset = useCallback(() => {
    controllerRef.current?.applySingleTilePreset()
  }, [])

  const applyNebulaPreset = useCallback(() => {
    controllerRef.current?.applyNebulaPreset()
  }, [])

  const applyMinimalPreset = useCallback(() => {
    controllerRef.current?.applyMinimalGridPreset()
  }, [])

  const handleClusterPresetSelect = useCallback(
    (value: string) => {
      if (!controllerRef.current) return
      switch (value) {
        case 'single':
          applySingleTilePreset()
          break
        case 'nebula':
          applyNebulaPreset()
          break
        case 'minimal':
          applyMinimalPreset()
          break
        case 'shuffle':
        default:
          randomiseCluster()
          break
      }
      const presetValue =
        value === 'single' || value === 'nebula' || value === 'minimal' ? value : 'shuffle'
      setClusterPreset(presetValue as 'single' | 'nebula' | 'minimal' | 'shuffle')
    },
    [applyMinimalPreset, applyNebulaPreset, applySingleTilePreset, randomiseCluster],
  )

  const handleRandomiseAll = useCallback(() => {
    controllerRef.current?.randomizeAll()
  }, [])

  const statusPalette = currentPalette.name
  const statusMode = currentModeLabel
  const statusBlend = spriteState ? formatBlendMode(spriteState.blendMode as BlendModeOption) : 'None'
  const statusMotion = spriteState ? formatMovementMode(spriteState.movementMode) : 'Sway'

  const applyDocumentTheme = useCallback((mode: ThemeMode, color: ThemeColor) => {
    if (typeof document === 'undefined') {
      return
    }
    const root = document.documentElement
    const prefersDark =
      mode === 'system' && typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false
    const resolved: Exclude<ThemeMode, 'system'> = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode
    root.setAttribute('data-theme-mode', mode)
    root.setAttribute('data-theme', resolved)
    root.setAttribute('data-theme-color', color)
    root.setAttribute('data-theme-shape', 'box')
    root.style.setProperty('color-scheme', resolved)
  }, [])

  useLayoutEffect(() => {
    applyDocumentTheme(themeMode, themeColor)
  }, [applyDocumentTheme, themeMode, themeColor])

  useEffect(() => {
    if (themeMode !== 'system' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyDocumentTheme('system', themeColor)
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    }
    media.addListener(handler)
    return () => media.removeListener(handler)
  }, [applyDocumentTheme, themeColor, themeMode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode)
  }, [themeMode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(THEME_COLOR_STORAGE_KEY, themeColor)
  }, [themeColor])

  const renderSpriteControls = () => {
    if (!spriteState) {
      return null
    }
    return (
      <>
        <div className="section">
          <h3 className="section-title">Generation</h3>
          <ControlSelect
            id="render-mode"
            label="Render Mode"
            value={spriteState.spriteMode}
            onChange={(value) => handleModeChange(value as SpriteMode)}
            disabled={!ready}
            options={SPRITE_MODES.map((mode) => ({ value: mode.value, label: mode.label }))}
            tooltip="Swap between pixel mosaics, geometric sprite layers, or a single icon motif."
          />

          <ControlSlider
            id="density-range"
            label="Tile Density"
            min={20}
            max={400}
            value={Math.round(spriteState.scalePercent)}
            displayValue={`${Math.round(spriteState.scalePercent)}%`}
            onChange={(value) => controllerRef.current?.setScalePercent(value)}
            disabled={!ready}
            tooltip="Controls how many tiles spawn per layer; higher values create a busier canvas."
          />
          <ControlSlider
            id="scale-base"
            label="Scale Base"
            min={40}
            max={220}
            value={Math.round(spriteState.scaleBase)}
            displayValue={`${Math.round(spriteState.scaleBase)}%`}
            onChange={(value) => controllerRef.current?.setScaleBase(value)}
            disabled={!ready}
            tooltip="Sets the baseline sprite size before any random spread is applied."
          />
          <ControlSlider
            id="scale-range"
            label="Scale Range"
            min={30}
            max={360}
            value={Math.round(spriteState.scaleSpread)}
            displayValue={`${Math.round(spriteState.scaleSpread)}%`}
            onChange={(value) => controllerRef.current?.setScaleSpread(value)}
            disabled={!ready}
            tooltip="Expands or tightens the difference between the smallest and largest sprites."
          />
          {spriteState.spriteMode === 'pixel-glass' && (
            <>
              <ControlSlider
                id="cluster-amount"
                label="Cluster Amount"
                min={0}
                max={100}
                value={Math.round(spriteState.clusterAmount)}
                displayValue={`${Math.round(spriteState.clusterAmount)}%`}
                onChange={(value) => controllerRef.current?.setClusterAmount(value)}
                disabled={!ready}
                tooltip="Blend between a single featured tile (0) and a fully packed pixel-glass cluster (100)."
              />
              <ControlSelect
                id="cluster-preset"
                label="Cluster Preset"
                value={clusterPreset}
                onChange={handleClusterPresetSelect}
                options={CLUSTER_PRESET_OPTIONS}
                disabled={!ready}
                tooltip="Apply ready-made cluster recipes or trigger a fresh random shuffle."
                currentLabel={
                  CLUSTER_PRESET_OPTIONS.find((option) => option.value === clusterPreset)?.label ??
                  CLUSTER_PRESET_OPTIONS[3].label
                }
              />
            </>
          )}
        </div>

        {spriteState.spriteMode === 'icon' && (
          <div className="section">
            <h3 className="section-title">Icon Selection</h3>
            <p className="section-hint">Choose one icon from the Pixelarticons library.</p>
            <div className="icon-selector">
              {currentIconAsset && (
                <div className="icon-selector-preview">
                  <img src={currentIconAsset.url} alt={currentIconAsset.label} width={28} height={28} />
                </div>
              )}
              <ControlSelect
                id="library-icon"
                label="Library Icon"
                value={spriteState.iconAssetId}
                onChange={handleIconAssetSelect}
                disabled={!ready}
                options={pixelArtIconAssets.map((assetOption) => ({
                  value: assetOption.id,
                  label: assetOption.label,
                }))}
                placeholder="Select Icon"
                tooltip="Choose the pixelarticons asset rendered for icon mode outputs."
                currentLabel={currentIconAsset?.label}
              />
            </div>
          </div>
        )}

        <div className="panel-footer">
          <Button
            {...BUTTON_PRIMARY}
            type="button"
            className="panel-footer-button"
            onClick={handleRandomiseAll}
            disabled={!ready}
          >
            Randomise All
          </Button>
        </div>
      </>
    )
  }

  const renderFxControls = () => {
    if (!spriteState) {
      return null
    }
    const blendAutoLabelId = 'blend-auto-label'

    return (
      <>
        <div className="section">
          <h3 className="section-title">Motion &amp; Blend</h3>
          <ControlSelect
            id="movement-mode"
            label="Movement"
            value={spriteState.movementMode}
            onChange={(value) => handleMovementSelect(value as MovementMode)}
            disabled={!ready}
            options={MOVEMENT_MODES.map((mode) => ({ value: mode.value, label: mode.label }))}
            tooltip="Select the animation path applied to each sprite layer."
            currentLabel={formatMovementMode(spriteState.movementMode)}
          />
          <ControlSlider
            id="motion-range"
            label="Motion Intensity"
            min={0}
            max={100}
            value={Math.round(spriteState.motionIntensity)}
            displayValue={`${Math.round(spriteState.motionIntensity)}%`}
            onChange={(value) => controllerRef.current?.setMotionIntensity(value)}
            disabled={!ready}
            tooltip="Adjust how far sprites travel within their chosen movement path."
          />
          <ControlSlider
            id="motion-speed"
            label="Animation Speed"
            min={0}
            max={300}
            step={5}
            value={Math.round(spriteState.motionSpeed)}
            displayValue={`${Math.round(spriteState.motionSpeed)}%`}
            onChange={(value) => controllerRef.current?.setMotionSpeed(value)}
            disabled={!ready}
            tooltip="Slow every layer down or accelerate the motion-wide choreography."
          />
          <ControlSlider
            id="opacity-range"
            label="Layer Opacity"
            min={15}
            max={100}
            value={Math.round(spriteState.layerOpacity)}
            displayValue={`${Math.round(spriteState.layerOpacity)}%`}
            onChange={(value) => controllerRef.current?.setLayerOpacity(value)}
            disabled={!ready}
            tooltip="Sets the base transparency for each rendered layer before blending."
          />
          <ControlSelect
            id="blend-mode"
            label="Blend Mode"
            value={spriteState.blendMode as string}
            onChange={(value) => handleBlendSelect(value as BlendModeOption)}
            disabled={!ready || spriteState.blendModeAuto}
            options={BLEND_MODES.map((mode) => ({ value: mode, label: formatBlendMode(mode) }))}
            tooltip="Choose the compositing mode applied when layers draw over each other."
            currentLabel={formatBlendMode(spriteState.blendMode as BlendModeOption)}
          />
          <div className="control-field control-field--spaced">
            <div className="field-heading">
              <div className="field-heading-left">
                <span className="field-label" id={blendAutoLabelId}>
                  Random sprite blend
                </span>
                <TooltipIcon
                  id="blend-auto-tip"
                  text="Give every sprite an individual blend pick from the RetroUI-compatible pool."
                  label="Random sprite blend"
                />
              </div>
            </div>
            <div className="switch-row">
              <Switch
                id="blend-auto"
                checked={spriteState.blendModeAuto}
                onCheckedChange={handleBlendAutoToggle}
                disabled={!ready}
                aria-labelledby={blendAutoLabelId}
              />
            </div>
          </div>
        </div>

        <div className="section">
          <h3 className="section-title">Palette &amp; Variance</h3>
          <ControlSlider
            id="palette-range"
            label="Palette Variance"
            min={0}
            max={100}
            value={Math.round(spriteState.paletteVariance)}
            displayValue={`${Math.round(spriteState.paletteVariance)}%`}
            onChange={(value) => controllerRef.current?.setPaletteVariance(value)}
            disabled={!ready}
            tooltip="Controls how much each colour can drift away from the base palette swatches."
          />
          <ControlSelect
            id="palette-presets"
            label="Palette Presets"
            value={currentPalette.id}
            onChange={(value) => handlePaletteSelection(value)}
            disabled={!ready}
            options={PALETTE_OPTIONS}
            tooltip="Select the core palette used for tinting sprites before variance is applied."
            currentLabel={currentPalette.name}
          />
          <ControlSelect
            id="background-mode"
            label="Canvas Background"
            value={spriteState.backgroundMode}
            onChange={handleBackgroundSelect}
            disabled={!ready}
            options={BACKGROUND_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
            tooltip="Choose the colour applied behind the canvas."
            currentLabel={
              BACKGROUND_OPTIONS.find((option) => option.value === spriteState.backgroundMode)?.label
            }
          />
        </div>

        <div className="panel-footer">
          <Button
            {...BUTTON_PRIMARY}
            type="button"
            className="panel-footer-button"
            onClick={handleRandomiseAll}
            disabled={!ready}
          >
            Randomise All
          </Button>
        </div>
      </>
    )
  }

  const renderUtilities = () => (
    <div className="utilities-actions">
      <Button type="button" className="utilities-button" onClick={() => controllerRef.current?.reset()} disabled={!ready}>
        Reset
      </Button>
      <Button type="button" className="utilities-button" disabled>
        Save Preset
      </Button>
    </div>
  )

  const renderDisplayContent = () => (
    <>
      <Card {...BUTTON_SECONDARY} className="panel canvas-card">
        <div className="canvas-wrapper">
          <div className="sketch-container" ref={sketchContainerRef} aria-live="polite" />
        </div>
        <div className="status-bar">
          <span className="status-chip">Palette · {statusPalette}</span>
          <span className="status-chip">Mode · {statusMode}</span>
          <span className="status-chip">Blend · {statusBlend}</span>
          <span className="status-chip">Motion · {statusMotion}</span>
          <span className="status-chip">{frameRate.toFixed(0)} FPS</span>
        </div>
      </Card>

      <Card {...BUTTON_SECONDARY} className="panel">
        <h2 className="control-label">Session Notes</h2>
        <p className="notes-text">
          Sculpt vivid voxel compositions inside BitLab. Iterate on iconography, mutate colour systems, elevate motion envelopes,
          and layer blend modes to surface unexpected pixel poetry.
        </p>
        <div className="external-links">
          <a href="https://github.com/halfmage/pixelarticons" target="_blank" rel="noreferrer">
            Pixel Art Icons
          </a>
          <a href="https://p5js.org/" target="_blank" rel="noreferrer">
            p5.js
          </a>
          <a href="https://www.retroui.dev/docs" target="_blank" rel="noreferrer">
            RetroUI Docs
          </a>
        </div>
      </Card>
    </>
  )

  return (
    <div className="app-shell">
      <header className="app-header">
        <button type="button" className="app-logo-button" aria-label="BitLab">
          <BitlabLogo className="app-logo-svg" />
        </button>
        <div className="header-toolbar">
          <div className="header-spacer" />
          <div className="header-actions">
            <Select value={themeColor} onValueChange={handleThemeSelect}>
              <SelectTrigger className="header-theme-trigger" aria-label="Theme colour">
                <SelectValue placeholder="Theme">{themeColorLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent className="header-theme-menu">
                <SelectGroup>
                  {THEME_COLOR_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="header-theme-item"
                      style={{ '--theme-preview': THEME_COLOR_PREVIEW[option.value] } as CSSProperties}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              type="button"
              className="header-icon-button"
              onClick={cycleThemeMode}
              aria-label={`Switch theme mode (current ${themeModeText})`}
              title={`Theme: ${themeModeText}`}
            >
              <span aria-hidden="true">{themeModeIcon}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className={`app-layout${isStudioLayout ? ' app-layout--studio' : ''}`}>
          <aside className="control-column">
            {isStudioLayout ? (
              <>
                <Card {...BUTTON_SECONDARY} className="control-card">
                  <div className="panel">
                    <div className="panel-heading">Sprite Controls</div>
                    {renderSpriteControls()}
                  </div>
                </Card>
                <Card {...BUTTON_SECONDARY} className="utility-card">
                  <div className="panel">
                    <div className="panel-heading">Utilities</div>
                    {renderUtilities()}
                  </div>
                </Card>
              </>
            ) : (
              <>
                <Card {...BUTTON_SECONDARY} className="control-card">
                  <div className="panel">
                    <Tabs value={controlTab} onValueChange={(next) => setControlTab(next as 'sprites' | 'fx')}>
                      <TabsTriggerList className="retro-tabs">
                        <TabsTrigger value="sprites">Sprites</TabsTrigger>
                        <TabsTrigger value="fx">FX</TabsTrigger>
                      </TabsTriggerList>
                      <TabsPanels>
                        <TabsContent value="sprites" className="tab-panel">
                          {renderSpriteControls()}
                        </TabsContent>
                        <TabsContent value="fx" className="tab-panel">
                          {renderFxControls()}
                        </TabsContent>
                      </TabsPanels>
                    </Tabs>
                  </div>
                  <div className="panel">
                    <div className="panel-heading">Utilities</div>
                    {renderUtilities()}
                  </div>
                </Card>
              </>
            )}
          </aside>

          <div className="display-column">{renderDisplayContent()}</div>

          {isStudioLayout && (
            <aside className="fx-column">
              <Card {...BUTTON_SECONDARY} className="fx-card">
                <div className="panel">
                  <div className="panel-heading">FX</div>
                  {renderFxControls()}
                </div>
              </Card>
            </aside>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} BitLab · Generative Playground</span>
        <span>
          Inspired by{' '}
          <a href="https://github.com/djnavarro/series-advent" target="_blank" rel="noreferrer">
            Series Advent
          </a>{' '}
          ·{' '}
          <a href="https://github.com/djnavarro/series-pastiche" target="_blank" rel="noreferrer">
            Series Pastiche
          </a>
        </span>
      </footer>
    </div>
  )
}

export default App

