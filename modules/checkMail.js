function checkMail(mail) {

    let isValid = false;
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (EMAIL_REGEX.test(mail)) {
        isValid = true;
    }

    return isValid;
}

module.exports = { checkMail };
