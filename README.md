Fotofoo - SproutCore foto foolery
=================================

## Installing
    $ git clone git://github.com/devinus/fotofoo.git
    $ cd fotofoo
    $ git submodule init
    $ git submodule update

## Running
    $ sudo port install GraphicsMagick # or apt-get
    $ git clone git://github.com/ry/node.git
    $ cd node
    $ ./configure
    $ make
    $ sudo make install
    $ cd /path/to/fotofoo
    # cd server
    $ node fotofoo.js

Then, in a new console:
    $ cd /path/to/fotofoo
    $ sc-server

## Viewing
Now navigate your web browser to `http://127.0.0.1:4020/fotofoo`

## TODO
- Dragging and dropping of folders (commented out for now)
- Deleting folders/files (already have this in an older internal revision)
- Warn when file by the same name already exists in destination folder
- More image manipulation features, such as cropping
