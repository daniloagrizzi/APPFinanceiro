import React from "react";

interface ProfileCase {

    profilePicture?: string;
    userName?: string;


}


const ProfileCase: React.FC<ProfileCase> = ({ profilePicture = '/profile-pictst.jpg', userName = 'username' }) => {

    return (<>
        <figure className="flex-col text-center">
            <img src={profilePicture} className="w-[100px] h-[100px] rounded-full" />
            <figcaption className="m-1"><b>{userName}</b></figcaption>
        </figure >
    </>)



}

export default ProfileCase