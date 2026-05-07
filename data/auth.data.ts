export const USERNAMES = {
    valid: 'tomsmith',
    invalid: 'wrong_user',
    empty: '',
    spaces: '   ',
};

export const PASSWORDS = {
    valid: 'SuperSecretPassword!',
    invalid: 'wrong_password',
    empty: '',
};

export const AUTH_MESSAGES = {
    invalidUsername: 'Your username is invalid!',
    invalidPassword: 'Your password is invalid!',
    success: 'You logged into a secure area!',
    logout: 'You logged out of the secure area!',
};

export const AUTH_CREDENTIALS = {
    valid:          { username: USERNAMES.valid,   password: PASSWORDS.valid   },
    invalidUsername:{ username: USERNAMES.invalid, password: PASSWORDS.valid   },
    invalidPassword:{ username: USERNAMES.valid,   password: PASSWORDS.invalid },
    emptyUsername:  { username: USERNAMES.empty,   password: PASSWORDS.valid   },
    emptyPassword:  { username: USERNAMES.valid,   password: PASSWORDS.empty   },
    bothEmpty:      { username: USERNAMES.empty,   password: PASSWORDS.empty   },
    spacesUsername: { username: USERNAMES.spaces,  password: PASSWORDS.valid   },
};

export const invalidLoginScenarios = [
    {
        label:    'invalid username',
        username: AUTH_CREDENTIALS.invalidUsername.username,
        password: AUTH_CREDENTIALS.invalidUsername.password,
        error:    AUTH_MESSAGES.invalidUsername,
    },
    {
        label:    'invalid password',
        username: AUTH_CREDENTIALS.invalidPassword.username,
        password: AUTH_CREDENTIALS.invalidPassword.password,
        error:    AUTH_MESSAGES.invalidPassword,
    },
    {
        label:    'empty username (boundary)',
        username: AUTH_CREDENTIALS.emptyUsername.username,
        password: AUTH_CREDENTIALS.emptyUsername.password,
        error:    AUTH_MESSAGES.invalidUsername,
    },
    {
        label:    'empty password (boundary)',
        username: AUTH_CREDENTIALS.emptyPassword.username,
        password: AUTH_CREDENTIALS.emptyPassword.password,
        error:    AUTH_MESSAGES.invalidPassword,
    },
];

export const formValidationScenarios = [
    {
        label:    'invalid username and valid password',
        username: AUTH_CREDENTIALS.invalidUsername.username,
        password: AUTH_CREDENTIALS.invalidUsername.password,
        error:    AUTH_MESSAGES.invalidUsername,
    },
    {
        label:    'valid username and invalid password',
        username: AUTH_CREDENTIALS.invalidPassword.username,
        password: AUTH_CREDENTIALS.invalidPassword.password,
        error:    AUTH_MESSAGES.invalidPassword,
    },
    {
        label:    'both fields empty (boundary)',
        username: AUTH_CREDENTIALS.bothEmpty.username,
        password: AUTH_CREDENTIALS.bothEmpty.password,
        error:    AUTH_MESSAGES.invalidUsername,
    },
    {
        label:    'username with spaces only (boundary)',
        username: AUTH_CREDENTIALS.spacesUsername.username,
        password: AUTH_CREDENTIALS.spacesUsername.password,
        error:    AUTH_MESSAGES.invalidUsername,
    },
];
