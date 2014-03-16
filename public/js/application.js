window.ActiveAddress = Ember.Application.create({
  LOG_TRANSITIONS: true
});

ActiveAddress.ApplicationView = Ember.View.extend({
  classNames: [ 'full-height' ]
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
      if (this.controller.get('isEditing')) {
        this.controller.get('model').rollback();
      }
    }
  },
});

// controllers
ActiveAddress.ContactsNewController = Ember.ArrayController.extend({
  contactFormButtonText: 'Add Contact',

  actions: {
    submitContactForm: function() {
      // check for the required fields
      var first_name = this.get('first_name');
      var surname = this.get('surname');
      if (!first_name || !first_name.trim() ||
          !surname || !surname.trim()) {
        return;
      }
      var address = this.get('address');
      var phone_number = this.get('phone_number');
      var email = this.get('email');

      // create the new record
      var contact = this.store.createRecord('contact', {
        first_name: first_name,
        surname: surname,
        address: address,
        phone_number: phone_number,
        email: email
      });

      // clear form
      this.set('newContactFirstName', '');
      this.set('newContactSurname', '');

      // save the new record
      contact.save();
    },

    cancelContactForm: function() {
      this.transitionToRoute('contacts.index');
    }
  }
});

ActiveAddress.ContactController = Ember.ObjectController.extend({
  isEditing: false,
  contactFormButtonText: 'Done',

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    submitContactForm: function() {
      this.set('isEditing', false);
      this.get('model').save();
    },

    cancelContactForm: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
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
