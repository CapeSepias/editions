module.exports = {
    getCurrentState: jest.fn(() => Promise.resolve()),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
}
