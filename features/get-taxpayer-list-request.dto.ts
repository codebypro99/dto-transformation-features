import { RpcRequestFieldDecorator } from '@app/core/decorators/rpc-request-field.decorator'
import { RpcRequestGenericDto } from '@app/core/dto/requests/rpc-request-generic.dto'
import { SortDirection } from '@app/core/interfaces/core'
import { RpcRequestFieldCast } from '@app/core/interfaces/rpc'
import {
  GetTaxpayerListPayload,
  TaxpayerListParams,
  TaxpayerSortColumn,
} from '@app/types/processing/interfaces/taxpayer'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator'

export class TaxpayerListParamsDto implements TaxpayerListParams {
  @RpcRequestFieldDecorator({ cast: RpcRequestFieldCast.Number, defaultValue: 1 })
  @IsNumber()
  @Min(1)
  page: number

  @RpcRequestFieldDecorator({ cast: RpcRequestFieldCast.Number, defaultValue: 10 })
  @IsNumber()
  @Min(0)
  @Max(100)
  pageSize: number

  @RpcRequestFieldDecorator()
  @IsOptional()
  @IsString()
  searchTerm?: string

  @RpcRequestFieldDecorator()
  @IsOptional()
  @IsEnum(TaxpayerSortColumn)
  sortColumn?: TaxpayerSortColumn

  @RpcRequestFieldDecorator()
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection
}

export class GetTaxpayerListPayloadDto implements GetTaxpayerListPayload {
  @ValidateNested()
  @Type(() => TaxpayerListParamsDto)
  params: TaxpayerListParamsDto
}

export class GetTaxpayerListRequestDto extends RpcRequestGenericDto<GetTaxpayerListPayloadDto> {
  @Type(() => GetTaxpayerListPayloadDto)
  payload: GetTaxpayerListPayloadDto
}
