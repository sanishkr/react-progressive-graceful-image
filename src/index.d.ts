declare module 'react-progressive-graceful-image' {
	type srcSetData = {
		srcSet: string;
		sizes: string;
	};

	export interface ProgressiveImageProps {
		delay?: number;
		onError?: (errorEvent: Event) => void;
		placeholder: string;
		src: string;
		srcSetData?: srcSetData;
		noRetry?: boolean;
		noLazyLoad?: boolean;
		rootMargin?: string;
		threshold?: Array;
		children?: (src: string, loading?: boolean, srcSetData?: srcSetData) => React.Node;
	}

	export interface ProgressiveImageState {
		image: string;
		loading: boolean;
		srcSetData?: srcSetData;
	}

	export default class ProgressiveImage extends React.Component<
		ProgressiveImageProps,
		ProgressiveImageState
	> {}
}
