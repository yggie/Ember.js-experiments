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
