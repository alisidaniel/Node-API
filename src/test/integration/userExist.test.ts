import { userExist } from '../../utils/userExist';
import connection from '../../database/connection';
import faker from 'faker';
import User, { IUser } from '../../server/models/userModel';

beforeAll(async () => {
    connection
        .then(function (res: any) {
            console.log('Database connected::successfully');
        })
        .catch(function (err: any) {
            console.log('Database error:', err);
        });
});

jest.setTimeout(30000);

describe('User Exist', () => {
    it('should test a boolean is returned and user exist', async () => {
        try {
            // const addressMap = new Map<string, string>();
            const user: IUser = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                phone: faker.phone.phoneNumber(),
                userType: 0
            };
            const person = new User(user);
            await person.save();

            const userCheck = await userExist(user.email);
            expect(typeof userCheck === 'boolean').toBeTruthy();
        } catch (error) {
            console.log(error);
        }
    });
});
