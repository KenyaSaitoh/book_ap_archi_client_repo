var MyApp = MyApp || {};
// PersonのModel
MyApp.Person = Backbone.Model.extend({
  defaults: {
    personId: '',
    personName: '',
    age: '',
    gender: ''
  },
  idAttribute: 'personId',
  url: 'http://localhost:8080/rs_person_server/persons'
});

// Modelを定義する。
// Personのコレクション
MyApp.PersonList = Backbone.Collection.extend({
  model: MyApp.Person, // 先にModelが宣言されている必要あり
  url: 'http://localhost:8080/rs_person_server/persons',
  getMaxPersonId: function() {
    if (this.size() == 0) {
      return 0;
    } else {
      var maxPerson = this.max(function(person){
        return person.get('personId');
      });
      return parseInt(maxPerson.get('personId'));
    }
  }
});