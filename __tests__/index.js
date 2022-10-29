import 'raf/polyfill';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import ProgressiveImage from '../src';

configure({ adapter: new Adapter() });

const src = 'https://via.placeholder.com/300x200/000/source';
const placeholder = 'https://via.placeholder.com/30x20/000/placeholder';
const srcSetData = {
  srcSet: 'srcSet',
  sizes: 'sizes'
};

const mountProgressiveImage = (renderFn, delay) => {
  const defaultRender = jest.fn(src => <img src={src} alt="an image" />);

  const render = renderFn || defaultRender;
  return mount(
    <ProgressiveImage
      delay={delay}
      src={src}
      placeholder={placeholder}
      srcSetData={srcSetData}
      noLazyLoad={true}
    >
      {render}
    </ProgressiveImage>
  );
};

describe('react-progressive-graceful-image', () => {
  beforeEach(() => {
    global.Image = Image;
  });
  it('exports a React component', () => {
    expect(typeof ProgressiveImage).toBe('function');
  });
  it('throws if not provided a function as a child', () => {
    /* eslint-disable no-console */
    const _error = console.error;
    console.error = jest.fn(() => {});
    try {
      expect(() => {
        mount(
          <ProgressiveImage>
            <h1>Uh oh!</h1>
          </ProgressiveImage>
        );
      }).toThrow(`ProgressiveImage requires a function as its only child`);
    } finally {
      console.error = _error;
    }
    /* eslint-enable no-console */
  });
  it('creates an instance of Image when mounted', () => {
    const wrapper = mountProgressiveImage();
    const instance = wrapper.instance();
    wrapper.instance().loadImage(src);
    expect(instance.image.constructor).toBe(HTMLImageElement);
  });
  it('sets the onload property on the Image instance', () => {
    const wrapper = mountProgressiveImage();
    const instance = wrapper.instance();
    wrapper.instance().loadImage(src);
    expect(instance.image.onload).toEqual(instance.onLoad);
  });
  it('sets the onerror property on the Image instance', () => {
    const wrapper = mountProgressiveImage();
    const instance = wrapper.instance();
    // expect(instance.image.onerror).toEqual(instance.onError);
  });
  it('sets the src property on the Image instance', () => {
    const wrapper = mountProgressiveImage();
    const instance = wrapper.instance();
    wrapper.instance().loadImage(src);
    expect(instance.image.src).toEqual(src);
  });
  // it('sets the srcSet property on the Image instance', () => {
  //   const wrapper = mountProgressiveImage();
  //   const instance = wrapper.instance();
  //   expect(instance.image.srcset).toEqual(srcSetData.srcSet);
  // });
  // it('sets the sizes property on the Image instance', () => {
  //   const wrapper = mountProgressiveImage();
  //   const instance = wrapper.instance();
  //   expect(instance.image.sizes).toEqual(srcSetData.sizes);
  // });
  it('renders placeholder image on initial render', () => {
    const render = jest.fn(src => <img src={src} alt="an image" />);
    const wrapper = mountProgressiveImage(render);
    expect(render.mock.calls[0][0]).toEqual(src);
  });
  it('renders src image on second render', () => {
    const render = jest.fn(src => <img src={src} alt="an image" />);
    const wrapper = mountProgressiveImage(render);
    wrapper.instance().loadImage(src);
    wrapper.instance().onLoad();
    expect(render.mock.calls[1][0]).toEqual(src);
  });
  it('sets loading to false after src image is loaded', () => {
    const render = jest.fn(src => <img src={src} alt="an image" />);
    const wrapper = mountProgressiveImage(render);
    expect(render.mock.calls[0][1]).toEqual(false);
    wrapper.instance().loadImage(src);
    wrapper.instance().onLoad();
    expect(render.mock.calls[1][1]).toEqual(false);
  });
  it('does not immediately set image if delay prop exists', () => {
    const delay = 3000;
    const render = jest.fn(src => <img src={src} alt="an image" />);
    const wrapper = mountProgressiveImage(render, delay);
    wrapper.instance().loadImage(src);
    wrapper.instance().onLoad();
    expect(wrapper.instance().state.image).toEqual(placeholder);
  });
  it('sets image after delay passes if delay prop exists', () => {
    const delay = 3000;
    const render = jest.fn(src => <img src={src} alt="an image" />);
    const wrapper = mountProgressiveImage(render, delay);
    wrapper.instance().loadImage(src);
    wrapper.instance().onLoad();
    setTimeout(() => {
      expect(wrapper.instance().state.image).toEqual(src);
    }, delay + 1);
  });
});
