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

### Todo

- open all / close all result discosure / show details
- filtering
    - OR between options within a single dimension, AND between dimensions
    - show active filters, have a "x' button to remove that filter
    - cap at 200 items (or config supplied cap; maybe "show all" button?)
    - string search
        - allow "hide from search" fields config
- mobile layout
- include support for icons (just get a name from the Material Icon font)
    - if there's a URL, do that when the icon is clicked
        - this will require a mod of Pauline's python
    - support icon field specifying the URL field for clicks ("url" or "URL" field is the default)
    - support icon field specifying the caption field for showing text next to the icon ("iconcaption" is the default)
- "quiet" fields (to go with Header and Normal) that are in an additional disclosure area
- config file
    - include json data filename
    - include contact info for support
- range for numeric field



