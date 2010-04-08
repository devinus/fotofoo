// ==========================================================================
// Project:   Fotofoo.FileNameValidator
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

Fotofoo.FileNameValidator = SC.Validator.extend(
  /** @scope Fotofoo.FileNameValidator.prototype */ {

  _alertPaneDidDismiss: YES,
  _ALL_WHITESPACE_RE: /^\s*$/,
  _INVALID_FILENAME_RE: /^.*[\/\:*?"<>|\0]+.*$/,

  validateCommit: function(value, field) {
    if (!value) return SC.Error.create();
    if (this._ALL_WHITESPACE_RE.test(value)) return SC.Error.create();
    if (!this.get('_alertPaneDidDismiss')) return value;
    if (this._INVALID_FILENAME_RE.test(value)) {
      this.set('_alertPaneDidDismiss', NO);
      SC.AlertPane.error(
        '_Invalid File Name'.loc(),
        '_You cannot name a file containing a disallowed character.'.loc(), 
        '_Disallowed characters: / \\ : * ? " < > |'.loc(),
        '_OK'.loc(), null, null, this
      );
      return SC.Error.create();
    }
    return value;
  },

  alertPaneDidDismiss: function() {
    this.set('_alertPaneDidDismiss', YES);
  }

});
