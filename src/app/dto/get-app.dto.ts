import { IsUUID } from 'class-validator';

export class GetOneAppParams {
  @IsUUID('4')
  id: string;
}
