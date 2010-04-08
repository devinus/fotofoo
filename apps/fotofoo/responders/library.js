// ==========================================================================
// Project:   Fotofoo.LIBRARY
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

Fotofoo.LIBRARY = SC.Responder.create({

  clipboard: null,
  _verticalScrollOffset: null,

  didBecomeFirstResponder: function() {
    Fotofoo.set('nowShowing', 'library');
    var responder = this;
    this.invokeLast(function(){
      var verticalScrollOffset = responder.get('_verticalScrollOffset');
      if (verticalScrollOffset) {
        Fotofoo.libraryView.set('verticalScrollOffset', verticalScrollOffset);
      }
    });
    return sc_super();
  },

  willLoseFirstResponder: function() {
    var verticalScrollOffset = Fotofoo.libraryView.get('verticalScrollOffset');
    this.set('_verticalScrollOffset', verticalScrollOffset);
  },

  newFolder: function() {
    return Fotofoo.foldersController.newFolder();
  },

  uploadDialog: function() {
    Fotofoo.set('state', 'UPLOAD');
    return YES;
  },

  cutFile: function() {
    var file = Fotofoo.fileController.get('content');
    if (file) {
      file.set('folder', null);
      this.set('clipboard', file);
    }
    return YES;
  },

  previewFile: function() {
    Fotofoo.set('state', 'PREVIEW');
    return YES
  }

});
