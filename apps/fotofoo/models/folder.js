// ==========================================================================
// Project:   Fotofoo.Folder
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Fotofoo.Folder = SC.Record.extend(
/** @scope Fotofoo.Folder.prototype */ {

  treeItemIsExpanded: NO,

  guid: SC.Record.attr(String, { isRequired: YES }),
  type: SC.Record.attr(String, { defaultValue: 'Folder', isRequired: YES }),
  name: SC.Record.attr(String, { defaultValue: 'untitled folder', isRequired: NO }),
  parentFolder: SC.Record.toOne('Fotofoo.Folder', { inverse: 'childFolders' }),
  childFolders: SC.Record.toMany('Fotofoo.Folder', { inverse: 'parentFolder' }),
  files: SC.Record.toMany('Fotofoo.File', { inverse: 'folder' }),

  icon: function() {
    var isTrash = this.get('name') === '_Trash'.loc();
    return isTrash ? 'sc-icon-trash-16' : 'sc-icon-folder-16';
  }.property('name'),

  treeItemChildren: function() {
    return this.get('childFolders');
  }.property('childFolders').cacheable(),

  isTrash: function() {
    return this.get('guid') === 'Trash';
  }.property('guid').cacheable(),

  hasFiles: function() {
    var files = this.get('files');
    return files && files.get('length') > 0;
  }.property('files').cacheable()

}) ;
