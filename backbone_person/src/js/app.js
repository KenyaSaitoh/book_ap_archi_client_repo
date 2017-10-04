var MyApp = MyApp || {};
jQuery(function($) {
  // Modelオブジェクトを生成する。
  var personList = new MyApp.PersonList();
  var personInput = new MyApp.Person();

  var tableFormView = new MyApp.TableFormView({
    collection: personList
  });
  var inputFormView = new MyApp.InputFormView({
    model: personInput,
    personList: personList
  });

  // フェッチしてコレクションの初期データを生成する。
  personList.fetch().then(function() {
    $('#tableFormBlock').append(tableFormView.render().$el);
    $('#inputFormBlock').append(inputFormView.render().$el);
  });
});