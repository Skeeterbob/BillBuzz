const {AuthHandler} = require('./authHandler.js');
const authHandler = new AuthHandler();

test('generate authentication token', async () => {
    expect(authHandler.validateToken(authHandler.createToken(123456), 123456)).toBe(true);
})