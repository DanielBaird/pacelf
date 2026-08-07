# JCU Digital Library Catalog

This is a _plain ol' javascript_ tool to filter items in a JSON list. James Cook University uses it to access and search digital collections.

---

## Setup

A minimum setup includes three `jcudl` files and your JSON library data file.
- `jcudl.js` is the core Javascript file that does most of the work
- `jcudl-style.css` is the CSS required by jcudl
- `jcudl-config.json` is the configuration for jcudl. Soon this will become optional but for now it's required
- `jcudl-data.json` is the default name for your library data (you can set a different filename in `jcudl-config.json`). It should contain an array of objects, each object is a catalogued item with whatever metadata your items need

#### Locate files

- put `jcudl.js` and `jcudl-style.css` anywhere on your web server. The examples here assume you have stored them right next to your page's html file, but you can adjust the path to suit.
- put `jcudl-config.json` next to your page's html file. Unlike other files it MUST be stored in the same directory as your html
- put `jcudl-data.json` alongside your html file, or if you are specifying a path in the config you can put it anywhere you like

#### Setup your web page

- include `jcudl-style.css` and the icon font stylesheet in your page by adding these lines to your `<head>` tag. If you saved the CSS file alongside your page's html, that will look like this:
```html
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    <link rel="stylesheet" href="./jcudl-style.css" />
```
- include `jcudl.js` in your page by adding this tag at the bottom of your page, right before the closing `</body>` tag. If you saved the JS file alongside your page's html, that will look like this:
```html
    <script src="./jcudl.js"></script>
```
- include a div (or other block element) in your page with an id of `jcudl-catalog` wherever you want the catalog to show up:
```html
        <div id="jcudl-catalog">
            <!-- jcudl catalog goes here -->
        </div>        
```

---

## Colours

Here are the CSS variable names for the colours used by JCUDLC, along with the defaults that will be used if you don't specify it yourself.

```
--jcudl-filter-bg, #111
--jcudl-filter-item, #222
--jcudl-filter-active, #333
--jcudl-filter-highlight, #000
--jcudl-filter-text, #ddd

--jcudl-data-bg, #bbb
--jcudl-data-item, #fff
--jcudl-data-active, #eee
--jcudl-data-highlight, #ffffec
--jcudl-data-text, #111

--jcudl-message-bg, #ecf6ff
--jcudl-message-good-text, #037
--jcudl-message-bg, #fee
--jcudl-message-bad-text, #700

--jcudl-interface-bg, var(--filter-item)
--jcudl-interface-text, var(--filter-text)
--jcudl-interface-bg, var(--data-active)
--jcudl-interface-text, var(--data-text)
```

---

## Running locally

You can open your HTML file right in your browser but pages loaded from a `file://` URL will come with browser security restrictions on loading JSON. So I recommend using a file server like `caddy`.

```bash
    brew install caddy
```

...or visit https://caddyserver.com/docs/install to find an installion method for your platform.

Once you have caddy installed, run

```bash
    caddy file-server
```

to run a http server at http://localhost, or run

```bash
    caddy file-server --domain localhost
```

to run a **https** server at https://localhost. The first time you run this you will have to become an admin and enter your password a couple of times so caddy can install certificates etc.

---

## Todo


#### Changes to data file

- [ ] URL to follow when icon clicked: requires a mod of Pauline's python

#### Higher Priority

- field types
    - [ ] URL looking fields (URL, Link, website, email) that renders a clicky-link
- filtering
    - [x] AND between all options
    - [x] show active filters
    - [x] active filters have an "x" button to remove that filter
    - [x] cap at 200 items (or config supplied cap)
    - [ ] string search
        - [x] support string searches as a filter type
        - [ ] allow "hide from search" fields config
    - [ ] for each filter item, show result count for that additional filter
- [ ] mobile layout
- [ ] config file
    - [x] create config file
    - [x] include json data filename
    - [x] quiet field show/hide config
    - [x] include contact info for support
- [ ] thorough documentation

#### Lower Priority

- [ ] fix message backgrounds (good and bad messages don't have separately customisable bgs)
- [ ] range for numeric field
- [ ] sorting options
- [ ] open all / close all result discosure / show details
- [ ] optional icon feature; on hover, or something, offer a button to copy the link
- [ ] "show all" button to see every item instead of the cap
- [ ] make popup-on-icon-hover text a bit larger than browser default 

#### Complete

- [x] defaults for when no fields are nominated as headers
- [x] packaging: JS lib that you point at the div that should become the filterable list of items
    - [x] split into files
    - [x] specify a page element that everything gets built into
    - [x] trim up the CSS to let the page specify the font and maybe colours
        - [x] default to some nice grey and white, support colours in config
            - [x] allow config to specify CSS vars
- message display refactor
    - [x] existing "message" is too big for general display / list header / etc
    - [x] remember to include support info as specified by config
    - [x] background activity indicator
- [x] include support for icons (just get a name from the Material Icon font)
    - [x] if there's a URL, do that when the icon is clicked
    - [x] support icon field specifying the URL field for clicks ("url" or "URL" field is the default)
    - [x] support specifying a field to supply a pop-up tooltip for the icon ("iconTooltip" is the default)


