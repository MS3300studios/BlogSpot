import React, {useState} from 'react';

import classes from './language.module.css';
import classes2 from './colours.module.css';

const Language = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("English")

    return (
        <div className={classes.languageContainer}>
            <h1>Choose your language</h1>
            <div className={classes.optionsContainer}>
                <div className={classes2.inputContainer}>
                    <input type="radio" className={classes2.imgInput} checked={selectedLanguage === "English"} onChange={()=>setSelectedLanguage("English")} />
                    <p>English</p>
                </div>
                <div className={classes2.inputContainer}>
                    <input type="radio" className={classes2.imgInput} checked={selectedLanguage === "Polish"} onChange={()=>setSelectedLanguage("Polish")} />
                    <p>Polski</p>
                </div>
                <div className={classes2.inputContainer}>
                    <input type="radio" className={classes2.imgInput} checked={selectedLanguage === "Spanish"} onChange={()=>setSelectedLanguage("Spanish")} />
                    <p>Español</p>
                </div>
                <div className={classes2.inputContainer}>
                    <input type="radio" className={classes2.imgInput} checked={selectedLanguage === "German"} onChange={()=>setSelectedLanguage("German")} />
                    <p>Deutsch</p>
                </div>
                <div className={classes2.inputContainer}>
                    <input type="radio" className={classes2.imgInput} checked={selectedLanguage === "Chinese"} onChange={()=>setSelectedLanguage("Chinese")} />
                    <p>中文</p>
                </div>
            </div>
        </div>
    );
}
 
export default Language;