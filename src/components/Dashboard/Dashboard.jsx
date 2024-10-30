import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import ClientDashboard from './ClientDashboard';
import ProviderDashboard from './ProviderDashboard';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user } = useAuth(); // Get user from context
  console.log("shiiiiiiiiit")
  
  const [conversations, setConversations] = useState({})

  const getConversations = async() => {
    try{
        const response = await axios.get(`${BACKEND_URL}/messages/conversatons`,getAuthHeaders())
        setConversations(response.data)
    }catch(error){
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error saving provider:', error);
        throw error;
    }
}

  useEffect(()=>{
    const fetchConvos = async () => {
      const convoData = await getConversations()
      setConversations(convoData)
    }
    fetchConvos()
    console.log("conversations:" + conversations)
  },[])

  return (
    <div className="bg-alice_blue-500 min-h-screen">
        <div className="container mx-auto px-4 py-8">
            {user?.type === 'provider' ? (
                <ProviderDashboard />
            ) : (
                <ClientDashboard />
            )}
        </div>
    </div>
);
};

export default Dashboard;
