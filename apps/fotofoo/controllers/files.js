// ==========================================================================
// Project:   Fotofoo.filesController
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

Fotofoo.MAX_THUMBNAIL_SIZE = 250;

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Fotofoo.filesController = SC.ArrayController.create(
/** @scope Fotofoo.filesController.prototype */ {

  contentBinding: 'Fotofoo.folderController.files'

}) ;
