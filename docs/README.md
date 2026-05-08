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

#### Higher Priority

- packaging: JS lib that you point at the div that should become the filterable list of items
    - [x] split into files
    - [ ] specify a page element that everything gets built into
    - [ ] trim up the CSS to let the page specify the font and maybe colours?
        - [ ] default to some nice grey and white, support colours in config?
- filtering
    - [x] OR between options within a single dimension, AND between dimensions
    - [ ] show active filters, have a "x' button to remove that filter
    - [ ] cap at 200 items (or config supplied cap; maybe "show all" button?)
    - [ ] string search
        - [ ] allow "hide from search" fields config
- [ ] mobile layout
- [ ] include support for icons (just get a name from the Material Icon font)
    - [ ] if there's a URL, do that when the icon is clicked
        - [ ] this will require a mod of Pauline's python
    - [ ] support icon field specifying the URL field for clicks ("url" or "URL" field is the default)
    - [ ] support icon field specifying the caption field for showing text next to the icon ("iconcaption" is the default)
- [x] "quiet" fields (to go with Header and Normal) that are in an additional disclosure area
- [ ] config file
    - [x] create config file  
    - [x] include json data filename
    - [x] quiet field show/hide config
    - [ ] include contact info for support

#### Lower Priority

- [ ] defaults for when no fields are nominated as headers
- [ ] range for numeric field
- [ ] sorting options
- [ ] open all / close all result discosure / show details
- [ ] optional icon feature; on hover, or something, offer a button to copy the link


