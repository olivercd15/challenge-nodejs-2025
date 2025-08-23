module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    rootDir: './',

    roots: ['<rootDir>/test'],

    testMatch: [
        '**/*.spec.ts',
        '**/*.e2e-spec.ts',
        '**/*.test.ts'
    ],

    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^src/(.*)$': '<rootDir>/src/$1',
    },

    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/coverage/'
    ],

    moduleFileExtensions: ['js', 'json', 'ts'],

    // Coverage
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.dto.ts',
        '!src/**/*.entity.ts',
        '!src/**/*.module.ts',
        '!src/main.ts',
        '!src/**/__tests__/**',
    ],

    coverageDirectory: './coverage',

    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json',
        },
    },
};