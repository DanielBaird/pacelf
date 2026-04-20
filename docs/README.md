# POJS rewrite (plain old javascript)

This is a re-write of the PacELF document library browser in plain old javascript, with the intention to produce a site with minimal update requirements.

### Running POJS

You can open the index.html file right in your browser but pages loaded from a `file://` URL will come with browser security restrictions on loading JSON. So I recommend using a file server like `caddy`.

    brew install caddy

...or visit https://caddyserver.com/docs/install to find an installion method for your platform.

Once you have caddy installed, run

    caddy file-server

to run a http server at http://localhost, or run

    caddy file-server --domain localhost

to run a **https** server at https://localhost. The first time you run this you will have to become an admin and enter your password a couple of times so caddy can install certificates etc.



