import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessage, GenericErrorCode, GenericErrorMessage } from '../../common/message';

const errorObject = (exception: GenericErrorCode, errorMessage?: ErrorMessage) =>
  HttpException.createBody.apply(
    null,
    errorMessage
      ? [
          Object.keys(ErrorMessage)[Object.values(ErrorMessage).indexOf(errorMessage)],
          errorMessage,
          HttpStatus[exception],
        ]
      : [exception, GenericErrorMessage[exception], HttpStatus[exception]]
  );

export class ForbiddenException extends HttpException {
  constructor(errorMessage?: ErrorMessage) {
    super(errorObject(GenericErrorCode.FORBIDDEN, errorMessage), HttpStatus.FORBIDDEN);
  }
}

export class BadRequestException extends HttpException {
  constructor(errorMessage?: ErrorMessage) {
    super(errorObject(GenericErrorCode.BAD_REQUEST, errorMessage), HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends HttpException {
  constructor(errorMessage?: ErrorMessage) {
    super(errorObject(GenericErrorCode.NOT_FOUND, errorMessage), HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(errorMessage?: ErrorMessage) {
    super(errorObject(GenericErrorCode.UNAUTHORIZED, errorMessage), HttpStatus.UNAUTHORIZED);
  }
}

export class ConflictException extends HttpException {
  constructor(errorMessage?: ErrorMessage) {
    super(errorObject(GenericErrorCode.CONFLICT, errorMessage), HttpStatus.CONFLICT);
  }
}
