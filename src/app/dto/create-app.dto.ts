import { IsNotEmpty, IsUUID, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AppPublisherDto {
  @IsUUID()
  id: string;
}

export class CreateAppDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsUrl()
  readonly url: string;

  @ValidateNested()
  @Type(() => AppPublisherDto)
  readonly publisher: AppPublisherDto;
}
