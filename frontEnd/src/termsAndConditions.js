import React from 'react';

import { Link } from 'react-router-dom';
import Button from './components/UI/button';

function termsAndConditions (){
    return (
        <div className="terms_and_conditions_centerContainer">
            <h1>Terms and Conditions</h1>
            <Link to="/register" className="terms_and_conditions_Link">
                <Button>Back to registration</Button>
            </Link>
            <ul>
                <li>
                    <h1>1. DATA MANAGEMENT</h1>
                    <p>You consent for all the data you submit to the website to be managed (that is: modified, deleted or altered in any way) including all of the personal information given during the registration process, as well as all of the content submitted to BragSpot during later use, such as photos, posts, comments likes, etc. You also consent to have your personal account suspended, or deleted should you not comply with the Terms and Conditions listed on this website.</p>
                </li>
                <hr />
                <li>
                    <h1>2. CODE EXPLOITATION</h1>
                    <p>You consent not to use any web developer tools, or alter the code provided by BragSpot in any way, and not to exploit the vulnerabilities of the website, but to report them in order to improve the user experience for all other users. You also consent to not exploit any bugs or deficiencies in the system in order to obtain other users' data or inject malicious code into their browsers or Personal Computers.</p>
                </li>
                <hr />
                <li>
                    <h1>3. CIVIL BEHAVIOUR</h1>
                    <p>You consent not to publish any images depicting adult content, or content that is deemed to be unlawful in any way either in your own jurisdiction or content that is not compliant with EU or Polish law. You also consent to not use profane language and swear words and to respect other users. You consent not to publish or send any content that is extremist in nature and deemed as immoral by the laws of your local jurisdiction or the EU and Polish law.</p>
                </li>
                <hr />
                <li>
                    <h1>4. IP ADRESS AND COOKIES</h1>
                    <p>You consent to store cookies on your browser in order for the website to work. We inform you that no tracking cookies are used on this website, only cookies that allow for authorization and safer website usage. You also agree to save your IP adress (which also entails saving your location) to the admin database, so that were your account to be suspended and/or deleted, you would still exist in the database blacklist if ever you decide to break any of the points listed in this document.</p>
                </li>
                <hr />
                <li>
                    <h1>5. USING THE WEBSITE ON YOUR OWN RISK</h1>
                    <p>By accepting the Terms and Conditions you hereby declare that you, and you only are solely responsible for the content you publish, and/or receive. BragSpot does not take any responsibility for the content posted by its users, although all the necessairy precautions and steps will be taken to take down any content violating the terms and conditions in a reasonable amount of time.</p>
                </li>
                <hr />
                <li>
                    <h1>6. SPAMMING</h1>
                    <p>Spamming is strictly forbidden, and users who produce spam will be immediately removed from BragSpot. Spamming is defined as posting/sending large quantities of data in a short space of time. That includes sending more than 5 messages in a time period of maximum 3 seconds, or multiple (no less than 10) posts during the time period of one minute. That also refers to, but is not limited by likes, photos, and other means of sending data accessible on this website.</p>
                </li>
                <hr />
                <li>
                    <h3>Privacy Policy Link</h3>
                    <a href="https://www.termsfeed.com/live/35194640-fcb4-477d-b80e-95545d807a93">https://www.termsfeed.com/live/35194640-fcb4-477d-b80e-95545d807a93</a>
                </li>
            </ul>
            <hr />
            <h3>
                Special thanks to these users for their solutions:
            </h3>
            <ul>
                <li><b>Kosten</b>, for his glowing css animation for the send button in conversation: <a href="https://codepen.io/kocsten">codepen.io/Kosten</a> or <a href="http://zornet.ru/index/8-1">zornet.ru/Kosten</a></li>
                <li><b>Luke Haas</b>, for his amazing spinner animation: <a href="https://twitter.com/lukehaas">twitter.com/lukehaas</a></li>
            </ul>
        </div>
    )
}

export default termsAndConditions;