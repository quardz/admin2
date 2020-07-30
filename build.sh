ng build --optimization=false --prod
cp /var/www/node/decent.press.admin/admin2/src/.htaccess /var/www/node/decent.press.admin/admin2/dist/admin2/
php /var/www/node/decent.press.admin/wpmysql2json.php > /var/www/node/decent.press.admin/admin2/dist/admin2/db.json

