var MyApp = MyApp || {};
var InputFormView = Marionette.ItemView.extend({
  template: '#inputForm-tmpl',
  initialize: function() {
    MyApp.App.vent.on('edit', function(personRow) {
      this.model.set(personRow.toJSON());
      this.render();
    }, this);
  },
  events: {
    'submit #inputForm': 'registerPerson'
  },
  modelEvents: {
    sync: 'saved'
  },
  registerPerson: function(event) {
    event.preventDefault(); // フォームのデフォルトイベントを抑止する
    this.model.set({personName: this.$('#personName').val()});
    this.model.set({age: this.$('#age').val()});
    this.model.set({gender: this.$('#gender').val()});
    this.model.save();
  },
  saved: function() {
    this.collection.add(this.model.clone(), {merge: true});
    this.model.set({personName: '', age: '', gender: ''}); // 初期値をセットし直す
    this.model.unset('personId'); // undefinedに戻す
    this.render();
  },
  templateHelpers: function() {
    return {
      personId: this.model.isNew() ? '' : this.model.get('personId')
    };
  }
});

// モデル用のView
var RowView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: '#row-tmpl',
  events: {
    'click button[name="edit"]': 'editRow',
    'click button[name="delete"]': 'removeRow'
  },
  editRow: function(event) {
    MyApp.App.vent.trigger('edit', this.model);
  },
  removeRow: function(event) {
    this.model.destroy();
  }
});

// コレクション用のView
var TableFormView = Marionette.CompositeView.extend({
  template: '#tableForm-tmpl',
  childView: RowView,
  childViewContainer: '#tbodyContainer',
  initialize: function() {
    this.listenTo(this.collection, 'change', this.render);
  },
});
