/**
 * Closed orders
 * @param {*} fromDate 
 * @param {*} toDate 
 * Returns Void
 */
const closedOrders = (fromDate, toDate) => {
    // Service table container
    let renderclosedOrdersTable = $("#renderclosedOrdersTable");
    renderclosedOrdersTable.html('Loading...');
    // Make http request
    makeHTTPRequest(
        "/closedOrders", "POST", "application/json", JSON.stringify({ fromDate, toDate }),
        function (success) {

            let tableTh = ['#', 'Order', 'Total Amount', 'Paid Amount', 'Balance Amount', 'Discount', 'Received By', 'Type', 'Date', 'Collection', 'Actions'];

            let renderTableRows = ``;

            let renderHeadColumns = tableTh.map(column => `<th>${column}</th>`).join('');

            if (success.closedOrders != null) {
                renderTableRows = success.closedOrders.map((order, index) => `<tr>
                                                                <td>${(index + 1)}</td>
                                                                <td>#${order.order_header_id}</td>
                                                                <td>AED ${order.payable_amount}</td>
                                                                <td><strong class="text-danger p-1" style="background-color: yellow;">AED ${order.amount_collected}</strong></td>
                                                                <td><strong class="text-danger p-1" style="background-color: yellow;">AED ${order.balance_amount}</strong></td>
                                                                <td><strong class="text-danger p-1" style="background-color: yellow;">AED ${(order.payable_amount - order.amount_collected) < 0 ? 0 : (order.payable_amount - order.amount_collected)}</strong></td>
                                                                <td><strong class="text-danger p-1" style="background-color: yellow;">${order.employee_name}</strong></td>
                                                                <td>${orderStatusBadge(order.payment_type)}</td>
                                                                <td>${formateDateTimeString(order.order_closed_at)}</td>
                                                                <td><strong class="${order.amount_collected_by_owner == 1 ? 'text-white' : 'text-danger'} p-1" style="background-color: ${order.amount_collected_by_owner == 1 ? 'green' : 'yellow'};">${order.amount_collected_by_owner == 1 ? 'COLLECTED' : 'PENDING'}</strong></td>
                                                                <td>
                                                                    <a href="#" onclick="toggleCollectUncollectModal(event, '${order.order_header_id}', '${order.payable_amount}', '${order.amount_collected}', '${order.balance_amount}', '${order.amount_collected_by_owner}', '${order.payment_type}','${order.employee_name}')" class="btn btn-sm btn-link me-2">
                                                                        ${order.amount_collected_by_owner == 1 ? 'Uncollect' : 'Collect'}
                                                                    </a>

                                                                    <a href="/admin/order/view/${order.order_header_id}" class="btn btn-sm btn-link">
                                                                        View
                                                                    </a>

                                                                    <button type="button" onclick="orderReOpenModal(event, ${order.order_header_id})" class="btn btn-sm btn-link">
                                                                        Re-Open
                                                                    </button>

                                                                </td>
                                                            </tr>`).join('');
            }

            let htmlTable = `<table id="datatablesSimple">
                    <thead>
                      <tr>
                        ${renderHeadColumns}
                      </tr>
                    </thead>
                    <tbody>
                      ${renderTableRows}
                    </tbody>
                  </table>`;

            renderclosedOrdersTable.html(htmlTable);

            // Init data table id
            let datatablesSimple = document.getElementById('datatablesSimple');

            if (datatablesSimple) {
                new simpleDatatables.DataTable(datatablesSimple);
            }

        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {
            // console.log(always);
        });
}

closedOrders("", "");


/**
 * Order Payments
 * @param {*} fromDate 
 * @param {*} toDate 
 * Returns Void
 */
const ordersPayments = (fromDate, toDate) => {


    // Init element
    let displayCardPaymentsHeading = $("#displayCardPaymentsHeading");
    // Set 
    displayCardPaymentsHeading.text('loading...');

    // Init element
    let displayCardPaymentsAmount = $("#displayCardPaymentsAmount");
    // Set 
    displayCardPaymentsAmount.text('loading...');

    // Init element
    let displayCardPaymentsCollectedAmount = $("#displayCardPaymentsCollectedAmount");
    // Set 
    displayCardPaymentsCollectedAmount.text('loading...');

    // Init element
    let displayCardPaymentsPendingAmount = $("#displayCardPaymentsPendingAmount");
    // Set 
    displayCardPaymentsPendingAmount.text('loading...');





    // Init element
    let displayCashPaymentsHeading = $("#displayCashPaymentsHeading");
    // Set 
    displayCashPaymentsHeading.text('loading...');

    // Init element
    let displayCashPaymentsAmount = $("#displayCashPaymentsAmount");
    // Set 
    displayCashPaymentsAmount.text('loading...');

    // Init element
    let displayCashPaymentsCollectedAmount = $("#displayCashPaymentsCollectedAmount");
    // Set 
    displayCashPaymentsCollectedAmount.text('loading...');

    // Init element
    let displayCashPaymentsPendingAmount = $("#displayCashPaymentsPendingAmount");
    // Set 
    displayCashPaymentsPendingAmount.text('loading...');






    // Init element
    let displayTotalPaymentAmount = $("#displayTotalPaymentAmount");
    // Set 
    displayTotalPaymentAmount.text('loading...');

    // Init element
    let displayTotalPaymentsHeading = $("#displayTotalPaymentsHeading");
    // Set 
    displayTotalPaymentsHeading.text('loading...');

    // Init element
    let displayTotalPaymentCollectedAmount = $("#displayTotalPaymentCollectedAmount");
    // Set 
    displayTotalPaymentCollectedAmount.text('loading...');

    // Init element
    let displayTotalPaymentPendingAmount = $("#displayTotalPaymentPendingAmount");
    // Set 
    displayTotalPaymentPendingAmount.text('loading...');



    // Make http request
    makeHTTPRequest(
        "/ordersPayments", "POST", "application/json", JSON.stringify({ fromDate, toDate }),
        function (success) {

            // Add heading
            displayCardPaymentsHeading.text('Card Payments (' + success.ordersPayments.total_card_payments + ')');
            // Add amount
            displayCardPaymentsAmount.text('AED ' + success.ordersPayments.total_card_amount);
            // Add amount
            displayCardPaymentsCollectedAmount.text('AED ' + success.ordersPayments.total_card_amount_collected + ' Collected (' + success.ordersPayments.total_card_collected + ')');
            // Add amount
            displayCardPaymentsPendingAmount.text('AED ' + success.ordersPayments.total_card_amount_not_collected + ' Pending (' + success.ordersPayments.total_card_not_collected + ')');



            // Add heading
            displayCashPaymentsHeading.text('Cash Payments (' + success.ordersPayments.total_cash_payments + ')');
            // Add amount
            displayCashPaymentsAmount.text('AED ' + success.ordersPayments.total_cash_amount);
            // Add amount
            displayCashPaymentsCollectedAmount.text('AED ' + success.ordersPayments.total_cash_amount_collected + ' Collected (' + success.ordersPayments.total_cash_collected + ')');
            // Add amount
            displayCashPaymentsPendingAmount.text('AED ' + success.ordersPayments.total_cash_amount_not_collected + ' Pending (' + success.ordersPayments.total_cash_not_collected + ')');


            // Add heading
            displayTotalPaymentsHeading.text('Total Payments (' + (success.ordersPayments.total_cash_payments + success.ordersPayments.total_card_payments) + ')');
            // Add amount
            displayTotalPaymentAmount.text('AED ' + (success.ordersPayments.total_cash_amount + success.ordersPayments.total_card_amount));
            // Add amount
            displayTotalPaymentCollectedAmount.text('AED ' + (success.ordersPayments.total_cash_amount_collected + success.ordersPayments.total_card_amount_collected) + ' Collected (' + (success.ordersPayments.total_cash_collected + success.ordersPayments.total_card_collected) + ')');
            // Add amount
            displayTotalPaymentPendingAmount.text('AED ' + (success.ordersPayments.total_cash_amount_not_collected + success.ordersPayments.total_card_amount_not_collected) + ' Pending (' + (success.ordersPayments.total_cash_not_collected + success.ordersPayments.total_card_not_collected) + ')');


        }, function (error) {

            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {

        });
}


// Invoke here
ordersPayments("", "");


/**
 * Filter
 * @param {*} event 
 */
const ordersPaymentsFilter = (event) => {

    $("#filterSalesButton").addClass('disabled');

    const fromDate = $("#from").val() + " 00:00:00";
    const toDate = $("#to").val() + " 23:59:59";

    ordersPayments(fromDate, toDate);

    closedOrders(fromDate, toDate);

    $("#filterSalesButton").removeClass('disabled');

}


/**
 * Order re-open modal
 * @param {*} event 
 * @param {*} order_header_id 
 */
function orderReOpenModal(event, order_header_id) {

    // Prevent default
    event.preventDefault();


    let genericModalDialog = $(".genericModalDialog");
    genericModalDialog.addClass("modal-lg");

    let modalHeader = $("#genericModalHeader");
    modalHeader.html(``);

    let modalBody = $("#genericModalBody");
    modalBody.html(``);

    let modalFooter = $("#genericModalFooter");
    modalFooter.html(``);


    let modalHeaderHTML = `<h5 class="modal-title" id="genericModalLabel">Order Re-Open</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;

    modalHeader.html(modalHeaderHTML);

    let modalBodyHTML = `<h4 class="text-center m-0">Are you sure? You want to re-open order #${order_header_id}.</h4>`;
    modalBody.html(modalBodyHTML);

    let modalFooterHTML = `<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Back</button>
                            <button type="button" class="btn btn-primary btn-sm" onclick="orderReOpen(event, ${order_header_id})">
                                Re-Open
                            </button>`;

    modalFooter.html(modalFooterHTML);

    // Show the modal using Bootstrap 5's modal instance
    const myModal = new bootstrap.Modal(document.getElementById('genericModal'));
    myModal.show();

}

/**
 * Order re-open
 * @param {*} event 
 * @param {*} order_header_id 
 */
function orderReOpen(event, order_header_id){
        // Make http request
    makeHTTPRequest("/admin/order/reopen", "POST", "application/json", JSON.stringify({order_header_id}),

        function (success) {
            
            // Success message
            toastr.success(success.message, "Success");

            // Re-render
            ordersPaymentsFilter();

            // Reload after timeout
            setTimeout(()=> {
                location.reload();
            },1000);

            // Hide modal
            $("#genericModal").modal('hide');


        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {

        });
}

/**
 * Orders bulk collect
 * @param {*} fromDate 
 * @param {*} toDate 
 */
function ordersBulkCollect(fromDate, toDate){
        // Make http request
    makeHTTPRequest("/admin/orders/bulkCollect", "POST", "application/json", JSON.stringify({fromDate, toDate}),

        function (success) {
            
            // Success message
            toastr.success(success.message, "Success");

            // Re-render
            ordersPaymentsFilter();

            // Reload after timeout
            setTimeout(()=> {
                location.reload();
            },1000);

            // Hide modal
            $("#genericModal").modal('hide');


        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {

        });
}

/**
 * Orders bulk collect modal
 * @param {*} event 
 */
function ordersBulkCollectionModal(event) {

    // Prevent default
    event.preventDefault();


    let genericModalDialog = $(".genericModalDialog");
    genericModalDialog.addClass("modal-lg");

    let modalHeader = $("#genericModalHeader");
    modalHeader.html(``);

    let modalBody = $("#genericModalBody");
    modalBody.html(``);

    let modalFooter = $("#genericModalFooter");
    modalFooter.html(``);


    let modalHeaderHTML = `<h5 class="modal-title" id="genericModalLabel">Confirm Order Collection</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;

    modalHeader.html(modalHeaderHTML);

    let modalBodyHTML = `<h4 class="text-center m-0">Are you sure? You want to collect bulk orders.</h4>`;
    modalBody.html(modalBodyHTML);

    let modalFooterHTML = `<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Back</button>
                            <button type="button" class="btn btn-primary btn-sm" id="ordersBulkCollectionWithFilterButton" onclick="ordersBulkCollectionWithFilter(event)">
                                Collect
                            </button>`;

    modalFooter.html(modalFooterHTML);

    // Show the modal using Bootstrap 5's modal instance
    const myModal = new bootstrap.Modal(document.getElementById('genericModal'));
    myModal.show();

}

/**
 * Orders bulk collection
 * @param {*} event 
 */
const ordersBulkCollectionWithFilter = async (event) => {

    $("#ordersBulkCollectionWithFilterButton").addClass('disabled');

    const fromDate = $("#from").val() + " 00:00:00";
    const toDate = $("#to").val() + " 23:59:59";

    ordersBulkCollect(fromDate, toDate);

    ordersPayments(fromDate, toDate);

    closedOrders(fromDate, toDate);

    $("#ordersBulkCollectionWithFilterButton").removeClass('disabled');

}

function toggleCollectUncollectModal(event, order_header_id, payable_amount, amount_collected, balance_amount, amount_collected_by_owner, payment_type, employee_name) {

    // Prevent default
    event.preventDefault();


    let genericModalDialog = $(".genericModalDialog");
    genericModalDialog.addClass("modal-lg");

    let modalHeader = $("#genericModalHeader");
    modalHeader.html(``);

    let modalBody = $("#genericModalBody");
    modalBody.html(``);

    let modalFooter = $("#genericModalFooter");
    modalFooter.html(``);


    let modalHeaderHTML = `<h5 class="modal-title" id="genericModalLabel">Confirm Order Collection</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;

    modalHeader.html(modalHeaderHTML);

    let modalBodyHTML = `<div class="table-responsive">
                        <input type="hidden" value="${order_header_id}" id="closingOrderHeaderId" />
                        <table class="table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Order</th>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">Paid Amount</th>
                                    <th scope="col">Balance Amount</th>
                                    <th scope="col">Payment Type</th>
                                    <th scope="col">Employee</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="" style="border-color: transparent;">
                                    <td>#${order_header_id}</td>
                                    <td>AED ${payable_amount}</td>
                                    <td>
                                        <strong class="text-danger p-1" style="background-color: yellow;">
                                           AED ${amount_collected}
                                        </strong>
                                    </td>
                                    <td>
                                        <strong class="text-danger p-1" style="background-color: yellow;">
                                           AED ${balance_amount}
                                        </strong>
                                    </td>
                                    <td>
                                        <span class="badge ${payment_type == 'cash' ? 'bg-primary' : 'bg-success'} text-uppercase">${payment_type}</span>
                                    </td>
                                    <td>
                                        <strong class="text-danger p-1" style="background-color: yellow;">
                                            ${employee_name}
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;
    modalBody.html(modalBodyHTML);

    let modalFooterHTML = `<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Back</button>
                            <button type="button" class="btn btn-primary btn-sm ${amount_collected_by_owner == 0 ? 'collectOrder' : 'unCollectOrder'}" id="${amount_collected_by_owner == 0 ? 'collectOrder' : 'unCollectOrder'}" onclick="${amount_collected_by_owner == 0 ? 'collectOrder' : 'unCollectOrder'}(event, '${order_header_id}')">
                                ${amount_collected_by_owner == 0 ? 'Collect' : 'Uncollect'}
                            </button>`;

    modalFooter.html(modalFooterHTML);

    // Show the modal using Bootstrap 5's modal instance
    const myModal = new bootstrap.Modal(document.getElementById('genericModal'));
    myModal.show();

}

/**
 * Uncollect order
 * @param {*} event 
 * @param {*} order_header_id 
 */
function collectOrder(event, order_header_id){
    
    // If header id is coming
    if(!checkForValue(order_header_id)){
        // Error
        toastr.error("Order id is not coming","Error");
        // Stop the flow
        return;
    }

    // Change text
    $(event.target).text = "Collecting";


    let orderIds = [];

    orderIds.push(order_header_id);

    // Make http request
    makeHTTPRequest("/admin/orders/collect", "POST", "application/json", JSON.stringify({orderIds: orderIds}),

        function (success) {
            
            // Success message
            toastr.success(success.message, "Success");

            // Re-render
            ordersPaymentsFilter();

            // Reload after timeout
            setTimeout(()=> {
                location.reload();
            },1000);


        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {

        });
}

/**
 * Uncollect order
 * @param {*} event 
 * @param {*} order_header_id 
 */
function unCollectOrder(event,order_header_id){

    // If header id is coming
    if(!checkForValue(order_header_id)){
        // Error
        toastr.error("Order id is not coming","Error");
        // Stop the flow
        return;
    }

    // Change text
    $(event.target).text = "Collecting";


    let orderIds = [];

    orderIds.push(order_header_id);

    // Make http request
    makeHTTPRequest("/admin/orders/uncollect", "POST", "application/json", JSON.stringify({orderIds: orderIds}),

        function (success) {
           
            // Success message
            toastr.success(success.message, "Success");

            // Re-render
            ordersPaymentsFilter();

            // Reload after timeout
            setTimeout(()=> {
                location.reload();
            },1000);


        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {

        });
}


