// Authored by Bryan Hodgins
const {AuthHandler} = require('./authHandler.js');
const authHandler = new AuthHandler();

test('generate authentication token and decrypt it', async () => {
    expect(authHandler.validateToken(authHandler.createToken(123456), 123456)).toBe(true);
})