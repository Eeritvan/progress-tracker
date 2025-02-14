import { test, expect, Locator } from '@playwright/test'

const APP_URL = 'http://localhost:5173'
const LOGIN_URL = 'http://localhost:5173/login'

test.describe('Main Application:', () => {
  interface MainPageInputs {
    settingsButton: Locator
    addNewButton: Locator
    cardTitle: Locator
    cardDesc: Locator
    submitButton: Locator
    colors: Locator
    icons: Locator
  }

  let inputs: MainPageInputs
  
  test.beforeEach(async ({ page }) => {
    inputs = {
      settingsButton: page.locator('button svg.lucide-settings'),
      addNewButton: page.locator('button svg.lucide-plus'),
      cardTitle: page.getByPlaceholder('title'),
      cardDesc: page.getByPlaceholder('description'),
      submitButton: page.getByRole('button', { name: 'Continue' }),
      colors: page.getByTestId('color'),
      icons: page.getByTestId('icon')
    }

    await page.goto(LOGIN_URL)
    
    await page.getByPlaceholder('username').fill('testAccount')
    await page.getByPlaceholder('password').fill('testPassword')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveURL(APP_URL)

    page.on('dialog', dialog => dialog.accept())
    await inputs.settingsButton.click()
    await page.getByRole('button', { name: 'Reset everything' }).click()

    await inputs.settingsButton.click()
  })
  
  test.describe('Creating new card: ', () => {
    test('shows up', async ({ page }) => {
      await expect(page).toHaveURL(APP_URL)
      await expect(inputs.settingsButton).toBeVisible()
      await expect(inputs.addNewButton).toBeVisible()

      await inputs.addNewButton.click()

      await expect(inputs.cardTitle).toBeVisible()
      await expect(inputs.cardDesc).toBeVisible()
      await expect(inputs.submitButton).toBeVisible()

      expect(await inputs.colors.count()).toBe(15);
      const allColors = await inputs.colors.all()
      for (const color of allColors) {
        await expect(color).toBeVisible()
      }

      expect(await inputs.icons.count()).toBe(11);
      const allIcons = await inputs.icons.all()
      for (const icon of allIcons) {
        await expect(icon).toBeVisible()
      }
    })

    test('adding new works', async ({ page }) => {
      await inputs.addNewButton.click()

      await inputs.cardTitle.fill('test Title')
      await inputs.cardDesc.fill('test Desc')
      await inputs.colors.nth(2).click()
      await inputs.icons.nth(2).click({ force: true })
      await inputs.submitButton.click()

      await expect(page.getByText('test Title')).toBeVisible()
    })

    test('Menu can be toggled off escape key', async ({ page }) => {
      await inputs.addNewButton.click()

      await expect(inputs.cardTitle).toBeVisible()

      await page.keyboard.press('Escape')

      await expect(inputs.cardTitle).not.toBeVisible()
    }) 

    test.describe('shows error with: ', () => {
      test('too short title ', async ({ page }) => {
        await inputs.addNewButton.click()

        await inputs.cardTitle.fill('aa')
        await inputs.colors.nth(2).click()
        await inputs.icons.nth(2).click({ force: true })
        await inputs.submitButton.click()

        await expect(page.getByText('Needs to be at least 3 characters')).toBeVisible()
        await expect(page.getByText('aa')).not.toBeVisible()
      })

      test('duplicate title ', async ({ page  }) => {
        await inputs.addNewButton.click()
      
        await inputs.cardTitle.fill('Test task')
        await inputs.colors.nth(2).click()
        await inputs.icons.nth(2).click({ force: true })
        await inputs.submitButton.click()

        await expect(page.getByText('Test task')).toBeVisible()

        await inputs.cardTitle.fill('Test task')
        await inputs.colors.nth(2).click()
        await inputs.icons.nth(2).click({ force: true })
        await inputs.submitButton.click()

        await expect(page.getByText('A card with same name already exists')).toBeVisible()
      })

      test('missing color', async ({ page }) => {
        await inputs.addNewButton.click()

        await inputs.cardTitle.fill('test Title')
        await inputs.icons.nth(2).click({ force: true })
        await inputs.submitButton.click()

        await expect(page.getByText('Please select your color.')).toBeVisible()
        await expect(page.getByText('test Title')).not.toBeVisible()
      })

      test('missing icon', async ({ page }) => {
        await inputs.addNewButton.click()

        await inputs.cardTitle.fill('test Title')
        await inputs.colors.nth(2).click()
        await inputs.submitButton.click()

        await expect(page.getByText('Please select your icon.')).toBeVisible()
        await expect(page.getByText('test Title')).not.toBeVisible()
      })
    })
  })

  test.describe('Cards can be', () => {
    test('marked done and undone', async ({ page }) => {
      await inputs.addNewButton.click()

      await inputs.cardTitle.fill('test Title')
      await inputs.colors.nth(2).click()
      await inputs.icons.nth(2).click({ force: true })
      await inputs.submitButton.click()

      await expect(page.getByText('test Title')).toBeVisible()
      const doneButton = page.locator('button svg.lucide-check')

      await expect(doneButton).toBeVisible()
      await expect(doneButton.locator('..')).toHaveClass(/opacity-40/)

      await doneButton.click()
      await expect(doneButton.locator('..')).not.toHaveClass(/opacity-40/)

      await doneButton.click()
      await expect(doneButton.locator('..')).toHaveClass(/opacity-40/)
    })

    test('deleted', async ({ page }) => {
      await inputs.addNewButton.click()

      await inputs.cardTitle.fill('test Title')
      await inputs.colors.nth(2).click()
      await inputs.icons.nth(2).click({ force: true })
      await inputs.submitButton.click()

      await expect(page.getByText('test Title')).toBeVisible()

      await page.getByText('test Title').click({ button: 'right'})

      await expect(page.getByText('Delete')).toBeVisible()
      await page.getByRole('menuitem', { name: 'Delete' }).click()

      await expect(page.getByText('test Title')).not.toBeVisible()
    })
  })

  test.describe('settings: ', () => {
    test('Menu can be toggled off escape key', async ({ page }) => {
      await inputs.settingsButton.click()

      await expect(page.getByText('Logout')).toBeVisible()

      await page.keyboard.press('Escape')

      await expect(page.getByText('Logout')).not.toBeVisible()
    })

    test('Log out works', async ({ page }) => {
      await inputs.settingsButton.click()

      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
      await page.getByRole('button', { name: 'Logout' }).click()

      await expect(page).toHaveURL(LOGIN_URL)
    })
  })
})