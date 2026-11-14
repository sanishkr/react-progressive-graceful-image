import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import 'raf/polyfill';
import ProgressiveImage from '../src';

let capturedOnChange;
jest.mock('react-intersection-observer', () => ({
  InView: ({ children, onChange }) => {
    capturedOnChange = onChange;
    if (typeof children === 'function') {
      return children({ inView: false, ref: jest.fn() });
    }
    return <div>{children}</div>;
  }
}));

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect
}));

const src = 'https://via.placeholder.com/300x200/000/source';
const placeholder = 'https://via.placeholder.com/30x20/000/placeholder';
const srcSetData = {
  srcSet: 'srcSet',
  sizes: 'sizes'
};

describe('react-progressive-graceful-image', () => {
  let nativeImage;

  beforeAll(() => {
    nativeImage = global.Image;
  });

  afterAll(() => {
    global.Image = nativeImage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Image
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onload && !this.error) {
            // Simulate async loading
          }
        }, 0);
      }
      set src(value) {
        this._src = value;
      }
      get src() {
        return this._src;
      }
    };
  });

  it('exports a React component', () => {
    expect(typeof ProgressiveImage).toBe('function');
  });

  it('throws if not provided a function as a child', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(() => {
      render(
        <ProgressiveImage src={src} placeholder={placeholder}>
          <h1>Uh oh!</h1>
        </ProgressiveImage>
      );
    }).toThrow(`ProgressiveImage requires a function as its only child`);
    consoleSpy.mockRestore();
  });

  it('renders placeholder image on initial render when noLazyLoad is false', () => {
    const { container } = render(
      <ProgressiveImage src={src} placeholder={placeholder}>
        {image => <img src={image} alt="test" />}
      </ProgressiveImage>
    );
    const img = screen.getByAltText('test');
    expect(img.src).toBe(placeholder);
  });

  it('renders src image immediately when noLazyLoad is true', () => {
    render(
      <ProgressiveImage src={src} placeholder={placeholder} noLazyLoad={true}>
        {image => <img src={image} alt="test" />}
      </ProgressiveImage>
    );
    const img = screen.getByAltText('test');
    expect(img.src).toBe(src);
  });

  it('switches to src image after loading when noLazyLoad is true (simulated)', async () => {
    // We need to manually trigger the load since we're mocking Image
    let imageInstance;
    global.Image = class {
      constructor() {
        imageInstance = this;
      }
      set src(v) {
        this._src = v;
      }
      get src() {
        return this._src;
      }
    };

    render(
      <ProgressiveImage src={src} placeholder={placeholder} noLazyLoad={false}>
        {image => <img src={image} alt="test" />}
      </ProgressiveImage>
    );

    // Simulate intersection
    act(() => {
      capturedOnChange(true, { isIntersecting: true });
    });

    expect(imageInstance.src).toBe(src);

    act(() => {
      imageInstance.onload();
    });

    const img = screen.getByAltText('test');
    expect(img.src).toBe(src);
  });

  it('respects delay prop before switching to src', async () => {
    jest.useFakeTimers();
    let imageInstance;
    global.Image = class {
      constructor() {
        imageInstance = this;
      }
      set src(v) {
        this._src = v;
      }
      get src() {
        return this._src;
      }
    };

    render(
      <ProgressiveImage src={src} placeholder={placeholder} delay={1000}>
        {image => <img src={image} alt="test" />}
      </ProgressiveImage>
    );

    // Simulate intersection
    act(() => {
      capturedOnChange(true, { isIntersecting: true });
    });

    act(() => {
      imageInstance.onload();
    });

    // Should still be placeholder because of delay
    expect(screen.getByAltText('test').src).toBe(placeholder);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByAltText('test').src).toBe(src);
    jest.useRealTimers();
  });

  it('handles src change correctly', async () => {
    let imageInstance;
    global.Image = class {
      constructor() {
        imageInstance = this;
      }
      set src(v) {
        this._src = v;
      }
      get src() {
        return this._src;
      }
    };

    const { rerender } = render(
      <ProgressiveImage src={src} placeholder={placeholder} noLazyLoad={true}>
        {image => <img src={image} alt="test" />}
      </ProgressiveImage>
    );

    const newSrc = 'https://via.placeholder.com/300x200/fff/new-source';
    rerender(
      <ProgressiveImage
        src={newSrc}
        placeholder={placeholder}
        noLazyLoad={true}
      >
        {image => <img src={image} alt="test" />}
      </ProgressiveImage>
    );

    expect(screen.getByAltText('test').src).toBe(newSrc);
  });
});
