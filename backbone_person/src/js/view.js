var MyApp = MyApp || {};
// ViewModelを定義する。
MyApp.InputFormView = Backbone.View.extend({
  initialize: function(options) {
    this.model = options.model;
    this.personList = options.personList;
    this.listenTo(this.personList, 'edit', function(personRow) {
      this.model = personRow;
      this.render();
    });
  },
  events: {
    'submit #inputForm': 'submit'
  },
  render: function() {
    var template = $('#inputForm-tmpl').html();
    var compiled = _.template(template);
    var html = compiled(this.model.toJSON());
    this.$el.html(html);
    return this;
  },
  submit: function(event) {
    event.preventDefault(); // これでFORMのSUBMITでリロードが走らなくなる?
    var personId = this.$('#personId').val();
    var createMode = false;
    if (personId == '') {
      createMode = true;
      personId = this.personList.getMaxPersonId() + 1;
    }
    this.model.set({personId: personId});
    this.model.set({personName: this.$('#personName').val()});
    this.model.set({age: this.$('#age').val()});
    this.model.set({gender: this.$('#gender').val()});
    // モデルの追加（自動的に、IDが同じだったら更新、IDが違っていれば挿入される！）
    // クローンを入れないと、この先のクリア処理（set{personId: ''}）でpersonListの中までクリアされちゃう。
    this.personList.add(this.model.clone(), {merge: true});
    this.personList.trigger('update');

    if (createMode) {
      this.model.save(this.model.attributes, {
        type: 'POST',
        wait: false
      });
    } else {
      this.model.save(this.model.attributes, {
        type: 'PUT',
        wait: false
      });
    }
    this.model.set({personId: '', personName: '', age: '', gender: ''});
    this.render();
  }
});

// モデル用のView
MyApp.RowView = Backbone.View.extend({
  tagName: 'tr',
  initialize: function(options) {
    this.model = options.model;
  },
  events: {
    'click button[name="edit"]': 'editRow',
    'click button[name="delete"]': 'removeRow'
  },
  render: function() {
    var template = $('#row-tmpl').html();
    var compiled = _.template(template);
    var html = compiled(this.model.toJSON());
    this.$el.append(html);
    return this;
  },
  editRow: function(event) {
    this.model.collection.trigger('edit', this.model.clone());
  },
  removeRow: function(event) {
    this.model.collection.remove(this.model); // モデルの削除
    this.model.destroy({
      url: 'http://localhost:8080/rs_person_server/persons/remove',
      type: 'POST',
      data: JSON.stringify(this.model.attributes), // saveと同じようにtoJSON()にしたがNGだった
      contentType: 'application/json; charset=UTF-8',
      wait: false
    });
  }
});

// コレクション用のView
MyApp.TableFormView = Backbone.View.extend({
  initialize: function(options) {
    this.collection = options.collection;
    this.listenTo(this.collection, 'update', this.reRender);
    this.listenTo(this.collection, 'remove', this.reRender);
  },
  render: function() {
    var template = $('#tableForm-tmpl').html();
    this.$el.append(template);
    this.renderRow();
    return this;
  },
  renderRow: function() {
    var self = this;
    self.collection.each(function(personRow) {
      var rowView = new MyApp.RowView({
        model: personRow
      });
      self.$('#tbodyContainer').append(rowView.render().$el); // ループ処理の中ではthisの意味が変わってしまう模様
    });
  },
  reRender: function() {
    this.$el.empty();
    this.render();
  }
});
