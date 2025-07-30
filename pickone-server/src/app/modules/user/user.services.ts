import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ImageUploadService } from '../../../shared/fileUpload';
import { IUser } from './user.interface';
import { User } from './user.model';
const createUser = async (payload: IUser): Promise<Partial<IUser> | null> => {
   payload.role = 'admin';
   const user = await User.create(payload);
   if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
   }
   return null;
};
const getAllUsers = async (): Promise<IUser[] | null> => {
   return await User.find().select('-password');
};

const userProfile = async (email: string): Promise<IUser | null> => {
   return await User.findOne({ email }).select('-password');
};

const updateUser = async (
   email: string,
   payload: IUser,
   image: any
): Promise<IUser | null> => {
   console.log(email, payload, image);
   const isUserExist = await User.findOne({ email });

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
   }
   const { ...userData } = payload;

   if (image) {
      const uploadImage = await ImageUploadService.uploadSingleFile(
         image,
         'user'
      );
      userData.profile_image = uploadImage;
      if (isUserExist.profile_image) {
         await ImageUploadService.deleteSingleFile(isUserExist.profile_image);
      }
   }
   const formattedUserData = {
      name: userData.name || isUserExist.name,
      email: userData.email || isUserExist.email,
      profile_image: userData.profile_image || isUserExist.profile_image,
   };
   const updatedUser = await User.findOneAndUpdate(
      { email },
      formattedUserData,
      {
         new: true,
      }
   );
   return updatedUser;
};

export const UserServices = {
   createUser,
   getAllUsers,
   userProfile,
   updateUser,
};
