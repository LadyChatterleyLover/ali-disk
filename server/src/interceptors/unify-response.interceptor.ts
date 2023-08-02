import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { getReqMainInfo } from '../utils/getReqMainInfo'

@Injectable()
export class UnifyResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>()

    return next.handle().pipe(
      map((data) => {
        this.logger.info('response', {
          responseData: data,
          req: getReqMainInfo(req),
        })
        return {
          code: 200,
          data,
          msg: '成功',
        }
      }),
    )
  }
}
