import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const hashPwd = await bcrypt.hashSync(password, 10);
    return hashPwd;
};

export const validatePassword = async (
    password: string,
    userPassword: string
): Promise<Boolean> => {
    let isValid = await bcrypt.compareSync(password, userPassword);
    if (!isValid) return false;
    return true;
};
