import * as SwitchPrimitive from '@radix-ui/react-switch'
import { forwardRef } from 'react'

type SwitchProps = SwitchPrimitive.SwitchProps

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className = '', ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={`control-switch ${className}`}
      {...props}
    >
      <SwitchPrimitive.Thumb className="control-switch-thumb" />
    </SwitchPrimitive.Root>
  ),
)
Switch.displayName = 'Switch'
