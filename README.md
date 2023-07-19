# Fa components
[![pre-release](https://github.com/ProductionPanic/fa-components/actions/workflows/main.yml/badge.svg)](https://github.com/ProductionPanic/fa-components/actions/workflows/main.yml)

A collection of handy web components made by [Me](https://github.com/Freekiehsoes)

## disclaimer

This is still very much a work in progress, so expect breaking changes, and or bugs.

## Installation

```bash
npm i @freek.attema/fa-components
```

## Usage

```js
// include the js file any way you like and you're good to go
import '@freek.attema/fa-components/dist/fa-typewriter.js';

// each component has its own files, so you can also import them individually or all at once like so:
import '@freek.attema/fa-components/dist/all.js';
```

## Components

### fa-typewriter

A typewriter effect, that can be used to animate text.

#### Usage

```html
<fa-typewriter
    delay="100"
    interval="10"
>
    <h1>Typewriter effect</h1>
    <p>Some text</p>
</fa-typewriter>
```

It also supports deep nesting, so you can use it like so:

```html
<fa-typewriter>
    <div> im a div with a <section>section and the section has a <h1>header</h1></section> in it </div>
</fa-typewriter>
```

when the inner content is changed, the animation will automatically restart with the new content.

#### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| delay | Number | 100 | The delay in ms before the animation starts |
| interval | Number | 10 | The interval in ms between each character |

#### Styling

When styling is applied to the `fa-typewriter` element, it will be applied to the children as well.

### fa-slider

A slider component, that can be used to slide through a collection of elements.
