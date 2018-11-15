# aCKolor

Angular color picker that accepts/stores rgb, rgba, hex, hsl, and transparent color values.

## Install

* * *

`bower install ackolor`

**Add to your app**

`angular.module('app’, ['aCKolor’])`

[Live demo](http://ackolor/cklsylabs.com/)

## Directives

* * *

### Input

The a-ckolor directive creates an input that will be bound to the color string(via ngModel). By default, it’s a hidden input, but can be defined using the `type` attribute. The input is wrapped in an element (’.c-ckolor__input-wrapper’) that when clicked, opens up the color wheel.

**Markup:**

```html
<a-ckolor model="app.color" element-id="'an_id'" input-id="'an_input_id'" name="'an-input-name'" type="'hidden'" blur="false" default-color="'#a10005'"></a-ckolor>
  ```

**Attributes**

`model` - Required. The scope model.

`type` - Optional. Set the directive’s input type attribute. If omitted, it defaults to hidden.

`element-id` - Optional. Sets the input’s wrapper, .c-ckolor__input-wrapper, id. This is useful if you plan on targeting the whole element with css or javascript.

`input-id` - Optional. Set the input id.

`name` - Optional. Set the directive’s input name attribute.

`blur` - Optional. Enable or disable the css blur filter behind the overlay. Enabled by default.

`default-color` - Optional. If the initial value is not a valid color string(transparent, inherit, null, etc), this can be used to set a default when the color wheel is opened. Be sure to wrap in single quotes, i.e. `default-color="'#a10005'"`.

* * *

### Color wheel

Contains the color wheel markup and is automatically compiled in the body element when an input is clicked.

**Markup:**

  ```html
  <a-ckolor-wheel></a-ckolor-wheel>
  ```

## Factory

* * *

### Properties:

`alpha : INT` - The alpha value of RGB and HSL colors.

`ckoloring : BOOL` - Flag that determines if the color wheel is open or not.

`display : STRING` - Color mode that is displayed, auto selected by model’s color mode and changed by the dropdown selection.

`inputHsl : {h:FLOAT, s:FLOAT, l:FLOAT}` - HSL number input values - hue, saturation, lightness.

`hex : STRING` - Hex input value.

`hsl : {h:FLOAT, s:FLOAT, l:FLOAT}` - HSL values. The factory converts the model to HSL then sets the other types. Used on the color wheel and saturation slider.

`hues : [INT]` - 36 values of hue degrees used on the color wheel background.

`model : SCOPE` - The given color value.

`modelId : STRING` - The id of the given model. When there are multiple color pickers, this is used by the directives to determine which model is currently being worked on so they aren’t all updated.

`originalFormat : STRING` - The original format of the model. HSL, Hex, or RGB.

`previousColors : ARRAY` - Previously selected colors. Stored in localStorage.

`rgb : {r:INT, g:INT, b:INT}` - RGB input value. Red, Green, Blue.

`circleWidth : INT` - The width of the color wheel

* * *

### Methods:

`init ({"model":SCOPE, "modelId":STRING})` - Called from the input directive to initialize the color wheel with it’s values.

`save` - Updates the model and turns the color wheel off.

`toggleCKoloring` - Toggles the color wheel off.

`updateColorDisplay (STRING | 'hex', 'hsl', 'rgb')` - Updates the color wheel display to the given parameter.

`updateHSL` - Convert other color models from the hsl property when this is called.

`updateRGB` - Convert other color models from the rgb property when this is called.

`updateHEX` - Convert other color models from the hex property when this is called.

`hueLightFromRadial (MOUSE EVENT)` - Get HSL from a point on color wheel.

`radialXY` - Set scoop position based on HSL values.

`convertTo` - Convert any color string to HSL and sets the originalFormat property.

`hexToRgb` - Convert hex to rgb.

`rgbToHsl` - Convert rgb to hsl.

`hslToRgb` - Convert hsl to rgb.

`intToHex` - Convert a rgb integer to a hex value.

`rgbToHex` - Convert rgb to hex.

`previousColorClick` - Sets the color to a previously stored color.
