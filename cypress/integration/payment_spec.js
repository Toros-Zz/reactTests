const { v4: uuidv4 } = require('uuid');

describe('payment', () => {
    it('user can make payment', () => {
        //login
        cy.visit('http://localhost:3000');
        cy.findByRole('textbox', { name: /username/i }).type('johndoe');
        cy.findByLabelText(/password/i).type('s3cret');
        cy.findByRole('checkbox', { name: /remember me/i }).check();
        cy.findByRole('button', { name: /sign in/i }).click();

        // check account balance
        let oldBalance;
        cy.get('[data-test="sidenav-user-balance"]').then($balance => oldBalance = $balance.text());


        // click on pay button
        cy.findByRole('button', { name: /new/i }).click();

        // search for user
        cy.findByRole('textbox').type('devon becker');
        const note = uuidv4();    
        cy.findByText(/devon becker/i).click();
        
        // add amount and note and click pay
        const payAmount= "5.00"
        cy.findByPlaceholderText(/amount/i).type(payAmount);
        cy.findByPlaceholderText(/add a note/i).type(note);
        cy.findByRole('button', { name: /pay/i}).click();
        
        // return to transactions
        cy.findByRole('button', { name: /return to transactions/i}).click();
        
        // go to personal payments
        cy.findByRole('tab', { name: /mine/i}).click();
        
        // click on paymant
        cy.findByText(note).click({ force: true });
        
        // verify if payment was made 
        cy.findByText(`-$${payAmount}`).should('be.visible');
        cy.findByText(note).should('be.visible');
        
        // verify if payment amount was deducted
        cy.get('[data-test="sidenav-user-balance"]').then($balance => {
            const convertedOldBalance = parseFloat(oldBalance.replace(/\$|,/g, ""));
            const convertedNewBalance = parseFloat($balance.text().replace(/\$|,/g, ""));

            expect(convertedOldBalance - convertedNewBalance).to.equal(parseFloat(payAmount));
        });
    })
})