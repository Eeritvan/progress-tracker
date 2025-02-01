import { test, expect, Locator } from '@playwright/test'

const APP_URL = 'http://localhost:5173'
const LOGIN_URL = 'http://localhost:5173/login'
const REGISTER_URL = 'http://localhost:5173/register'

test.describe('Authentication: ', () => {
  interface LoginPageInputs {
    username: Locator
    password: Locator
    submitButton: Locator
  };

  let inputs: LoginPageInputs

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL)
    
    inputs = {
      username: page.getByPlaceholder('username'),
      password: page.getByPlaceholder('password'),
      submitButton: page.getByRole('button', { name: 'Continue' })
    }
  })

  test.describe('Login field', () => {
    test('shows up', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'login'})).toBeVisible()
        await expect(page.getByRole('link', { name: 'register'})).toBeVisible()
    
        await expect(inputs.username).toBeVisible()
        await expect(inputs.password).toBeVisible()
        await expect(page.getByPlaceholder('confirm password')).not.toBeVisible()
        await expect(inputs.submitButton).toBeVisible()
    })

    test.describe('shows error with: ', () => {
      test('too short username (less than 3 chars)', async ({ page }) => {
        await inputs.username.fill('ab')
        await inputs.password.fill('validPassword')
        await inputs.submitButton.click()
        await expect(page.getByText('Needs to be at least 3 characters')).toBeVisible()
      })

      test('non-existend account', async ({ page }) => {
        await inputs.username.fill('fake-account')
        await inputs.password.fill('validPassword')
        await inputs.submitButton.click()
        await expect(page.getByText('failed to fetch user information')).toBeVisible()
      })
    })
  })

  test.describe('Register field', () => {
    interface LoginPageInputs {
      username: Locator
      password: Locator
      confirmPassword: Locator
      submitButton: Locator
    };
  
    let inputs: LoginPageInputs
  
    test.beforeEach(async ({ page }) => {
      await page.goto(REGISTER_URL)
      
      inputs = {
        username: page.getByPlaceholder('username'),
        password: page.getByPlaceholder('password', {exact: true}),
        confirmPassword: page.getByPlaceholder('confirm password'),
        submitButton: page.getByRole('button', { name: 'Continue' })
      }
    })

    test('shows up', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'login'})).toBeVisible()
      await expect(page.getByRole('link', { name: 'register'})).toBeVisible()

      
      await expect(inputs.username).toBeVisible()
      await expect(inputs.password).toBeVisible()
      await expect(inputs.confirmPassword).toBeVisible()
      await expect(inputs.submitButton).toBeVisible()
    })

    test.describe('shows error with: ', () => {
      test('too short username', async ({ page }) => {
        await inputs.username.fill('ab')
        await inputs.password.fill('validPassword')
        await inputs.confirmPassword.fill('validPassword')
        await inputs.submitButton.click()
        await expect(page.getByText('Needs to be at least 3 characters')).toBeVisible()
      })

      test('missing password', async ({ page }) => {
        await inputs.username.fill('validUsername')
        await inputs.submitButton.click()
        await expect(page.getByText('password cant be empty')).toBeVisible()
      })

      test('too short password (less than 8 chars)', async ({ page }) => {
        await inputs.username.fill('validUsername')
        await inputs.password.fill('1234567')
        await inputs.confirmPassword.fill('1234567')
        await inputs.submitButton.click()
        await expect(page.getByText('the password must be at least 8 characters long')).toBeVisible()
      })

      test('mismatched password and confirmation', async ({ page }) => {
        await inputs.username.fill('validUsername')
        await inputs.password.fill('validPassword')
        await inputs.confirmPassword.fill('wrongPassword')
        await inputs.submitButton.click()
        await expect(page.getByText('The two passwords do not match.')).toBeVisible()
      })
    })

    test.describe.serial('Account creation tests', () => {
      test('creates new account with valid information', async ({ page }) => {
        await inputs.username.fill('testAccount')
        await inputs.password.fill('testPassword')
        await inputs.confirmPassword.fill('testPassword')
        await inputs.submitButton.click()

        await expect(page).toHaveURL(APP_URL)
      })

      test('duplicate account name fails', async ({ page }) => {
        await inputs.username.fill('testAccount')
        await inputs.password.fill('testPassword')
        await inputs.confirmPassword.fill('testPassword')
        await inputs.submitButton.click()

        await expect(page).toHaveURL(REGISTER_URL)
        await expect(page.getByText('username already exists')).toBeVisible()
      })
    })
  })
})
