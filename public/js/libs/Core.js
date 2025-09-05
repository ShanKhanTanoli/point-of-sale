// Set of invalid values
const invalidValues = new Set(['', null, undefined, 'null', 'undefined']);

/**
 * Make HTTP Request
 * @param {*} requestURL 
 * @param {*} requestMethod 
 * @param {*} requestContentType 
 * @param {*} requestPayload 
 * @param {*} doneCallBlack 
 * @param {*} errorCallBlack 
 * @param {*} alwaysCallBlack 
 */
const makeHTTPRequest = (
  requestURL,
  requestMethod,
  requestContentType,
  requestPayload,
  doneCallBlack,
  errorCallBlack,
  alwaysCallBlack
) => {
  $.ajax({
    url: requestURL,
    method: requestMethod,
    contentType: requestContentType,
    data: requestPayload,
    dataType: 'json'
  })
    .done((response) => doneCallBlack(response))
    .fail((error) => errorCallBlack(error))
    .always((always) => alwaysCallBlack(always));
}


/**
 * Check for the value
 * @param {*} val 
 * @returns Boolean
 */
const checkForValue = (val) => !invalidValues.has(val);

/**
 * Order status badge
 * @param {*} orderStatus 
 * @returns HTML
 */
const orderStatusBadge = (orderStatus) => {
  let badge = ``;
  switch (orderStatus.toLowerCase()) {

    case 'cash':
      badge = `<span class="badge bg-primary text-uppercase">${orderStatus}</span>`;
      break;

    case 'card':
      badge = `<span class="badge bg-success text-uppercase">${orderStatus}</span>`;
      break;

    default:
      badge = `<span class="badge bg-info text-uppercase">${orderStatus}</span>`;
      break;
  }
  return badge;
}

/**
 * Formatted date time
 * @param {*} input 
 * @returns String
 */
const formateDateTimeString = (input) => {
  const date = new Date(input);
  const formatted = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  return formatted;
}

/**
 * Renders site menu
 * @returns HTML
 */
const renderSiteMenu = () => {

  const siteMenuTitle = `<div class="sb-sidenav-menu-heading">Menu</div>`;

  const renderSiteMenu = $("#renderSiteMenu");

  let siteMenuElements = ``;

  const pathName = document.location.pathname;

  const siteMenu = [{
    'url': '/',
    'name': 'Dashboard',
    'icon': 'fa-tachometer-alt'
  },
  {
    'url': '/OrderSales',
    'name': 'Order Sales',
    'icon': 'fa-shopping-basket'
  },
  {
    'url': '/EmployeeSales',
    'name': 'Employee Sales',
    'icon': 'fa-users'
  },
  {
    'url': '/ServiceSales',
    'name': 'Service Sales',
    'icon': 'fa-hands'
  }];

  siteMenuElements += siteMenu.map((menu, index) => `<a key="${index}" class="nav-link ${pathName == menu.url ? 'active' : ''}" href="${menu.url}">
                                                        <div class="sb-nav-link-icon">
                                                            <i class="fas ${menu.icon}"></i>
                                                        </div>
                                                        ${menu.name}
                                                    </a>`).join('');

  renderSiteMenu.html(siteMenuTitle + siteMenuElements);
}

// Invoke
renderSiteMenu();



/**
 * Renders site menu
 * @returns HTML
 */
const adminSideNavAccordion = () => {

  const siteMenuTitle = `<div class="sb-sidenav-menu-heading">Menu</div>`;

  const renderAdminSiteMenu = $("#renderAdminSiteMenu");

  let siteMenuElements = ``;

  const pathName = document.location.pathname;

  const baseUrl = '/admin';

  const siteMenu = [{
    'url': baseUrl + '/dashboard',
    'name': 'Dashboard',
    'icon': 'fa-tachometer-alt'
  },
  {
    'url': baseUrl + '/orders',
    'name': 'Orders',
    'icon': 'fa-money-bill-transfer'
  },
  {
    'url': baseUrl + '/services',
    'name': 'Services',
    'icon': 'fa-hands'
  },
  {
    'url': baseUrl + '/users',
    'name': 'Users',
    'icon': 'fa-users'
  },
  {
    'url': baseUrl + '/employees',
    'name': 'Employees',
    'icon': 'fa-briefcase'
  },
  {
    'url': baseUrl + '/roles',
    'name': 'Roles',
    'icon': 'fa-shield'
  },
  {
    'url': '/',
    'name': 'Home',
    'icon': 'fa-home'
  },
  {
    'url': baseUrl + '/settings',
    'name': 'Settings',
    'icon': 'fa-gear'
  }];

  siteMenuElements += siteMenu.map((menu, index) => `<a key="${index}" class="nav-link ${pathName == menu.url ? 'active' : ''}" href="${menu.url}">
                                                        <div class="sb-nav-link-icon">
                                                            <i class="fas ${menu.icon}"></i>
                                                        </div>
                                                        ${menu.name}
                                                    </a>`).join('');

  renderAdminSiteMenu.html(siteMenuTitle + siteMenuElements);
}

// Invoke
adminSideNavAccordion();


// Init date pickers
$(function () {
  const dateFormat = "yy-mm-dd";
  const defaultDate = new Date();
  const maxDate = new Date();
  const minDate = new Date(2000, 0, 1);

  const from = $("#from")
    .datepicker({
      defaultDate: defaultDate,
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      maxDate: maxDate,
      minDate: minDate,
      dateFormat: dateFormat
    })
    .datepicker("setDate", defaultDate) // set default selected date
    .on("change", function () {
      to.datepicker("option", "minDate", getDate(this));
    });

  const to = $("#to")
    .datepicker({
      defaultDate: defaultDate,
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      maxDate: maxDate,
      minDate: minDate,
      dateFormat: dateFormat
    })
    .datepicker("setDate", defaultDate) // set default selected date
    .on("change", function () {
      from.datepicker("option", "maxDate", getDate(this));
    });

  function getDate(element) {
    let date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }
    return date;
  }
});

/**
 * Bs5 Spinner
 * @param {*} spinnerColor 
 * @returns HTML
 */
const renderSpinnner = (spinnerColor) => {
  return `<div class="d-flex justify-content-center align-items-center">
            <div class="spinner-border ${spinnerColor}" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>`;
}


function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setVH);
setVH();

