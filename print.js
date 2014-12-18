define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/on',
  'dojo/dom',
  'dojo/dom-construct',
  'dojo/Evented',
  'dijit/a11yclick',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'widgets/print/printdialog',
  'esri/request',
  'text!widgets/print/print.tpl.html'
], function(
  declare,
  lang, arrayUtil,
  on, dom, domConstruct, Evented,
  a11yclick,
  _WidgetBase, _TemplatedMixin,
  PrintDialog,
  esriRequest,
  template
) {

  function head(t) {
    return t[0];
  }

  function isTemplate(param) {
    return param.name === 'Layout_Template';
  }

  return declare([_WidgetBase, _TemplatedMixin, Evented], {

    templateString: template,

    options: {},

    printDialog: null,

    loaded: false,

    constructor: function(options) {
      this.options = options || {};

      // widget map
      this.map = this.options.map;

    },

    // start widget
    startup: function() {
      this._init();
    },

    postCreate: function() {
      // get the available print templates
      var elem = dom.byId('tools-menu');
      if (elem) {
        domConstruct.place(this.domNode, elem);
      }
      esriRequest({
        url: this.printUrl,
        content: {
          f: 'json'
        }
      }).then(lang.hitch(this, '_printTemplates'));

      this.own(
        on(this.printBtn, a11yclick, lang.hitch(this, '_printMap'))
      );
    },

    // cleanup
    destroy: function() {
      // default destroy
      this.printDialog.destroyRecursive();
      this.inherited(arguments);
    },

    // public methods

    // widget methods
    _printMap: function(e) {
      e.preventDefault();
      this.printDialog.show();
    },

    // private functions
    _init: function() {
      this.set('loaded', true);
      this.emit('loaded', {});
    },

    _printTemplates: function(response) {
      // build the menu that will have templates
      var layoutTemplate;
      layoutTemplate = head(arrayUtil.filter(response.parameters, isTemplate));

      this.printDialog = new PrintDialog({
        map: this.map,
        printUrl: this.printUrl,
        printParams: this.printParams,
        templateNames: layoutTemplate.choiceList
      });

    }

  });

});
