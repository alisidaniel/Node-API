import Admin from '../server/models/adminModel';
import User from '../server/models/userModel';

export const userExist = async (email: string): Promise<Boolean> => {
    const user = await User.findOne({ email });
    if (!user) return false;
    return true;
};

export const adminExist = async (email: string): Promise<Boolean> => {
    console.log('got here', email);
    const admin = await Admin.findOne({ email });
    if (!admin) return false;
    return true;
};
