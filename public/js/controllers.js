ActiveAddress.ContactsController = Ember.ArrayController.extend({
  sortProperties: [ 'display_name' ],
  sortAscending: true
});

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
      var controller = this;
      contact.save().then(function(record) {
        // redirect to the show page
        controller.transitionToRoute('contact', record.id);
      });
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
      var record = this.get('model');
      if (confirm('Do you really want to remove ' + record.get('display_name') + ' from the contacts list?')) {
        var controller = this;
        record.destroyRecord().then(function() {
          controller.transitionToRoute('contacts');
        });
      }
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
