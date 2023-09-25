import React, { useContext, createContext,useState } from "react";
import { useAddress, useMetamask, useContract,  useContractRead } from '@thirdweb-dev/react'
import { ethers } from "ethers";

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xD78681E6Bb323791c3e27667E3B9f6C99ea87225')
    const connect = useMetamask()
    const address = useAddress()
    const [campaigns, setCampaigns] = useState([]);

    const { data, error } = useContractRead(contract, "getAllCampaigns", [])

    const getCampaigns = async () => {
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
        console.log(err)
      }
    }

    const publishCampaign = async (form) => {
        try {

            const data = await contract.call('createCampaign',
                [
                    address, //owner of the campaign
                    form.title,
                    form.description,
                    form.image,
                    form.target,
                    new Date(form.deadline).getTime(),
                ]
            )


        } catch (err) {
            console.log(err)
        }
    }

  

    const getUserCampaigns = async () => {
        try {

            const allCampaigns = await getCampaigns()

            const userCampaign = allCampaigns.filter((campaign) => campaign.owner === address)

            return userCampaign;

        } catch (err) {
            console.log(err)
        }
    }

    const donate = async (pId, amount) => {
        try {

            const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) })

            return data;

        } catch (err) {
            console.log(err)
        }
    }

    const getDonations = async (pId) => {
        try {
            const donations = await contract.call('getAllDonators', [pId])
            const numberOfDonations = donations[0]?.length;
            const updatedDonations = []
            for (let i = 0; i < numberOfDonations; i++) {
                updatedDonations.push({
                    donator: donations[0][i],
                    donation: ethers.utils.formatEther(donations[1][i].toString())
                })
            }


            return updatedDonations

        } catch (err) {
            console.log(err)
        }
    }
    return (
        <StateContext.Provider
            value={{
                address,
                createCampaign: publishCampaign,
                contract,
                connect,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                campaigns,
                setCampaigns
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)