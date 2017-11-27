<img align="right" src="https://raw.githubusercontent.com/gustafekeberg/html-element-remover/master/assets/icon-128.png">

# HTML-element remover

A browser extension to hide or delete html elements. The extension will add context menu items depending on the config.

- Git clone and then: `npm install`
- Build: `npm run build`

This extension should work fine in Firefox, Chrome, Edge or any other browser that supports the [WebExtensions APIs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

## Config

When the extension is installed it needs to be configured. At the moment the configuration is written as JSON in a textarea.

Configuring the extension can be tricky. It will not work if the JSON data is not valid. This is an area of improvement.

- The `items = array` will be shown in a context menu when right clicking on the document body.
- Each `item` can perform different tasks.
- The `name = string` will be displayed as the context menu item.
- The `query = array` is the defined task to perform on the document body. Multiple queries can be configured on each item.
  - `delete = boolean` - if set to true the matched element will be removed from the document, otherwise it will be hidden via CSS
  - `action = string` - what to do after performed action `(print|savePDF)`
  - `selector = string` - the CSS selector to match
  - `innerText = string` - only match if the selected element has this inner text
  - `innerHTML = string` - only match if the selected element has this inner HTML

## Example config

```JSON
{
  "items": [{
      "name": "Select all <p> with 'innerText' sample text and delete from document",
      "action": "print",
      "query": [{
          "delete": true,
          "selector": "p",
          "innerText": "Sample text",
        },
        {
          "delete": true,
          "selector": "p",
          "innerHTML": "<b>HTML</b>"
        }
      ]
    },
    {
      "name": "Select css-class named 'css-class' and hide it from the document",
      "query": [{
        "selector": ".css-class"
      }]
    }
  ]
}
```
