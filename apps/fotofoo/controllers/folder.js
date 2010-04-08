// ==========================================================================
// Project:   Fotofoo.folderController
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Fotofoo.folderController = SC.ObjectController.create(
/** @scope Fotofoo.folderController.prototype */ {

  contentBinding: SC.Binding.from('Fotofoo.foldersController.selection').single()

}) ;
