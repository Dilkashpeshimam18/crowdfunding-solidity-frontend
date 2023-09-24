import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();
  
  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaigns();
      if (data) {
        setCampaigns(data);
        setIsLoading(false);
      } else {
        console.log('No campaign data received.');
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log(contract)
    console.log(address)
   if (contract) fetchCampaigns();
    

}, [address, contract]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home