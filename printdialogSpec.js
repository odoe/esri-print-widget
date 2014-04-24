/*global define, describe*/
define([
  'widgets/print/printdialog'
], function(
  Widget
) {

  'use strict';

  var expect = chai.expect;

  describe(
    'widgets/print/printdialog', function() {

    var templateNames = [1,2,3];

    var options = {
      map: {
        spatialReference: 1234
      },
      templateNames: templateNames
    };

    var widget;

    beforeEach(function() {
      sinon.stub(Widget.prototype, '_initDialog').returns(function(){});
      sinon.stub(Widget.prototype, '_printSetup').returns(function(){});
      widget = new Widget(options);
      widget.dialog = {
        destroyRecursive: function(){},
        show: function(){}
      }
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

  });
});
