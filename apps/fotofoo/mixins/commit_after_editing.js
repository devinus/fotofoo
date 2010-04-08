// ==========================================================================
// Project:   Fotofoo.CommitAfterEditing
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Fotofoo */

/** @mixin */
Fotofoo.CommitAfterEditing = {

  inlineEditorClassName: '',
  _DIMENSIONS_HINT_RE: /^(.*) \(\d+x\d+\)$/,
  _FILENAME_EXT_RE: /^.*(\..*)$/,

  inlineEditorShouldBeginEditing: function(inlineEditor) { return YES; },

  inlineEditorWillBeginEditing: function(inlineEditor) {
    var value = inlineEditor.get('value');
    value = value.replace(this._DIMENSIONS_HINT_RE, '$1');
    inlineEditor.set('value', value);
  },

  inlineEditorDidBeginEditing: function(inlineEditor) {},

  inlineEditorShouldEndEditing: function(inlineEditor, finalValue) {
    return YES;
  },

  inlineEditorDidEndEditing: function(inlineEditor, finalValue) {
    var content = this.get('content');
    if (content) {
      var name = content.get('name'),
          value = Fotofoo.trim(finalValue);
      if (name && value && name != value) {
        var storeKey = content.get('storeKey'),
            recordType = SC.Store.recordTypeFor(storeKey),
            extMatch = this._FILENAME_EXT_RE.exec(name),
            ext = extMatch ? extMatch[1] : '';
        content.set('name', value+ext);
        content.commitRecord();
        if (recordType === Fotofoo.Folder) {
          content.addObserver('status', content, function() {
            var status = this.get('status');
            if (status && status & SC.Record.READY_CLEAN) {
              this.removeObserver('status', this, arguments.callee);
              content.refresh();
            }
          });
        }
      }
    }
  }

};
