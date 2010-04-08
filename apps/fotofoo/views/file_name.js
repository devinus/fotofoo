// ==========================================================================
// Project:   Fotofoo.FileName
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Fotofoo */

require('mixins/commit_after_editing');
require('views/inline_text_field');

/** @class

  (Document Your View Here)

  @extends SC.LabelView
*/
Fotofoo.FileName = SC.LabelView.extend(
  Fotofoo.CommitAfterEditing,
/** @scope Fotofoo.FileName.prototype */ {

  isEditable: YES,
  validator: Fotofoo.FileNameValidator,
  exampleInlineTextFieldView: Fotofoo.InlineTextFieldView

});
