Widgets
  title
  description
  setings definition
  component name
  component path
  component inputs (mostly through settings)
  Weight

Regions
  Name
  Description


Wr-Map (per them)
  widget
  region
  weight
  settings


List of default widgets
  Menu *-
  search * 
  recent post * 
  pages * 
  custom html *
  categories * 
  tags
  archives * 
  calender 


---
  Core will have essentail widgets

  Themes, modules will supply own Widgets
  Themes supply all the regions

--------------------------------------------------------------------------------

Themes   
  Themes database
  Can be installed via public URL 

Core will have themes
  
Theme fields
  Theme name
  theme Id (machine name)  
  version
  thumbnail
  Screenshoots : []
  preview link
  theme author
    Name
    Link
  description
  activate_status
  dependency (like min required core version etc)
  stats: {
    mostly 3rd party counts
  }
  theme_settings: {
    as form config
  }
  locations []
  widgets []
  default_widget: []
  extra_data: {}

cd /var/www/wptest
unzip latest.zip
rm -rf /var/www/wptest/first/wp-admin /var/www/wptest/first/wp-includes
cp -r /var/www/wptest/wordpress/wp-includes /var/www/wptest/first/
cp -r /var/www/wptest/wordpress/wp-admin /var/www/wptest/first/

