/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dijit/Dialog',
  'dijit/form/Form',
  'dijit/form/DropDownButton',
  'dijit/MenuItem',
  'dijit/PopupMenuBarItem',
  'dijit/DropDownMenu',
  'dojo/dom-construct',
  'dojo/dom-class',
  'esri/tasks/PrintTask',
  'esri/tasks/PrintParameters',
  'esri/tasks/PrintTemplate'
], function(
  declare,
  lang, arrayUtil,
  Dialog, Form, DropDownButton, MenuItem, PopupMenuBarItem, DropDownMenu,
  domConstruct, domClass,
  PrintTask, PrintParameters, PrintTemplate
) {

  return declare([], {

    options: {},

    map: null,

    dialog: null,

    _progressNode: null,

    _printTask: null,

    _printTemplate: null,

    constructor: function(options) {
      if (!options.templateNames) {
        throw new Error('Options must include list of templates');
      }
      // mix in settings and defaults
      declare.safeMixin(this.options, options);

      this.map = this.options.map;

      this._initDialog();

      this._printSetup();

    },

    // cleanup
    destroy: function() {
      // default destroy
      this.dialog.destroyRecursive();
      this.inherited(arguments);
    },

    // public methods
    show: function() {
      this.dialog.show();
    },

    // private methods
    _printSelectedTemplate: function(layout) {
      domClass.remove(this._progressNode, 'hidden-node');
      var pparams = new PrintParameters();
      this._printTemplate.layout = layout;

      pparams.map = this.map;
      pparams.template = this._printTemplate;
      pparams.outSpatialReference = this.map.spatialReference;

      this._printTask.execute(pparams, lang.hitch(this, function(result) {
        domClass.add(this._progressNode, 'hidden-node');
        window.open(result.url);
      }), lang.hitch(this, function(err) {
        domClass.add(this._progressNode, 'hidden-node');
        console.warn('error printing:', err);
      }));
    },

    _printSetup: function() {
      this._printTask = new PrintTask(
        this.options.printUrl, this.options.printParams
      );
      this._printTemplate = new PrintTemplate();
      this._printTemplate.format = 'PDF';
    },

    _initDialog: function() {
      // build the menu that will have templates
      var menu, form;
      menu = new DropDownMenu({ style: 'display: none;' });
      form = new Form();

      arrayUtil.forEach(this.options.templateNames, function(name) {
        menu.addChild(new MenuItem({
          label: name,
          onClick: lang.hitch(this, function() {
            this._printSelectedTemplate(name);
          })
        }));
      }, this);

      new DropDownButton({
        label: 'Choose a template',
        name: 'ddbutton',
        dropDown: menu,
        id: 'ddbutton'
      }).placeAt(form.containerNode);

      this._progressNode = domConstruct.create('div');
      domClass.add(this._progressNode, 'progress-spin');
      domClass.add(this._progressNode, 'hidden-node');
      domConstruct.place(this._progressNode, form.containerNode);

      this.dialog = new Dialog({
        title: 'Export to PDF',
        content: form,
        style: 'width: 200px;'
      });

      form.startup();

    }

  });

});

