export default {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb', 'plugin:react/recommended', "eslint:recommended", 'airbnb/hooks',],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs,jsx}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
    },
};
