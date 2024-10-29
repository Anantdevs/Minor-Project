// UserProfile.js
import React from 'react';
import { UserData } from "../context/User";

const UserProfile = ({  }) => {
    const { user } = UserData();

    return (
        
        <div className="flex mb-2 pb-4 items-center gap-3 pl-8 cursor-pointer">
            Profile Name: <span>{user.name}</span>
            Profile Email: <span>{user.email}</span>
        </div>
    );
};

export default UserProfile;
