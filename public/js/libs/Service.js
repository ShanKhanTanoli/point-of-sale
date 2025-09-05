function fetchActiveServices() {
  // Service table container
  let renderServicesTable = $("#renderServicesTable");
  // Make http request
  makeHTTPRequest(
    "/services", "GET", "application/json", JSON.stringify({}),
    function (success) {

      // let tableTh = ['#', 'Service', 'Price', 'Add To Order'];

      // let renderHeadColumns = tableTh.map(column => `<th>${column}</th>`).join('');

      // let renderTableRows = success.services.map(service => `<tr>
      //                                                           <td>${service.service_id}</td>
      //                                                           <td>${service.service_name}</td>
      //                                                           <td>AED ${service.service_price}</td>
      //                                                           <td>
      //                                                           <button data-order-id="${service.order_header_id}" onclick="toggleAddRemoveFromOrder('${service.service_id}','${service.order_header_id}')"
      //                                                               class="toggleAddRemoveFromOrder${service.service_id}Button btn btn-sm ${service.added_to_order == 1 ? 'text-danger' : 'text-primary'}">
      //                                                               <i class="fas ${service.added_to_order == 1 ? 'fa-times-circle fa-2x' : 'fa-plus-circle fa-2x'}"></i>
      //                                                           </button>
      //                                                           </td>
      //                                                       </tr>`).join('');

      // let htmlTable = `<table id="datatablesSimple">
      //               <thead>
      //                 <tr>
      //                   ${renderHeadColumns}
      //                 </tr>
      //               </thead>
      //               <tbody>
      //                 ${renderTableRows}
      //               </tbody>
      //             </table>`;

      let htmlGrid = success.services.map((service, index) => 
        `<div key="${index}" class="col-sm-12 col-md-3 col-lg-3">
                                        <div class="card">
                                            <div class="card-body text-center">
                                                <h4 class="card-title">
                                                    AED ${service.service_price}
                                                </h4>
                                                <p class="card-text">
                                                    ${service.service_name}
                                                </p>
                                                <div>
                                                    <button data-order-id="${service.order_header_id}" onclick="toggleAddRemoveFromOrder('${service.service_id}','${service.order_header_id}')"
                                                                     class="toggleAddRemoveFromOrder${service.service_id}Button btn btn-sm ${service.added_to_order == 1 ? 'text-danger' : 'text-primary'}">
                                                                     <i class="fas ${service.added_to_order == 1 ? 'fa-times-circle fa-2x' : 'fa-plus-circle fa-2x'}"></i>
                                                                 </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
      ).join('');

      renderServicesTable.html(`<div class="row g-3">${htmlGrid}</div>`);

      // Init data table id
      // let datatablesSimple = document.getElementById('datatablesSimple');

      // if (datatablesSimple) {
      //   new simpleDatatables.DataTable(datatablesSimple);
      // }

    }, function (error) {
      let errorMessage = error.responseJSON ? (error.responseJSON.message ? error.responseJSON.message : 'Something went wrong. Please refresh the page and try again.') : 'Something went wrong. Please refresh the page and try again.';
      // Error message
      toastr.error(errorMessage, "Error");
    }, function (always) {
      // console.log(always);
    });
}


// Invoke
fetchActiveServices();

// Invoke
fetchActiveEmployees();



/**
 * Service sales
 * @param {*} fromDate 
 * @param {*} toDate 
 * Returns Void
 */
const serviceSales = (fromDate, toDate) => {
  // Service table container
  let renderServiceSalesTable = $("#renderServiceSalesTable");
  renderServiceSalesTable.html('Loading...');
  // Make http request
  makeHTTPRequest("/fetchServiceSales", "POST", "application/json", JSON.stringify({ fromDate, toDate }), function (success) {

    let tableTh = ['#', 'Service', 'Paid Amount', 'Service Count'];

    let renderTableRows = ``;

    let renderHeadColumns = tableTh.map(column => `<th>${column}</th>`).join('');

    if (success.serviceSales != null) {
      renderTableRows = success.serviceSales.map((service, index) => `<tr>
                                                                <td>${index+1}</td>
                                                                <td><strong class="text-danger p-1" style="background-color: yellow;">${service.service_name}</strong></td>
                                                                 <td>
                                                                    <strong class="${service.amount_collected > 0 ? 'text-danger' : 'text-white'} p-1" style="background-color: ${service.amount_collected > 0 ? 'yellow' : 'red'};">
                                                                        AED ${service.amount_collected}
                                                                    </strong>
                                                                </td>
                                                                <td>
                                                                    <strong class="${service.times_used > 0 ? 'text-danger' : 'text-white'} p-1" style="background-color: ${service.times_used > 0 ? 'yellow' : 'red'};">
                                                                        ${service.times_used} Times
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

    renderServiceSalesTable.html(htmlTable);

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

serviceSales("", "");


// Filter employees sales
const serviceSalesFilter = (event) => {

  $("#filterSalesButton").addClass('disabled');

  const fromDate = $("#from").val() + " 00:00:00";
  const toDate = $("#to").val() + " 23:59:59";

  serviceSales(fromDate, toDate);

  $("#filterSalesButton").removeClass('disabled');

}