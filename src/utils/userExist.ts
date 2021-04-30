import User from '@models/userModel';

export const userExist = async (email: string): Promise<Boolean> => {
    let user = await User.findOne({ email });
    if (!user) return false;
    return true;
};
