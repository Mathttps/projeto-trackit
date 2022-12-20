// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import ReactDOM from 'react-dom'
import App from './components/App'

import './assets/CSS/reset.css'
import './assets/CSS/style.css'

ReactDOM.render(<App />, document.querySelector('.root'))