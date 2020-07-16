---
title: 'How to secure wp-login.php with basic auth and avoid brute force attacks'
date: '2020-07-15'
---

## Apache
```sh
<Location /wp-login.php>
   <If "%{QUERY_STRING} !~ /action=logout/">
         Authname "Restricted"
         Authtype basic
         authuserfile "/etc/apache2/.htpasswd"
         require valid-user
   </If>
</Location>
```

## Nginx
```sh
    location = /wp-login.php {
        set $auth_basic "Restricted";

        if ($query_string ~* "(action=logout)") {
            set $auth_basic off;
        }

       auth_basic $auth_basic;
       auth_basic_user_file /etc/nginx/.htpasswd;
       include fastcgi_params;
       fastcgi_pass unix:/run/php/php7.2-fpm.sock;
       fastcgi_index index.php;
       fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }  
```
## User logout
In the examples above we prevent the server from asking for authentication when the users are logging out.
It's especially useful if you are running woocommerce or another plugin with front-end functionality for logged users.

### The htpasswd file
The password must be encoded by function mcrypt(3).

You can use a <a href="https://hostingcanada.org/htpasswd-generator/" target="_blank" rel="nofollow">Htpasswd generator</a> to generate the file content.

```sh
user:pass
```