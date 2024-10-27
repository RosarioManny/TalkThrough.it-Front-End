const index =  async () => {
    try {
        const res = await fetch(BASE_URL,{
            headers: {Authorization: `Bearer ${localStorage.getItem(`token`)}`}
        })
        return res.json()
    } catch (error){
        console.log(error)
    }
}

export {index}