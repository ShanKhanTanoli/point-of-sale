const paymentFormHtml = (activeOrder, totalAmount, orderDetails) => {
    return `<form class="needs-validation mb-2" novalidate="" onsubmit="closeOrderModal(event)">

                                        <input type="hidden" id="calculatedTotalAmount" value=${totalAmount} />
                                        <input type="hidden" id="orderHeaderId" value=${activeOrder.order_header.id} />
                                        <input type="hidden" id="orderHeaderStatus" value=${activeOrder.order_header.order_status} />

                                        <div class="row g-3">
                                            <div id="loadOrderServices" class="mb-3">
                                            <!-- Order details will be rendered here -->
                                            ${orderDetails}
                                            </div>
                                        </div>

                                        <div class="row g-3">

                                            <div class="col-md-12 col-lg-12 col-sm-12">
                                                <label for="collectingAmountInput" class="form-label">Collecting
                                                    Amount</label>

                                                <div class="input-group has-validation">
                                                        <span class="input-group-text">AED</span>
                                                        <input type="number" class="form-control" id="collectingAmountInput"
                                                    placeholder="Collecting Amount" value="${totalAmount}" required="">
                                                    <div class="invalid-feedback">
                                                        Amount collection is required.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-12 col-lg-12 col-sm-12">
                                                <label for="balanceAmountInput" class="form-label">Balance
                                                    Amount</label>

                                                <div class="input-group has-validation">
                                                        <span class="input-group-text">AED</span>
                                                        <input type="text" class="form-control" id="balanceAmountInput"
                                                    placeholder="Balance Amount" value="0" required="" disabled>
                                                    <div class="invalid-feedback">
                                                        Balance Amount is required.
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-12 col-lg-12 col-sm-12">
                                                <label for="employee" class="form-label">Employee</label>
                                                <select class="form-select" id="selectEmployee" required="">
                                                    <option value="">Choose...</option>
                                                </select>
                                                <div class="invalid-feedback" id="employeeErrorFeedback">
                                                    Please select an employee.
                                                </div>
                                            </div>

                                            <div class="col-12">
                                                <label for="remarks" class="form-label">Remarks <span
                                                        class="text-muted">(Optional)</span></label>
                                                <textarea class="form-control" name="remarks" id="remarks"></textarea>
                                            </div>

                                        </div>

                                        <h4 class="my-3">Payment</h4>

                                        <div class="my-3">
                                            <label for="paymentType" class="form-label">Payment</label>
                                                <select class="form-select" id="paymentType" required="">
                                                    <option value="cash">Cash Payment</option>
                                                    <option value="card">Card Payment</option>
                                                </select>
                                                <div class="invalid-feedback" id="paymentTypeErrorFeedback">
                                                    Please select payment type.
                                                </div>
                                        </div>

                                        <button class="w-100 btn btn-primary btn-lg" type="submit">
                                            Collect Payment
                                        </button>

                                    </form>`;
}


const orderDetailsHTML = (orders, totalAmount) => {

    let tableTr = ``;


    tableTr += orders.order_details.map((order, index) => `<tr class="">
                                            <td scope="row">${index + 1}</td>
                                            <td>${order.service_name}</td>
                                            <td>AED ${order.service_price}</td>
                                        </tr>`).join('');

    return `<div class="col-sm-12 col-md-12 col-lg-12">
                                                    <div class="card">
                                                        <div class="card-header">
                                                            <div class="card-title m-0">
                                                                Order #${orders.order_header.id} Details 
                                                            </div>
                                                        </div>
                                                        <div class="card-body">
                                                            <div class="table-responsive">
                                                                <table class="table mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col">#</th>
                                                                            <th scope="col">Service</th>
                                                                            <th scope="col">Price</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        ${tableTr}
                                                                        <tr style="border-color: transparent;">
                                                                            <td scope="row"></td>
                                                                            <td><strong>Total</strong></td>
                                                                            <td><strong id="totalAmountId" total-payment-amount=${totalAmount}>AED ${totalAmount}</strong></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`;
}
/**
 * Load active order
 */
const getActiveOrder = () => {

    // Order counter element id
    let countOrderItems = $("#countOrderItems");

    // Payment form id
    let loadPaymentForm = $("#loadPaymentForm");

    // Make http request
    makeHTTPRequest(
        "/activeOrder", "GET", "application/json", JSON.stringify({}),
        function (success) {

            let orderCount = success.activeOrder?.order_details?.length || 0;

            // Add to counter
            countOrderItems.html(orderCount);


            if (orderCount > 0) {

                // Calculate total price
                const totalAmount = success.activeOrder.order_details.reduce((sum, od) => {
                    return sum + (parseFloat(od.service_price) || 0);
                }, 0);


                let orderDetailsHtml = orderDetailsHTML(success.activeOrder, totalAmount);

                loadPaymentForm.html(paymentFormHtml(success.activeOrder, totalAmount, orderDetailsHtml));

                let collectingAmountInput = $("#collectingAmountInput");
                let balanceAmountInput = $("#balanceAmountInput");

                // Calculate balance amount
                collectingAmountInput.on("change",function(){
                    let calculateBalance = collectingAmountInput.val()-totalAmount;
                    balanceAmountInput.val( calculateBalance > 0 ? calculateBalance : 0 );
                });

                // Fetch active employees
                fetchActiveEmployees();

            } else {
                loadPaymentForm.html(``);
            }

        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {
            // console.log(always);
        });
}

getActiveOrder();

/**
 * Toggle add/remove
 * @param {*} service_id 
 * @param {*} order_header_id 
 * Returns
 */
const toggleAddRemoveFromOrder = (service_id, order_header_id) => {

    // Order id
    let order_id = null;

    // Get class
    let toggleAddRemoveFromOrder = $(`.toggleAddRemoveFromOrder${service_id}Button `);

    // Get attr value
    let orderIdAttr = toggleAddRemoveFromOrder.attr('data-order-id');

    // Check
    if (checkForValue(orderIdAttr)) {
        // Assign value
        order_id = orderIdAttr;
    }

    // Check
    if (checkForValue(order_id)) {
        // Remove
        removeFromOrder(toggleAddRemoveFromOrder, service_id, order_id);
    } else {
        // Add
        addToOrder(toggleAddRemoveFromOrder, service_id);
    }

    getActiveOrder();
}


/**
 * Add
 * @param {*} toggleAddRemoveFromOrder
 * @param {*} service_id
 * Returns Void
 */
const addToOrder = (toggleAddRemoveFromOrder, service_id) => {

    // Disable
    toggleAddRemoveFromOrder.addClass('disabled');
    // Change the text
    toggleAddRemoveFromOrder.text('adding');

    // Make http request
    makeHTTPRequest(
        "/addToOrder", "POST", "application/json", JSON.stringify({ service_id }),
        function (success) {
            // Get success message
            let successMessage = success.message ? success.message : 'Operation successful.';
            // Set attr value
            toggleAddRemoveFromOrder.attr('data-order-id', success.order_id);
            // Remove class
            toggleAddRemoveFromOrder.removeClass('text-primary');
            // Add class
            toggleAddRemoveFromOrder.addClass('text-danger');
            // Change icon and text
            toggleAddRemoveFromOrder.html(`<i class="fas fa-times-circle fa-2x"></i>`);
            // Success message
            toastr.success(successMessage, "Success");
            // Update the order count
            getActiveOrder();
        }, function (error) {

            // Remove
            toggleAddRemoveFromOrder.removeClass('disabled');
            // Remove class
            toggleAddRemoveFromOrder.removeClass('text-danger');
            // Add class
            toggleAddRemoveFromOrder.addClass('text-primary');
            // Change icon and text
            toggleAddRemoveFromOrder.html(`<i class="fas fa-plus-circle fa-2x"></i>`);


            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {
            // Remove
            toggleAddRemoveFromOrder.removeClass('disabled');
        });
}

/**
 * Remove
 * @param {*} toggleAddRemoveFromOrder 
 * @param {*} service_id 
 * @param {*} order_header_id 
 * Returns Void
 */
const removeFromOrder = (toggleAddRemoveFromOrder, service_id, order_header_id) => {

    // Disable
    toggleAddRemoveFromOrder.addClass('disabled');
    // Change the text
    toggleAddRemoveFromOrder.text('removing');

    // Make http request
    makeHTTPRequest(
        "/removeFromOrder", "POST", "application/json", JSON.stringify({ service_id, order_header_id }),
        function (success) {
            // Get success message
            let successMessage = success.message ? success.message : 'Operation successful.';
            // Set attr value
            toggleAddRemoveFromOrder.attr('data-order-id', '');
            // Remove class
            toggleAddRemoveFromOrder.removeClass('text-danger');
            // Add class
            toggleAddRemoveFromOrder.addClass('text-primary');
            // Change icon and text
            toggleAddRemoveFromOrder.html(`<i class="fas fa-plus-circle fa-2x"></i>`);
            // Success message
            toastr.success(successMessage, "Success");
            // Update the order count
            getActiveOrder();
        }, function (error) {

            // Remove
            toggleAddRemoveFromOrder.removeClass('disabled');
            // Remove class
            toggleAddRemoveFromOrder.addClass('text-danger');
            // Add class
            toggleAddRemoveFromOrder.removeClass('text-primary');
            // Change icon and text
            toggleAddRemoveFromOrder.html(`<i class="fas fa-times-circle fa-2x"></i>`);


            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {
            // Remove
            toggleAddRemoveFromOrder.removeClass('disabled');
        });
}


const closeOrderModal = (event) => {

    event.preventDefault();

    let genericModalDialog = $(".genericModalDialog");
    genericModalDialog.addClass("modal-lg");

    let modalHeader = $("#genericModalHeader");
    modalHeader.html(``);

    let modalBody = $("#genericModalBody");
    modalBody.html(``);

    let modalFooter = $("#genericModalFooter");
    modalFooter.html(``);

    let collectingAmountInput = $("#collectingAmountInput").val();

    let totalAmountId = $("#totalAmountId").attr('total-payment-amount');

    let paymentType = $("#paymentType").val();

    let selectEmployee = $("#selectEmployee");

    let remarks = $("#remarks").val();

    let orderHeaderId = $("#orderHeaderId").val();

    let calculatedTotalAmount = $("#calculatedTotalAmount").val();

    if (!checkForValue(selectEmployee.val())) {
        $("#employeeErrorFeedback").css('display', 'block');
        return;
    } else {
        $("#employeeErrorFeedback").css('display', 'none');
    }

    if (!checkForValue(paymentType)) {
        $("#paymentTypeErrorFeedback").css('display', 'block');
        return;
    } else {
        $("#paymentTypeErrorFeedback").css('display', 'none');
    }

    let modalHeaderHTML = `<h5 class="modal-title" id="genericModalLabel">Confirm Order</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;

    modalHeader.html(modalHeaderHTML);

    let modalBodyHTML = `<div class="table-responsive">
                        <input type="hidden" value="${orderHeaderId}" id="closingOrderHeaderId" />
                        <input type="hidden" value="${calculatedTotalAmount}" id="totalCalculatedAmount" />
                        <input type="hidden" value="${collectingAmountInput}" id="collectionAmount" />
                        <input type="hidden" value="${selectEmployee.val()}" id="selectedEmployee" />
                        <input type="hidden" value="${remarks}" id="orderRemarks" />
                        <input type="hidden" value="${paymentType}" id="selectedPaymentType" />
                        <table class="table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">Paid Amount</th>
                                    <th scope="col">Balance Amount</th>
                                    <th scope="col">Payment Type</th>
                                    <th scope="col">Employee</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="" style="border-color: transparent;">
                                    <td>AED ${totalAmountId}</td>
                                    <td>
                                        <strong class="text-danger p-1" style="background-color: yellow;">
                                           AED ${collectingAmountInput}
                                        </strong>
                                    </td>
                                    <td>
                                        <strong class="text-danger p-1" style="background-color: yellow;">
                                           AED ${collectingAmountInput-totalAmountId > 0 ? collectingAmountInput-totalAmountId : 0}
                                        </strong>
                                    </td>
                                    <td>
                                        <span class="badge ${paymentType == 'cash' ? 'bg-primary' : 'bg-success'} text-uppercase">${paymentType}</span>
                                    </td>
                                    <td>
                                        <strong class="text-danger p-1" style="background-color: yellow;">
                                            ${$('#selectEmployee option:selected').text()}
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;
    modalBody.html(modalBodyHTML);

    let modalFooterHTML = `<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Back</button>
                            <button type="button" class="btn btn-primary btn-sm collectAmount" id="collectAmount" onclick="collectAmount(event)">Collect</button>`;

    modalFooter.html(modalFooterHTML);

    // Show the modal using Bootstrap 5's modal instance
    const myModal = new bootstrap.Modal(document.getElementById('genericModal'));
    myModal.show();
}


/**
 * Collect & close
 * @param {*} event
 * Returns Void
 */
const collectAmount = (event) => {
    // Prevent default
    event.preventDefault();

    // Disable
    $(event.target).addClass('disabled');
    // Change the text
    $(event.target).text('Collecting');

    // Element id
    let closingOrderHeaderId = $("#closingOrderHeaderId").val();

    // Element id
    let collectionAmount = $("#collectionAmount").val();

    // Element id
    let totalCalculatedAmount = $("#totalCalculatedAmount").val();

    // Element id
    let selectedEmployee = $("#selectedEmployee").val();

    // Element id
    let orderRemarks = $("#orderRemarks").val();

    // Element id
    let selectedPaymentType = $("#selectedPaymentType").val();

    // Payload
    const payload = {
        order_header_id: closingOrderHeaderId,
        amount_collected: collectionAmount,
        payable_amount: totalCalculatedAmount,
        employee_id: selectedEmployee,
        order_remarks: orderRemarks,
        payment_type: selectedPaymentType
    }

    // return;
    // Make http request
    makeHTTPRequest(
        "/closeOrder", "POST", "application/json", JSON.stringify(payload),
        function (success) {
            // Get success message
            let successMessage = success.message ? success.message : 'Operation successful.';
            // Success message
            toastr.success(successMessage, "Success");
            // Update the order count
            getActiveOrder();


            // Show the modal using Bootstrap 5's modal instance
            const myModal = new bootstrap.Modal(document.getElementById('genericModal'));
            myModal.hide();

            setTimeout(() => {
                location.reload();
            }, 500);


        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {
            // Remove
            $(event.target).removeClass('disabled');
            // Change the text
            $(event.target).text('Collect');
        });
}