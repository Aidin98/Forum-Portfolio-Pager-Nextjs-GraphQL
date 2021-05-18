import  'bootstrap/dist/css/bootstrap.min.css'

import '../styles/index.scss'
import App from 'next/app'
import 'react-datepicker/dist/react-datepicker.css'
 import "react-toastify/dist/ReactToastify.css";
const MyApp=({Component,pageProps})=>{

  return (



          <Component {...pageProps} />


  );

}

export default MyApp
