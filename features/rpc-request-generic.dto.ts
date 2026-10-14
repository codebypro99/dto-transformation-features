import { RpcRequestDto } from '@app/core/dto/requests/rpc-request.dto'
import {
  AclData,
  AdminUserRole,
  MobileUserRole,
  PartnerUserRole,
  SystemRole,
  UserRole,
} from '@app/core/interfaces/user'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'

class RpcRequestGenericUserDto implements AclData<UserRole> {
  @IsString()
  @IsOptional()
  gid: string

  @IsObject()
  @IsOptional()
  info: object

  @IsArray()
  @IsEnum(
    [
      ...Object.values(SystemRole),
      ...Object.values(MobileUserRole),
      ...Object.values(AdminUserRole),
      ...Object.values(PartnerUserRole),
    ],
    { each: true },
  )
  roles: UserRole[]
}

export abstract class RpcRequestGenericDto<PayloadType> extends RpcRequestDto<PayloadType> {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => RpcRequestGenericUserDto)
  user: RpcRequestGenericUserDto
}
