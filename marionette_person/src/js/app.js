var MyApp = MyApp || {};
jQuery(function($) {
  MyApp.App = new Marionette.Application();
  MyApp.App.addRegions({
    'inputForm': '#inputFormBlock',
    'tableForm': '#tableFormBlock'
  });
  MyApp.App.addInitializer(function() {
    // Modelオブジェクトを生成する。
    var personList = new PersonList();
    var personInput = new Person();
    var tableFormView = new TableFormView({
      collection: personList
    });
    var inputFormView = new InputFormView({
      model: personInput,
      collection: personList
    });
    MyApp.App.inputForm.show(inputFormView);

    // フェッチしてコレクションの初期データを生成する。
    personList.fetch();
    MyApp.App.tableForm.show(tableFormView);
  });
  MyApp.App.start();
});