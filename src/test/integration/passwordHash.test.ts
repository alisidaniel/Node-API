import bcrypt from 'bcrypt';
import { hashPassword, validatePassword } from '../../utils/hashPassword';

describe('Password validation and hash password function', () => {
    it('It should test and return boolean for valid response', async () => {
        const hashkey = await bcrypt.hashSync('password', 10);
        const response = await validatePassword('password', hashkey);
        expect(typeof response === 'boolean').toBeTruthy();
    });

    it('It should test for generated password', async () => {
        const response = await hashPassword('password');
        expect(response).toBeDefined();
    });
});
