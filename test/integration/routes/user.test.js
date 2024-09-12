const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../../../model/users'); 
const bcrypt = require('bcrypt');
let server;

describe('User Routes', () => {
    beforeEach(() => {
        server = require('../../../index'); 
    });

    afterEach(async () => {
        await User.deleteMany({}); 
        await server.close(); 
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/users (Register)', () => {
        let userPayload;

        const exec = async () => {
            return await request(server)
                .post('/api/users')
                .send(userPayload);
        };

        beforeEach(() => {
            userPayload = {
                fullName: 'John Doe',
                email: 'johndoe@test.com',
                phoneNumber: '+1234567890',
                password: 'password123'
            };
        });

        it('should return 400 if the user data is invalid (email)', async () => {
            userPayload.email = 'invalid-email';
            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/valid email/);
        });

        it('should return 400 if the password is less than 5 characters', async () => {
            userPayload.password = '1234'; 

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/minimum length/);
        });

        it('should save the user if the request is valid', async () => {
            const res = await exec();

            const userInDb = await User.findOne({ email: 'johndoe@test.com' });

            expect(userInDb).not.toBeNull();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token'); 
        });

        it('should return 400 if the user already exists', async () => {
            await User.create(userPayload); 

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/already registered/);
        });
    });

    describe('POST /api/auth (Login)', () => {
        let loginPayload;

        const exec = async () => {
            return await request(server)
                .post('/api/auth')
                .send(loginPayload);
        };

        beforeEach(async () => {
            const passwordHash = await bcrypt.hash('password123', 10);
            await User.create({
                fullName: 'John Doe',
                email: 'johndoe@test.com',
                phoneNumber: '+1234567890',
                password: passwordHash
            });

            loginPayload = {
                email: 'johndoe@test.com',
                password: 'password123'
            };
        });

        it('should return 400 if email or password is invalid', async () => {
            loginPayload.password = 'invalidpassword'; 

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/Invalid email or password/);
        });

        it('should return 200 and a token if credentials are valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.text).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/); // Token regex
        });
    });
});
