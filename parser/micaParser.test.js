const sum = require('./packets');

test('Adds 1 to 2', () => {
    expect(sum(1,2)).toBe(3);
});