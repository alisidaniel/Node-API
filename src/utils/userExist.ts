import User from '../server/models/userModel';

export const userExist = async (email: string): Promise<Boolean> => {
    const user = await User.findOne({ email });
    if (!user) return false;
    return true;
};
