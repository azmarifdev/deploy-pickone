import { CookieOptions, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IRefreshToken } from './auth.interface';
import { AuthServices } from './auth.services';

const isProduction = process.env.NODE_ENV === 'production';

const loginUser = catchAsync(async (req: Request, res: Response) => {
   const { ...loginData } = req.body;

   const result = await AuthServices.loginUser(loginData);

   const refreshCookieOptions: CookieOptions = {
      path: '/',
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
   };

   const accessCookieOptions: CookieOptions = {
      path: '/',
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
   };

   // Set cookies
   if (result?.refreshToken) {
      res.cookie(
         'pickone_refresh_token',
         result.refreshToken,
         refreshCookieOptions
      );
   }

   if (result?.accessToken) {
      res.cookie(
         'pickone_access_token',
         result.accessToken,
         accessCookieOptions
      );
   }

   sendResponse<any>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User logged successfully..!!',
      data: result?.user,
   });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
   const { refreshToken } = req.cookies;

   const result = await AuthServices.refreshToken(refreshToken);

   // Clear the old refresh token and access token
   res.clearCookie('pickone_refresh_token');
   res.clearCookie('pickone_access_token');

   const refreshCookieOptions = {
      path: '/',
      secure: isProduction, // Use true only in production (HTTPS)
      httpOnly: true, // Keep it true for security
      sameSite: isProduction ? 'none' : ('lax' as 'none' | 'lax'), // Explicitly cast to valid type
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
   };

   const accessCookieOptions = {
      path: '/',
      secure: isProduction, // Use true only in production (HTTPS)
      httpOnly: true, // Keep it true for security
      sameSite: isProduction ? 'none' : ('lax' as 'none' | 'lax'), // Explicitly cast to valid type
      maxAge: 30 * 24 * 60 * 60 * 1000,
   };

   // Set the new refresh token in the cookie
   res.cookie(
      'pickone_refresh_token',
      result?.refreshToken,
      refreshCookieOptions
   );

   // Set the new access token in the cookie
   res.cookie('pickone_access_token', result?.accessToken, accessCookieOptions);

   sendResponse<IRefreshToken>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User logged successfully..!!',
      data: result,
   });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
   const user = req.user;
   const { ...passwordData } = req.body;

   await AuthServices.changePassword(user, passwordData);

   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully !',
   });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
   // Clear the cookies
   res.clearCookie('pickone_refresh_token');
   res.clearCookie('pickone_access_token');

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User logged out successfully..!!',
   });
});

export const AuthController = {
   loginUser,
   refreshToken,
   changePassword,
   logoutUser,
};
