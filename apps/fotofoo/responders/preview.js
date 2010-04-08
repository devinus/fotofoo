// ==========================================================================
// Project:   Fotofoo.PREVIEW
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

Fotofoo.PREVIEW = SC.Responder.create({

  sliderValue: 100,

  didBecomeFirstResponder: function() {
    Fotofoo.set('nowShowing', 'preview');
  },

  willLoseFirstResponder: function() {
    this.set('sliderValue', 100);
  },

  newFolder: function() {
    Fotofoo.set('state', 'LIBRARY');
    return Fotofoo.foldersController.newFolder();
  },

  uploadDialog: function() {
    Fotofoo.set('state', 'UPLOAD');
    return YES;
  },

  sliderValueDidChange: function() {
    var sliderValue = this.get('sliderValue'),
        file = Fotofoo.fileController.get('content'),
        originalWidth = file.get('width'),
        originalHeight = file.get('height');
    Fotofoo.touchUpPreview.imageView.adjust({
      width: Math.floor((originalWidth * sliderValue) / 100),
      height: Math.floor((originalHeight * sliderValue) / 100)
    }).updateLayout();
  }.observes('sliderValue'),

  saveDimensions: function() {
    var file = Fotofoo.fileController.get('content'),
        layout = Fotofoo.touchUpPreview.imageView.get('layout');
    if (file && layout) {
      file.set('width', Math.floor(layout.width));
      file.set('height', Math.floor(layout.height));
      file.commitRecord();
      file.addObserver('status', file, function() {
        var status = this.get('status');
        if (status && status & SC.Record.READY_CLEAN) {
          this.removeObserver('status', this, arguments.callee);
          Fotofoo.set('state', 'LIBRARY');
        }
      });
    }
    return YES;
  }

});
