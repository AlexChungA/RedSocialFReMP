import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcon from 'react-icons/io';
import * as IoIcons from 'react-icons/io5';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';

let userId = "me"
export const SidebarData = [
    {
        title: 'Inicio',
        path: '/inicio',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Diario',
        path: '/diario',
        icon: <IoIcons.IoJournal/>,
        cName: 'nav-text'
    },
    {
        title: 'Perfil',
        path: '/perfil/'+userId,
        icon: <PersonIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'Personas',
        path: '/personas/',
        icon: <PeopleIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'Cerrar Sesión',
        path: '/',
        onClick:()=>{localStorage.removeItem("session")},
        icon: <IoIcon.IoMdLogOut/>,
        cName: 'nav-text'
    },
]