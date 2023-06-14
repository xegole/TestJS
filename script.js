function initGpLibrary(data) {
    
    console.log("init script");
    
    GlobalPayments.configure({
        accessToken: data["token"],
        apiVersion: "2021-03-22",
        env: data["environment"],
        apms: {
            currencyCode: "EUR",
            allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
            clickToPay: {
                buttonless: false,
                canadianDebit: true,
                ctpClientId: data["clientId"],
                currencyCode: "EUR",
                wrapper: false
            }
        }
    });

    // creating an instance of the payment form
    var cardForm = GlobalPayments.creditCard.form('#payment-form', {
        amount: data["amountToPay"],
        style: "gp-default",
        apms: ["click-to-pay"]
    });


    // method to notify that payment form has been initialized
    cardForm.ready(() => {
        console.log("Registration of payment form occurred");
    });

    // appending the Click To Pay token to the form as a hidden field and
    // submitting it to the server-side
    cardForm.on("token-success", (resp) => {
        // add payment token to form as a hidden input
        const token = document.createElement("input");
        token.type = "hidden";
        token.name = "callid";
        token.value = resp.paymentReference;

        // add payment method provider
        const provider = document.createElement("input");
        provider.type = "hidden";
        provider.name = "provider";
        provider.value = resp.details.apmProvider;


        // submit data to the integration's backend for processing
        const form = document.getElementById("payment-form");
        form.appendChild(token);
        form.appendChild(provider);
        form.submit();
    });

    cardForm.on("token-error", (resp) => {
        // TODO: Add your error handling
    });
}
