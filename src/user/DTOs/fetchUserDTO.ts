import { IsNotEmpty, IsUUID } from 'class-validator';
import VALIDATION_MESSAGES from '../../messages/validationMessages';

export default class FetchUserDTO {
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.userDTO.id.isNotEmpty,
  })
  @IsUUID(4, {
    message: VALIDATION_MESSAGES.userDTO.id.isUUID,
  })
  id: string;
}
