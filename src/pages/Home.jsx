import React, { useState, useEffect } from 'react'
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import { ethers } from "ethers";

import { DisplayCampaigns } from '../components';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { contract } = useContract('0xD78681E6Bb323791c3e27667E3B9f6C99ea87225')
  const address = useAddress();
  const { data, error } = useContractRead(contract, "getAllCampaigns", []);

  const getCampaigns = (data) => {
    try {
      if (data) {

        const updatedCampaigns = data.map((campaign, i) => ({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: ethers.utils.formatEther(campaign.target.toString()),
          deadline: campaign.deadline.toNumber(),
          amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
          image: campaign.image,
          pId: i

        }))


        return updatedCampaigns
      } else {
        return [];
      }


    } catch (err) {
      console.log(err);
      return [];
    }
  }


  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      try {
    
        if (!error) {
          const updatedCampaigns = getCampaigns(data);
          setCampaigns(updatedCampaigns);
          setIsLoading(false);
        } else {
          console.log('Error fetching campaign data:', error);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setIsLoading(false);
      }
    };

    if (contract && address) {
      fetchData();
    }

  }, [address, contract, data, error]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home