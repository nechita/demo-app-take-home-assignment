module.exports = {
    '**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix', 'jest --bail --findRelatedTests --passWithNoTests'],
    '**/*.{json,css,md}': ['prettier --write'],
}
