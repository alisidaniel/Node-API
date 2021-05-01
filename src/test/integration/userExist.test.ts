import { userExist } from '../../utils/userExist';

describe('User Exist', () => {
    it('should test a boolean is returned and user exist', async () => {
        const userCheck = await userExist('melodyleonard7@gmail.com');
        expect(typeof userCheck === 'boolean').toBeTruthy();
    });
});
