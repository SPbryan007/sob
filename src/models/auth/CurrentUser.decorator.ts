import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let user: any;
    const request = ctx.switchToHttp().getRequest();

    if (request.user.username) {
      user = {
        id: request.user.idUser,
        username: request.user.username,
        roles: request.user.role,
      };
    }
    if (request.user.email) {
      user = {
        id: request.user.idUser,
        email: request.user.email,
      };
    }
    return user;
  },
);
// import { createParamDecorator } from '@nestjs/common';
// // import { User } from '../user-staff/user.entity';
// import { CurrentUserDto } from './dto/CurrentUser.dto';
// import { plainToClass } from 'class-transformer';

// export const CurrentUser = createParamDecorator(
//   (data, req): CurrentUserDto => {
//     // const roles = req.user.roles.map(r => r.name);
//     // const user = {
//     //   id: req.user.idUser,
//     //   email: req.user.email,
//     //   roles: roles,
//     // }
//     console.log('dataaaaaa', data);

//     return plainToClass(CurrentUserDto, req.user);
//   },
// );
