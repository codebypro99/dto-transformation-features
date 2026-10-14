import { PlatformType } from '@app/core/interfaces/core'
import { RpcRequest, RpcRequestHeaders, RpcRequestUser } from '@app/core/interfaces/rpc'
import { Type } from 'class-transformer'
import { IsEnum, IsObject, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator'

class RpcRequestHeadersDto implements RpcRequestHeaders {
  @IsUUID()
  traceId: string

  @IsUUID()
  @IsOptional()
  mobileUid: string

  @IsString()
  @IsOptional()
  platformVersion: string

  @IsString()
  @IsOptional()
  appVersion: string

  @IsEnum(PlatformType)
  @IsOptional()
  platformType: PlatformType
}

export abstract class RpcRequestDto<PayloadType> implements RpcRequest<PayloadType> {
  @IsObject()
  @ValidateNested()
  @Type(() => RpcRequestHeadersDto)
  headers: RpcRequestHeadersDto

  @IsObject()
  @ValidateNested()
  abstract user: RpcRequestUser

  @IsObject()
  @ValidateNested()
  abstract payload: PayloadType
}
