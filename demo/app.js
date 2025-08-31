import React from 'react'
import {createRoot} from 'react-dom/client'
import ProgressiveImage from '../src/index.js'

const centerAlign = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

const containerStyle = {
  ...centerAlign,
  overflow: 'hidden',
  position: 'relative',
  maxWidth: 1440,
  margin: '0 auto'
}

const imageStyle = {
  height: '100vh',
  minWidth: '100%'
}

const textContainerStyle = {
  ...centerAlign,
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0
}

const textStyle = {
  color: '#fff',
  fontFamily: 'sans-serif',
  fontSize: '2.5em',
  textTransform: 'uppercase'
}

class App extends React.Component {
  render() {
    return (
      <div style={containerStyle}>
        <div style={textContainerStyle}>
          <h1 style={textStyle}>
            React <br />
            Progressive <br />
            Graceful <br />
            Image
          </h1>
        </div>
        {[...Array(5)].map((item, i) => (
          <ProgressiveImage
            key={i + 1}
            src={`https://via.placeholder.com/594x1024/${i + 1}d${i}${i +
              4}${i + 3}a/ffffff/&text=Image${i + 1}`}
            placeholder={`https://via.placeholder.com/59x102/${i + 1}d${i}${i +
              4}${i + 3}a/ffffff/&text=Placeholder${i + 1}`}
            srcSetData={{
              srcSet: `https://via.placeholder.com/594x1024/${i + 1}d${i}${i +
                4}${i + 3}a/ffffff/&text=BigImage${i + 1} 2000w`
            }}
            rootMargin="0% 0% 0%"
            threshold={[1]}
          >
            {(image, loading, srcSetData) => {
              return (
                <img
                  style={imageStyle}
                  src={image}
                  srcSet={srcSetData.srcSet}
                  // sizes={srcSetData.sizes}
                  alt={`Image #${i + 1}`}
                />
              )
            }}
          </ProgressiveImage>
        ))}
      </div>
    )
  }
}

const rootElement = document.getElementById('content')
const root = createRoot(rootElement)

root.render(<App />)
