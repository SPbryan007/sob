// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   Logger,
//   CallHandler,
//   Next,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// // export class LoggingInterceptor implements NestInterceptor {
// //     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
// //       console.log('Before...');

// //       const now = Date.now();
// //       return next
// //         .handle()
// //         .pipe(
// //           tap(() => console.log(`After... ${Date.now() - now}ms`)),
// //         );
// //     }
// //   }
// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const req = context.switchToHttp().getRequest();
//     const method = req.method;
//     const url = req.url;
//     const now = Date.now();

//     return next
//       .handle()
//       .pipe(
//         tap(() =>
//           Logger.log(
//             `${method} ${url} ${Date.now() - now}ms`,
//             context.getClass().name,
//           ),
//         ),
//       );
//   }
// }
