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
                                                                    <a href="/Order/Details/${order.order_header_id}" class="btn btn-sm btn-link">
                                                                        View
                                                                    </a>
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



const ordersPaymentsFilter = (event) => {

    $("#filterSalesButton").addClass('disabled');

    const fromDate = $("#from").val() + " 00:00:00";
    const toDate = $("#to").val() + " 23:59:59";

    ordersPayments(fromDate, toDate);

    closedOrders(fromDate, toDate);

    $("#filterSalesButton").removeClass('disabled');

}


