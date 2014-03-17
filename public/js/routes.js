ActiveAddress.Router.map(function() {
  this.resource('contacts', { path: '/' }, function() {
    this.route('new');
    this.resource('contact', { path: '/contacts/:id' });
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
    var router = this;
    return this.store.find('contact', params.id).catch(function(e) {
      router.transitionTo('contacts');
      return null;
    });
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
