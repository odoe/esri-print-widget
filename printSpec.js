/*jshint expr:true*/
define([
  'widgets/print/print'
], function(
  Widget
) {

   describe(
    'widgets/print/print',
    function() {

      var expect = chai.expect;
      var options = {
        map: {},
        printUrl: '/gis/api/test'
      };

      var widget;
      var server;

      beforeEach(function() {
        server = sinon.fakeServer.create();
        server.respondWith("GET", "/gis/api/test?f=json", [
          200,
          {"Content-Type": "application/json"},
          '{"parameters": [ { name: "Layout_Template", choiceList: [1,2,3] } ]}'
        ]);
        sinon.stub(Widget.prototype, 'own').returns(function() {});
        sinon.spy(Widget.prototype, '_printTemplates');//.returns(function(){});
        widget = new Widget(options);
        widget.printDialog = {
          destroyRecursive: function(){}
        };
        sinon.stub(widget.printDialog, 'destroyRecursive').returns(function(){});
        widget.postCreate();
        server.respond();
      });

      afterEach(function() {
        widget.destroy();
        server.restore();
        widget.printDialog.destroyRecursive.restore();
        Widget.prototype.own.restore();
        Widget.prototype._printTemplates.restore();
      });

      describe(
        '#postCreate',
        function() {

          it('will call own for an event', function() {
            expect(widget.own.called).to.be.ok;
          });

          it('will call _printTemplates when esriRequest done', function() {
            expect(widget._printTemplates.called).to.be.ok;
          });

        }
      );

      describe(
        '#startup',
        function() {

          it(
            'will set loaded to true when startup complete',
            function() {
              widget.startup();
              expect(widget.loaded).to.be.true;
            }
          );

          it('will emit a loaded event', function(done) {
            widget.on('loaded', function(data) {
              expect(data).to.be.ok;
              done();
            });
            widget.startup();
          });

        }
      );

      describe(
        '#destroy',
        function() {

          it('will destroy the child printdialog', function() {
            widget.destroy();
            expect(widget.printDialog.destroyRecursive.called).to.be.ok;
          });

        }
      );

      describe(
        '#_printMap',
        function() {

          var e = { preventDefault: function() {} };

          beforeEach(function() {
            widget.printDialog.show = function(){};
            sinon.spy(widget.printDialog, 'show');
            sinon.spy(e, 'preventDefault');
          });

          afterEach(function() {
            widget.printDialog.show.restore();
            e.preventDefault.restore();
          });

          it('will show dialog when asked to print map', function() {
            widget._printMap(e);
            expect(e.preventDefault.called).to.be.ok;
            expect(widget.printDialog.show.called).to.be.ok;
          });

        }
      );

    });

});




