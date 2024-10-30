const Messages = (props) => {
    const user = useAuth()
    const messageRead = true

    return (
        <div className="bg-alice_blue-500 min-h-screen p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold text-prussian_blue-500 mb-4">Messages</h1>
                <div className={`p-4 rounded-lg ${messageRead ? 'bg-alice_blue-100' : 'bg-celestial_blue-50'}`}>
                    <h2 className="text-lg font-medium text-prussian_blue-500">RecieverId</h2>
                    <p className="text-prussian_blue-400">Contents of the Message Go here</p>
                </div>
            </div>
        </div>
    )
}
