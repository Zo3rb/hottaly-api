const User = require('../models/User');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const queryString = require('query-string');

exports.createConnectAccount = async (req, res) => {
    try {
        // First we Need to Find the User From The Token provided with the request
        const user = await User.findById(req.user._id);

        // Create Stripe Account for The User
        if (!user.stripe_account_id) {
            let account = await stripe.accounts.create({ type: "express" });
            user.stripe_account_id = account.id;
            await user.save();
        };

        // Create Stripe Account Link
        let accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.FRONT_END_URL_CALLBACK,
            return_url: process.env.FRONT_END_URL_CALLBACK,
            type: 'account_onboarding',
        });

        // Overwriting The Account Link With Spreading it and add User.Email
        accountLink = Object.assign(accountLink, {
            email: user.email
        });

        // Send The URL With its Query String
        res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
    } catch (error) {
        res.status(400).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.getAccountStatus = async (req, res) => {
    try {
        // First we Need to Find the User From The Token provided with the request
        const user = await User.findById(req.user._id);

        // Update The Current User Document With Stripe Data
        const account = await stripe.accounts.update(user.stripe_account_id, {
            // Adjust the Delay Days of The Stripe Data
            settings: { payouts: { schedule: { delay_days: 7 } } }
        });
        user.stripe_seller = { ...account };

        // Saving The Updates to The Database
        await user.save();

        // Send The User Back
        res.send({ user, token: req.headers.authorization.split("Bearer ")[1] });
    } catch (error) {
        res.status(400).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.getAccountBalance = async (req, res) => {
    try {
        // First we Need to Find the User From The Token provided with the request
        const user = await User.findById(req.user._id);

        // Then We Ask Stripe For The Account Balance with its Stripe id
        const accountBalance = await stripe.balance.retrieve({ stripeAccount: user.stripe_account_id });

        // Then We Send Back The Balance
        res.send(accountBalance);
    } catch (error) {
        res.status(400).json(`Something Went Wrong: ${error.message}`);
    }
};

exports.getPayoutSetting = async (req, res) => {
    try {
        // First we Need to Find the User From The Token provided with the request
        const user = await User.findById(req.user._id);

        // Get Login Link From Stripe
        const loginLink = await stripe.accounts.createLoginLink(user.stripe_account_id, {
            redirect_url: process.env.FRONT_END_UR_REDIRECT
        });

        // Send Back The Login Link to User @ the Front End
        res.send(loginLink);
    } catch (error) {
        res.status(400).json(`Something Went Wrong: ${error.message}`);
    }
};
