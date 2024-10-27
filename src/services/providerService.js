// TODO: figure out connection string to server here. right now localhost3000:/TalkThroughIt

const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/TalkThroughIt`

const index =  async () => {
    try {
        const res = await fetch(BASE_URL,{
            // Only if we need people to sign in to view therapists TODO: Ask team what they prefer 
            headers: {Authorization: `Bearer ${localStorage.getItem(`token`)}`}  
        })
        return res.json()
    } catch (error){
        console.log(error)
    }
}

export {index}