// @flow

import * as React from 'react';
import Observer from '@researchgate/react-intersection-observer';

type SrcSetData = {
  srcSet: string,
  sizes: string
};

type Props = {
  children: (string, boolean, SrcSetData) => React.Node,
  delay?: number,
  onError?: (errorEvent: Event) => void,
  placeholder: string | React.Node,
  src: string,
  srcSetData?: SrcSetData,
  noRetry?: boolean,
  noLazyLoad?: boolean,
  rootMargin?: string,
  threshold?: number | Array<number>
};

type State = {
  image: string,
  loading: boolean,
  srcSetData: SrcSetData
};

const hasWindow = () => {
  return typeof window !== 'undefined';
};
export default class ProgressiveImage extends React.Component<Props, State> {
  image: HTMLImageElement;
  constructor(props: Props) {
    super(props);
    this._isMounted = false;

    this.state = {
      isOnline: hasWindow() ? window.navigator.onLine : true,
      image: props.placeholder,
      loading: true,
      srcSetData: { srcSet: '', sizes: '' }
    };
  }

  handleOnlineStatus = () => {
    this.setState({
      isOnline: window.navigator.onLine
    });
  };

  componentDidMount() {
    this._isMounted = true;
    if (!hasWindow()) {
      return;
    }
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentDidUpdate(prevProps: Props) {
    const { src, placeholder, srcSetData } = this.props;
    // We only invalidate the current image if the src has changed.
    if (src !== prevProps.src) {
      this.setState({ image: placeholder, loading: true }, () => {
        this.loadImage(src, srcSetData);
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
    // this.clearEventListeners();
  }

  loadImage = (src: string, srcSetData?: SrcSetData) => {
    // If there is already an image we nullify the onload
    // and onerror props so it does not incorrectly set state
    // when it resolves
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    const image = new Image();
    this.image = image;
    image.onload = this.onLoad;
    image.onerror = errorEvent => {
      this.onError(errorEvent);
      return;
      // this.handleImageRetries(image);
    };
    image.src = src;
    if (srcSetData) {
      image.srcset = srcSetData.srcSet;
      image.sizes = srcSetData.sizes;
    }
  };

  onLoad = () => {
    // use this.image.src instead of this.props.src to
    // avoid the possibility of props being updated and the
    // new image loading before the new props are available as
    // this.props.

    if (this.props.delay) {
      this.setImageWithDelay();
    } else {
      this.setImage();
    }
  };

  setImageWithDelay = () => {
    setTimeout(() => {
      this.setImage();
    }, this.props.delay);
  };

  setImage = () => {
    if (this._isMounted) {
      this.setState(
        {
          image: this.image.src,
          loading: false,
          srcSetData: {
            srcSet: this.image.srcset || '',
            sizes: this.image.sizes || ''
          }
        },
        () => {
          window.removeEventListener('online', this.handleOnlineStatus);
          window.removeEventListener('offline', this.handleOnlineStatus);
        }
      );
    }
  };

  onError = (errorEvent: Event) => {
    const { onError } = this.props;
    if (onError) {
      onError(errorEvent);
    }
  };

  handleIntersection = (event, unobserve, isOnline) => {
    if (event.isIntersecting) {
      const { src, srcSetData } = this.props;
      if (isOnline) {
        this.loadImage(src, srcSetData);
        unobserve();
      }
    }
  };

  render() {
    const options = {
      onChange: (event, unobserve) =>
        this.handleIntersection(event, unobserve, this.state.isOnline),
      rootMargin: this.props.rootMargin || '0% 0% 25%',
      threshold: this.props.threshold || [0],
      disabled: this.props.noLazyLoad || false
    };
    const { image, loading, srcSetData } = this.state;
    const { src, children, noRetry, noLazyLoad } = this.props;

    if (!children || typeof children !== 'function') {
      throw new Error(`ProgressiveImage requires a function as its only child`);
    }

    if (noLazyLoad) {
      return children(src, false, this.props.srcSetData);
    }

    return (
      <Observer {...options}>{children(image, loading, srcSetData)}</Observer>
    );
  }
}
