# React Progressive Graceful Image


**Note:** I published this [interesting article on medium](https://medium.com/@sanishkr/react-progressive-graceful-image-c7a45b577f5f) to explain the idea and motivation behind building this npm package. And a small [code snippet](https://gist.github.com/sanishkr/7f520f227989133a779eb49726bc77cb) to make best use of it.

**Update**
- [0.7.0] : Allow ^v18 of `react` and `react-dom` as peer dependencies, add + fix props types.
- [0.6.14] : Allow ^v17 of `react` and `react-dom` as peer dependencies.
- [0.6.13] : `onError` bug-fix to works as expected.

***

**Note**: This is a forked repo from https://github.com/FormidableLabs/react-progressive-image. So, all usage are similar to that. 

I am adding two new features:
 - Graceful loading 
 - Lazy loading

similar to https://github.com/linasmnew/react-graceful-image, but with a different approach(for better performance and optimization). So, please check usage of 4 newly introduced props (noRetry, noLazyLoad, rootMargin, threshold) from the props table below.

#### [TODO] : 
- [x] Use of Intersection Observer for Lazy Loading (Better Performance)
- [x] Use of navigator.onLine in place of current retry strategy (Optimization)
- [x] Introduce `rootMargin` and `threshold` props for Intersection Observer options.
- [x] Add more Code Sandbox example links
- [x] Remove `ref` from child function.
- [ ] Remove dependency of `@researchgate/react-intersection-observer`

**Note:** `npm i intersection-observer`, if polyfill is required, I have removed it to keep the library lightweight.
***

[![Maintenance Status][maintenance-image]](#maintenance-status)

[`react-progressive-graceful-image`](https://www.npmjs.com/package/react-progressive-graceful-image) React component for progressive image loading

### Install

```bash
$ npm i react-progressive-graceful-image
```

### Examples

#### Simple - [CodeSandbox](https://codesandbox.io/s/react-progressive-graceful-image-simple-example-x8zhz)

```jsx
<ProgressiveImage src="large-image.jpg" placeholder="tiny-image.jpg">
  {(src) => <img src={src} alt="an image" />}
</ProgressiveImage>
```

#### With Delay - [CodeSandbox](https://codesandbox.io/s/react-progressive-graceful-image-with-delay-y0vfp)

```jsx
<ProgressiveImage
  delay={3000}
  src="large-image.jpg"
  placeholder="tiny-image.jpg"
>
  {(src) => <img src={src} alt="an image" />}
</ProgressiveImage>
```

#### With loading argument - [CodeSandbox](https://codesandbox.io/s/react-progressive-graceful-image-with-loading-argument-u6mj1)

```jsx
<ProgressiveImage src="large-image.jpg" placeholder="tiny-image.jpg">
  {(src, loading) => (
    <img style={{ opacity: loading ? 0.5 : 1 }} src={src} alt="an image" />
  )}
</ProgressiveImage>
```

#### With srcSet - [CodeSandbox](https://codesandbox.io/s/react-progressive-graceful-image-with-srcset-o1dod)

```jsx
<ProgressiveImage
  src="medium.jpg"
  srcSetData={{
    srcSet: 'small.jpg 320w, medium.jpg 700w, large.jpg 2000w',
    sizes: '(max-width: 2000px) 100vw, 2000px'
  }}
  placeholder="tiny-image.jpg"
>
  {(src, loading, srcSetData) => (
    <img
      src={src}
      srcSet={srcSetData.srcSet}
      sizes={srcSetData.sizes}
      alt="an image"
    />
  )}
</ProgressiveImage>
```

#### With Intersection Observer Options - [CodeSandbox](https://codesandbox.io/s/react-progressive-graceful-image-with-intersection-observer-options-sjl25)

```jsx
<ProgressiveImage
  delay={3000}
  src="large-image.jpg"
  placeholder="tiny-image.jpg"
  rootMargin="0% 0% 0%"
  threshold={[1]}
>
  {(src) => <img src={src} alt="an image" />}
</ProgressiveImage>
```

#### Component As Placeholder - [CodeSandbox](https://codesandbox.io/s/react-progressive-graceful-image-component-as-placeholder-wuz48)

If you want to use a component, such as a loading spinner, as a placeholder, you can make use of the `loading` argument in the render callback. It will be true while the main image is loading and false once it has fully loaded. Keep in mind that the `placeholder` props is `required`, so you will need to explicitly declare an empty string as it's value if you plan on using a component in the render callback.

```jsx
const dominantImageColor = '#86356B';
const placeholder = (
  <div
    style={{ backgroundColor: dominantImageColor, height: 300, width: 500 }}
  />
);

<ProgressiveImage src="large-image.jpg" placeholder="" >
  {(src, loading) => {
    return loading ? placeholder : <img src={src} alt="an image" />;
  }}
</ProgressiveImage>;
```

#### Progressive Enhancement and No JavaScript

Since this component relies on JavaScript to replace the placeholder src with the full image src, you should use a fallback image if your application supports environments that do not have JavaScript enabled or is progressively enhanced.

You can do this by adding the fallback image inside of a `<noscript>` tag in the render callback you provide as the `ProgressiveImage` component's child.

```jsx
<ProgressiveImage src="large-image.jpg" placeholder="tiny-image.jpg" >
  {(src) => {
    return (
      <div>
        <img className="progressive-image" src={src} />
        <noscript>
          <img className="progressive-image no-script" src="large-image.jpg" />
        </noscript>
      </div>
    );
  }}
</ProgressiveImage>
```

### Props

| Name        | Type                                   | Required | Description                                              |
| ----------- | -------------------------------------- | -------- | ---------------------------------------------------------|
| children    | `function`                             | `true`   | returns `src`, `loading`, and `srcSetData`        |
| delay       | `number`                               | `false`  | time in milliseconds before src image is loaded          |
| onError     | `function`                             | `false`  | returns error event                                      |
| placeholder | `string \| React.Node`                  | `true`   | the img src or React Component for the placeholder image                         |
| src         | `string`                               | `true`   | the src of the main image                                |
| srcSetData  | `{srcSet: "string", sizes: "string" }` | `false`  | srcset and sizes to be applied to the image              |
| noRetry     | `boolean`                              | `false`  | flag to turn off re-trying (default: `false`)	           |
| noLazyLoad  | `boolean`                              | `false`  | flag to turn off lazy loading (default: `false`)         |
| rootMargin  | `string`                               | `false`  | Intersection Observer Option (eg: `"0% 0% 25%"` -default)|
| threshold   | `number\|Array<number>`                 | `false`  | Intersection Observer Option (eg: `[0]` -default)        |

## Maintenance Status

 **Stable:** Formidable is not planning to develop any new features for this project. We are still responding to bug reports and security concerns. We are still welcoming PRs for this project, but PRs that include new features should be small and easy to integrate and should not include breaking changes.

[maintenance-image]: https://img.shields.io/badge/maintenance-stable-blue.svg

## License

Licensed under the MIT License, Copyright © 2019-present.

See [LICENSE](./LICENSE) for more information.
