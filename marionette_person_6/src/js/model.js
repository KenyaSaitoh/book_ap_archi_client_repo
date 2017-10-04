var MyApp = MyApp || {};
// PersonのModel
var Person = Backbone.Model.extend({
  idAttribute: 'personId',
  defaults: {
    personName: '',
    age: '',
    gender: ''
  },
  urlRoot: 'http://localhost:8080/rs_person_server/persons'
});

// Modelを定義する。
// Personのコレクション
var PersonList = Backbone.Collection.extend({
  model: Person, // 先にModelが宣言されている必要あり
  url: 'http://localhost:8080/rs_person_server/persons'
});