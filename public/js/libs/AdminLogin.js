
const adminLogin = (event) => {
    // Prevent default behaviour
    event.preventDefault();

    // Login container id
    let loginCardContainer = $("#loginCardContainer");

    // Login card footer id
    let loginCardFooter = $("#loginCardFooter");

    // Button element id
    const adminLoginButton = $("#adminLoginButton");

    // Email element id
    const inputEmail = $("#inputEmail").val();

    // Password element id
    const inputPassword = $("#inputPassword").val();

    if (!checkForValue(inputEmail)) {
        // Throw error
        toastr.error("Please enter email.", "Error");
        return;
    }

    if (!checkForValue(inputPassword)) {
        // Throw error
        toastr.error("Please enter password.", "Error");
        return;
    }

    // Payload
    const payload = {
        user_email: inputEmail,
        user_password: inputPassword
    };

    // Disable
    adminLoginButton.addClass("disabled");
    // Change text
    adminLoginButton.text('Loggin in');

    // Make http request
    makeHTTPRequest("/admin/submitLogin", "POST", "application/json", JSON.stringify(payload),
        function (success) {
            // Get success message
            let successMessage = success.message ? success.message : 'Operation successful.';
            // Success message
            toastr.success(successMessage, "Success");
            // Remove footer
            loginCardFooter.addClass('d-none');
            // Add spinner
            loginCardContainer.html(renderSpinnner('text-dark'));
            // Get origin
            let origin = window.location.origin;
            // Fire an event after
            setTimeout(function () {
                // Redirect
                window.location.href = origin + '/admin/dashboard';
            }, 1200);
        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {
            // Enable
            adminLoginButton.removeClass("disabled");
            // Change text
            adminLoginButton.text('Login');
        });

}