import { RpcRequestFieldCast, RpcRequestFieldDecoratorConfig } from '@app/core/interfaces/rpc'
import { applyDecorators } from '@nestjs/common'
import { Expose, Transform } from 'class-transformer'
import luxon from 'luxon'

export function RpcRequestFieldDecorator<T, Y>(
  config?: RpcRequestFieldDecoratorConfig<T>,
): (target: object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void {
  const { cast, defaultValue, convertEmpty = true, expose = true } = config || {}

  const decorators = [
    Transform(({ value }) => {
      if (value === null && config?.keepNull) {
        return null
      }

      if (value === undefined) {
        return defaultValue
      }

      if (convertEmpty && !value && value !== false) {
        return defaultValue
      }

      if (cast) {
        switch (cast) {
          case RpcRequestFieldCast.Boolean:
            if (['false', 'off', '0'].includes(value)) {
              return false
            }

            return Boolean(value)
          case RpcRequestFieldCast.Number:
            return Number(value)
          case RpcRequestFieldCast.Json:
            try {
              return JSON.parse(value)
            } catch {
              return defaultValue
            }
          case RpcRequestFieldCast.Date: {
            const date = luxon.DateTime.fromISO(value)
            if (date.isValid) {
              return date.toJSDate()
            }

            return defaultValue
          }
          case RpcRequestFieldCast.Set: {
            try {
              const values = typeof value === 'string' ? JSON.parse(value) : value

              return Array.isArray(values) ? [...new Set(values)] : defaultValue
            } catch {
              return defaultValue
            }
          }
          default: {
            const unhandledCast: never = cast

            throw new TypeError(`Unhandled owner type: ${unhandledCast}`)
          }
        }
      }

      return value
    }),
  ]

  if (expose) {
    decorators.unshift(Expose())
  }

  return applyDecorators(...decorators)
}
