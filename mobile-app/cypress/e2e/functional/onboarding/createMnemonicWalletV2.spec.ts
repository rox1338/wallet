context('Onboarding V2 - Create Mnemonic Wallet', () => {
  const recoveryWords: string[] = []
  const settingsRecoveryWords: string[] = []

  before(function () {
    cy.setFeatureFlags(['onboarding_v2'])
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('should start creation of mnemonic wallet', function () {
    cy.visit('/')
    cy.exitWallet()
    cy.startCreateMnemonicWalletV2(recoveryWords)
  })

  it('should have disabled button for verify words', function () {
    cy.getByTestID('verify_words_button').should('have.attr', 'aria-disabled')
  })

  it('should select incorrect words', function () {
    Array.from(Array(6), (v, i) => i + 1).forEach((key, index) => {
      cy.getByTestID(`line_${index}`).then(($txt: any) => {
        const wordIndex = (parseInt($txt[0].textContent)) - 1
        cy.getByTestID(`recovery_word_row_${wordIndex}`).children().first().click()
      })
    })
  })

  it('should return to previous page on error', function () {
    cy.getByTestID('verify_words_button').should('not.have.attr', 'disabled')
    cy.getByTestID('verify_words_button').click()
    cy.on('window:confirm', () => {})
    // validate if they're the same words on return
    Array.from(Array(24), (v, i) => i + 1).forEach((i) => {
      cy.getByTestID(`word_${i}`).should('exist')
      cy.getByTestID(`word_${i}_number`).should('exist').contains(`${i}.`)
    })
    cy.getByTestID('verify_button').click()
  })

  it('should be able to select correct words', function () {
    cy.selectMnemonicWordsV2(recoveryWords)
  })

  it('should be able to navigate to passcode FAQ screen', function () {
    cy.getByTestID('passcode_faq_link').click()
    cy.getByTestID('passcode_faq').should('exist')
    cy.go('back')
  })

  it('should be able to verify and set pincode', function () {
    cy.setupPinCodeV2()
  })

  it('should be able to navigate to wallet creation success screen', function () {
    cy.getByTestID('wallet_create_success').should('exist')
    cy.getByTestID('continue_button').should('exist').click()
  })

  context('Settings - Mnemonic Verification', () => {
    it('should be able to verify mnemonic from settings page', function () {
      cy.verifyMnemonicOnSettingsPageV2(settingsRecoveryWords, recoveryWords)
    })
  })

  context('Restore - Mnemonic Verification', () => {
    it('should be able to restore mnemonic words', function () {
      cy.exitWallet()
      cy.restoreMnemonicWordsV2(settingsRecoveryWords)
    })

    it('should be able to verify mnemonic from settings page', function () {
      cy.verifyMnemonicOnSettingsPageV2([], recoveryWords)
    })
  })
})

context('Onboarding V2 - Create Mnemonic Wallet with refresh recovery word', () => {
  const recoveryWords: string[] = []
  const oldRecoveryWords: string[] = []
  const settingsRecoveryWords: string[] = []

  before(() => {
    cy.setFeatureFlags(['onboarding_v2'])
    cy.createEmptyWallet()
    cy.visit('/')
    cy.exitWallet()
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('should refresh recovery word', function () {
    cy.getByTestID('get_started_button').click()
    cy.getByTestID('guidelines_check').click()
    cy.getByTestID('create_recovery_words_button').click()
    cy.url().should('include', 'wallet/mnemonic/create')
    cy.wrap(Array.from(Array(24), (v, i) => i)).each((el, i: number) => {
      cy.getByTestID(`word_${i + 1}`).should('exist')
      cy.getByTestID(`word_${i + 1}_number`).should('exist').contains(`${i + 1}.`)
      cy.getByTestID(`word_${i + 1}`).then(($txt: any) => {
        oldRecoveryWords.push($txt[0].textContent)
      })
    }).then(() => {
      cy.getByTestID('reset_recovery_word_button').click().wait(3000)
      cy.wrap(Array.from(Array(24), (v, i) => i)).each((el, i: number) => {
        cy.getByTestID(`word_${i + 1}`).should('exist')
        cy.getByTestID(`word_${i + 1}_number`).should('exist').contains(`${i + 1}.`)
        cy.getByTestID(`word_${i + 1}`).then(($txt: any) => {
          recoveryWords.push($txt[0].textContent)
        })
      }).then(() => {
        expect(oldRecoveryWords).not.deep.equal(recoveryWords)
        cy.getByTestID('verify_button').should('not.have.attr', 'disabled')
        cy.getByTestID('verify_button').click()
        cy.selectMnemonicWordsV2(recoveryWords)
        cy.setupPinCodeV2()
        cy.getByTestID('wallet_create_success').should('exist')
        cy.getByTestID('continue_button').should('exist').click()
      })
    })
  })

  it('should be able to verify refreshed mnemonic from settings page', function () {
    cy.verifyMnemonicOnSettingsPageV2(settingsRecoveryWords, recoveryWords)
  })

  context('Restore - Refreshed Mnemonic Verification', () => {
    it('should be able to restore refreshed mnemonic words', function () {
      cy.exitWallet()
      cy.restoreMnemonicWordsV2(settingsRecoveryWords)
    })

    it('should be able to verify refreshed mnemonic from settings page', function () {
      cy.verifyMnemonicOnSettingsPageV2([], recoveryWords)
    })
  })
})
