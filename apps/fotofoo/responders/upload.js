// ==========================================================================
// Project:   Fotofoo.UPLOAD
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

Fotofoo.UPLOAD = SC.Responder.create({

  uploadPane: null,

  didBecomeFirstResponder: function() {
    var $this = this;
    var uploadPane = $this.get('uploadPane');
    if (!uploadPane) {
      uploadPane = SC.PanelPane.create({
        layout: { width: 400, height: 200, centerX: 0, centerY: 0 },
        contentView: SC.View.design({
          layout: { top: 0, left: 0, bottom: 0, right: 0 },
          childViews: 'labelView upload cancelButton okButton'.w(),

          labelView: SC.LabelView.design({
            layout: { height: 24, top: 20, left: 0, right: 0 },
            textAlign: SC.ALIGN_CENTER,
            controlSize: SC.LARGE_CONTROL_SIZE,
            value: '_Choose an image to upload:'.loc(),
          }),

          upload: Fotofoo.UploadView.design({
            init: function() {
              Fotofoo.uploader = this;
              return sc_super();
            }
          }),

          cancelButton: SC.ButtonView.design({
            layout: { width: 80, left: 210, top: 160 },
            controlSize: SC.REGULAR_CONTROL_SIZE,
            title: '_Cancel'.loc(),
            isCancel: YES,
            isEnabled: YES,
            action: function() {
              Fotofoo.set('state', 'LIBRARY');
              return YES;
            }
          }),

          okButton: SC.ButtonView.design({
            layout: { width: 80, left: 300, top: 160 },
            controlSize: SC.REGULAR_CONTROL_SIZE,
            title: '_OK'.loc(),
            isDefault: YES,
            action: function() {
              Fotofoo.uploader.startUpload();
              Fotofoo.uploader.addObserver('status', Fotofoo.uploader, function() {
                if (this.get('status') === 'DONE') {
                  this.removeObserver('status', this, arguments.callee);
                  Fotofoo.set('state', 'LIBRARY');
                }
              });
              return YES;
            }
          })
        })
      });
      $this.set('uploadPane', uploadPane);
    }
    uploadPane.append();
    return YES;
  },

  willLoseFirstResponder: function() {
    var uploadPane = this.get('uploadPane');
    if (uploadPane) uploadPane.remove();
    if (Fotofoo.uploader) Fotofoo.uploader.clearFileUpload();
  },

  uploadComplete: function(sender, context) {
    var dataHash = JSON.parse(context.data);
    var newFile = Fotofoo.store.createRecord(Fotofoo.Folder, dataHash);
    Fotofoo.filesController.pushObject(newFile);
  }

});
