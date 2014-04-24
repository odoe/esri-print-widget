/*global define, describe*/
/*jshint expr:true*/
define([
  'widgets/print/printdialog',
  'dojo/dom-class',
  'esri/tasks/PrintTemplate',
  'dijit/Dialog'
], function(
  Widget,
  domClass,
  PrintTemplate,
  Dialog
) {

  'use strict';

  var expect = chai.expect;

  describe(
    'widgets/print/printdialog', function() {

    var templateNames = ['MAP_ONLY', 'TEST_ONLY'];

    var options = {
      map: {
        spatialReference: 1234
      },
      templateNames: templateNames,
      printUrl: '/test/test',
      printParams: {}
    };

    var widget;

    beforeEach(function() {
      sinon.stub(Widget.prototype, '_initDialog').returns(function(){});
      sinon.stub(Widget.prototype, '_printSetup').returns(function(){});
      widget = new Widget(options);
      widget.dialog = {
        destroyRecursive: function(){},
        show: function(){}
      };
    });

    afterEach(function() {
      Widget.prototype._initDialog.restore();
      Widget.prototype._printSetup.restore();
      widget.destroy();
    });

    describe(
      '#constructor', function() {

      it('will assign the map from options', function() {
        expect(widget.map).to.eql(options.map);
      });

      it('will initialize the dialog', function() {
        expect(Widget.prototype._initDialog.calledOnce).to.be.ok;
      });

      it('will initialize print setup', function() {
        expect(Widget.prototype._printSetup.calledOnce).to.be.ok;
      });

    });

    describe('#destroy', function() {

      beforeEach(function() {
        sinon.stub(Widget.prototype, 'inherited');
        sinon.stub(widget.dialog, 'destroyRecursive');
        widget.destroy();
      });

      afterEach(function() {
        Widget.prototype.inherited.restore();
        widget.dialog.destroyRecursive.restore();
      });

      it('will call destroyRecursive of child dialog', function() {
        expect(widget.dialog.destroyRecursive.calledOnce).to.be.ok;
      });

      it('will call inherited(arguments) to clean up widget', function() {
        expect(Widget.prototype.inherited.calledOnce).to.be.ok;
      });

    });

    describe('#show', function() {

      beforeEach(function() {
        sinon.stub(widget.dialog, 'show');
        widget.show();
      });

      afterEach(function() {
        widget.dialog.show.restore();
      });

      it('will call show of child dialog', function() {
        expect(widget.dialog.show.calledOnce).to.be.ok;
      });

    });

    describe('#_printSetup', function() {

      beforeEach(function() {
        Widget.prototype._printSetup.restore();
        widget._printSetup();
      });
      afterEach(function() {
        sinon.stub(Widget.prototype, '_printSetup').returns(function(){});
      });

      it('will create a new PrintTask', function() {
        expect(widget._printTask).to.be.ok;
      });

      it('will set up a new print template', function() {
        expect(widget._printTemplate).to.be.instanceOf(PrintTemplate);
      });

      it('will ask for PDF prints', function() {
        expect(widget._printTemplate.format = 'PDF');
      });

    });

    describe('#_initDialog', function() {

      beforeEach(function() {
        Widget.prototype._initDialog.restore();
        widget._initDialog();
      });
      afterEach(function() {
        sinon.stub(Widget.prototype, '_initDialog').returns(function(){});
      });

      it('will create a new instance of dialog on widget', function() {
        expect(widget.dialog).to.be.instanceOf(Dialog);
      });

    });

    describe('#_printSelectedTemplate', function() {

      var result = {
        url: 'testurl'
      };

      beforeEach(function() {
        widget._printTask = {
          execute: function(params, callback){
            callback(result);
          }
        };
        widget._printTemplate = {};
        sinon.stub(domClass, 'remove');
        sinon.stub(domClass, 'add');
        sinon.stub(window, 'open');
        sinon.spy(widget._printTask, 'execute');
        widget._printSelectedTemplate('test');
      });
      afterEach(function() {
        widget._printTask.execute.restore();
        domClass.remove.restore();
        domClass.add.restore();
        window.open.restore();
      });

      it('will show the progress meter', function() {
        expect(domClass.remove.calledOnce).to.be.ok;
      });

      it('will assign given payout to print template', function() {
        expect(widget._printTemplate.layout).to.eql('test');
      });

      it('will execute the print task', function() {
        expect(widget._printTask.execute.calledOnce).to.be.ok;
      });

      it('will remove the progress meter', function() {
        expect(domClass.add.calledOnce).to.be.ok;
      });

    });

  });
});
