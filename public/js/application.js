window.ActiveAddress = Ember.Application.create({
  LOG_TRANSITIONS: true
});

ActiveAddress.ApplicationView = Ember.View.extend({
  classNames: [ 'full-height' ]
});

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

// handlebar helpers

Ember.Handlebars.helper('begin-form-group', function(dummy, options) {
  var errorClass = (options.error) ? ' has-error has-feedback' : '';
  return new Handlebars.SafeString('<div class="form-group' + errorClass + '">');
});

Ember.Handlebars.helper('end-form-group', function(errorMsg) {
  if (errorMsg) {
    return new Handlebars.SafeString('<span class="help-block control-label">' + errorMsg + '</span></div>');
  } else {
    return new Handlebars.SafeString('</div>');
  }
});

// models
ActiveAddress.Contact = DS.Model.extend({
  first_name: DS.attr('string'),
  surname: DS.attr('string'),
  address: DS.attr('string'),
  phone_number: DS.attr('string'),
  email: DS.attr('string'),

  display_name: function() {
    return this.get('first_name') + ' ' + this.get('surname');
  }.property('first_name', 'surname'),

  mail_to: function() {
    return 'mailto:' + this.get('email');
  }.property('email'),

  display_address: function() {
    return this.get('address');
  }.property('address')
});

// routes
ActiveAddress.Router.map(function() {
  this.resource('contacts', { path: '/' }, function() {
    this.route('new');
    this.resource('contact', { path: '/contact/:id' });
  });
});

ActiveAddress.ContactsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('contact');
  },

  actions: {
    willTransition: function(transition) {
      this.controllerFor('contacts.new').send('reset');
    }
  }
});

ActiveAddress.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('contact', params.id);
  },

  setupController: function(controller, contact) {
    controller.set('model', contact);
    controller.set('isEditing', false);
  },

  actions: {
    willTransition: function(transition) {
      this.controllerFor('contact').send('reset');
    }
  },
});

// controllers
ActiveAddress.ContactsNewController = Ember.ArrayController.extend({
  contactFormButtonText: 'Add Contact',
  errors: {},

  actions: {
    submitContactForm: function() {
      // run validation
      var validation = validateContact(this);
      
      if (validation.hasErrors()) {
        this.set('errors', validation.errors());
        return;
      }

      // create the new record
      var contact = this.store.createRecord('contact', validation.attributes());

      // reset the controller
      this.send('reset');

      // save the new record
      contact.save();

      // redirect to the show page
      this.transitionToRoute('contact', contact.id);
    },

    cancelContactForm: function() {
      this.transitionToRoute('contacts.index');
    },

    reset: function() {
      this.set('errors', {});
      this.set('first_name', '');
      this.set('surname', '');
      this.set('address', '');
      this.set('email', '');
      this.set('phone_number', '');
    }
  }
});

ActiveAddress.ContactController = Ember.ObjectController.extend({
  isEditing: false,
  contactFormButtonText: 'Done',
  errors: {},

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    submitContactForm: function() {
      var model = this.get('model');

      var validation = validateContact(model);
      if (validation.hasErrors()) {
        this.set('errors', validation.errors());
        return;
      }

      this.set('isEditing', false);
      model.save();
    },

    delete: function() {
      this.get('model').deleteRecord();
      this.transitionToRoute('contacts');
    },

    cancelContactForm: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },

    reset: function() {
      if (this.get('isEditing')) {
        this.get('model').rollback();
      }
      this.set('errors', {});
    }
  }
});

// fixtures
ActiveAddress.ApplicationAdapter = DS.FixtureAdapter.extend();

ActiveAddress.Contact.FIXTURES = [
{
  id: 1,
  first_name: 'Frodo',
  surname: 'Baggins',
  address: 'The Burrow, Shire',
  phone_number: '07913475574',
  email: 'frodo@middleearth.org'
},
{
  id: 2,
  first_name: 'Harry',
  surname: 'Potter',
  address: 'The Cupboard under the Stairs, 4 Privet Drive, Little Whinging, Surrey',
  phone_number: '01234567890',
  email: 'harry.potter@hogwarts.ac.uk'
},
{
  id: 3,
  first_name: 'Benjamin',
  surname: 'Button',
  address: '25 Whirley Way, Hogsmead',
  phone_number: '0142954760',
  email: 'ben.button@buttons.com'
}
]
