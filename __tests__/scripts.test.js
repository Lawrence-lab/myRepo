
describe('Username regex validation', () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    test('should validate a username with at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and at least 8 characters', () => {
        const validUsername = 'Valid1@Password';
        expect(regex.test(validUsername)).toBe(true);
    });

    test('should invalidate a username without an uppercase letter', () => {
        const invalidUsername = 'valid1@password';
        expect(regex.test(invalidUsername)).toBe(false);
    });

    test('should invalidate a username without a lowercase letter', () => {
        const invalidUsername = 'VALID1@PASSWORD';
        expect(regex.test(invalidUsername)).toBe(false);
    });

    test('should invalidate a username without a number', () => {
        const invalidUsername = 'Valid@Password';
        expect(regex.test(invalidUsername)).toBe(false);
    });

    test('should invalidate a username without a special character', () => {
        const invalidUsername = 'Valid1Password';
        expect(regex.test(invalidUsername)).toBe(false);
    });

    test('should invalidate a username with less than 8 characters', () => {
        const invalidUsername = 'V1@Pa';
        expect(regex.test(invalidUsername)).toBe(false);
    });
});