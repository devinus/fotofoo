// ==========================================================================
// Project:   Fotofoo.InlineTextFieldView
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your View Here)

  @extends SC.InlineTextFieldView
*/
Fotofoo.InlineTextFieldView = SC.InlineTextFieldView.extend(
/** @scope Fotofoo.InlineTextFieldView.prototype */ {

  commitEditing: function() {
    // try to validate field.  If it fails, return false.  
    var value = this.getValidatedValueFromFieldValue(NO);
    if (SC.typeOf(value) === SC.T_ERROR) this.discardEditing();
    return this._endEditing(value) ;
  },

  didLoseKeyResponderTo: function(keyView) {
    var el = this.$input[0];
    if (el) el.blur();
  }

});
