function validateContact(proxy) {
  var errors = {},
      first_name = proxy.get('first_name'),
      surname = proxy.get('surname'),
      address = proxy.get('address'),
      phone_number = proxy.get('phone_number'),
      email = proxy.get('email');

  if (!first_name || !first_name.trim()) {
    errors.first_name = "First name cannot be empty";
  }
  if (!surname || !surname.trim()) {
    errors.surname = "Surname cannot be empty";
  }
  if (phone_number && !phone_number.match(/^\d{11}$/)) {
    errors.phone_number = "Invalid phone number";
  }
  if (email && !email.match(/^[\w\.]+@[\w\.]+$/)) {
    errors.email = "Invalid email address";
  }

  return (function(e, attr) {
    var hasE = (Object.keys(e).length > 0);

    return {
      errors: function() { return e; },
      hasErrors: function() { return hasE; },
      attributes: function() { return attr; }
    }
  })(errors, {
    first_name: first_name,
    surname: surname,
    address: address,
    phone_number: phone_number,
    email: email
  });
}
