// ==========================================================================
// Project:   Fotofoo.fileController
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Fotofoo.fileController = SC.ObjectController.create(
/** @scope Fotofoo.fileController.prototype */ {

  contentBinding: SC.Binding.from('Fotofoo.filesController.selection').single()

}) ;
