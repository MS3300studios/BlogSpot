import React, {useState} from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import '../../App.css';

const CookiesBanner = (props) => {

    const [show, setshow] = useState(props.show);

    const closeBanner = () => {
        localStorage.setItem('showCookies', false);
        setshow(false)
    } 

    return (
        <>
            {
                show ? (
                    <div className="cookiesBanner">
                        <p>
                            This website utilizes cookies to function properly. 
                            By closing this banner you consent to cookies being stored on your computer. 
                            If you don't agree with this, leave this site now.
                        </p>
                        <div className="closeCookiesBannerIcon" onClick={closeBanner}>
                        <AiOutlineCloseCircle size="2em" color="#0a42a4" />
                        </div>
                    </div>
                ) : null   
            }
        </>
    );
}
 
export default CookiesBanner;