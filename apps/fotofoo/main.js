// ==========================================================================
// Project:   Fotofoo
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
function main() {
  document.title = 'Fotofoo Library';
  Fotofoo.getPath('mainPage.mainPane').append() ;
  Fotofoo.set('rootFolder', Fotofoo.store.find(Fotofoo.Folder, '/'));
  Fotofoo.foldersController.set('content', SC.Object.extend({
    treeItemIsExpanded: YES,

    treeItemChildren: function() {
      return [SC.Object.create({
        name: '_Library'.loc(),

        treeItemIsExpanded: YES,

        treeItemChildren: function() {
          return Fotofoo.getPath('rootFolder.childFolders');
        }.property('Fotofoo*rootFolder.childFolders').cacheable()
      })];
    }.cacheable()
  }).create());
  Fotofoo.set('state', 'LIBRARY');
};
