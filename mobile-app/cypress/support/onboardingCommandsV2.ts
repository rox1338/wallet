import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * @description Start onboarding mnemonic wallet process
       * @param {string[]} recoveryWords - pass an empty array to be filled later
       * @example cy.startCreateMnemonicWalletV2(recoveryWords)
       */
      startCreateMnemonicWalletV2: (recoveryWords: string[]) => Chainable<Element>

      /**
       * @description Select mnemonic words from Verify Step
       * @param {string[]} recoveryWords - list of recoveryWords
       * @example cy.selectMnemonicWordsV2(recoveryWords)
       */
      selectMnemonicWordsV2: (recoveryWords: string[]) => Chainable<Element>

      /**
       * @description Setup pin code from Onboarding
       */
      setupPinCodeV2: () => Chainable<Element>

      /**
       * @description Verify created mnemonic words in Settings Page
       * @param {string[]} settingsRecoveryWords - need to pass reference to be used on other steps
       * @param {string[]} recoveryWords - recovery words from create page
       * @example cy.verifyMnemonicOnSettingsPageV2(settingsRecoveryWords, recoveryWords)
       */
      verifyMnemonicOnSettingsPageV2: (settingsRecoveryWords: string[], recoveryWords: string[]) => Chainable<Element>

      /**
       * @description Restore wallet using mnemonic words
       * @param {string[]} recoveryWords - recovery words to restore
       * @example cy.restoreMnemonicWordsV2(recoveryWords)
       */
      restoreMnemonicWordsV2: (recoveryWords: string[]) => Chainable<Element>
    }
  }
}

Cypress.Commands.add('startCreateMnemonicWalletV2', (recoveryWords: string[]) => {
  cy.getByTestID('get_started_button').click()
  cy.getByTestID('guidelines_check').click()
  cy.getByTestID('create_recovery_words_button').click()
  cy.url().should('include', 'wallet/mnemonic/create')
  cy.wrap(Array.from(Array(24), (v, i) => i)).each((el, i: number) => {
    cy.getByTestID(`word_${i + 1}`).should('exist')
    cy.getByTestID(`word_${i + 1}_number`).should('exist').contains(`${i + 1}.`)
    cy.getByTestID(`word_${i + 1}`).then(($txt: any) => {
      recoveryWords.push($txt[0].textContent)
    })
  }).then(() => {
    cy.getByTestID('verify_button').should('not.have.attr', 'disabled')
    cy.getByTestID('verify_button').click()
  })
})

Cypress.Commands.add('selectMnemonicWordsV2', (recoveryWords: string[]) => {
  Array.from(Array(6), (v, i) => i + 1).forEach((key, index) => {
    cy.getByTestID(`line_${index}`).then(($txt: any) => {
      const wordIndex = (parseInt($txt[0].textContent)) - 1
      cy.getByTestID(`line_${index}_${recoveryWords[wordIndex]}`).first().click()
    })
  })
  cy.getByTestID('verify_words_button').should('not.have.attr', 'disabled')
  cy.getByTestID('verify_words_button').click()
})

Cypress.Commands.add('setupPinCodeV2', () => {
  cy.getByTestID('pin_input').type('000000')
  cy.getByTestID('pin_confirm_input').type('777777').wait(1000)
  cy.getByTestID('wrong_passcode_text').should('exist')
  cy.getByTestID('pin_confirm_input').type('000000')
})

Cypress.Commands.add('verifyMnemonicOnSettingsPageV2', function (settingsRecoveryWords: string[], recoveryWords: string[]) {
  cy.getByTestID('portfolio_list').should('exist')
  cy.getByTestID('bottom_tab_portfolio').click()
  cy.getByTestID('header_settings').click()
  cy.getByTestID('view_recovery_words').click().wait(3000)
  cy.getByTestID('pin_authorize').type('000000')
  cy.wrap(Array.from(Array(24), (v, i) => i)).each((el, i: number) => {
    cy.getByTestID(`word_${i + 1}`).should('exist')
    cy.getByTestID(`word_${i + 1}_number`).should('exist').contains(`${i + 1}.`)
    cy.getByTestID(`word_${i + 1}`).then(($txt: any) => {
      settingsRecoveryWords.push($txt[0].textContent)
    })
  }).then(() => {
    expect(recoveryWords).to.deep.eq(settingsRecoveryWords)
  })
})

Cypress.Commands.add('restoreMnemonicWordsV2', (recoveryWords: string[]) => {
  cy.getByTestID('restore_wallet_button').click()
  recoveryWords.forEach((word, index: number) => {
    cy.getByTestID(`recover_word_${index + 1}`).clear().type(word).blur()
    cy.getByTestID(`recover_word_${index + 1}`).should('have.css', 'color', 'rgb(64, 64, 64)')
  })
  cy.getByTestID('recover_wallet_button').should('not.have.attr', 'disabled')
  cy.getByTestID('recover_wallet_button').click()
  cy.getByTestID('pin_input').type('000000')
  cy.getByTestID('pin_confirm_input').type('000000')
  cy.getByTestID('wallet_restore_success').should('exist')
  cy.getByTestID('continue_button').should('exist').click()
  cy.getByTestID('portfolio_list').should('exist')
})
