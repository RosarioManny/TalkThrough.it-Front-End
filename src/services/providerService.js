// TODO: figure out connection string to server here. right now localhost3000:/TalkThroughIt
// TODO: I installed axios, lets figure out how to use it! --Gabe
import axios from 'axios'

const BACKEND_URL = `http://localhost:3000`

const fetchProviders = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/search/providers`, {headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}} )
        return res.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export {fetchProviders} 