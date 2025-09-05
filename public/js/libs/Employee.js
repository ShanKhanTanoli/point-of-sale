
// Invoke


/**
 * Toggle add
 * @param {*} toggleAddRemoveFromOrder
 * @param {*} service_id
 * Returns Void
 */
const fetchActiveEmployees = () => {
    // Make http request
    makeHTTPRequest(
        "/employees", "GET", "application/json", JSON.stringify({}),
        function (success) {

            const selectEmployee = $("#selectEmployee");

            // Only proceed if employees exist
            if (Array.isArray(success.employees) && success.employees.length > 0) {
                const options = success.employees.map((employee, index) =>
                    `<option value="${employee.id}">${employee.employee_name}</option>`
                );

                // Add default option at the beginning
                options.unshift(`<option selected value="">Select employee</option>`);

                // Inject into the DOM once
                selectEmployee.html(options.join(''));
            } else {
                // If no employees, still show default option
                selectEmployee.html(`<option selected value="">Select employee</option>`);
            }


        }, function (error) {
            let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
            // Error message
            toastr.error(errorMessage, "Error");
        }, function (always) {
            // console.log(always);
        });
}

fetchActiveEmployees();



/**
 * Closed orders
 * @param {*} fromDate 
 * @param {*} toDate 
 * Returns Void
 */
const employeesSales = (fromDate, toDate) => {
    // Service table container
    let renderEmployeesSalesTable = $("#renderEmployeesSalesTable");
    renderEmployeesSalesTable.html('Loading...');
    // Make http request
    makeHTTPRequest("/fetchEmployeesSales", "POST", "application/json", JSON.stringify({ fromDate, toDate }), function (success) {

        let tableTh = ['#', 'Employee', 'Total Orders', 'Cash Payments', 'Cash Collected', 'Card Payments', 'Card Collected', 'Total Amount Collected'];

        let renderTableRows = ``;

        let renderHeadColumns = tableTh.map(column => `<th>${column}</th>`).join('');

        if (success.employeeSales != null) {
            renderTableRows = success.employeeSales.map(employeeSale => `<tr>
                                                                <td>${employeeSale.employee_id}</td>
                                                                <td>${employeeSale.employee_name}</td>
                                                                <td>${(employeeSale.total_cash_payments+employeeSale.total_card_payments)}</td>
                                                                <td>${employeeSale.total_cash_payments}</td>
                                                                <td>
                                                                    <strong class="${employeeSale.total_cash_collected > 0 ? 'text-danger' : 'text-white'} p-1" style="background-color: ${employeeSale.total_cash_collected > 0 ? 'yellow' : 'red'};">
                                                                        AED ${employeeSale.total_cash_collected}
                                                                    </strong>
                                                                </td>
                                                                <td>${employeeSale.total_card_payments}</td>
                                                                <td>
                                                                    <strong class="${employeeSale.total_card_collected > 0 ? 'text-danger' : 'text-white'} p-1" style="background-color: ${employeeSale.total_card_collected > 0 ? 'yellow' : 'red'};">
                                                                        AED ${employeeSale.total_card_collected}
                                                                    </strong>
                                                                </td>
                                                                <td>
                                                                    <strong class="${employeeSale.total_collected > 0 ? 'text-danger' : 'text-white'} p-1" style="background-color: ${employeeSale.total_collected > 0 ? 'yellow' : 'red'};">
                                                                        AED ${employeeSale.total_collected}
                                                                    </strong>
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

        renderEmployeesSalesTable.html(htmlTable);

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

employeesSales("", "");


// Filter employees sales
const employeesSalesFilter = (event) => {

    $("#filterSalesButton").addClass('disabled');

    const fromDate = $("#from").val() + " 00:00:00";
    const toDate = $("#to").val() + " 23:59:59";

    employeesSales(fromDate, toDate);

    $("#filterSalesButton").removeClass('disabled');

}