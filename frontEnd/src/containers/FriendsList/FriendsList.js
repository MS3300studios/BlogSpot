import React, { Component } from 'react';

import classes from './FriendsList.module.css';
import SearchBar from '../../components/UI/searchBar';


import photo1 from '../../assets/userPhoto/image (1).jfif';
import photo2 from '../../assets/userPhoto/image (2).jfif';
import photo3 from '../../assets/userPhoto/image (3).jfif';
import photo4 from '../../assets/userPhoto/image (4).jfif';
import photo5 from '../../assets/userPhoto/image (14).jfif';
import photo6 from '../../assets/userPhoto/image2.jfif';
import photo7 from '../../assets/userPhoto/image.jfif';

class FriendsList extends Component {
    constructor(props){
        super(props);
        this.state = {
            photos: [
                photo1,photo2,photo3,photo4,photo5,photo6,photo7
            ],
            names: [
                {name: 'Anna', surname: 'Marks', nickname: 'anna74'},
                {name: 'Ted', surname: 'Wilinks', nickname: 'teddy22'},
                {name: 'Maciej', surname: 'Warnik', nickname: 'macieK23'},
                {name: 'Józef', surname: 'Seren', nickname: 'koks101'},
                {name: 'Adam', surname: 'Sęp', nickname: 'adamex'},
                {name: 'Natalia', surname: 'Jarska', nickname: 'Kicia<3'},
                {name: 'Bolek', surname: 'Tokarski', nickname: 'Chrobry3000'}
            ],
            viewAsFaces: false
        }
        this.changeView.bind(this);
    }

    changeView = (option) => {
        if(option === "list"){
            this.setState({viewAsFaces: false});
        }
        else if(option === "photos"){
            this.setState({viewAsFaces: true});
        }
    }

    filterfriends = () => {

    }

    render() { 
        let names = (
            <div className={classes.nameListContainer}>
                {
                    this.state.names.map((name, index)=>{
                        let img = this.state.photos[index];
                        return (
                            <React.Fragment key={index}>
                                <div className={classes.listElement}>
                                    <div className={classes.smallFaceContainer}>
                                        <img src={img} alt="friend's face"/>
                                    </div>
                                    <div className={classes.namesContainer}>
                                        <h1>{name.name} {name.surname}</h1>
                                        <p>@{name.nickname}</p>
                                    </div>
                                </div>
                                <hr/>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        );

        let faces = (
            <div className={classes.wrapper}>
                {
                    this.state.photos.map((photo, index) => {
                        return (
                            <div className={classes.face} key={index}>
                                <img src={photo} alt="user face"/>
                            </div>
                        )
                    })
                }
                <div className={classes.face}>
                    <button>add a new friend</button>
                </div>
            </div>
        );

        return (
            <div className={classes.mainContainer}>
                <div className={classes.upperContainer}>
                    <h1 className={classes.mainHeader}>Your friends:</h1>
                    <div className={classes.viewOptions}>
                        <h3 className={classes.viewOptionsH3}>View as:</h3>
                        <select className={classes.Select} onChange={(e)=>this.changeView(e.target.value)}>
                            <option>list</option>
                            <option>photos</option>
                        </select>
                    </div>
                    <SearchBar 
                        placeholder="search friends by..."
                        clicked={(arg, arg2)=>{console.log(`option: ${arg} string: ${arg2}`)}}
                        selectValues={["nickname", "name", "surname", "id"]}
                    />
                </div>
                {this.state.viewAsFaces ? faces : names}
            </div>
        );
    }
}
 
export default FriendsList;


// resetFilter={()=>{this.setState({filterIn: "none", filterBy: "none"})}}