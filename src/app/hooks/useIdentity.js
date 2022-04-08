import {useContext} from 'react';
import IdentityContext from '../context/IdentityProvider';

const useIdentity = () => {
    return useContext(IdentityContext);
}

export default useIdentity;