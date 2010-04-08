# ===========================================================================
# Project:   Fotofoo
# Copyright: ©2010 Devin Torres
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore
config :fotofoo, :theme => :'sproutcore/sc_ace'

proxy '/_media/', :to => 'localhost:8080', :url => '/'
