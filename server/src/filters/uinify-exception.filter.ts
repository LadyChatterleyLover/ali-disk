import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { getReqMainInfo } from '../utils/getReqMainInfo'

@Catch()
export default class UnifyExceptionFilter implements ExceptionFilter {
  // 注入日志服务相关依赖
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp() // 获取当前执行上下文
    const res = ctx.getResponse<Response>() // 获取响应对象
    const req = ctx.getRequest<Request>() // 获取请求对象
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const msg =
      exception.message || (status >= 500 ? 'Service Error' : 'Client Error')

    // 记录日志（错误消息，错误码，请求信息等）
    this.logger.error(msg, {
      status,
      req: getReqMainInfo(req),
      stack: exception.stack,
    })
    let json: any = {}
    if (status === 401) {
      json = {
        code: 401,
        msg: '登录过期',
      }
    } else {
      json = {
        code: status,
        msg,
        url: req.url,
        method: req.method,
        query: req.query,
        body: req.body,
        time: new Date().toISOString(),
      }
    }
    res.status(status >= 500 ? status : 200).json(json)
  }
}
